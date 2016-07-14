import {Component, AfterViewInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {BarChartComponent} from "./bar-chart.component";
import {Model} from "./Model";
import {Data} from "./Data";

@Component({
  selector: 'basic-charts',
  template: `
    <div>
      <button (click)="refreshData()">Refresh</button>
    </div>
    <column-chart [datas]="datas"></column-chart>
  `,
  directives: [BarChartComponent],
  providers: [Model],
  styles: [``]
})
export class BasicChartsComponent implements AfterViewInit, OnDestroy {
  private datas:Data[];
  
  constructor(private changeDetectorRef:ChangeDetectorRef, private model:Model) {
  }

  refreshData() {
    this.model.refreshData();
  }

  ngAfterViewInit() {
    this.model.data.subscribe(datas => {
      this.datas = datas;
      this.changeDetectorRef.detectChanges();
    });
  }
  
  ngOnDestroy() {
    this.model.destory();
    this.model = null;
  }
}