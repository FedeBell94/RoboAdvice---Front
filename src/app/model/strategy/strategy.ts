/**
 * Created by lorenzogagliani on 02/03/17.
 */
import { Asset } from "./asset";

export class Strategy {
  constructor() {
    this.asset_class = new Array<Asset>();
  }
  name: String;
  asset_class: Asset[];
}
