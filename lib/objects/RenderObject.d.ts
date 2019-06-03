import { Selection } from 'd3-selection';
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
export declare class RenderObject<T> implements IRenderObject<T> {
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
  private pendingEvents;
  constructor(
    tag: string, // tag名称
    option?: IRenderObjectOption,
    data?: T
  );
  /**
   * 添加子对象
   *
   * @param {IRenderObject} child
   * @returns
   * @memberof RenderObject
   */
  add(child: IRenderObject): this;
  /**
   * 绘制到dom
   *
   * @param {SVGElement} parent
   * @returns {this}
   * @memberof RenderObject
   */
  renderTo(parent: SVGElement): this;
  /**
   * 更新入口
   * 负责调用updateSurface和updatePosition
   *
   * @returns {this}
   * @memberof RenderObject
   */
  update(): this;
  /**
   * 事件监听绑定函数
   *
   * @param {string} name
   * @param {() => void} callback
   * @returns {this}
   * @memberof RenderObject
   */
  on(name: string, callback: () => void): this;
  /**
   * 更新surface
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updateSurface(): void;
  /**
   * 更新position
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  protected updatePosition(): void;
  /**
   * 初始化svg元素
   *
   * @protected
   * @param {SVGElement} parent
   * @returns {this}
   * @memberof RenderObject
   */
  protected initElement(parent: SVGElement): this;
}
