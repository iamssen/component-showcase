import {Component, AfterViewInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {BasicColumnChartComponent} from "./column/basic-column-chart.component";
import {ShapedColumnChartComponent} from "./column/shaped-column-chart.component";
import {Model} from "./Model";
import {Data} from "./Data";
import {Subscriptions} from "../../../ssen/utils/Subscriptions";

@Component({
  selector: 'basic-charts',
  template: require('./basic-charts.component.html'),
  directives: [
    BasicColumnChartComponent,
    ShapedColumnChartComponent,
  ],
  providers: [Model],
  styles: [``]
})
export class BasicChartsComponent implements AfterViewInit, OnDestroy {
  private datas:Data[];
  private dataFields:string[];
  private categoryField:string;
  private width:number;
  private height:number;
  private color:string[];
  private subscriptions:Subscriptions;
  private count:number[] = [...new Array(100)];
  
  constructor(private changeDetectorRef:ChangeDetectorRef, private model:Model) {
    this.subscriptions = new Subscriptions;
  }
  
  refreshData() {
    this.model.refreshData();
  }
  
  changeDataFields() {
    this.model.changeDataFields();
  }
  
  changeSize() {
    this.model.changeSize();
  }
  
  changeColor() {
    this.model.changeColor();
  }
  
  ngAfterViewInit() {
    this.subscriptions.add(this.model.data.subscribe(datas => {
      this.datas = datas;
      this.changeDetectorRef.detectChanges();
    }));
    
    this.subscriptions.add(this.model.dataFields.subscribe(dataFields => {
      this.dataFields = dataFields;
      this.changeDetectorRef.detectChanges();
    }));
    
    this.subscriptions.add(this.model.categoryField.subscribe(categoryField => {
      this.categoryField = categoryField;
      this.changeDetectorRef.detectChanges();
    }));
    
    this.subscriptions.add(this.model.size.subscribe(size => {
      this.width = size[0];
      this.height = size[1];
      this.changeDetectorRef.detectChanges();
    }));
    
    this.subscriptions.add(this.model.color.subscribe(color => {
      this.color = color;
      this.changeDetectorRef.detectChanges();
    }));
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.subscriptions = null;
    this.model.destory();
    this.model = null;
  }
}