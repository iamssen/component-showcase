import {
  Component,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges
} from "@angular/core";
import {select} from "d3-selection";
import {RenderComponent} from "../components/render-component";
import {Pixels} from "./Pixels";
import {Rect, round} from "./Rect";
import {drawTiles, Tile} from "./drawTiles";

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
  
  protected render(changes:SimpleChanges):boolean {
    if (!this.source || !this.sourceRect) return false;
    
    const pixelRatio:number = window.devicePixelRatio || 1;
    
    const canvas:HTMLCanvasElement = this.canvasElement.nativeElement as HTMLCanvasElement;
    const context:CanvasRenderingContext2D = canvas.getContext('2d');
    
    select(this.hostElement.nativeElement)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    
    select(canvas)
      .attr('width', this.width * pixelRatio)
      .attr('height', this.height * pixelRatio)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    
    const xTiles:number = Math.floor(this.width / this.dotBound);
    const yTiles:number = Math.floor(this.height / this.dotBound);
    
    // console.time('dotter');
    
    context.fillStyle = this.dotColor;
    
    drawTiles(this.source,
      round(this.sourceRect),
      xTiles,
      yTiles,
      {x: 0, y: 0, width: this.width * pixelRatio, height: this.height * pixelRatio},
      (source:Pixels, tile:Tile, drawTo:Rect) => {
        const sourceX:number = Math.floor(tile.sample.x + (tile.sample.width / 2));
        const sourceY:number = Math.floor(tile.sample.y + (tile.sample.height / 2));
        const circleX:number = Math.floor(drawTo.x + (drawTo.width / 2));
        const circleY:number = Math.floor(drawTo.y + (drawTo.height / 2));
        const index:number = source.getPointer(sourceX, sourceY);
        if (source.pixels[index + 3] > 0.5) {
          context.beginPath();
          context.arc(circleX, circleY, this.dotSize, 0, Math.PI * 2);
          context.closePath();
          context.fill();
        }
      });
    
    // console.timeEnd('dotter');
    
    return true;
  }
}