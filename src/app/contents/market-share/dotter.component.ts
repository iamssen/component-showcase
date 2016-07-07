import {Component, ChangeDetectionStrategy, OnChanges, Input, ViewChild, ElementRef} from "@angular/core";
import {select} from "d3-selection";
import {RenderComponent} from "../../../ssen/components/render-component";
import {Pixels} from "../../../ssen/draw/Pixels";
import {Rect} from "../../../ssen/draw/Rect";

function round(rect:Rect):Rect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  }
}

@Component({
  selector: 'dotter',
  template: `<canvas #canvas [style.background-color]="backgroundColor"></canvas>`,
  styles: [`
    :host {
      display: inline-block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotterComponent extends RenderComponent implements OnChanges {
  @Input() width:number = 300;
  @Input() height:number = 300;
  @Input() source:Pixels;
  @Input() sourceRect:Rect;
  @Input() backgroundColor:string = '#f2f2f2';
  @Input() dotColor:string = '#cbcbcb';
  @Input() dotSize:number = 2.5;
  @Input() dotBound:number = 4;
  
  @ViewChild('canvas') private canvasElement:ElementRef;
  
  constructor(private hostElement:ElementRef) {
    super();
  }
  
  render(complete:(success:boolean)=>void) {
    if (!this.source || !this.sourceRect) {
      complete(false);
      return;
    }
    
    const r:number = window.devicePixelRatio || 1;
    
    const canvas:HTMLCanvasElement = this.canvasElement.nativeElement as HTMLCanvasElement;
    const context:CanvasRenderingContext2D = canvas.getContext('2d');
    
    select(this.hostElement.nativeElement)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    
    select(canvas)
      .attr('width', this.width * r)
      .attr('height', this.height * r)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    
    const xtiles:number = Math.floor(this.width / this.dotBound);
    const ytiles:number = Math.floor(this.height / this.dotBound);
    const tiles:Pixels = this.source.tileize(xtiles, ytiles, round(this.sourceRect));
    
    context.fillStyle = this.dotColor;
    
    const p:Uint8ClampedArray = tiles.pixels;
    
    // console.time('dotter');
    
    let y:number = -1;
    while (++y < tiles.height) {
      let x:number = -1;
      while (++x < tiles.width) {
        const pr:number = this.width * r / xtiles;
        const px:number = x * pr;
        const py:number = y * pr;
        const i:number = tiles.getPointer(x, y);
        if (p[i + 3] > 0) {
          context.beginPath();
          context.arc(px, py, r > 1 ? this.dotSize : Math.floor(this.dotSize), 0, Math.PI * 2);
          context.closePath();
          context.fill();
        }
      }
    }
    
    // console.timeEnd('dotter');
    
    complete(true);
  }
}