import {Component, AfterViewInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {BubbleMapComponent} from "./bubble-map.component";
import {GlobalTableComponent} from "./global-table.component";
import {LocalTableComponent} from "./local-table.component";
import {Bubble} from "./Bubble";
import {Resources} from "./Resources";
import {Pixels} from "../../../ssen/draw/Pixels";
import {Subscription} from "rxjs";
import {DotterMapSampleComponent} from "./dotter-map-sample.component";

declare var console:any;

@Component({
  selector: 'market-share',
  template: require('./market-share.component.html'),
  providers: [Resources],
  directives: [
    BubbleMapComponent,
    GlobalTableComponent,
    LocalTableComponent,
    DotterMapSampleComponent
  ],
  styles: [require('./market-share.component.less')]
})
export class MarketShareComponent implements AfterViewInit, OnDestroy {
  global:Bubble[];
  asia:Bubble[];
  northAmerica:Bubble[];
  europe:Bubble[];
  latam:Bubble[];
  mea:Bubble[];

  worldmap:Pixels;
  worldmapSubscription:Subscription;
  
  constructor(private changeDetectorRef:ChangeDetectorRef, private resources:Resources) {
    this.worldmapSubscription = resources.worldmap.subscribe(pixels => {
      this.worldmap = pixels;
    });
  }
  
  ngAfterViewInit() {
    this.global = [
      {name: 'Samsung', value: 21},
      {name: 'Apple', value: 12},
      {name: 'Huawei', value: 7},
      {name: 'Nokia', value: 4},
      {name: 'TCL-Alcatel', value: 4},
      {name: 'ZTE', value: 3},
      {name: 'LG', value: 3}
    ];
    
    this.asia = [
      {name: 'Samsung', value: 15},
      {name: 'Apple', value: 9},
      {name: 'Huawei', value: 8},
      {name: 'Xiaomi', value: 6},
      {name: 'Oppo', value: 6}
    ];
    
    this.northAmerica = [
      {name: 'Apple', value: 30},
      {name: 'Samsung', value: 27},
      {name: 'LG', value: 14},
      {name: 'ZTE', value: 9},
      {name: 'TCL-Alcatel', value: 8}
    ];
    
    this.europe = [
      {name: 'Samsung', value: 28},
      {name: 'Apple', value: 18},
      {name: 'Nokia', value: 10},
      {name: 'Huawei', value: 7},
      {name: 'TCL-Alcatel', value: 7}
    ];
    
    this.latam = [
      {name: 'Samsung', value: 35},
      {name: 'TCL-Alcatel', value: 12},
      {name: 'LG', value: 10},
      {name: 'Motorola', value: 6},
      {name: 'Huawei', value: 6},
    ];
    
    this.mea = [
      {name: 'Samsung', value: 24},
      {name: 'iTel', value: 15},
      {name: 'Nokia', value: 10},
      {name: 'Tecno', value: 7},
      {name: 'Huawei', value: 5},
    ];
    
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.worldmapSubscription.unsubscribe();
    this.resources.destroy();
  }
}
