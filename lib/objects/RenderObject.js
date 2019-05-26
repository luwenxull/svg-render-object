import { select } from 'd3-selection';
export class RenderObject {
  constructor(
    tag, // tag名称
    option = {},
    data // 自定义data
  ) {
    this.tag = tag;
    this.data = data;
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
  }
  /**
   * 添加子对象
   *
   * @param {IRenderObject} child
   * @returns
   * @memberof RenderObject
   */
  add(child) {
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
  renderTo(parent) {
    this.initElement(parent);
    this.update();
    this.children.forEach(child => {
      child.renderTo(this.ele_selection.node());
    });
    return this;
  }
  /**
   *
   *
   * @returns {this}
   * @memberof RenderObject
   */
  update() {
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
  on(name, callback) {
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
  updateSurface() {
    const ele = this.ele_selection;
    const { attr, style } = this;
    ele.call(
      (selection, datas) => {
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
  updatePosition() {
    const ele = this.ele_selection;
    const { x, y } = this.position;
    const reg = /translate\(.+\)/;
    const transform = ele.attr('transform') || '';
    ele.attr('transform', transform.replace(reg, '') + `translate(${x}, ${y})`);
  }
  initElement(parent) {
    this.ele_selection = select(parent).append(this.tag);
    this.pendingEvents.forEach(([name, callback]) => {
      this.ele_selection.on(name, callback);
    });
    return this;
  }
}
