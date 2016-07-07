import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Bubble} from "./Bubble";
import {RenderComponent} from "../../../ssen/components/render-component";

@Component({
  selector: 'global-table',
  template: '<table #table></table>',
  styles: [`
    :host {
      display: inline-block;
    }

    :host th {
      padding-left: 10px;
      padding-right: 10px;
      text-align: right;
      color: #61BFA2;
    }
    
    :host td {
      padding-left: 10px;
      padding-right: 20px;
      text-align: left;
      color: #848484;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalTableComponent extends RenderComponent implements OnChanges {
  @Input() data:Bubble[];
  @Input() columns:number = 2;
  @ViewChild('table') private tableElement:ElementRef;
  
  render(complete:(success:boolean)=>void) {
    if (!this.data) {
      complete(false);
      return;
    }
    
    const numRows:number = Math.ceil(this.data.length / this.columns);
    const rows:JSX.Element[] = [];
    
    let k:number = 0;
    
    let f:number = -1;
    while (++f < numRows) {
      const cells:JSX.Element[] = [];
      
      let s:number = -1;
      while (++s < this.columns) {
        const index:number = (s * numRows) + f;
        if (this.data.length > index) {
          cells.push((<th key={++k}>{this.data[index].value}%</th>));
          cells.push((<td key={++k}>{this.data[index].name}</td>));
        } else {
          cells.push((<th key={++k}></th>));
          cells.push((<td key={++k}></td>));
        }
      }
      
      rows.push((<tr key={++k}>{cells}</tr>));
    }
    
    ReactDOM.render((
      <tbody>{rows}</tbody>
    ), this.tableElement.nativeElement) as HTMLTableElement;
    
    complete(true);
  }
}