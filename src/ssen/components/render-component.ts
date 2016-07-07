export abstract class RenderComponent {
  private _invalidated:boolean = false;
  
  protected invalidate() {
    if (this._invalidated) return;
    this._invalidated = true;
    requestAnimationFrame(() => this.validate());
  }
  
  protected validate() {
    this.render((success:boolean) => {
      this._invalidated = false;
    });
  }
  
  ngOnChanges(changes:any) {
    this.invalidate();
  }
  
  abstract render(complete:(success:boolean) => void);
}