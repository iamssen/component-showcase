import {Component, Input, ViewChild, ElementRef, SimpleChanges} from "@angular/core";
import {select, Selection, BaseSelection} from "d3-selection";
import {schemeCategory20c, scaleOrdinal, Ordinal, Linear, scaleLinear, Band, scaleBand} from "d3-scale";
import {axisLeft, axisBottom} from "d3-axis";
import {easeQuadOut} from "d3-ease";
import {max} from "d3-array";
import {RenderComponent} from "../../../../ssen/components/render-component";
import {Data} from "../Data";

const shapeWidth:number = 46;

@Component({
  selector: 'shaped-column-chart',
  template: `
    <svg #chart>
      <defs>
        <clipPath id="clip-path">
          <rect x="0" y="0" #mask/>
        </clipPath>
        <symbol id="shape">
          <g transform="matrix(0.785206,0,0,0.785206,-254.861,-97.578)">
            <path d="M382.066,163.841L368.949,163.841L368.949,704.872L337.695,704.872L337.695,163.841L324.578,163.841L353.322,124.271L382.066,163.841Z" fill="currentColor"/>
          </g>
          <circle cx="22.5" cy="23" r="5" fill="#ffffff"/>
        </symbol>
      </defs>
      <g #series clip-path="url(#clip-path)"></g>
      <g #axisX></g>
      <g #axisY></g>
    </svg>
  `
})
export class ShapedColumnChartComponent extends RenderComponent {
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
  @ViewChild('mask') private maskElement:ElementRef;
  
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
    const mask:SVGRectElement = this.maskElement.nativeElement as SVGRectElement;
    
    const w:number = this.width - this.gutterLeft - this.gutterRight;
    const h:number = this.height - this.gutterTop - this.gutterBottom;
    
    if (drawContainer) {
      select(chart).attr('width', this.width).attr('height', this.height);
      select(series).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop})`);
      select(axisX).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop + h})`);
      select(axisY).attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop})`);
      select(mask).attr('width', this.width - this.gutterLeft - this.gutterRight).attr('height', this.height - this.gutterTop - this.gutterBottom);
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
    
    const selection:Selection = select(series)
      .selectAll('use')
      .data([].concat(...rects))
    
    const update:BaseSelection = !drawTransition ? selection : selection
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
    
    update
      .attr('opacity', 1)
      .attr('fill', color)
      .style('color', color)
      .attr('transform', (r:Rect) => `translate(${r.x + ((r.width - shapeWidth) / 2)}, ${r.y})`)
    
    const exit:BaseSelection = !drawTransition ? selection.exit() : selection.exit()
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
      .attr('opacity', 0)
      .attr('transform', (r:Rect) => `translate(${w + ((r.width - shapeWidth) / 2)}, ${h})`)
    
    exit.remove()
    
    const enterSelection:Selection = selection.enter()
      .append('use')
      .attr('fill', color)
      .style('color', color)
      .attr('xlink:href', '#shape')
    
    const enter:BaseSelection = !drawTransition ? enterSelection : enterSelection
      .attr('opacity', 0)
      .attr('transform', (r:Rect) => `translate(${r.x + ((r.width - shapeWidth) / 2)}, ${h})`)
      .transition()
      .duration(this.duration)
      .delay(delay)
      .ease(easeQuadOut)
    
    enter
      .attr('opacity', 1)
      .attr('transform', (r:Rect) => `translate(${r.x + ((r.width - shapeWidth) / 2)}, ${r.y})`)
    
    select(axisX).call(axisBottom(xscale));
    select(axisY).call(axisLeft(yscale));
    
    return true;
  }
}