import {provideRouter, RouterConfig} from "@angular/router";
import {MarketShareComponent} from "./contents/market-share/market-share.component";
import {BasicChartsComponent} from "./contents/basic-charts/basic-charts.component";

const routes:RouterConfig = [
  {path: '', redirectTo: 'market-share', terminal: true},
  {path: 'market-share', component: MarketShareComponent},
  {path: 'basic-charts', component: BasicChartsComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
