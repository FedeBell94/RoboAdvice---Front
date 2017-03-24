import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-worth',
  templateUrl: './worth.component.html',
  styleUrls: ['./worth.component.css']
})
export class WorthComponent implements OnInit {

  constructor(
  ) { }

  @Input() myWorth: number;
  @Input() myProfLoss: number;
  @Input() demo: boolean = false;

  ngOnInit() {
  }

  isLoss(): boolean{
    return (this.myProfLoss < 0);
  }

}
