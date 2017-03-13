import { Component, OnInit } from '@angular/core';
import {Route, Router} from "@angular/router";
import {Question} from "../../model/survey/question";
import {Strategy} from "../../model/strategy/strategy";
import {ManageJsonService} from "../../services/manageJson.service";
import {StrategyService} from "../../services/strategy.service";
import {AuthService} from "../../services/remote/authentication.service";

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

  strategy: Array<Array<number>>;

  assetClassName: string[] = ['BONDS', 'INCOME', 'BALANCED', 'GROWTH', 'STOCKS'];

  currentStrategyName: string;

  currentStrategyValues: number[] = [25,25,25,25];

  constructor(
    private jsonService: ManageJsonService,
    private apiService: StrategyService,
    private auth: AuthService,
    private routes: Router
  ) { }

  ngOnInit() {
    jQuery('a[title]').tooltip();
    this.jsonService.getFromJson('survey_roboadvice.json').subscribe((data:any)=> {
      this.questions = data["questions"];
      console.log("this.questions: ", this.questions);
    });
    this.jsonService.getFromJson('strategy_roboadvice.json').subscribe((data:any)=> {
      this.strategies = data["strategies"];
      console.log("this.strategies: ", this.strategies);

      this.strategy = new Array<Array<number>>();

      for (let i = 0; i < this.strategies.length; i++){
        this.strategy[i] = new Array<number>();
        for (let j = 0; j < this.strategies[i].asset_class.length; j++){
            this.strategy[i][j] = parseInt(this.strategies[i].asset_class[j].percentage.toString());
        }
      }
      console.log(this.strategy);
    });
  }

  getStrategy(id: number){
    return this.strategy[id];
  }

  setAnswer(answ: number){
    this.idAnswer = answ;
  }

  sendMyStrategy(my_strategy: Strategy){
    this.apiService.saveStrategy(my_strategy).subscribe((data)=>{
      console.log("Strategy sent:");
      console.log(my_strategy.asset_class);
      /*this.currentStrategyName = my_strategy.name;
      let i : number = 0;
      for (let entry of my_strategy.asset_class) {
        this.currentStrategyValues[i] = entry.percentage;
        i++;
      }
      console.log(this.currentStrategyValues);*/
      this.auth.getUser().newUser = false;
      this.routes.navigate(["/mainView"]);
      (window as any).swal("Well done!", "Your strategy is '" + my_strategy.name +"'.\n If you want you can adjust (or change) the percentages of your strategy by your dashboard","success");
      //document.getElementById('select_strategy').click();
    });
  }

  choiceStrategy() {
    let x: number = 50;
    x += this.totalScore[1];    //sum: Income
    x -= this.totalScore[3];    //sub: Growth
    x += this.totalScore[0]/2;  //sum: Bonds/2
    x -= this.totalScore[4]/2;  //sub: Stocks/2

    console.log("Total Score: ");
    console.log("Bonds: "+   this.totalScore[0]);
    console.log("Income: "+  this.totalScore[1]);
    console.log("Balanced: "+this.totalScore[2]);
    console.log("Growth: "+  this.totalScore[3]);
    console.log("Stocks: "+  this.totalScore[4]);


      switch (true){
        case (x < 20):
          console.log("Stocks");
          this.sendMyStrategy(this.strategies[4]);
          break;
        case (x >= 20 && x < 40):
          console.log("Growth");
          this.sendMyStrategy(this.strategies[3]);
          break;
        case (x >= 40 && x < 60):
          console.log("Balanced");
          this.sendMyStrategy(this.strategies[2]);
          break;
        case (x >= 60 && x < 80):
          console.log("Income");
          this.sendMyStrategy(this.strategies[1]);
          break;
        case (x >= 80):
          console.log("Bonds");
          this.sendMyStrategy(this.strategies[0]);
          break;
      }

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

  choose_strategy(id: number){
      this.sendMyStrategy(this.strategies[id]);
  }

}
