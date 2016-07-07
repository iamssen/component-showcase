import {provideRouter, RouterConfig} from "@angular/router";
import {MarketShareComponent} from "./contents/market-share/market-share.component";

const routes:RouterConfig = [
  {path: '', redirectTo: 'market-share', terminal: true},
  {path: 'market-share', component: MarketShareComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
