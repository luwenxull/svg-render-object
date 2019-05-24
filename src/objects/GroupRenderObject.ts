import RenderObject, { IRenderObjectSurface, IPosition } from './RenderObject';

export default class GroupRenderObject extends RenderObject<
  IRenderObjectSurface
> {
  constructor(
    surface: Partial<IRenderObjectSurface>,
    position: IPosition = { x: 0, y: 0 }
  ) {
    super(
      Object.assign(
        {
          opacity: 1
        },
        surface
      ),
      position
    );
    this.name = 'g';
  }
}
