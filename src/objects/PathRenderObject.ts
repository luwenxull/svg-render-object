import { Selection } from 'd3-selection';
import RenderObject, { IRenderObjectSurface, IPosition } from './RenderObject';

export interface IPathRenderObjectSurface extends IRenderObjectSurface {
  color: string;
  width: number;
}

export default class PathRenderObject extends RenderObject<
  IPathRenderObjectSurface
> {
  constructor(
    surface: Partial<IPathRenderObjectSurface>,
    position: IPosition = { x: 0, y: 0 }
  ) {
    super(
      Object.assign(
        {
          color: '#000',
          width: 1,
          opacity: 1
        },
        surface
      ),
      position
    );
    this.name = 'line';
  }

  protected updateSurface(): this {
    super.updateSurface();
    const { width, color } = this.surface;
    const selection = this._selection_self as Selection<
      SVGElement,
      any,
      any,
      any
    >;
    selection.attr('stroke', color).attr('stroke-width', width);
    return this;
  }
}
