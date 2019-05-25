import { IRenderObject } from '../objects';

export default function scale(renderObject: IRenderObject, factor: number) {
  if (renderObject.ele_selection) {
    renderObject.ele_selection
      .transition('scale')
      .duration(200)
      .attr('transform', `scale(${factor})`);
  }
}
