import {Data} from "./Data";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {range} from "d3-array";
import {Subscriptions} from "../../../ssen/utils/Subscriptions";

export class Model {
  private _subscriptions:Subscriptions = new Subscriptions;
  private _data:Subject<Data[]>;
  private _dataFields:Subject<string[]>;
  private _categoryField:Subject<string>;
  private _size:Subject<[number, number]>;
  
  get data():Observable<Data[]> {
    if (!this._data) {
      this._data = new BehaviorSubject<Data[]>(this.getData());
      this._subscriptions.add(this._data);
    }
    return this._data;
  }
  
  get dataFields():Observable<string[]> {
    if (!this._dataFields) {
      this._dataFields = new BehaviorSubject<string[]>(this.getDataFields());
      this._subscriptions.add(this._dataFields);
    }
    return this._dataFields;
  }
  
  get categoryField():Observable<string> {
    if (!this._categoryField) {
      this._categoryField = new BehaviorSubject<string>('category');
      this._subscriptions.add(this._categoryField);
    }
    return this._categoryField;
  }
  
  get size():Observable<[number, number]> {
    if (!this._size) {
      this._size = new BehaviorSubject<[number, number]>(this.getSize());
      this._subscriptions.add(this._size);
    }
    return this._size;
  }
  
  private _dataFieldsSources:string[][] = [
    ['data1'],
    ['data1', 'data2'],
    ['data1', 'data2', 'data3'],
    ['data1', 'data2', 'data3', 'data4'],
  ];
  
  private _dataFieldsNext:number = -1;
  
  getSize():[number, number] {
    return [200 + Math.floor(Math.random() * 350), 120 + Math.floor(Math.random() * 250)];
  }
  
  getDataFields():string[] {
    this._dataFieldsNext = (this._dataFieldsNext + 1) % this._dataFieldsSources.length;
    return this._dataFieldsSources[this._dataFieldsNext];
  }
  
  getData():Data[] {
    const max:number = Math.floor(Math.random() * 1000);
    return range(3 + Math.floor(Math.random() * 5))
      .map((x:number, i:number) => ({
        category: 'Category' + i,
        data1: Math.floor(Math.random() * max),
        data2: Math.floor(Math.random() * max),
        data3: Math.floor(Math.random() * max),
        data4: Math.floor(Math.random() * max),
      }));
  }
  
  refreshData() {
    if (this._data) this._data.next(this.getData());
  }
  
  changeDataFields() {
    if (this._dataFields) this._dataFields.next(this.getDataFields());
  }
  
  changeSize() {
    if (this._size) this._size.next(this.getSize());
  }
  
  destory() {
    this._subscriptions.unsubscribe();
    this._subscriptions = null;
    
    this._data = null;
    this._dataFields = null;
    this._categoryField = null;
  }
}