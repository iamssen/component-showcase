import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  REACTIVE_FORM_DIRECTIVES,
  AbstractControl,
  ValidatorFn,
  FORM_DIRECTIVES
} from '@angular/forms';
import {AngularFormModelCustomComponent} from './angular-form-model-custom.component';
import {MdCheckbox} from '@angular2-material/checkbox';

interface SelectionItem {
  label:string;
  value:string;
}

@Component({
  selector: 'angular-form-model',
  template: require('./angular-form-model.component.html'),
  styles: [`
    label {
      font-weight: 600;
    }
    .radio label {
      font-weight: 400;
    }
  `],
  directives: [
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    AngularFormModelCustomComponent,
    MdCheckbox,
  ],
})
export class AngularFormModelComponent implements OnInit {
  private form:FormGroup;
  
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
  
  constructor(private formBuilder:FormBuilder) {
  }
  
  get textValidated():boolean {
    return this.form.controls['text'].valid || this.form.controls['text'].pristine;
  }
  
  get listValidated():boolean {
    return this.form.controls['list'].valid || this.form.controls['list'].pristine;
  }
  
  minSelected(minSelected:number = 1):ValidatorFn {
    return (control:AbstractControl) => {
      return (control.value && control.value.length >= 2) ? null : {minSelected, currentSelected: control.value.length};
    }
  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
      number: ['', [Validators.required]],
      radio: [this.radioList[1]],
      select: [this.selectList[1]],
      bool: [true],
      list: [[this.listList[1], this.listList[2]], this.minSelected(2)],
      custom: ['hello test...'],
      mdCheckboxValue: [true],
    });
  }
  
  onSubmit() {
    console.log(this.form.status, this.form.valid);
    console.log(JSON.stringify(this.form.value, null, 2));
  }
}