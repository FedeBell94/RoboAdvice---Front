/**
 * Created by lorenzogagliani on 01/03/17.
 */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ManageJsonService } from "../services/manageJson.service";
import { Question } from "../model/survey/question";
import { Strategy } from "../model/strategy/strategy";
import { ApiService } from "../services/remote/remote-call.service";

@Component({
  selector: "survey-page",
  templateUrl: "/app/pages/survey-page.template.html",
  styleUrls: ['app/css/survey-page.css']
})
export class SurveyPageComponent {

  questions: Question[];

  strategies: Strategy[];

  idAnswer: number = -1;

  totalScore: number[] = [0, 0, 0, 0, 0]; //0: Bonds, 1: Income, 2: Balanced, 3: Growth, 4: Stocks

  constructor(
    private jsonService: ManageJsonService,
    private apiService: ApiService,
    private routes: Router
  ) {  }

  ngOnInit() {
    this.jsonService.getFromJson('survey_roboadvice.json').subscribe((data:any)=> {
      console.log(data["questions"]);
      this.questions = data["questions"];
    });
    document.getElementsByTagName("md-tab-header")
                .item(0).setAttribute("style", "display: none");
  }

  sendMyStrategy(my_strategy: Strategy){
    console.log("Uploading my strategy...");
    console.log(my_strategy.asset_class);
    this.apiService.post("updateStrategy", my_strategy.asset_class).subscribe(()=>{
      console.log("Uploaded!");
    });


  }

  choiceStrategy() {
    let x: number = 50;
    x += this.totalScore[1];    //sum: Income
    x -= this.totalScore[3];    //sub: Growth
    x += this.totalScore[0]/2;  //sum: Bonds/2
    x -= this.totalScore[4]/2;  //sum: Stocks/2

    this.jsonService.getFromJson('strategy_roboadvice.json').subscribe((data:any)=> {
      this.strategies = data["strategies"];
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
    });

  }

  submitQuestion(idTab: number){
    if (this.idAnswer != -1){
        if (idTab < this.questions.length){

            for (let i: number = 0; i < this.questions[idTab].answers.length; i++){
              this.totalScore[i] += this.questions[idTab].answers[this.idAnswer].scores[i];
            }

            if (idTab != this.questions.length - 1) {
                document.getElementById("md-tab-label-0-" + (idTab + 1)).click();
            }else{
                //END---> Now SEND DATA and redirect to dashboard.
                console.log("Bonds: "+   this.totalScore[0]);
                console.log("Income: "+  this.totalScore[1]);
                console.log("Balanced: "+this.totalScore[2]);
                console.log("Growth: "+  this.totalScore[3]);
                console.log("Stocks: "+  this.totalScore[4]);
                this.choiceStrategy();
                this.routes.navigate(["/dashboard"]);
            }
            this.idAnswer = -1;
        }
    }
  }

  setAnswer(answ: number){
    this.idAnswer = answ;
  }

}
