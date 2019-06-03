import 'd3-transition';
/**
 *
 *
 * @export
 * @param {Selection<SVGElement, any, any, any>} ele
 * @param {number} factor
 * @param {() => void} [end]
 */
export default function scale(ele, factor, end) {
  const reg = /scale\(.+\)/;
  const transform = ele.attr('transform') || '';
  ele
    .transition('scale')
    .duration(200)
    .attr('transform', transform.replace(reg, '') + `scale(${factor})`)
    .on('end', () => {
      typeof end === 'function' && end();
    });
}
