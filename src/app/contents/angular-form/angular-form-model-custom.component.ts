import {Component, Provider, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'custom-form-component',
  template: `<div (click)="onClick()">{{value}}</div>`,
  styles: [`
    div {
      border: 1px solid black;
      background-color: #eeeeee;
      padding: 5px;
      cursor: pointer;
    }
  `],
  providers: [
    new Provider(NG_VALUE_ACCESSOR, {
      useExisting: forwardRef(() => AngularFormModelCustomComponent),
      multi: true
    })
  ],
})
export class AngularFormModelCustomComponent implements ControlValueAccessor {
  private value:string = '-';
  private change:(newValue) => void;
  private _name:string;
  
  get name():string {
    return this._name;
  }
  
  set name(value:string) {
    this._name = value;
  }
  
  writeValue(obj:any):void {
    this.value = obj ? obj.toString() : '-';
  }
  
  registerOnChange(fn:any):void {
    this.change = fn;
  }
  
  registerOnTouched(fn:any):void {
  }
  
  private onClick() {
    this.value = 'random text... ' + Math.round(Math.random() * 1000);
    if (this.change) this.change(this.value);
  }
}