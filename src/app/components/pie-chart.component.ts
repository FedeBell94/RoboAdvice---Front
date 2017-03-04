import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';

@Component({
  selector: "pie-chart",
  templateUrl: 'app/components/pie-chart.template.html',
  styleUrls: ['app/components/pie-chart.style.css']
})
export class PieChartComponent {
    constructor(
    ) { }
    @Input() values: number[] = [20, 20, 20, 40];
    @Input() labels: string[] = ["Pippo", "Pluto", "Minnie", "Donald"];
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = ["#3c4eb9", "#1b70ef", "#00abff", "#40daf1"];
    @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";
    @Input() title: string;
    @Input() titleColor: string | CanvasGradient | CanvasPattern;
    @Input() legendaTextColor: string | CanvasGradient | CanvasPattern;
    @Input() portrait: boolean = false;
    @ViewChild('chartCanvas') canvas: ElementRef;
    @Output() save = new EventEmitter();

    getMax(i:number) {
        let tot = 0;
        for (let j = 0; j < this.values.length; j++) tot += this.values[j];
        return 100 - tot + this.values[i];
    }


    ngOnInit() {
        if (!this.values) this.values = [20, 20, 20, 40];
        this.rePaint();
    }

    rePaint() {
        setTimeout(()=>this.printChart(), 1);
    }

    valueChanged(event: any, i:number) {
        this.values[i] = event.value;
        this.rePaint();
        console.log(event);
    }

    saveStrategy() {
        this.save.emit(this.values);
    }

    private printChart() {
        //setting up canvas
        this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth ;
        this.canvas.nativeElement.style.height = this.canvas.nativeElement.offsetWidth ;
        this.canvas.nativeElement.height = this.canvas.nativeElement.offsetWidth ;
        let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

        //preparing external data
        let innerStrings = this.values.map(v=>v.toString()+"%");

        let angles: number[] = [];
        let total = 0;
        for (let i = 0; i < this.values.length; i++) { total += this.values[i]; };     //getting the total
        angles[0] = this.values[0] * Math.PI * 2 / total;
        for (let i = 1; i < this.values.length; i++) { angles[i] = angles[i-1] + this.values[i] * Math.PI * 2 / total; }; //now we got all proportional angles starting from previous one.


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
        for (let i = 0 ; i < this.values.length; i++) {
            if (this.values[i] == 0) continue;
            ctx.fillStyle = this.textColor;
            ctx.font = (fontSize / 3 * 2) + "px Roboto";
            ctx.fillText(this.labels[i], textCoords[i].x - ctx.measureText(this.labels[i]).width / 2, textCoords[i].y - fontSize / 2);
            ctx.font = fontSize + "px Roboto";
            ctx.fillText(innerStrings[i], textCoords[i].x - ctx.measureText(innerStrings[i]).width / 2, textCoords[i].y + fontSize / 2);
        }
        /*
        //legenda
        ctx.font = (fontSize / 3 * 2) + "px Roboto";
        let maxLabelLenght = 0;
        for (let i = 0; i < values.length; i++) if (maxLabelLenght < ctx.measureText(labels[i] || "").width) maxLabelLenght = ctx.measureText(labels[i]).width;
        //TODO: resizing if exceed
        let lineSpace = legendaArea.width / values.length;
        for (let i = 0; i < values.length; i++) {
            
            //color
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(legendaArea.x + lineSpace / 2, legendaArea.y + i * lineSpace + lineSpace / 2, lineSpace / 4, 0, 2 * Math.PI);
            ctx.fill();

            //label
            ctx.fillStyle = legendaTextColor || colors[i];
            ctx.fillText(labels[i] || "", legendaArea.x + lineSpace, legendaArea.y + i * lineSpace + lineSpace / 2);
        }*/
    }
}