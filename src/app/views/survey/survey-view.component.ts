import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'surveyView',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.css']
})
export class surveyViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollUp(){
        setTimeout(()=>{
            (window).scrollTo(0,0);
        }, 10)
  }
  
}
