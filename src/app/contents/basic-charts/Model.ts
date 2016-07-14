import {Data} from "./Data";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {range} from "d3-array";

export class Model {
  private _data:Subject<Data[]>;
  
  get data():Observable<Data[]> {
    if (!this._data) {
      this._data = new BehaviorSubject<Data[]>(this.randomData());
    }
    return this._data;
  }
  
  randomData():Data[] {
    const max:number = Math.floor(Math.random() * 1000);
    return range(5 + Math.floor(Math.random() * 10))
      .map((x:number, i:number) => ({
        category: 'Category' + i,
        data1: Math.floor(Math.random() * max),
        data2: Math.floor(Math.random() * max),
        data3: Math.floor(Math.random() * max),
        data4: Math.floor(Math.random() * max)
      }));
  }
  
  refreshData() {
    if (!this._data) return;
    this._data.next(this.randomData());
  }
  
  destory() {
    if (this._data) {
      this._data.unsubscribe();
      this._data = null;
    }
  }
}