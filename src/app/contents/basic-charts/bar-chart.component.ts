import {Component, Input, ViewChild, ElementRef, SimpleChanges} from "@angular/core";
import {RenderComponent} from "../../../ssen/components/render-component";
import {select, Selection, Transition} from "d3-selection";
import {schemeCategory20c, scaleOrdinal, Ordinal, Linear, scaleLinear, Band, scaleBand} from "d3-scale";
import {axisLeft, axisBottom, Axis} from 'd3-axis';
import {Data} from "./Data";
import {max} from "d3-array";
import {easeQuadOut} from 'd3-ease';

interface States {
  width:number;
  height:number;
  gutterLeft:number;
  gutterRight:number;
  gutterTop:number;
  gutterBottom:number;
  color:string[];
  datas:Data[];
  dataFields:string[];
}

@Component({
  selector: 'column-chart',
  template: `
    <svg #chart>
      <g #series></g>
      <g #axisX></g>
      <g #axisY></g>
    </svg>
  `
})
export class BarChartComponent extends RenderComponent {
  @Input() private duration:number = 300;
  @Input() private delay:number = 20;
  @Input() private width:number = 540;
  @Input() private height:number = 320;
  @Input() private gutterLeft:number = 50;
  @Input() private gutterRight:number = 20;
  @Input() private gutterTop:number = 20;
  @Input() private gutterBottom:number = 30;
  @Input() private color:string[] = schemeCategory20c;

  @Input() private datas:Data[];
  @Input() private dataFields:string[] = ['data1'];

  @ViewChild('chart') private chartElement:ElementRef;
  @ViewChild('series') private seriesElement:ElementRef;
  @ViewChild('axisX') private axisXElement:ElementRef;
  @ViewChild('axisY') private axisYElement:ElementRef;

  render(changes:SimpleChanges):boolean {
    if (!this.datas) return false;

    const drawContainer:boolean = this.firstRender
      || changes['width'] !== undefined
      || changes['height'] !== undefined
      || changes['gutterLeft'] !== undefined
      || changes['gutterRight'] !== undefined
      || changes['gutterTop'] !== undefined
      || changes['gutterBottom'] !== undefined;

    const drawTransition:boolean = this.canAnimate && (this.firstRender
      || changes['data'] !== undefined
      || changes['dataField'] !== undefined);

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

    const ymax:number = max(this.datas, (d:Data) => d.data1);
    const xscale:Band<string> = scaleBand<string>().rangeRound([0, w]).domain(this.datas.map(d => d.category));
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
      color: dataFieldsLength === 1 ? fill(data.category) : fill(s.toString()),
      delay: this.delay * f,
      width: xscale.bandwidth(),
      height: h - yscale(data.data1),
      x: xscale(data.category) + (xscale.bandwidth() * s),
      y: yscale(data.data1),
      data,
      dataField
    })));

    const delay = (r:Rect) => r.delay;
    const color = (r:Rect) => r.color;
    const x = (r:Rect) => r.x;
    const y = (r:Rect) => r.y;
    const width = (r:Rect) => r.width;
    const height = (r:Rect) => r.height;

    const selection = select(series)
      .selectAll('rect')
      .data([].concat(...rects))

    const update = selection;

    // if (drawTransition) update = update
    //   .transition()
    //   .duration(this.duration)
    //   .delay(delay)
    //   .ease(easeQuadOut) as Selection

    update
      .attr('opacity', 1)
      .attr('fill', color)
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)

    selection.exit()
    // .attr('opacity', 0)
    // .attr('x', w)
    // .attr('y', h)
    // .attr('width', 0)
    // .attr('height', 0)
      .remove()

    const enter = selection.enter()
      .append('rect')
      .attr('fill', color)
      .attr('x', x)
      .attr('width', width)
    // .call(d3tip)

    enter
      .attr('opacity', 1)
      .attr('y', y)
      .attr('height', height)

    select(axisX).call(axisBottom(xscale));
    select(axisY).call(axisLeft(yscale));

    return true;
  }
  
  
}