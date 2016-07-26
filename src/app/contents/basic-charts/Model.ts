import {Injectable} from '@angular/core';
import {Data} from "./Data";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {range} from "d3-array";
import {schemeCategory10, schemeCategory20, schemeCategory20b, schemeCategory20c} from 'd3-scale';
import {Subscriptions} from "../../../ssen/utils/Subscriptions";

@Injectable()
export class Model {
  private _subscriptions:Subscriptions = new Subscriptions;
  
  // ---------------------------------------------
  // observables
  // ---------------------------------------------
  // data
  private _data:Subject<Data[]>;
  
  get data():Observable<Data[]> {
    if (!this._data) {
      this._data = new BehaviorSubject<Data[]>(this.getData());
      this._subscriptions.add(this._data);
    }
    return this._data;
  }
  
  // dataFields
  private _dataFields:Subject<string[]>;
  
  get dataFields():Observable<string[]> {
    if (!this._dataFields) {
      this._dataFields = new BehaviorSubject<string[]>(this.getDataFields());
      this._subscriptions.add(this._dataFields);
    }
    return this._dataFields;
  }
  
  // categoryField
  private _categoryField:Subject<string>;
  
  get categoryField():Observable<string> {
    if (!this._categoryField) {
      this._categoryField = new BehaviorSubject<string>('category');
      this._subscriptions.add(this._categoryField);
    }
    return this._categoryField;
  }
  
  // size
  private _size:Subject<[number, number]>;
  
  get size():Observable<[number, number]> {
    if (!this._size) {
      this._size = new BehaviorSubject<[number, number]>(this.getSize());
      this._subscriptions.add(this._size);
    }
    return this._size;
  }
  
  // color
  private _color:Subject<string[]>;
  
  get color():Observable<string[]> {
    if (!this._color) {
      this._color = new BehaviorSubject<string[]>(this.getColor());
      this._subscriptions.add(this._color);
    }
    return this._color;
  }
  
  // ---------------------------------------------
  // actions
  // ---------------------------------------------
  refreshData() {
    if (this._data) this._data.next(this.getData());
  }
  
  changeDataFields() {
    if (this._dataFields) this._dataFields.next(this.getDataFields());
  }
  
  changeSize() {
    if (this._size) this._size.next(this.getSize());
  }
  
  changeColor() {
    if (this._color) this._color.next(this.getColor());
  }
  
  // ---------------------------------------------
  // data
  // ---------------------------------------------
  private getData():Data[] {
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
  
  private _dataFieldsSources:string[][] = [
    ['data1'],
    ['data1', 'data2'],
    ['data1', 'data2', 'data3'],
    ['data1', 'data2', 'data3', 'data4'],
  ];
  
  private _dataFieldsNext:number = -1;
  
  private getDataFields():string[] {
    this._dataFieldsNext = (this._dataFieldsNext + 1) % this._dataFieldsSources.length;
    return this._dataFieldsSources[this._dataFieldsNext];
  }
  
  private getSize():[number, number] {
    return [300 + Math.floor(Math.random() * 250), 220 + Math.floor(Math.random() * 150)];
  }
  
  private _colorSources:string[][] = [
    schemeCategory10,
    schemeCategory20,
    schemeCategory20b,
    schemeCategory20c
  ];
  
  private _colorNext:number = -1;
  
  private getColor():string[] {
    this._colorNext = (this._colorNext + 1) % this._colorSources.length;
    return this._colorSources[this._colorNext];
  }
  
  // ---------------------------------------------
  // destroy
  // ---------------------------------------------
  destory() {
    this._subscriptions.unsubscribe();
    this._subscriptions = null;
    
    this._data = null;
    this._dataFields = null;
    this._categoryField = null;
    this._color = null;
  }
}