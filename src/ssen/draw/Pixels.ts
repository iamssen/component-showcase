import {Rect} from "./Rect";

export class Pixels {
  static parse(context:CanvasRenderingContext2D, area?:Rect):Pixels {
    area = area ? area : {x: 0, y: 0, width: context.canvas.width, height: context.canvas.height};
    return new Pixels(context.getImageData(area.x, area.y, area.width, area.height));
  }
  
  constructor(private data:ImageData) {
  }
  
  get width():number {
    return this.data.width;
  }
  
  get height():number {
    return this.data.height;
  }
  
  getPixel(x:number, y:number):Uint8ClampedArray {
    const i:number = this.getPointer(x, y);
    return this.data.data.slice(i, i + 4);
  }
  
  getPointer(x:number, y:number):number {
    return ((this.data.width * y) + x) * 4;
  }
  
  get pixels():Uint8ClampedArray {
    return this.data.data;
  }
}