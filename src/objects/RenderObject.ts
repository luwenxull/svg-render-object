import { select, Selection } from 'd3-selection';

export interface IPosition {
  x: number;
  y: number;
}

export interface IAttrOrStyle {
  [p: string]: string | number;
}

export interface IRenderObjectOption {
  opacity?: number;
  visible?: boolean;
  attr?: IAttrOrStyle;
  style?: IAttrOrStyle;
  position?: {
    x: number;
    y: number;
  };
}

export interface IRenderObject {
  tag: string;
  visible: boolean;
  opacity: number;
  attr: IAttrOrStyle;
  style: IAttrOrStyle;
  position: IPosition;
  children: IRenderObject[];
  needUpdateSurface: boolean;
  needUpdatePosition: boolean;
  ele_selection?: Selection<SVGElement, any, any, any>;
  add(child: IRenderObject): IRenderObject;
  renderTo(parent: SVGElement): IRenderObject;
  update(): void;
}

export class RenderObject<T> implements IRenderObject {
  public visible: boolean;
  public opacity: number;
  public attr: IAttrOrStyle;
  public style: IAttrOrStyle;
  public position: IPosition;
  public children: IRenderObject[];
  public needUpdateSurface: boolean;
  public needUpdatePosition: boolean;
  public ele_selection?: Selection<SVGElement, any, any, any>;
  constructor(
    public tag: string, // tag名称
    option: IRenderObjectOption = {},
    public data?: T // 自定义data
  ) {
    const {
      attr = {},
      style = {},
      visible = true,
      opacity = 1,
      position = { x: 0, y: 0 }
    } = option;
    this.attr = attr;
    this.style = style;
    this.visible = visible;
    this.opacity = opacity;
    this.children = [];
    this.position = position;
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
      child.renderTo((this.ele_selection as any).node());
    });
    return this;
  }

  public update(): void {
    if (this.ele_selection) {
      if (this.visible === true) {
        if (this.needUpdateSurface) {
          this.updateSurface();
          this.needUpdateSurface = false;
        }
        if (this.needUpdatePosition) {
          this.updatePosition();
          this.needUpdatePosition = false;
        }
        this.ele_selection.style('display', '');
      } else {
        this.ele_selection.style('display', 'none');
      }
    }
  }

  /**
   * 更新surface
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updateSurface(): void {
    if (this.ele_selection) {
      const { attr, style } = this;
      const fn = () => {};
      this.ele_selection.call(
        (selection, datas: { data: IAttrOrStyle; fn: 'style' | 'attr' }[]) => {
          datas.forEach(({ data, fn }) => {
            Object.keys(data).forEach(key => {
              selection[fn](key, data[key]);
            });
          });
        },
        [{ data: style, fn: 'style' }, { data: attr, fn: 'attr' }]
      );
    }
  }

  /**
   * 更新position
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updatePosition(): void {
    const { x, y } = this.position;
    (<any>this.ele_selection).attr('transform', `translate(${x}, ${y})`);
  }

  protected initElement(parent: SVGElement): this {
    this.ele_selection = select(parent).append(this.tag);
    return this;
  }
}
