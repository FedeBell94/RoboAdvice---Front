/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';
import { GenericResponse } from "../remote/remote-call/generic-response";
import { PortfolioCache } from "../../model/portfolio/portfolio-cache";
import { ApiService } from "../remote/remote-call/remote-call.service";
import { AssetService } from "../asset/asset.service";
import { MockApiService } from "../../mock/mock-remote-call.service";

describe('Service: AssetSnapshot', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                    PortfolioService,
                    {provide: ApiService, useClass: MockApiService},
                ]
        });
    });

    it("#compute cache", () => {
        let portfolio = new PortfolioService(null, null);

        portfolio['cache'] = new PortfolioCache();

        portfolio['cache'].raw = [
            {
                "date": "2017-01-02",
                "assetClassId": 1,
                "value": 3700
            },
            {
                "date": "2017-01-02",
                "assetClassId": 2,
                "value": 2100
            },
            {
                "date": "2017-01-02",
                "assetClassId": 3,
                "value": 2000
            },
            {
                "date": "2017-01-02",
                "assetClassId": 4,
                "value": 2200
            },
            {
                "date": "2017-01-03",
                "assetClassId": 1,
                "value": 3700
            },
            {
                "date": "2017-01-03",
                "assetClassId": 2,
                "value": 2110.0554
            },
            {
                "date": "2017-01-03",
                "assetClassId": 3,
                "value": 2000
            },
            {
                "date": "2017-01-03",
                "assetClassId": 4,
                "value": 2200
            }
        ];

        let resAsset = new GenericResponse(1, 0, "", [
            {
                id: 1,
                name: "Bonds"
            },
            {
                id: 2,
                name: "Forex"
            },
            {
                id: 3,
                name: "Stocks"
            },
            {
                id: 4,
                name: "Commodities"
            }
        ]);

        portfolio['computeCache'](resAsset);
        expect(portfolio['cache'].worthHistoryOptions).not.toBeNull();
        expect(portfolio['cache'].profLoss).not.toBe(0);
        expect(portfolio['cache'].portfolio.assets.length).toBe(4);

        portfolio['cache'].raw = [];
        portfolio['computeCache'](resAsset);
        expect(portfolio['cache'].profLoss).toBe(0);

        portfolio['cache'].raw = [
            {
                "date": "2017-01-02",
                "assetClassId": 1,
                "value": 3700
            },
            {
                "date": "2017-01-02",
                "assetClassId": 2,
                "value": 2100
            },
            {
                "date": "2017-01-02",
                "assetClassId": 3,
                "value": 2000
            },
            {
                "date": "2017-01-02",
                "assetClassId": 4,
                "value": 2200
            }
        ];
        portfolio['computeCache'](resAsset);
        expect(portfolio['cache'].profLoss).toBe(0);

    });


});