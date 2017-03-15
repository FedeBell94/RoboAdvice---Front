import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from "@angular/core";
import {StrategyService} from "../../services/strategy/strategy.service";
import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {RoboAdviceConfig} from "../../app.configuration";
import {ManageJsonService} from "../../services/manage-json/manage-json.service";


@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {
  constructor(
    private _z: NgZone,
    private strategyService: StrategyService,
    private jsonService: ManageJsonService,
  ) { }

  private roboAdviceConfig = RoboAdviceConfig;

  @Input() labels: string[] = this.roboAdviceConfig.AssetClassLabel;
  @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = this.roboAdviceConfig.PieChartColor;
  @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";
  @Input() titleColor: string | CanvasGradient | CanvasPattern;
  @ViewChild('pieChart') canvas: PieChartComponent;
  @Output() save = new EventEmitter();
  showPresetStrategies : boolean = false;
  presetStrategy: Array<Array<number>>;
  myAttualStrategy : number[] = [];

  nothingChanged: boolean = true;

  private strategyValues: number[] = [];

  ngOnInit() {

    this.strategyService.getStrategy().subscribe((data) => {
      if (data.response > 0) {
        let i: number = 0;
        for (let assetClass of data.data as Asset[]) {
          this.strategyValues[i] = assetClass.percentage;
          this.myAttualStrategy[i]= assetClass.percentage;
          i++;
        }
        this.strategyValues.push(0); // new position stand for empty portion;
        this.myAttualStrategy.push(0);
      }
    });

    this.jsonService.getFromJson('strategy_roboadvice.json').subscribe((data:any)=> {
      let tmpStrategy = data["strategies"];
      this.presetStrategy = new Array<Array<number>>();

      for (let i = 0; i < tmpStrategy.length; i++){
        this.presetStrategy[i] = new Array<number>();
        for (let j = 0; j < tmpStrategy[i].asset_class.length; j++){
          this.presetStrategy[i][j] = parseInt(tmpStrategy[i].asset_class[j].percentage.toString());
        }
      }
    });

    this.rePaint();
  }

  rePaint() {
    this.canvas.rePaint();
  }


  getValue(index: number) {
    return this.strategyValues[index];
  }

  valueChanged(event: any, i: number) {

    if (this.strategyValues != this.myAttualStrategy) {
        this.nothingChanged = false;
    }else{
        this.nothingChanged = true;
    }

    //to detect changes
    this._z.run(()=> {
      this.strategyValues[i] = event;
      this.strategyValues[4] = 100 - this.totalPercentage();
      this.rePaint();
    });
  }

  emitSave() {
    if (this.strategyValues[4] == 0) {  //Check if the 'empty' portion is 0%
      (window as any).swal({
        title: 'Are you sure?',
        text: "You are changing your strategy!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      }).then(() => {
        this.nothingChanged = true;
        this.copyArray(this.strategyValues,this.myAttualStrategy);

        //send new strategy to server
        this.strategyValues.pop();
        let str: Strategy = new Strategy();
        for (let i = 0; i < this.strategyValues.length; i++) {
          let asset = new Asset();
          asset.assetClassId = i + 1; //server has 1-based ids
          asset.percentage = this.strategyValues[i];
          str.asset_class.push(asset);
        }
        str.name = "Custom";
        this.strategyService.saveStrategy(str).subscribe((data) => {
          //everything's fine
          (window as any).swal('Done!', 'Your strategy has been changed.', 'success');
          this.save.emit(this.strategyValues);
          this.showPresetStrategies = false;
        });
        this.strategyValues.push(0);
      }, (error) => {
        //nothing
      });

    }else{
      //total is not 100%
      (window as any).swal("Oops", "total must be 100%", "error");
    }
  }

  previewStrategy(id: number){
    this.nothingChanged = false;
    this.strategyValues = this.presetStrategy[id];
    this.strategyValues.push(0);
    this.canvas.changeValues(this.strategyValues);
    this.rePaint();
  }

  resetStrategy(){
    this.nothingChanged = true;
    this.copyArray(this.myAttualStrategy, this.strategyValues);
    this.showPresetStrategies = false;
    this.canvas.changeValues(this.strategyValues);
    this.rePaint();
  }

  copyArray(from: number[], to: number[]){
    for (let i=0; i < from.length; i++){
      to[i] = from[i];
    }
  }

  tooglePresetStrategies(){
    this.showPresetStrategies = !this.showPresetStrategies;
  }

  // it's used in html
  private getMax(i: number) {
    return 100 - this.totalPercentage() + this.strategyValues[i];
  }

  private totalPercentage(): number {
    let tmp: number = 0;
    for (let i = 0; i < 4; i++) {
      tmp += this.strategyValues[i];
    }
    return tmp;
  }
}

