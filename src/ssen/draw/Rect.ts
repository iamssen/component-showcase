export interface Rect {
  x:number;
  y:number;
  width:number;
  height:number;
}

export function round(rect:Rect):Rect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  }
}