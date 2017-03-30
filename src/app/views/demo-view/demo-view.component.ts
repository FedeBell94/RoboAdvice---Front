import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from "../../services/remote/authentication.service";
import { DemoService } from "../../services/demo/demo.service";
import { Strategy } from "../../model/strategy/strategy";
import { StrategyComponent } from "../../components/strategy/strategy.component";

@Component({
    selector: 'demo',
    templateUrl: './demo-view.component.html',
    styleUrls: ['./demo-view.component.css']
})
export class demoViewComponent implements OnInit, OnDestroy {

    constructor(
        private auth: AuthService,
        private demo: DemoService,
    ) { }
    @ViewChild("strategyComponent") strategyComponent: StrategyComponent;
    private hasStarted: boolean = false;
    private startingDate: string = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    private strategy: Strategy;
    private days: number;

    private autoNext: boolean;
    private seconds: number = 2;

    private text = "Choose a strategy and then click on 'start' to begin the simulation.";
    textButton: string = "Start";
    textPreview: string = this.text;
    chartOptions: any;

    @ViewChild("inputStartingDate") inputDate: ElementRef;
    @ViewChild("nextButton") nextButton: ElementRef;

    private lastComputedDay() { return this.demo.getCurrentDate() };

    ngOnInit() {
        //set default date
        this.initData();
    }

    ngOnDestroy() {
        this.resetDemo();
    }

    private initData() {
        this.days = 1;
        let d = new Date();
        d.setDate(d.getDate() - 1);
        this.onStartDateChange({
            target: {
                value: d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
        });
        //set default strategy
        this.getInitialStrategy();
    }

    resetDemo() {
        this.textPreview = this.text;
        this.textButton = "Start";
        this.chartOptions = null;
        this.inputDate.nativeElement.disabled = false;
        this.nextButton.nativeElement.disabled = true;
        this.demo.wipeCache();
        this.initData();
    }

    getPortfolio() {
        return this.demo.getCached('portfolio');
    }

    getChartOptions() {
        return this.chartOptions;
    }

    isLogged() {
        return this.auth.isLogged();
    }

    demoNextDay() {
        if (!this.strategy) {
            (window as any).swal("Ooops", "You need to choose a strategy", "error");
            return;
        }

        this.textPreview = "Loading data...";
        this.textButton = "Next";

        this.inputDate.nativeElement.disabled = true;
        // disable next button, it'll enable when the call will came back
        this.nextButton.nativeElement.disabled = true;
        this.demo.demoDate(this.strategy, this.days).subscribe(res => {
            if (res.response > 0) {
                this.chartOptions = res.data;
                // enable nextButton
                this.nextButton.nativeElement.disabled = false;

                if (!this.isLastUtilDate()) {
                    this.textButton = "End";
                    (window as any).swal("Completed", "Simulation has ended", "success");
                    return;
                } else if (this.autoNext) {
                    setTimeout(() => {
                        this.chartOptions = null;
                        this.demoNextDay();
                    }, this.seconds * 1000);
                }

            } else {
                this.textPreview = res.data + ".\n Click on 'reset' to restart Demo";
            }
        });

    }

    private isLastUtilDate(): boolean {
        let today = new Date();
        if (this.lastComputedDay() >= today.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')) {
            this.nextButton.nativeElement.disabled = true;
            return false;
        }
        return true;
    }

    onStrategySave(s: Strategy) {
        this.nextButton.nativeElement.disabled = false;
        this.strategy = JSON.parse(JSON.stringify(s));
        (window as any).swal('Done!', 'Strategy selected', 'success');
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

    onNumberDaysChange(e: any) {
        if (e.target.value <= 0) {
            this.days = 1;
        } else {
            this.days = e.target.value;
        }
    }

    onNumberSecondsChange(e: any) {
        this.seconds = e.target.value;
    }

    private getInitialStrategy() {
        if (this.strategyComponent) {
            this.strategyComponent.getInitial().subscribe(res => {
                if (res.response > 0) {
                    this.strategy = res.data;
                }
            });
        } else {
            setTimeout(this.getInitialStrategy.bind(this), 10);
        }
    }

    changeAutomaticDemo(e: any) {
        this.autoNext = e.target.checked;
    }

}
