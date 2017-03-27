import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { StrategyService } from "../../services/strategy/strategy.service";
import { Strategy } from "../../model/strategy/strategy";
import { RoboAdviceConfig } from "../../app.configuration";
import { PieChartComponent } from "../pie-chart/pie-chart.component";


@Component({
    selector: 'app-default-strategies',
    templateUrl: './default-strategies.component.html',
    styleUrls: ['./default-strategies.component.css']
})
export class DefaultStrategiesComponent implements OnInit {

    private roboAdviceConfig = RoboAdviceConfig;

    constructor(
        private apiService: StrategyService,
    ) { }

    @Input() strategies: Strategy[];

    @Input() strategy: Array<Array<number>>;

    @Input() textAlert: string = "If you want you can adjust (or change) the percentages of your strategy by your dashboard";

    @Output() save = new EventEmitter();

    ngOnInit() {
    }

    chooseStrategy(my_strategy: Strategy) {
        this.apiService.saveStrategy(my_strategy).subscribe((data) => {
            console.log("Strategy changed:");
            this.save.emit();
            (window as any).swal("Well done!", "Your strategy is '" + my_strategy.name + "'.\n" + this.textAlert, "success");
        });
    }

    getStrategy(id: number) {
        return this.strategy[id];
    }
}
