import {Portfolio} from "./portfolio";

export class PortfolioCache {
  constructor() {
    this.portfolio = new Portfolio();
  }
  raw: any;
  worthHistoryOptions: any;
  worth: number;
  profLoss: number;
  portfolio: Portfolio;
}
