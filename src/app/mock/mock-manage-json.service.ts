import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockManageJsonService {
    constructor() { }

    getFromJson(fileJson: string): Observable<any> {
        return Observable.create((observer) => {
            if (fileJson == 'survey_roboadvice.json') {
                observer.next({
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
                }
                );
            } else {
                observer.next(
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
                );
            }
            observer.complete();
        });
    }

}