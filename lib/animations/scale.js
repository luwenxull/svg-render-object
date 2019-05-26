/**
 *
 *
 * @export
 * @param {IRenderObject} renderObject
 * @param {number} factor
 * @param {() => void} end
 */
export default function scale(renderObject, factor, end) {
  if (renderObject.ele_selection) {
    const ele = renderObject.ele_selection;
    const reg = /scale\(.+\)/;
    const transform = ele.attr('transform') || '';
    renderObject.ele_selection
      .transition('scale')
      .duration(200)
      .attr('transform', transform.replace(reg, '') + `scale(${factor})`)
      .on('end', () => {
        typeof end === 'function' && end();
      });
  }
}
