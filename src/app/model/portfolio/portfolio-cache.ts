import {PortfolioRawCache} from "./portfolio-raw-cache";
import {Portfolio} from "./portfolio";

export class PortfolioCache {
  constructor() {
    this.raw = new PortfolioRawCache();
    this.portfolio = new Portfolio();
  }
  raw: PortfolioRawCache;
  worthHistoryOptions: any;
  worth: number;
  profLoss: number;
  portfolio: Portfolio;
}
