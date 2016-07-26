import {provideRouter, RouterConfig} from "@angular/router";
import {MarketShareComponent} from "./contents/market-share/market-share.component";
import {BasicChartsComponent} from "./contents/basic-charts/basic-charts.component";
import {AngularFormComponent} from './contents/angular-form/angular-form.component';
import {AngularFormModelComponent} from './contents/angular-form/angular-form-model.component';

const routes:RouterConfig = [
  {path: '', redirectTo: 'market-share', terminal: true},
  {path: 'market-share', component: MarketShareComponent},
  {path: 'basic-charts', component: BasicChartsComponent},
  {path: 'angular-form', component: AngularFormComponent},
  {path: 'angular-form-model', component: AngularFormModelComponent},
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
