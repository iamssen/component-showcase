import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";
import {getImageContext} from "../../../ssen/draw/getImageContext";
import {Pixels} from "../../../ssen/draw/Pixels";

@Injectable()
export class Resources {
  private _worldmap:BehaviorSubject<Pixels>;
  
  get worldmap():Observable<Pixels> {
    if (!this._worldmap) {
      this._worldmap = new BehaviorSubject<Pixels>(null);
      getImageContext('app/contents/market-share/worldmap.svg')
        .then(sampleContext => {
          this._worldmap.next(Pixels.parse(sampleContext))
        })
        .catch(error => console.log(error))
    }
    return this._worldmap;
  }
  
  destroy() {
    this._worldmap.unsubscribe();
    this._worldmap = null;
  }
}