/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions, BaseRequestOptions, Http, ConnectionBackend, RequestOptions, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ApiService } from './remote-call.service';

import { GenericResponse } from './generic-response';

import { RoboAdviceConfig } from '../../../app.configuration';

describe('Service: RemoteCall', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ApiService,
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http,
                    deps: [
                        MockBackend,
                        BaseRequestOptions
                    ],
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });
    });

    function setupConnections(backend: MockBackend, options: any, action: string) {
        backend.connections.subscribe((connection: MockConnection) => {
            // to check if it's called by correct url
            // expect(connection.request.url).toBe(RoboAdviceConfig.apiUrl + 'undefined');
            const responseOptions = new ResponseOptions(options);
            const response = new Response(responseOptions);

            connection.mockRespond(response);
        });
    }

    it('#should return my strategy', inject([ApiService, MockBackend], (service, backend) => {
        setupConnections(backend, {
            body: {
                "response": 1,
                "errorCode": 0,
                "errorString": "",
                "data": [
                    {
                        "assetClassId": 1,
                        "percentage": 30
                    },
                    {
                        "assetClassId": 2,
                        "percentage": 20
                    },
                    {
                        "assetClassId": 3,
                        "percentage": 30
                    },
                    {
                        "assetClassId": 4,
                        "percentage": 20
                    }
                ]
            },
            status: 200
        }, 'strategy');

        service.get('strategy').subscribe((res: GenericResponse) => {
            expect(res.data.length).toBe(4);
            expect(res.response).toBe(1);
            expect(res.errorCode).toBe(0);
            expect(res.errorString).toBe("");
            expect(res.data[0].assetClassId).toBe(1);
            expect(res.data[0].percentage).toBe(30);
            expect(res.data[1].assetClassId).toBe(2);
            expect(res.data[1].percentage).toBe(20);
            expect(res.data[2].assetClassId).toBe(3);
            expect(res.data[2].percentage).toBe(30);
            expect(res.data[3].assetClassId).toBe(4);
            expect(res.data[3].percentage).toBe(20);
        });
    }));

    it('#should return portfolio from 2017-03-21', inject([ApiService, MockBackend], (service, backend) => {
        setupConnections(backend, {
            body: {
                "response": 1,
                "errorCode": 0,
                "errorString": "",
                "data": [
                    {
                        "value": 3334.1095,
                        "date": "2017-03-21",
                        "assetClassId": 1
                    },
                    {
                        "value": 2935.8689,
                        "date": "2017-03-21",
                        "assetClassId": 2
                    },
                    {
                        "value": 4876.219,
                        "date": "2017-03-21",
                        "assetClassId": 3
                    },
                    {
                        "value": 1590.7724,
                        "date": "2017-03-21",
                        "assetClassId": 4
                    }
                ]
            },
            status: 200
        }, 'portfolio');

        service.get('portfolio', { from: '2017-03-20'} ).subscribe((res: GenericResponse) => {
            // today is 2017-03-21
            expect(res.data.length).toBe(4);
            expect(res.data[0].value).toBe(3334.1095);
            expect(res.data[0].assetClassId).toBe(1);
            expect(res.data[0].date).toBe('2017-03-21');
        });
    }));

    it('#should send my strategy', inject([ApiService, MockBackend], (service, backend) => {
        let strategy = {
            "response": 1,
            "errorCode": 0,
            "errorString": "",
            "data": [
                {
                    "assetClassId": 1,
                    "percentage": 30
                },
                {
                    "assetClassId": 2,
                    "percentage": 20
                },
                {
                    "assetClassId": 3,
                    "percentage": 30
                },
                {
                    "assetClassId": 4,
                    "percentage": 20
                }
            ]
        };

        setupConnections(backend, {
            body: {
                "response": 1,
                "errorCode": 0,
                "errorString": "",
                "data": null
            },
            status: 200
        }, 'strategy');

        service.post('strategy').subscribe((res: GenericResponse) => {
            expect(res.data).toBeNull();
            expect(res.response).toBe(1);
            expect(res.errorCode).toBe(0);
            expect(res.errorString).toBe("");
        });
    }));

    it('#should set default RequestOptions', () => {
        let srv = new ApiService(null);

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Credentials', 'true');
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        
        srv.setDefaultRequestOptions(options);

        expect(srv['defaultOptions'].withCredentials).toBe(true);
        expect(srv['defaultOptions'].headers.keys().length).toBeTruthy();
    });
   
    it('#extract data must preserve data structure', () => {
        let srv = new ApiService(null);
        let genRes = [new GenericResponse(0, 0, "", ""),
        new GenericResponse(0, 0, "", "W"),
        new GenericResponse(0, 0, "W", ""),
        new GenericResponse(0, 0, "W", "W"),
        new GenericResponse(0, 1, "", ""),
        new GenericResponse(0, 1, "", "W"),
        new GenericResponse(0, 1, "W", ""),
        new GenericResponse(0, 1, "W", "W"),
        new GenericResponse(1, 0, "", ""),
        new GenericResponse(1, 0, "", "W"),
        new GenericResponse(1, 0, "W", ""),
        new GenericResponse(1, 0, "W", "W"),
        new GenericResponse(1, 1, "", ""),
        new GenericResponse(1, 1, "", "W"),
        new GenericResponse(1, 1, "W", ""),
        new GenericResponse(1, 1, "W", "W")];

        for (let i = 0; i < genRes.length; i++) {
            let res = new Response(new ResponseOptions({ body: JSON.stringify(genRes[i]) }));
            expect(typeof srv['extractData'](res)).toEqual(typeof new GenericResponse());
        }
    });

    it('#handleError must return a string', () => {
        let srv = new ApiService(null);
        let genRes = [
            new Response(new ResponseOptions({ body: JSON.stringify({ error: 400, message: "bad things" }) })),
            new Response(new ResponseOptions({ body: JSON.stringify({ message: "bad things" }) })),
            new Response(new ResponseOptions({ body: JSON.stringify({}) })),
            new Response(new ResponseOptions({ body: JSON.stringify("error") }))
        ];

        for (let i = 0; i < genRes.length; i++) {
            expect(typeof srv['handleError'](genRes[i])).toEqual(typeof "");
        }
        expect(typeof srv['handleError']({ "error": "bad things" })).toEqual(typeof "");
    });
});
