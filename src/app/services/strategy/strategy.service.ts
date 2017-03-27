import { Injectable } from '@angular/core';
import { ApiService } from '../remote/remote-call/remote-call.service';
import { Strategy } from '../../model/strategy/strategy';
import {isNumber} from "util";
import {Asset} from "../../model/strategy/asset";

@Injectable()
export class StrategyService {
    constructor(
        private apis: ApiService,
    ) { }
    getStrategy() {
        return this.apis.get('strategy');
    }
    saveStrategy(strategy: Strategy) {
        return this.apis.post('strategy', strategy.asset_class);
    }
    getRecommendedStrategy(rawForecastData: ForecastData[]): Strategy{
        let deltaArray: number[]=[];
        for( let i=0; i<rawForecastData.length; i++){
            if( (i+1) == rawForecastData[i].assetClassId){
                deltaArray[i] = 0 - rawForecastData[i].value;
            }else{
              break;
            }
        }
        let min: number = 0;
        let sum: number = 0;
        let suggestStrategy: Strategy = new Strategy();
        for( let i=0; i<deltaArray.length; i++){
          deltaArray[i] += rawForecastData[rawForecastData.length-deltaArray.length].value;
          min = (deltaArray[i]<min) ? deltaArray[i] : min;
        }
        for( let i=0; i<deltaArray.length; i++){
          deltaArray[i] += min;
          sum += deltaArray[i];
        }
        suggestStrategy.name = "Recommended Strategy";
        for( let i=0; i<deltaArray.length; i++){
          suggestStrategy.asset_class[i] = new Asset();
          suggestStrategy.asset_class[i].assetClassId = i+1;
          suggestStrategy.asset_class[i].percentage= Math.round(100*deltaArray[i]/sum);

        }
        return suggestStrategy;
    }

}


export class ForecastData{
  constructor(){

  }

  value : number;
  data : string;
  assetClassId: number;

}
