/**
 * Created by lorenzogagliani on 02/03/17.
 */
import { Asset } from "./asset";

export class Strategy {
    constructor() {
        this.asset_class = new Array<Asset>();
    }
    name: string;
    asset_class: Asset[];

    getPercentageArray(): number[]{
        let tmp: number[] = [];
        for (let i=0; i<this.asset_class.length; i++){
            tmp[i] = this.asset_class[i].percentage;
        }
        return tmp;
    }

    setStrategyByArrayValues(values: number[]){
        for (let i=0; i<values.length; i++){
            this.asset_class[i] = new Asset();
            this.asset_class[i].assetClassId = i+1;
            this.asset_class[i].percentage = values[i];
        }
    }
}
