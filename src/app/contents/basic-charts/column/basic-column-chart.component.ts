import {Component, Input, ViewChild, ElementRef, SimpleChanges} from "@angular/core";
import {select, Selection, BaseSelection} from "d3-selection";
import {schemeCategory20c, scaleOrdinal, Ordinal, Linear, scaleLinear, Band, scaleBand} from "d3-scale";
import {axisLeft, axisBottom} from "d3-axis";
import {easeQuadOut} from "d3-ease";
import {max} from "d3-array";
import {RenderComponent} from "../../../../ssen/components/render-component";
import {Data} from "../Data";

@Component({
  selector: 'basic-column-chart',
  template: `
    <svg #chart>
      <g #series></g>
      <g #axisX></g>
      <g #axisY></g>
    </svg>
  `
})
export class BasicColumnChartComponent extends RenderComponent {
  @Input() private duration:number = 300;
  @Input() private delay:number = 20;
  @Input() private width:number = 540;
  @Input() private height:number = 320;
  @Input() private gutterLeft:number = 50;
  @Input() private gutterRight:number = 20;
  @Input() private gutterTop:number = 20;
  @Input() private gutterBottom:number = 30;
  @Input() private color:string[] = schemeCategory20c;
  
  @Input() private datas:Data[] | null;
  @Input() private dataFields:string[] | null;
  @Input() private categoryField:string | null;
  
  @ViewChild('chart') private chartElement:ElementRef;
  @ViewChild('series') private seriesElement:ElementRef;
  @ViewChild('axisX') private axisXElement:ElementRef;
  @ViewChild('axisY') private axisYElement:ElementRef;
  
  render(changes:SimpleChanges):boolean {
    if (!this.datas || !this.dataFields || !this.categoryField) return false;
    
    const drawContainer:boolean = this.firstRender
      || changes['width'] !== undefined
      || changes['height'] !== undefined
      || changes['gutterLeft'] !== undefined
      || changes['gutterRight'] !== undefined
      || changes['gutterTop'] !== undefined
      || changes['gutterBottom'] !== undefined;
    
    const drawTransition:boolean = this.canAnimate && (this.firstRender
      || changes['datas'] !== undefined
      || changes['dataFields'] !== undefined
      || changes['categoryField'] !== undefined);
    
    const fill:Ordinal<string, string> = scaleOrdinal<string, string>(this.color);
    
    const chart:SVGElement = this.chartElement.nativeElement as SVGElement;
    const series:SVGGElement = this.seriesElement.nativeElement as SVGGElement;
    const axisX:SVGGElement = this.axisXElement.nativeElement as SVGGElement;
    const axisY:SVGGElement = this.axisYElement.nativeElement as SVGGElement;
    
    const w:number = this.width - this.gutterLeft - this.gutterRight;
    const h:number = this.height - this.gutterTop - this.gutterBottom;
    
    if (drawContainer) {
      select(chart).attr('width', this.width).attr('height', this.height);
      select(series).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop})`);
      select(axisX).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop + h})`);
      select(axisY).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop})`);
    }
    
    const ymax:number = max(this.datas, (d:Data) => max(this.dataFields, (dataField:string) => d[dataField]));
    const xscale:Band<string> = scaleBand<string>().rangeRound([0, w]).domain(this.datas.map(d => d[this.categoryField]));
    const yscale:Linear<number> = scaleLinear<number>().rangeRound([h, 0]).domain([0, ymax]).nice();
    
    interface Rect {
      delay:number;
      color:string;
      x:number;
      y:number;
      width:number;
      height:number;
      data:Data;
      dataField:string;
    }
    
    const dataFieldsLength:number = this.dataFields.length;
    const rects:Rect[][] = this.datas.map((data:Data, f) => this.dataFields.map((dataField:string, s) => ({
      color: dataFieldsLength === 1 ? fill(data[this.categoryField]) : fill(s.toString()),
      delay: this.delay * f,
      width: xscale.bandwidth() / dataFieldsLength,
      height: h - yscale(data[dataField]),
      x: xscale(data[this.categoryField]) + ((xscale.bandwidth() / dataFieldsLength) * s),
      y: yscale(data[dataField]),
      data,
      dataField,
    })));
    
    const delay = (r:Rect) => r.delay;
    const color = (r:Rect) => r.color;
    const x = (r:Rect) => r.x;
    const y = (r:Rect) => r.y;
    const width = (r:Rect) => r.width;
    const height = (r:Rect) => r.height;
    // const transform = (r:Rect) => `translate(${r.x}, ${h - r.height})`
    
    const selection:Selection = select(series)
      .selectAll('rect')
      .data([].concat(...rects))
    
    const update:BaseSelection = !drawTransition ? selection : selection
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
    
    update
      .attr('opacity', 1)
      .attr('fill', color)
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
    
    const exit:BaseSelection = !drawTransition ? selection.exit() : selection.exit()
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
      .attr('opacity', 0)
      .attr('x', w)
      .attr('y', h)
      .attr('width', 0)
      .attr('height', 0)
    
    exit.remove()
    
    const enterSelection:Selection = selection.enter()
      .append('rect')
      .attr('fill', color)
      .attr('x', x)
      .attr('width', width)
    
    const enter:BaseSelection = !drawTransition ? enterSelection : enterSelection
      .attr('opacity', 0)
      .attr('y', h)
      .attr('height', 0)
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
    
    enter
      .attr('opacity', 1)
      .attr('y', y)
      .attr('height', height)
    
    select(axisX).call(axisBottom(xscale));
    select(axisY).call(axisLeft(yscale));
    
    return true;
  }
}