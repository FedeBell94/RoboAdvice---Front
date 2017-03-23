import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { RoboAdviceConfig } from '../../app.configuration';
import { Strategy } from "../../model/strategy/strategy";
import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";

@Injectable()
export class BackTestingService {
    constructor(
        private apis: ApiService,
    ) { }

    /* methods */

    getRawBackTestingSimulation(str: Strategy, from: string): Observable<GenericResponse> {
        let obj = {
            from: from,
            strategy: str.asset_class
        }
        return this.apis.post('backTesting', obj);
    }

    getBackTestingSimulation(str: Strategy, from: string): Observable<GenericResponse> {
        let obj = {
            from: from,
            strategy: str.asset_class
        }
        return this.apis.post('backTesting', obj).map((res: GenericResponse) => {
            let graph = this.computeData(res.data);
            // let graph = this.computeData(this.mockAnswerBackend.data);
            console.log(graph);
            return new GenericResponse(1, 0, "", graph);
        });
    }

    private computeData(data: any) {

        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions('Worth-Backtesting', 'value'));

        let dataProvider = [];
        let tmp = [];
        for (let i = 0; i < data.length; i++) {
            if (!tmp[data[i].date])
                tmp[data[i].date] = 0;

            tmp[data[i].date] += data[i].value;
        }

        for (let y in tmp) {
            dataProvider.push({
                date: y,
                value: Math.round(tmp[y] * 100) / 100,
            });
        }

        return ChartUtils.getOptions(dataProvider, graphOptions);
    }

}