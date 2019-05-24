import { select, Selection } from 'd3-selection';

export interface IPosition {
  x: number;
  y: number;
}

export interface IRenderObjectSurface {
  opacity: number;
}

export interface IRenderObject<S = any> {
  name: string;
  children: IRenderObject[];
  position: IPosition;
  surface: S;
  visible: boolean;
  add(child: IRenderObject): IRenderObject;
  renderTo(parent: SVGElement): IRenderObject;
}

export default abstract class RenderObject<S extends IRenderObjectSurface>
  implements IRenderObject<S> {
  public name: string;
  public children: IRenderObject[];
  public visible: boolean;
  protected _selection_self?: Selection<SVGElement, any, any, any>;
  protected needUpdateSurface: boolean;
  protected needUpdatePosition: boolean;
  constructor(public surface: S, public position: IPosition) {
    this.name = '';
    this.children = [];
    this.visible = true; // 默认可见
    this.needUpdateSurface = true;
    this.needUpdatePosition = true;
  }

  /**
   * 添加子对象
   *
   * @param {IRenderObject} child
   * @returns
   * @memberof RenderObject
   */
  public add(child: IRenderObject): this {
    this.children.push(child);
    return this;
  }

  public renderTo(parent: SVGElement): this {
    this.initElement(parent);
    this.update();
    this.children.forEach(child => {
      child.renderTo((this._selection_self as any).node());
    });
    return this;
  }

  public update(): this {
    if (this._selection_self) {
      if (this.visible === true) {
        if (this.needUpdateSurface) {
          this.updateSurface();
          this.needUpdateSurface = false;
        }
        if (this.needUpdatePosition && this.position) {
          this.updatePosition();
          this.needUpdatePosition = false;
        }
        this._selection_self.style('display', '');
      } else {
        this._selection_self.style('display', 'none');
      }
    }
    return this;
  }

  /**
   * 更新surface
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updateSurface(): this {
    const { opacity } = this.surface;
    (<any>this._selection_self).style('opacity', opacity);
    return this;
  }

  /**
   * 更新position
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updatePosition(): this {
    const { x, y } = this.position as IPosition;
    (<any>this._selection_self).attr('transform', `translate(${x}, ${y})`);
    return this;
  }

  protected initElement(parent: SVGElement): this {
    this._selection_self = select(parent).append(this.name);
    return this;
  }
}
