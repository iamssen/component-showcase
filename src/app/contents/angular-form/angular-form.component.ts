import {Component, OnInit} from '@angular/core';
import {AngularFormModelCustomComponent} from './angular-form-model-custom.component';

interface SelectionItem {
  label:string;
  value:string;
}

interface Data {
  text?:string;
  number?:number;
  radio?:SelectionItem;
  select?:SelectionItem;
  bool:boolean;
  list?:SelectionItem[];
  custom?:string;
}

@Component({
  selector: 'angular-form',
  template: require('./angular-form.component.html'),
  directives: [AngularFormModelCustomComponent],
})
export class AngularFormComponent implements OnInit {
  private data:Data;
  
  private radioList:SelectionItem[] = [
    {label: 'Radio 1', value: 'radio value 1'},
    {label: 'Radio 2', value: 'radio value 2'},
    {label: 'Radio 3', value: 'radio value 3'},
  ];
  
  private selectList:SelectionItem[] = [
    {label: 'Select 1', value: 'select value 1'},
    {label: 'Select 2', value: 'select value 2'},
    {label: 'Select 3', value: 'select value 3'},
  ];
  
  private listList:SelectionItem[] = [
    {label: 'List 1', value: 'list value 1'},
    {label: 'List 2', value: 'list value 2'},
    {label: 'List 3', value: 'list value 3'},
  ];
  
  ngOnInit() {
    this.data = {
      text: 'Seoyeon Lee',
      radio: this.radioList[1],
      select: this.selectList[1],
      bool: false,
      custom: 'hello world...',
    };
  }
  
  onSubmit() {
    console.log(JSON.stringify(this.data, null, 2));
  }
}