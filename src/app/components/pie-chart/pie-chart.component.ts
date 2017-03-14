import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  @Input() values: number[] = [25, 25, 25, 25];
  @Input() labels: string[] = ["Label 1", "Label 2", "Label 3", "Label 4"];
  @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = ['#86c7f3','#aed581','#ffa1b5','#ECD25B', '#DADBD8'];
  @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";

  @ViewChild('pieChart_Canvas') canvas: ElementRef;

  ngOnInit() {
    if (!this.values) this.values = [25, 25, 25, 25];
    this.rePaint();
  }

  /*ngAfterViewChecked(){
    this.rePaint();
  }*/

  rePaint() {
    setTimeout(() => this.printChart(), 300);
    //window.requestAnimationFrame(this.printChart.bind(this));
  }


  private printChart() {
    //setting up canvas
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
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
