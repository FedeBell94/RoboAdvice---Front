import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, NgZone } from "@angular/core";
import {StrategyService} from "../../services/strategy.service";
import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";

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

    @Input() values: number[] = [20, 20, 20, 20, 20];
    @Input() labels: string[] = ['Bonds', 'Forex', 'Stocks', 'Commodities', 'Empty'];
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = ['#86c7f3','#aed581','#ffa1b5','#ECD25B', '#4A861E'];
    @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";
    @Input() titleColor: string | CanvasGradient | CanvasPattern;
    @ViewChild('chartCanvas') canvas: ElementRef;
    @Output() save = new EventEmitter();


    ngOnInit() {
        if (!this.values) this.values = [25, 25, 25, 25, 0];
        this.rePaint();
    }

    /*ngAfterViewChecked(){
        this.rePaint();
    }*/

    rePaint() {
      setTimeout(() => this.printChart(), 150);
      //window.requestAnimationFrame(this.printChart.bind(this));
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
          let _this = this;
          (window as any).swal({
            title: 'Are you sure?',
            text: "You are changing your strategy!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
          }).then(function () {
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
          }.bind(this), function (error) {
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

    private printChart() {
        //setting up canvas
        this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
        this.canvas.nativeElement.style.height = this.canvas.nativeElement.offsetWidth;
        this.canvas.nativeElement.height = this.canvas.nativeElement.offsetWidth;
        let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

        //preparing external data
        let innerStrings = this.values.map(v => v.toString() + "%");

        let angles: number[] = [];
        let total = 0;
        for (let i = 0; i < this.values.length; i++) { total += this.values[i]; }     //getting the total
        angles[0] = this.values[0] * Math.PI * 2 / total;
        for (let i = 1; i < this.values.length; i++) { angles[i] = angles[i - 1] + this.values[i] * Math.PI * 2 / total; }; //now we got all proportional angles starting from previous one.


        //preparing internal data
        let internalWidth = this.canvas.nativeElement.width;
        let fontSize = this.canvas.nativeElement.height / 12;
        let internalHeight = this.canvas.nativeElement.height;
        //pie area
        let pieArea = {
            x: 0,
            y: 0,
            width: internalWidth,
            height: internalWidth
        }

        let pieCenter = {
            x: pieArea.x + pieArea.width / 2,
            y: pieArea.y + pieArea.height / 2
        };


        let ray = pieArea.width / 2;
        ctx.font = fontSize + "px Roboto";
        ctx.textBaseline = "middle";

        let textCoords: any[] = [];
        for (let i = 0; i < this.values.length; i++) {
            let angle = (angles[i] - (angles[i - 1] || 0)) / 2 + (angles[i - 1] || 0)
            textCoords.push(
                {
                    x: pieCenter.x + (ray / 3 * 2) * Math.cos(angle),
                    y: pieCenter.y + (ray / 3 * 2) * Math.sin(angle)
                });
        }

        //drawing

        //pie
        for (let i = 0; i < this.values.length; i++) {
            ctx.fillStyle = this.colors[i];
            ctx.beginPath();
            ctx.moveTo(pieCenter.x, pieCenter.y);
            ctx.arc(pieCenter.x, pieCenter.y, ray, angles[i - 1] || 0, angles[i]);
            ctx.lineTo(pieCenter.x, pieCenter.y);
            ctx.fill();

        }
        //percentages
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] == 0) continue;
            ctx.fillStyle = this.textColor;
            ctx.font = (fontSize / 3 * 2) + "px Roboto";
            ctx.fillText(this.labels[i], textCoords[i].x - ctx.measureText(this.labels[i]).width / 2, textCoords[i].y - fontSize / 2);
            ctx.font = fontSize + "px Roboto";
            ctx.fillText(innerStrings[i], textCoords[i].x - ctx.measureText(innerStrings[i]).width / 2, textCoords[i].y + fontSize / 2);
        }
    }
}
