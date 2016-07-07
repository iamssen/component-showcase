import {Component, ViewChild, ElementRef, Input, ChangeDetectionStrategy, OnChanges} from "@angular/core";
import {select, Selection} from "d3-selection";
import {stratify, Node as D3Node, pack, CircleNode} from "d3-hierarchy";
import {Pixels} from "../../../ssen/draw/Pixels";
import {Bubble} from "./Bubble";
import {RenderComponent} from "../../../ssen/components/render-component";
import {DotterComponent} from "./dotter.component";
import {Rect} from "../../../ssen/draw/Rect";

@Component({
  selector: 'bubble-map',
  template: `
    <dotter [width]="size"
            [height]="size"
            [source]="map"
            [sourceRect]="mapArea"
            [dotColor]="mapDotColor"
            [backgroundColor]="mapBackgroundColor">
    </dotter>
    <svg #svg [attr.viewBox]="'0 0 ' + svgSize + ' ' + svgSize" preserveAspectRatio="none"></svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      position: relative;
      margin: 5px;
    }
    
    :host dotter canvas {
      border-radius: 50%;
      left: 0;
      top: 0;
    }
    
    svg {
      position: absolute;
      left: 0;
      top: 0;
    }
  `],
  directives: [DotterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BubbleMapComponent extends RenderComponent implements OnChanges {
  private svgSize:number = 300;
  
  @Input() map:Pixels;
  @Input() size:number = 300;
  @Input() data:Bubble[];
  @Input() mapArea:Rect;
  @Input() mapBackgroundColor:string = '#f2f2f2';
  @Input() mapDotColor:string = '#cbcbcb';
  @Input() circleColor:string = 'rgba(91, 193, 161, 0.85)';
  
  @ViewChild('svg') private svgElement:ElementRef;
  
  constructor(private hostElement:ElementRef) {
    super();
  }
  
  render(complete:(success:boolean) => void) {
    if (!this.data) {
      complete(false);
      return;
    }
    
    const container:HTMLElement = this.hostElement.nativeElement;
    const svg:SVGElement = this.svgElement.nativeElement as SVGElement;
    
    select(container)
      .style('width', this.size + 'px')
      .style('height', this.size + 'px')
    
    select(svg)
      .attr('width', this.size)
      .attr('height', this.size)
    
    //---------------------------------------------
    // create circle nodes
    //---------------------------------------------
    const root:string = '__Root__';
    const data:Bubble[] = [{name: root, value: 0}].concat(this.data);
    
    const nodes:D3Node<Bubble> = stratify<Bubble>()
      .id(d => d.name)
      .parentId(d => (d.name === root) ? null : root)
      (data)
      .sum(d => d['value'])
    
    const cnodes:CircleNode<Bubble> = pack<Bubble>()
      .size([this.svgSize, this.svgSize])
      .padding(10)
      (nodes)
    
    //---------------------------------------------
    // draw circles
    //---------------------------------------------
    const circles:Selection = select(svg)
      .selectAll('circle')
      .data(cnodes.children)
    
    const circlesEnter:Selection = circles
      .enter()
      .append('circle')
    
    const circlesExit:Selection = circles
      .exit()
    
    // console.log('circles', circles.size(), circlesEnter.size(), circlesExit.size())
    
    circlesEnter
      .merge(circles)
      .attr('fill', this.circleColor)
      .attr('cx', (d:CircleNode<Bubble>) => d.x)
      .attr('cy', (d:CircleNode<Bubble>) => d.y)
      .attr('r', (d:CircleNode<Bubble>) => d.r)
    
    circlesExit
      .remove()
    
    //---------------------------------------------
    // draw labels
    //---------------------------------------------
    const texts:Selection = select(svg)
      .selectAll('text')
      .data(cnodes.children)
    
    const textsEnter:Selection = texts
      .enter()
      .append('text')
    
    const textsExit:Selection = texts
      .exit()
    
    textsEnter
      .merge(texts)
      .attr('fill', '#ffffff')
      .attr('y', (d:CircleNode<Bubble>) => d.y)
    
    textsExit
      .remove()
    
    // console.log('texts', texts.size(), textsEnter.size(), textsExit.size())
    
    const companyNameSpanUpdate:Selection = texts
      .select('tspan.companyName')
    
    const companyNameSpanEnter:Selection = textsEnter
      .append('tspan')
      .classed('companyName', true)
    
    companyNameSpanEnter
      .merge(companyNameSpanUpdate)
      .text((d:CircleNode<Bubble>) => d.data.name)
      .attr('x', (d:CircleNode<Bubble>) => d.x)
      .style('font-size', (d:CircleNode<Bubble>) => (d.r * 0.4) + 'px')
      .style('text-anchor', 'middle')
    
    const marketShareSpanUpdate:Selection = texts
      .select('tspan.marketShare')
    
    const marketShareSpanEnter:Selection = textsEnter
      .append('tspan')
      .classed('marketShare', true)
    
    marketShareSpanEnter
      .merge(marketShareSpanUpdate)
      .text((d:CircleNode<Bubble>) => d.data.value + '%')
      .attr('x', (d:CircleNode<Bubble>) => d.x)
      .attr('dy', (d:CircleNode<Bubble>) => (d.r * 0.43))
      .style('font-size', (d:CircleNode<Bubble>) => (d.r * 0.35) + 'px')
      .style('text-anchor', 'middle')
    
    complete(true);
  }
}
