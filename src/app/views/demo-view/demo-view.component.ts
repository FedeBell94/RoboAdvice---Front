import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/remote/authentication.service";
import { DemoService } from "../../services/demo/demo.service";
import { Strategy } from "../../model/strategy/strategy";
import { StrategyComponent } from "../../components/strategy/strategy.component";

@Component({
  selector: 'demo',
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.css']
})
export class demoViewComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private demo: DemoService,
  ) { }
  @ViewChild("strategyComponent") strategyComponent: StrategyComponent;
  private hasStarted: boolean = false;
  private startingDate: string = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  private strategy: Strategy;
  private lastComputedDay() { return this.demo.getCurrentDate() };

  getPortfolio() {
      return this.demo.getCached('portfolio');
  }

  getChartOptions() {
    return this.demo.getCached('chartOptions');
  }

  isLogged() {
    return this.auth.isLogged();
  }

  demoNextDay() {
      if (!this.strategy) {
          (window as any).swal("Ooops", "You need to choose a strategy", "error");
          return;
      }
      this.demo.demoDate(this.strategy).subscribe(res=> {
          if (res.response > 0) {
              
          }
      });
    
  }

  onStrategySave(s: Strategy) {
      this.strategy = s;
  }

  onStartDateChange(e) {
      //used to manually do the double-way binding
      let d = new Date();
      d.setDate(d.getDate() - 1);
      if (e.target.value > d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')) {
          e.target.value = d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
      } else {
          this.startingDate = e.target.value;
          this.demo.setCurrentDate(this.startingDate);
      }
  }

  ngOnInit() {
      //set default date
      let d = new Date();
      d.setDate(d.getDate() - 1);
      this.onStartDateChange({target: {value: d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') }});
      //set default strategy
      this.getInitialStrategy();
  }

  private getInitialStrategy() {
    if (this.strategyComponent) {
        this.strategyComponent.getInitial().subscribe(res=> {
            if (res.response > 0) {
                this.strategy = res.data;
            }
        });
    } else {
        setTimeout(this.getInitialStrategy.bind(this), 10);
    }
  }

}
