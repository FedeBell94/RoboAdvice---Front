import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {StrategyService} from "../../services/strategy/strategy.service";
import {Strategy} from "../../model/strategy/strategy";

@Component({
  selector: 'app-default-strategies',
  templateUrl: './default-strategies.component.html',
  styleUrls: ['./default-strategies.component.css']
})
export class DefaultStrategiesComponent implements OnInit {

  constructor(
    private apiService: StrategyService,
  ) { }

  @Input() strategies: Strategy[];

  @Input() strategy: Array<Array<number>>;

  @Input() textAlert: string = "If you want you can adjust (or change) the percentages of your strategy by your dashboard";

  @Output() save = new EventEmitter();

  assetClassName: string[] = ['BONDS', 'INCOME', 'BALANCED', 'GROWTH', 'STOCKS'];

  ngOnInit() {
  }

  chooseStrategy(my_strategy: Strategy){
    this.apiService.saveStrategy(my_strategy).subscribe((data)=>{
      console.log("Strategy changed:");
      this.save.emit();
      (window as any).swal("Well done!", "Your strategy is '" + my_strategy.name +"'.\n"+this.textAlert,"success");
    });
  }

  getStrategy(id: number){
    return this.strategy[id];
  }
}
