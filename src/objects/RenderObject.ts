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

export interface IRenderObject<T = any> {
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
  data: T;
  add(child: IRenderObject): IRenderObject;
  renderTo(parent: SVGElement): IRenderObject;
  update(): IRenderObject;
  on(event: string, callback: () => void): IRenderObject;
}

export class RenderObject<T> implements IRenderObject<T> {
  public visible: boolean;
  public opacity: number;
  public attr: IAttrOrStyle;
  public style: IAttrOrStyle;
  public position: IPosition;
  public children: IRenderObject[];
  public needUpdateSurface: boolean;
  public needUpdatePosition: boolean;
  public ele_selection?: Selection<SVGElement, any, any, any>;
  public data: T;
  private pendingEvents: Array<[string, () => void]>;
  constructor(
    public tag: string, // tag名称
    option: IRenderObjectOption = {},
    data?: T // 自定义data
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
    this.pendingEvents = [];
    this.data = data as T;
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

  /**
   * 绘制到dom
   *
   * @param {SVGElement} parent
   * @returns {this}
   * @memberof RenderObject
   */
  public renderTo(parent: SVGElement): this {
    this.initElement(parent);
    this.update();
    this.children.forEach(child => {
      child.renderTo((this.ele_selection as any).node());
    });
    return this;
  }

  /**
   * 更新入口
   * 负责调用updateSurface和updatePosition
   *
   * @returns {this}
   * @memberof RenderObject
   */
  public update(): this {
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
    return this;
  }

  /**
   * 事件监听绑定函数
   *
   * @param {string} name
   * @param {() => void} callback
   * @returns {this}
   * @memberof RenderObject
   */
  public on(name: string, callback: () => void): this {
    if (this.ele_selection) {
      this.ele_selection.on(name, callback);
    } else {
      this.pendingEvents.push([name, callback]);
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
  protected updateSurface(): void {
    const ele = this.ele_selection as Selection<SVGElement, any, any, any>;
    const { attr, style } = this;
    ele.call(
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

  /**
   * 更新position
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updatePosition(): void {
    const ele = this.ele_selection as Selection<SVGElement, any, any, any>;
    const { x, y } = this.position;
    const reg = /translate\(.+\)/;
    const transform = ele.attr('transform') || '';
    ele.attr('transform', transform.replace(reg, '') + `translate(${x}, ${y})`);
  }

  /**
   * 初始化svg元素
   *
   * @protected
   * @param {SVGElement} parent
   * @returns {this}
   * @memberof RenderObject
   */
  protected initElement(parent: SVGElement): this {
    this.ele_selection = select(parent).append(this.tag);
    this.pendingEvents.forEach(([name, callback]) => {
      (this.ele_selection as Selection<SVGElement, any, any, any>).on(
        name,
        callback
      );
    });
    return this;
  }
}
