import {Component, ChangeDetectorRef, ViewChildren, QueryList, Input, ChangeDetectionStrategy} from "@angular/core";
import {DotterComponent} from "../../../ssen/draw/dotter.component";
import {Pixels} from "../../../ssen/draw/Pixels";
import {interpolateObject} from "d3-interpolate";
import {easeQuadOut} from "d3-ease";
import {Rect} from "../../../ssen/draw/Rect";

declare var console:any;

function getRandomId(curr:number, max:number):number {
  while (true) {
    const next:number = Math.floor(Math.random() * max);
    if (next !== curr) return next;
  }
}

@Component({
  selector: 'dotter-map-sample',
  template: `
    <dotter (click)="sampleDotterClick()"
            [backgroundColor]="'#aaaaaa'"
            [dotColor]="'#eeeeee'"
            [source]="source"
            [sourceRect]="sourceRect"></dotter>
  `,
  directives: [DotterComponent],
  styles: [`
    :host {
      display: block;
    }
    
    dotter {
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotterMapSampleComponent {
  @Input() source:Pixels;
  
  @ViewChildren(DotterComponent) private dotters:QueryList<DotterComponent>;
  
  sourceRect:Rect;
  
  private rects:Rect[] = [
    {x: 531, y: 84, width: 1300, height: 1300},
    {x: 2512, y: 480, width: 328, height: 328},
    {x: 333, y: 279, width: 735, height: 735},
    {x: 1382, y: 219, width: 550, height: 550},
    {x: 544, y: 768, width: 733, height: 733},
    {x: 2495, y: 1022, width: 493, height: 493}
  ];
  
  private rectIndex:number = 0;
  
  constructor(private changeDetectorRef:ChangeDetectorRef) {
    this.sourceRect = this.rects[this.rectIndex];
  }

  private sampleDotterClick() {
    this.rectIndex = getRandomId(this.rectIndex, this.rects.length);
    
    const curr = this.sourceRect;
    const next = this.rects[this.rectIndex];
    
    this.changeDetectorRef.detach();
    
    if (curr.x !== next.x) {
      const interpolate = interpolateObject(curr, next);

      const duration:number = 600; // ms
      const start:number = Date.now();
      const end:number = start + duration;

      const animate = () => {
        const current:number = Date.now();
        const progress:number = 1 - Math.min(((end - current) / duration), 1);

        const t:number = easeQuadOut(progress);
        const rect = interpolate(t);
        
        this.dotters.toArray().forEach(dotter => {
          dotter.sourceRect = rect;
          dotter.validateNow();
        });
        
        if (progress >= 1) {
          this.changeDetectorRef.reattach();
        } else {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
      
      if (console.table) console.table([curr, next], ['x', 'y', 'width', 'height']);
      this.sourceRect = next;
    }
  }
}