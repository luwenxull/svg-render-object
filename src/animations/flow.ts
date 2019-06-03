import { Selection } from 'd3-selection';

/**
 * 模拟流动效果
 *
 * @export
 * @param {Selection<SVGElement, any, any, any>} ele
 * @param {{flowId?: number}} recorder
 * @param {number} dashOffsetStep
 */
export default function flow(
  ele: Selection<SVGElement, any, any, any>,
  recorder: { flowId?: number },
  dashOffsetStep: number
) {
  let index = 0;
  const animation = function() {
    index += 1;
    ele.attr('stroke-dashoffset', () => {
      return dashOffsetStep * index;
    });
    recorder.flowId = requestAnimationFrame(animation);
  };
  animation();
}
