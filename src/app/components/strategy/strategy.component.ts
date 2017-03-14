import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from "@angular/core";
import {StrategyService} from "../../services/strategy/strategy.service";
import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {RoboAdviceConfig} from "../../app.configuration";

@Component({
    selector: 'app-strategy',
    templateUrl: './strategy.component.html',
    styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {
    constructor(
        private _z: NgZone,
        private strategyService: StrategyService,
    ) { }

    private roboAdviceConfig = RoboAdviceConfig;

    @Input() values: number[] = [20, 20, 20, 20, 20];
    @Input() labels: string[] = this.roboAdviceConfig.AssetClassLabel;
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = this.roboAdviceConfig.PieChartColor;
    @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";
    @Input() titleColor: string | CanvasGradient | CanvasPattern;
    @ViewChild('pieChart') canvas: PieChartComponent;
    @Output() save = new EventEmitter();


    ngOnInit() {
        if (!this.values) this.values = [25, 25, 25, 25, 0];
        this.canvas.rePaint();
    }


    rePaint() {
      this.canvas.rePaint();
    }


    getValue(index: number) {
        return this.values[index];
    }

    valueChanged(event: any, i: number) {
        //to detect changes
        this._z.run(()=> {
            this.values[i] = event;
            this.values[4] = 100 - this.totalPercentage();
            this.rePaint();
        });
    }

    emitSave() {
        if (this.values[4] == 0) {  //Check if the 'empty' portion is 0%
          (window as any).swal({
            title: 'Are you sure?',
            text: "You are changing your strategy!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
          }).then(() => {
            //send new strategy to server
            this.values.pop();
            let str: Strategy = new Strategy();
            for (let i = 0; i < this.values.length; i++) {
              let asset = new Asset();
              asset.assetClassId = i + 1; //server has 1-based ids
              asset.percentage = this.values[i];
              str.asset_class.push(asset);
            }
            str.name = "Custom";
            this.strategyService.saveStrategy(str).subscribe((data) => {
              //everything's fine
              (window as any).swal('Done!', 'Your strategy has been changed.', 'success');
              this.save.emit(this.values);
            });
            this.values.push(0);
          }, (error) => {
            //nothing
          });

        }else{
          //total is not 100%
          (window as any).swal("Oops", "total must be 100%", "error");
        }
    }

    private getMax(i: number) {
        return 100 - this.totalPercentage() + this.values[i];
    }

    private totalPercentage(): number {
        let tmp: number = 0;
        for (let i = 0; i < 4; i++) {
            tmp += this.values[i];
        }
        return tmp;
    }
}
