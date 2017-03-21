/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input, EventEmitter, Output } from '@angular/core';

import { SurveyComponent } from './survey.component';
import { Strategy } from "../../model/strategy/strategy";
import { ManageJsonService } from "../../services/manage-json/manage-json.service";
import { Http, ConnectionBackend, RequestOptions } from "@angular/http";

describe('SurveyComponent', () => {

    let jsonData = [
        {
            "questions": [
                {
                    "textQuestion": "OCCUPATION",
                    "answers": [
                        {
                            "text": "Self-employed / freelancer",
                            "scores": [0, 0, 0, 2, 4]
                        },
                        {
                            "text": "Employee with a permanent contract",
                            "scores": [1, 1, 2, 1, 1]
                        },
                        {
                            "text": "Employee with specific project time",
                            "scores": [2, 2, 2, 0, 0]
                        },
                        {
                            "text": "Retired",
                            "scores": [3, 3, 0, 0, 0]
                        },
                        {
                            "text": "Not assigned",
                            "scores": [4, 2, 0, 0, 0]
                        },
                        {
                            "text": "Student",
                            "scores": [5, 1, 0, 0, 0]
                        }
                    ]
                },
                {
                    "textQuestion": "EDUCATION LEVEL",
                    "answers": [
                        {
                            "text": "No educational degree",
                            "scores": [4, 2, 0, 0, 0]
                        },
                        {
                            "text": "Primary License",
                            "scores": [3, 2, 1, 0, 0]
                        },
                        {
                            "text": "Middle License",
                            "scores": [2, 1, 1, 1, 1]
                        },
                        {
                            "text": "High School",
                            "scores": [1, 1, 2, 1, 1]
                        },
                        {
                            "text": "Degree",
                            "scores": [0, 1, 1, 2, 3]
                        }
                    ]
                }
            ]
        },
        {
            "strategies": [
                {
                    "name": "Bonds",
                    "asset_class": [
                        {
                            "assetClassId": "1",
                            "percentage": "95"
                        },
                        {
                            "assetClassId": "2",
                            "percentage": "0"
                        },
                        {
                            "assetClassId": "3",
                            "percentage": "0"
                        },
                        {
                            "assetClassId": "4",
                            "percentage": "5"
                        }
                    ]
                }
            ]
        }
    ];
    let component: SurveyComponent;
    let fixture: ComponentFixture<SurveyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ManageJsonService, Http, ConnectionBackend, RequestOptions],
            declarations: [SurveyComponent, MockDefaultStrategiesComponent, MockPieChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SurveyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('plpl', () => {
        // Arrange
        const mockDefaultStrategies = fixture.debugElement.query(By.directive(MockDefaultStrategiesComponent));
        const mockPieChart = fixture.debugElement.query(By.directive(MockPieChartComponent));
        // Assert
        expect(mockDefaultStrategies).toBeTruthy();
        expect(mockPieChart).toBeTruthy();
    });*/

});

@Component({
    selector: 'app-default-strategies',
    templateUrl: '../default-strategies/default-strategies.component.html'

})
class MockDefaultStrategiesComponent {
    @Input('strategies')
    public strategies: Strategy[];
    @Input('strategy')
    public strategy: Array<Array<number>>;
    @Output('save')
    public save = new EventEmitter<void>();
}


@Component({
    selector: 'app-pie-chart',
    templateUrl: '../pie-chart/pie-chart.component.html'

})
class MockPieChartComponent {
    @Input('values')
    public values: number[];
}