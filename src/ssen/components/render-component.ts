import {SimpleChanges} from "@angular/core";

export abstract class RenderComponent {
  private _invalidated:boolean = false;
  private _changes:SimpleChanges;
  private _rendered:boolean = false;
  
  protected invalidate() {
    if (this._invalidated) return;
    this._invalidated = true;
    requestAnimationFrame(() => this.validate());
  }
  
  protected validate() {
    const success:boolean = this.render(this._changes);
    this._invalidated = false;
    this._changes = null;
    if (success) this._rendered = true;
  }

  get firstRender():boolean {
    return !this._rendered;
  }

  get canAnimate():boolean {
    return typeof window !== 'undefined' && (!process || !process.title || process.title === 'browser');
  }
  
  ngOnChanges(changes:SimpleChanges) {
    if (!this._changes) {
      this._changes = changes;
    } else {
      Object.keys(changes).forEach(name => {
        if (this._changes[name]) {
          this._changes[name].currentValue = changes[name].currentValue;
        } else {
          this._changes[name] = changes[name];
        }
      });
    }
    this.invalidate();
  }
  
  protected abstract render(changes:SimpleChanges):boolean;

  validateNow() {
    this.validate();
  }
}