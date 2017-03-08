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

  ngOnInit() {

  }

  isLoss(): boolean{
    if (this.myProfLoss < 0)
      return true;
    else
      return false;
  }

}
