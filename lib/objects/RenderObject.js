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
  renderTo(parent) {
    this.initElement(parent);
    this.update();
    this.children.forEach(child => {
      child.renderTo(this.ele_selection.node());
    });
    return this;
  }
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
  }
  /**
   * 更新surface
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  updateSurface() {
    if (this.ele_selection) {
      const { attr, style } = this;
      const fn = () => {};
      this.ele_selection.call(
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
  }
  /**
   * 更新position
   *
   * @protected
   * @returns {this}
   * @memberof RenderObject
   */
  updatePosition() {
    const { x, y } = this.position;
    this.ele_selection.attr('transform', `translate(${x}, ${y})`);
  }
  initElement(parent) {
    this.ele_selection = select(parent).append(this.tag);
    return this;
  }
}
