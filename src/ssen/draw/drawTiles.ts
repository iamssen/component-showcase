import {Rect} from "./Rect";
import {Pixels} from './Pixels';

export interface Tile {
  x:number;
  y:number;
  sample:Rect;
}

export function drawTiles(source:Pixels,
                          sampleArea:Rect, // | null TODO Typescript 2.0
                          xTiles:number,
                          yTiles:number,
                          drawArea:Rect,
                          render:(source:Pixels, tile:Tile, drawTo:Rect) => void) {
  sampleArea = sampleArea ? sampleArea : {x: 0, y: 0, width: this.width, height: this.height};
  
  const sampleWidth:number = sampleArea.width / xTiles;
  const sampleHeight:number = sampleArea.height / yTiles;
  const drawWidth:number = drawArea.width / xTiles;
  const drawHeight:number = drawArea.height / yTiles;
  
  let tileX:number = -1;
  while (++tileX < yTiles) {
    let tileY:number = -1;
    while (++tileY < xTiles) {
      const sampleX:number = (sampleWidth * tileX) + sampleArea.x;
      const sampleY:number = (sampleHeight * tileY) + sampleArea.y;
      const drawX:number = (drawWidth * tileX) + drawArea.x;
      const drawY:number = (drawHeight * tileY) + drawArea.y;
      render(
        source,
        {
          x: tileX,
          y: tileY,
          sample: {
            x: sampleX,
            y: sampleY,
            width: sampleWidth,
            height: sampleHeight
          }
        },
        {
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight
        }
      );
    }
  }
}