import {Subscription} from "rxjs/Rx";

export class Subscriptions {
  private _subscriptions:Subscription[];
  
  add(subscription:Subscription) {
    if (!this._subscriptions) this._subscriptions = [];
    this._subscriptions.push(subscription);
  }
  
  unsubscribe() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._subscriptions.length = 0;
  }
}