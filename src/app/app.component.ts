import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  selector: 'app',
  pipes: [],
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  template: require('./app.component.html'),
})
export class App {
  constructor() {
  }
}
