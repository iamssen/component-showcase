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
  
  tileize(width:number, height:number, area?:Rect):Pixels {
    area = area ? area : {x: 0, y: 0, width: this.width, height: this.height};
    const cw:number = area.width / width;
    const ch:number = area.height / height;
    
    const data:Uint8ClampedArray = new Uint8ClampedArray(width * height * 4);
    
    let ny:number = -1;
    while (++ny < height) {
      let nx:number = -1;
      while (++nx < width) {
        const x:number = Math.floor(cw * (nx + 0.5));
        const y:number = Math.floor(ch * (ny + 0.5));
        const p:Uint8ClampedArray = this.getPixel(x + area.x, y + area.y);
        const i:number = ((ny * width) + nx) * 4;
        data[i] = p[0];
        data[i + 1] = p[1];
        data[i + 2] = p[2];
        data[i + 3] = p[3];
      }
    }
    
    return new Pixels({data, width, height});
  }
  
  getPointer(x:number, y:number):number {
    return ((this.data.width * y) + x) * 4;
  }
  
  get pixels():Uint8ClampedArray {
    return this.data.data;
  }
}