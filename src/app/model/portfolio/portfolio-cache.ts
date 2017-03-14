import {PortfolioRawCache} from "./portfolio-raw-cache";
import {Portfolio} from "./portfolio";

export class PortfolioCache {
  constructor() {
    this.raw = new PortfolioRawCache();
  }
  raw: PortfolioRawCache;
  worthHistoryOptions: any;
  worth: number;
  profLoss: number;
  portfolio: Portfolio[];
}
