import {AssetSnapshot} from "./asset-snapshot";

export class Portfolio {
  constructor(){
    this.assets = new Array<AssetSnapshot>();
  }
  assets: AssetSnapshot[];
}
