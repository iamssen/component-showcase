import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  ElementRef,
  ViewChild,
  SimpleChanges
} from "@angular/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Bubble} from "./Bubble";
import {RenderComponent} from "../../../ssen/components/render-component";

@Component({
  selector: 'local-table',
  template: '<table #table></table>',
  styles: [`
    :host {
      display: inline-block;
      font-size: 0.9rem;
    }

    :host td, :host th {
      word-break: keep-all;
      white-space: nowrap;
    }
    
    :host th {
      width: 35px;
      color: #61BFA2;
    }
    
    :host td {
      color: #848484;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalTableComponent extends RenderComponent implements OnChanges {
  @Input() data:Bubble[]
  
  @ViewChild('table') private tableElement:ElementRef;
  
  protected render(changes:SimpleChanges):boolean {
    if (!this.data) return false;
    
    const rows:JSX.Element[] = [];
    
    let k:number = 0;
    
    let f:number = -1;
    let fmax:number = this.data.length;
    while (++f < fmax) {
      const rank:string = (f < 3) ? `No.${f + 1}` : '';
      rows.push((
        <tr key={++k}>
          <th key={++k}>{rank}</th>
          <td key={++k}>{this.data[f].name}</td>
        </tr>
      ));
    }
    
    ReactDOM.render((
      <tbody>{rows}</tbody>
    ), this.tableElement.nativeElement);
    
    return true;
  }
}