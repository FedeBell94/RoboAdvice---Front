import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-portfolio-snapshot',
  templateUrl: './portfolio-snapshot.component.html',
  styleUrls: ['./portfolio-snapshot.component.css']
})
export class PortfolioSnapshotComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  @Input() percentage: number;
  @Input() assetClassName: string;
  @Input() value: number;

  ngOnInit() {
  }

  isLoss(percentage: number): boolean {
    if (percentage < 0)
      return true;
    else
      return false;
  }

}
