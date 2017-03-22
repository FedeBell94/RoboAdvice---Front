import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { RoboAdviceConfig } from '../../app.configuration';
import { Strategy } from "../../model/strategy/strategy";
import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";

@Injectable()
export class BackcastingService {
    constructor(
        private apis: ApiService,
    ) { }


    /*mockAnswerBackend = {
        "response": 1,
        "errorCode": 0,
        "errorString": "",
        "data": [
            {
                "value": 9563.1853,
                "date": "2017-03-02",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-02",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-02",
                "assetClassId": 3
            },
            {
                "value": 515.6653,
                "date": "2017-03-02",
                "assetClassId": 4
            },
            {
                "value": 9536.5279,
                "date": "2017-03-03",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-03",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-03",
                "assetClassId": 3
            },
            {
                "value": 512.6916,
                "date": "2017-03-03",
                "assetClassId": 4
            },
            {
                "value": 9536.5279,
                "date": "2017-03-04",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-04",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-04",
                "assetClassId": 3
            },
            {
                "value": 512.6916,
                "date": "2017-03-04",
                "assetClassId": 4
            },
            {
                "value": 9536.5279,
                "date": "2017-03-05",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-05",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-05",
                "assetClassId": 3
            },
            {
                "value": 512.6916,
                "date": "2017-03-05",
                "assetClassId": 4
            },
            {
                "value": 9531.9641,
                "date": "2017-03-06",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-06",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-06",
                "assetClassId": 3
            },
            {
                "value": 514.3232,
                "date": "2017-03-06",
                "assetClassId": 4
            },
            {
                "value": 9515.56,
                "date": "2017-03-07",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-07",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-07",
                "assetClassId": 3
            },
            {
                "value": 514.7179,
                "date": "2017-03-07",
                "assetClassId": 4
            },
            {
                "value": 9498.0372,
                "date": "2017-03-08",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-08",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-08",
                "assetClassId": 3
            },
            {
                "value": 513.8758,
                "date": "2017-03-08",
                "assetClassId": 4
            },
            {
                "value": 9443.696,
                "date": "2017-03-09",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-09",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-09",
                "assetClassId": 3
            },
            {
                "value": 508.2442,
                "date": "2017-03-09",
                "assetClassId": 4
            },
            {
                "value": 9364.1922,
                "date": "2017-03-10",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-10",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-10",
                "assetClassId": 3
            },
            {
                "value": 505.1915,
                "date": "2017-03-10",
                "assetClassId": 4
            },
            {
                "value": 9364.1922,
                "date": "2017-03-11",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-11",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-11",
                "assetClassId": 3
            },
            {
                "value": 505.1915,
                "date": "2017-03-11",
                "assetClassId": 4
            },
            {
                "value": 9364.1922,
                "date": "2017-03-12",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-12",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-12",
                "assetClassId": 3
            },
            {
                "value": 505.1915,
                "date": "2017-03-12",
                "assetClassId": 4
            },
            {
                "value": 9394.2958,
                "date": "2017-03-13",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-13",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-13",
                "assetClassId": 3
            },
            {
                "value": 502.981,
                "date": "2017-03-13",
                "assetClassId": 4
            },
            {
                "value": 9339.6779,
                "date": "2017-03-14",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-14",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-14",
                "assetClassId": 3
            },
            {
                "value": 502.5862,
                "date": "2017-03-14",
                "assetClassId": 4
            },
            {
                "value": 9384.2268,
                "date": "2017-03-15",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-15",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-15",
                "assetClassId": 3
            },
            {
                "value": 503.0073,
                "date": "2017-03-15",
                "assetClassId": 4
            },
            {
                "value": 9493.3749,
                "date": "2017-03-16",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-16",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-16",
                "assetClassId": 3
            },
            {
                "value": 504.5336,
                "date": "2017-03-16",
                "assetClassId": 4
            },
            {
                "value": 9450.5867,
                "date": "2017-03-17",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-17",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-17",
                "assetClassId": 3
            },
            {
                "value": 504.5336,
                "date": "2017-03-17",
                "assetClassId": 4
            },
            {
                "value": 9450.5867,
                "date": "2017-03-18",
                "assetClassId": 1
            },
            {
                "value": 0,
                "date": "2017-03-18",
                "assetClassId": 2
            },
            {
                "value": 0,
                "date": "2017-03-18",
                "assetClassId": 3
            },
            {
                "value": 504.5336,
                "date": "2017-03-18",
                "assetClassId": 4
            }
        ]
    };*/

    /* methods */

    getBackcastingSimulation(str: Strategy, from: string): Observable<GenericResponse> {
        let obj = {
            from: from,
            strategy: str.asset_class
        }
        return this.apis.post('backcasting', obj).map((res: GenericResponse) => {
            let graph = this.computeData(res.data);
            // let graph = this.computeData(this.mockAnswerBackend.data);
            return new GenericResponse(1, 0, "", graph);
        });
    }

    private computeData(data: any) {

        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions('Worth-Backcasting', 'value'));

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