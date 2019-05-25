export default function scale(renderObject, factor) {
  if (renderObject.ele_selection) {
    renderObject.ele_selection
      .transition('scale')
      .duration(200)
      .attr('transform', `scale(${factor})`);
  }
}
