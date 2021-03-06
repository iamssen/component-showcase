import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import 'd3-transition';
// import {enableProdMode} from '@angular/core';

import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {App} from './app/app.component';

// enableProdMode()

bootstrap(App, [
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: HashLocationStrategy},
  disableDeprecatedForms(),
  provideForms(),
]).catch(err => console.error(err));
