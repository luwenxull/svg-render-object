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
  update(): IRenderObject;
  on(event: string, callback: () => void): IRenderObject;
}
export declare class RenderObject<T> implements IRenderObject {
  tag: string;
  data?: T | undefined;
  visible: boolean;
  opacity: number;
  attr: IAttrOrStyle;
  style: IAttrOrStyle;
  position: IPosition;
  children: IRenderObject[];
  needUpdateSurface: boolean;
  needUpdatePosition: boolean;
  ele_selection?: Selection<SVGElement, any, any, any>;
  private pendingEvents;
  constructor(
    tag: string, // tag名称
    option?: IRenderObjectOption,
    data?: T | undefined
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
   *
   *
   * @returns {this}
   * @memberof RenderObject
   */
  update(): this;
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
  protected initElement(parent: SVGElement): this;
}
