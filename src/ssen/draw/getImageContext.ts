export function getImageContext(url:string):Promise<CanvasRenderingContext2D> {
  return new Promise<CanvasRenderingContext2D>((resolve, reject) => {
    const image:HTMLImageElement = new Image;
    const onload = () => {
      image.removeEventListener('load', onload);
      
      const canvas:HTMLCanvasElement = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      
      const context:CanvasRenderingContext2D = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      
      resolve(context);
    }
    image.addEventListener('load', onload);
    image.src = url;
  });
}