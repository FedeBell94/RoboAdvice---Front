/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChartUtils } from "./charts-options";

describe('Class: ChartUtils', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: []
        });
    });

    it("#should get an array (graph)", () => {
        let g = ChartUtils['getGraphs'](
            [
                {
                    title: "Worth",
                    valueField: "value"
                }
            ]);
        expect(g.length).toBe(1);
        expect(g[0].id).toBe("g0");
        expect(g[0].title).toBe("Worth");
        expect(g[0].valueField).toBe("value");
        expect(g.length).not.toBe(2);

        expect(ChartUtils['counter']).toBe(0);
    });

    it("#should get the graph options", () => {
        let opt = ChartUtils.getOptions(
            [
                {
                    date: '2017-03-10',
                    value: 150
                },
                {
                    date: '2017-03-11',
                    value: 170
                },
                {
                    date: '2017-03-12',
                    value: 30
                },
                {
                    date: '2017-03-13',
                    value: 50
                }
            ],
            [
                {
                    title: "Bonds",
                    valueField: "value"
                }
            ]);
        expect(opt).not.toBeNull;
        expect(opt.dataProvider.length).toBe(4);
        expect(opt.dataProvider[2].date).toBe('2017-03-12');
        expect(opt.dataProvider[3].value).toBe(50);

        expect(opt.graphs.length).toBe(1);
        expect(opt.graphs[0].id).toBe('g0');

        expect(ChartUtils['counter']).toBe(opt.graphs.length);



    });
});
