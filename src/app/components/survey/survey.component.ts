import { Component, OnInit } from '@angular/core';
import {Question} from "../../model/survey/question";
import {Strategy} from "../../model/strategy/strategy";
import {ManageJsonService} from "../../services/manageJson.service";
import {StrategyService} from "../../services/strategy.service";
import {AuthService} from "../../services/remote/authentication.service";
import {Router} from "@angular/router";

declare var jQuery:any;

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  questions: Question[];

  strategies: Strategy[];

  idAnswer: number = -1;

  idNextTab: number = 1;

  totalScore: number[] = [0, 0, 0, 0, 0]; //0: Bonds, 1: Income, 2: Balanced, 3: Growth, 4: Stocks

  strategySelected: string;

  constructor(
    private jsonService: ManageJsonService,
    private apiService: StrategyService,
  ) { }

  ngOnInit() {
    jQuery('a[title]').tooltip();
    this.jsonService.getFromJson('survey_roboadvice.json').subscribe((data:any)=> {
      this.questions = data["questions"];
      console.log("this.questions: ", this.questions);

    });
  }

  setAnswer(answ: number){
    this.idAnswer = answ;
  }

  sendMyStrategy(my_strategy: Strategy){
    this.apiService.saveStrategy(my_strategy).subscribe((data)=>{
      console.log("Strategy sent:");
      console.log(my_strategy.asset_class);
      document.getElementById('select_strategy').click();
    });
  }

  choiceStrategy() {
    let x: number = 50;
    x += this.totalScore[1];    //sum: Income
    x -= this.totalScore[3];    //sub: Growth
    x += this.totalScore[0]/2;  //sum: Bonds/2
    x -= this.totalScore[4]/2;  //sum: Stocks/2

    console.log("Total Score: ");
    console.log("Bonds: "+   this.totalScore[0]);
    console.log("Income: "+  this.totalScore[1]);
    console.log("Balanced: "+this.totalScore[2]);
    console.log("Growth: "+  this.totalScore[3]);
    console.log("Stocks: "+  this.totalScore[4]);

    this.jsonService.getFromJson('strategy_roboadvice.json').subscribe((data:any)=> {
      this.strategies = data["strategies"];
      switch (true){
        case (x < 20):
          console.log("Stocks");
          this.strategySelected = this.strategies[4].name;
          this.sendMyStrategy(this.strategies[4]);
          break;
        case (x >= 20 && x < 40):
          console.log("Growth");
          this.strategySelected = this.strategies[3].name;
          this.sendMyStrategy(this.strategies[3]);
          break;
        case (x >= 40 && x < 60):
          console.log("Balanced");
          this.strategySelected = this.strategies[2].name;
          this.sendMyStrategy(this.strategies[2]);
          break;
        case (x >= 60 && x < 80):
          console.log("Income");
          this.strategySelected = this.strategies[1].name;
          this.sendMyStrategy(this.strategies[1]);
          break;
        case (x >= 80):
          console.log("Bonds");
          this.strategySelected = this.strategies[0].name;
          this.sendMyStrategy(this.strategies[0]);
          break;
      }
    });

  }

  submitQuestion(){
    if (this.idAnswer != -1){
      let idCurrentTab = this.idNextTab - 1;
      if (this.idNextTab < this.questions.length){
        for (let i: number = 0; i < this.questions[idCurrentTab].answers[this.idAnswer].scores.length; i++){
          this.totalScore[i] += this.questions[idCurrentTab].answers[this.idAnswer].scores[i];
        }
        document.getElementById("a_tab"+this.idNextTab).click();
        this.idAnswer = -1;
        this.idNextTab++;

      }else{
        this.choiceStrategy();
        console.log("Survey finished, total score: ", this.totalScore);
      }
    }
  }

}
