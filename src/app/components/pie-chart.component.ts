import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
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
    @Input() values: number[];
    @Input() labels: string[];
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[];
    @Input() textColor: string | CanvasGradient | CanvasPattern;
    @Input() title: string;
    @Input() titleColor: string | CanvasGradient | CanvasPattern;
    @Input() legendaTextColor: string | CanvasGradient | CanvasPattern;
    @ViewChild('chartCanvas') canvas: ElementRef;


    ngOnInit() {
        setTimeout(()=>this.printChart(), 1);
    }

    private printChart() {
        //setting up canvas
        this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth * 16;
        this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight * 16;
        let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
        let landscape = this.canvas.nativeElement.width >= this.canvas.nativeElement.height; //calculate if i'm landscape or portrait

        //preparing external data
        let values = this.values || [35, 35, 25, 5];
        let innerStrings = values.map(v=>v.toString()+"%");
        let labels = this.labels || ["Pippo", "Pluto", "Minnie", "Donald"];
        let colors = this.colors || ["#4D3DCC", "#6E3AC2", "#3D78CC", "#3A96C2"];
        let textColor = this.textColor || "#fff";
        let title = this.title || "Title";
        let titleColor = this.titleColor || "#3F51B5";
        let legendaTextColor = this.legendaTextColor;

        let angles = [];
        let total = 0;
        for (let i = 0; i < values.length; i++) { total += values[i]; };     //getting the total
        angles[0] = values[0] * Math.PI * 2 / total;
        for (let i = 1; i < values.length; i++) { angles[i] = angles[i-1] + values[i] * Math.PI * 2 / total; }; //now we got all proportional angles starting from previous one.


        //preparing internal data
        let internalWidth = this.canvas.nativeElement.width;
        let fontSize = landscape ? this.canvas.nativeElement.height / 12 : internalWidth / 10;
        let internalHeight = title == "" ? this.canvas.nativeElement.height : this.canvas.nativeElement.height - fontSize * 1.5;
        //pie area
        let pieArea = {
            x: 0,
            y: fontSize * 1.5,
            width: landscape ? internalWidth / 2 - fontSize * 1.5 : internalWidth - fontSize * 1.5,
            height: landscape ? internalWidth / 2 - fontSize * 1.5 : internalWidth - fontSize * 1.5
        }
        //legenda area
        let legendaArea = {
            x: landscape ? pieArea.width : 0,
            y: landscape ? fontSize * 1.5 : fontSize * 2 + pieArea.height,
            width: landscape ? internalWidth / 2 - fontSize * 1.5 : internalWidth - fontSize * 1.5,
            height: landscape ? internalWidth / 2 - fontSize * 1.5 : internalWidth - fontSize * 1.5,
        }

        //if landscape, i'll put on the left
        //
        //      [             ]
        //  [          ][ ][       ]
        //  [          ][ ][        ]
        //  [          ][ ][       ]
        //  [          ][ ][      ]
        //
        //if portrait, it will be on the top
        //
        //      [         ]
        //  [                   ]
        //  [                   ]
        //  [                   ]
        //  [                   ]
        //  [                   ]
        //  
        //  [       ]
        //  [           ]
        //  [       ]
        //  [          ]
        //
        let pieCenter = { 
                x: pieArea.x + pieArea.width / 2,
                y: pieArea.y + pieArea.height / 2 
            };
        
        
        let ray = pieArea.width / 2;
        ctx.font = fontSize + "px Roboto";
        ctx.textBaseline = "middle";

        let textCoords = [];
        for (let i = 0; i < values.length; i++) {
            let angle = (angles[i] - (angles[i - 1] || 0)) / 2 + (angles[i - 1] || 0)
            textCoords.push(
                {
                    x: pieCenter.x + (ray / 3 * 2) * Math.cos(angle),
                    y: pieCenter.y + (ray / 3 * 2) * Math.sin(angle)
                });
        }

        //drawing

        //title
        ctx.fillStyle = titleColor;
        ctx.fillText(title, internalWidth / 2 - ctx.measureText(title).width / 2, fontSize / 2);

        //pie
        for (let i = 0; i < values.length; i++) {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(pieCenter.x, pieCenter.y);
            ctx.arc(pieCenter.x, pieCenter.y, ray, angles[i - 1] || 0, angles[i]);
            ctx.lineTo(pieCenter.x, pieCenter.y);
            ctx.fill();

        }
        //percentages
        for (let i = 0 ; i < values.length; i++) {
            ctx.fillStyle = textColor;
            ctx.fillText(innerStrings[i], textCoords[i].x - ctx.measureText(innerStrings[i]).width / 2, textCoords[i].y);
        }
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
        }
    }
}