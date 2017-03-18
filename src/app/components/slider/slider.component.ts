import { Component, OnInit, ViewChild, Input, Output, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  constructor() { }
  @ViewChild('canvas') private canvas: ElementRef;
  @Input() max: number = 100;                                                       //max value
  @Input() maxAllowed: number = this.max;                                           //max allowed value
  @Input() value: number = 0;                                                       //current value
  @Input() step: number = 1;                                                        //min gap between values
  @Input() fillColor: string | CanvasGradient | CanvasPattern = "#3C3";             //inner color of valued part
  @Input() limitColor: string | CanvasGradient | CanvasPattern = "#fafafa";         //inner color of not allowed part when max allowed value is reached
  @Input() ballColor: string | CanvasGradient | CanvasPattern = "#090";             //ball color
  @Input() onFocusBorderColor: string | CanvasGradient | CanvasPattern = "#399";    //border color while pointer down
  @Input() borderColor: string | CanvasGradient | CanvasPattern = "#333";           //border color on rest
  @Input() backColor: string | CanvasGradient | CanvasPattern = "#fafafa";          //inner color on rest
  @Input() remainingColor: string | CanvasGradient | CanvasPattern = "#909090";     //color of the remaining available space while scrolling

  @Output() change = new EventEmitter<number>();     //triggered on pointerup
  @Output() input = new EventEmitter<number>();      //triggered on value change

  private ctx: CanvasRenderingContext2D;
  private p: { x: number, y: number } = { x: 0, y: 0 };
  private w: number;
  private h: number;
  private borColor: string | CanvasGradient | CanvasPattern = this.borderColor;
  private bColor: string | CanvasGradient | CanvasPattern = this.backColor;

  private dW: number;
  private dX: number;
  private dH: number;
  private dY: number;

  ngOnInit() {
    this.setupCanvas();

    this.canvas.nativeElement.onpointerdown = this.onpointerdown.bind(this);

    this.draw();
  }

  setManually(config: { max?: number, maxAllowed?: number, value?: number, step?: number }) {
    if (config.max != undefined) this.max = config.max;
    if (config.maxAllowed != undefined) {
        if(config.maxAllowed > this.max) this.maxAllowed = this.max;
        else this.maxAllowed = config.maxAllowed;
    }
    if (config.value != undefined) {
        if (config.value > this.maxAllowed) this.value = this.maxAllowed;
        else this.value = config.value;
    }
    if (config.step != undefined) this.step = config.step;
  }

  ngAfterViewChecked(){
    this.repaint();
  }

  repaint() {
    this.setupCanvas();
    this.draw();
  }

  private setupCanvas() {
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;

    this.h = this.canvas.nativeElement.offsetHeight;
    this.w = this.canvas.nativeElement.offsetWidth;

    this.dW = this.w - this.h;
    this.dX = this.h / 2;
    this.dY = 0;
    this.dH = this.h;
  }

  private onpointerdown(e) {
    //set pointer position
    this.p.x = e.clientX - this.getOffsetLeft(this.canvas.nativeElement) - this.dX;
    this.p.y = e.clientY - this.canvas.nativeElement.offsetTop;
    //set border
    this.ctx.lineWidth = this.h / 15;
    this.onFocusBorderColor = this.onFocusBorderColor;

    //set onmove
    document.onpointermove = this.onpointermove.bind(this);
    //set onup
    document.onpointerup = this.onpointerup.bind(this);
    this.computeValue(e);
    //draw
    this.draw();
  }

  private onpointermove(e) {
    this.computeValue(e);
    this.draw();
  }

  private onpointerup() {
    document.onpointermove = undefined;
    this.canvas.nativeElement.onpointerup = undefined;
    this.borColor = "#333";
    this.ctx.lineWidth = 1;
    this.draw();
    this.change.emit(this.value);
  }

  private computeValue(e) {
    let old = this.value;

    let p = this.p;
    p.x = e.clientX - this.getOffsetLeft(this.canvas.nativeElement) - this.dX;
    p.y = e.clientY - this.canvas.nativeElement.offsetTop;

    if (p.x < 0) p.x = 0;
    else if (p.x > this.dW) p.x = this.dW;

    this.value = this.max * p.x / this.dW;
    this.value = Math.floor(this.value);


    this.value = this.value - this.value % this.step;
    if (this.value >= this.maxAllowed) {
      this.value = this.maxAllowed;
      this.bColor = this.limitColor;
    } else {
      this.bColor = this.backColor;
    }

    //if the value changes, trigger the 'input' event
    if (old != this.value) this.input.emit(this.value);
  }

  private draw() {
    //shortcuts
    let c = this.ctx;
    let w = this.w;
    let h = this.h;
    let p = this.p;

    //resetting shadow
    c.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    c.shadowColor = null;
    c.shadowBlur = 0;
    c.shadowOffsetY = 0;
    c.shadowOffsetX = 0;

    //painting border and background
    c.strokeStyle = this.borColor;
    c.strokeRect(this.dX, h / 6 * 2, this.dW, h / 6 * 2);
    c.fillStyle = this.bColor;
    c.fillRect(this.dX, h / 6 * 2, this.dW, h / 6 * 2);

    //painting remaining part
    c.fillStyle = this.remainingColor;
    let rX = this.dX + this.value / this.max * this.dW;
    let rW = this.maxAllowed / this.max * this.dW - rX + this.dX;
    c.fillRect(
        rX,
        h / 6 * 2,
        rW,
        h / 6 * 2
      )

    //paintint filled part
    c.fillStyle = this.fillColor;
    c.fillRect(this.dX, h / 6 * 2, this.value / this.max * this.dW, h / 6 * 2);
    //painting cursor
    c.beginPath();
    c.arc(this.dX + this.value / this.max * this.dW, h / 2, h / 2 - h / 8, 0, Math.PI * 2);
    c.fillStyle = this.ballColor;
    c.shadowColor = '#999';
    c.shadowBlur = this.h / 7;
    c.shadowOffsetY = this.h / 15;
    c.shadowOffsetX = 0;
    c.fill();
  }

  private getOffsetLeft(elem) {
    var offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while (elem = elem.offsetParent);
    return offsetLeft;
  }

}
