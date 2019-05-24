import { Selection } from 'd3-selection';
import RenderObject, { IRenderObjectSurface, IPosition } from './RenderObject';
import { RequiredOnly } from '../HelperType';

export interface IImageRenderObjectSurface extends IRenderObjectSurface {
  img: string;
  size: number;
}

export type SurfaceFieldRequired = 'img';

export default class ImageRenderObject extends RenderObject<
  IImageRenderObjectSurface
> {
  constructor(
    surface: RequiredOnly<SurfaceFieldRequired, IImageRenderObjectSurface>,
    position: IPosition = { x: 0, y: 0 }
  ) {
    super(
      Object.assign(
        {
          size: 10,
          opacity: 1
        },
        surface
      ),
      position
    );
    this.name = 'image';
  }

  protected updateSurface(): this {
    super.updateSurface();
    const { img, size } = this.surface;
    const selection = this._selection_self as Selection<
      SVGElement,
      any,
      any,
      any
    >;
    selection
      .attr('href', img)
      .attr('x', -size / 2)
      .attr('y', -size / 2);
    return this;
  }
}
