import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {RoboAdviceConfig} from "../../app.configuration";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  private roboAdviceConfig = RoboAdviceConfig;
  private ctx: CanvasRenderingContext2D;
  private fontSize: number;
  private pieArea: any;
  private pieCenter: any;
  private ray: number;

  @Input() values: number[] = [25, 25, 25, 25];
  @Input() labels: string[] = this.roboAdviceConfig.AssetClassLabel;
  @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = this.roboAdviceConfig.PieChartColor;
  @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";

  @ViewChild('pieChart_Canvas') canvas: ElementRef;

  ngOnInit() {
    if (!this.values) this.values = [25, 25, 25, 25];
    this.draw();
  }

  ngAfterViewChecked(){
    this.rePaint();
  }

  rePaint() {
    this.setupCanvas();

    this.draw();
  }

  changeValues(values: Array<number>) {
    this.values = values;
  }

  private setupCanvas() {
      //setting up canvas
      this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
      this.canvas.nativeElement.height = this.canvas.nativeElement.offsetWidth;
      this.ctx = this.canvas.nativeElement.getContext("2d");

      //preparing internal data
      let internalWidth = this.canvas.nativeElement.width;
      this.fontSize = this.canvas.nativeElement.height / 12;
      let internalHeight = this.canvas.nativeElement.height;

      this.pieArea = {
          x: 0,
          y: 0,
          width: internalWidth,
          height: internalWidth
      }

      this.pieCenter = {
          x: this.pieArea.x + this.pieArea.width / 2,
          y: this.pieArea.y + this.pieArea.height / 2
      };

      this.ray = this.pieArea.width / 2;
      this.ctx.font = this.fontSize + "px Open Sans, Roboto";
      this.ctx.textBaseline = "middle";
  }

  private draw() {

    //preparing data
    let innerStrings = this.values.map(v => v.toString() + "%");

    let angles: number[] = [];
    let total = 0;
    for (let i = 0; i < this.values.length; i++) { total += this.values[i]; }     //getting the total
    angles[0] = this.values[0] * Math.PI * 2 / total;
    for (let i = 1; i < this.values.length; i++) { angles[i] = angles[i - 1] + this.values[i] * Math.PI * 2 / total; }; //now we got all proportional angles starting from previous one.


    

    let textCoords: any[] = [];
    for (let i = 0; i < this.values.length; i++) {
      let angle = (angles[i] - (angles[i - 1] || 0)) / 2 + (angles[i - 1] || 0)
      textCoords.push(
        {
          x: this.pieCenter.x + (this.ray / 3 * 2) * Math.cos(angle),
          y: this.pieCenter.y + (this.ray / 3 * 2) * Math.sin(angle)
        });
    }

    //drawing

    //pie
    for (let i = 0; i < this.values.length; i++) {
      this.ctx.fillStyle = this.colors[i];
      this.ctx.beginPath();
      this.ctx.moveTo(this.pieCenter.x, this.pieCenter.y);
      this.ctx.arc(this.pieCenter.x, this.pieCenter.y, this.ray, angles[i - 1] || 0, angles[i]);
      this.ctx.lineTo(this.pieCenter.x, this.pieCenter.y);
      this.ctx.fill();

    }
    //percentages
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] == 0) continue;
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = (this.fontSize / 3 * 2) + "px Roboto";
      this.ctx.fillText(this.labels[i], textCoords[i].x - this.ctx.measureText(this.labels[i]).width / 2, textCoords[i].y - this.fontSize / 2);
      this.ctx.font = this.fontSize + "px Roboto";
      this.ctx.fillText(innerStrings[i], textCoords[i].x - this.ctx.measureText(innerStrings[i]).width / 2, textCoords[i].y + this.fontSize / 2);
    }
  }
}
