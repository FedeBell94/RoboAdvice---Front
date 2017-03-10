import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, NgZone } from "@angular/core";

@Component({
    selector: 'app-pie-chart-3d',
    templateUrl: './pie-chart-3d.component.html',
    styleUrls: ['./pie-chart-3d.component.css']
})
export class PieChart3dComponent implements OnInit {
    constructor(
        private _z: NgZone,
    ) { }
    @Input() values: number[] = [20, 20, 20, 20, 20];
    @Input() labels: string[] = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"];
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = ["#3c4eb9", "#1b70ef", "#00abff", "#40daf1", "#4A861E"];
    @Input() textColor: string | CanvasGradient | CanvasPattern = "#fff";
    @Input() titleColor: string | CanvasGradient | CanvasPattern;
    @ViewChild('chartCanvas') canvas: ElementRef;
    @Output() save = new EventEmitter();




    ngOnInit() {
        if (!this.values) this.values = [20, 20, 20, 20, 10];
        this.rePaint();
    }

    rePaint() {
        setTimeout(() => this.printChart(), 1);
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
        this.save.emit(this.values);
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
