/**
 * 模拟流动效果
 *
 * @export
 * @param {Selection<SVGElement, any, any, any>} ele
 * @param {{flowId?: number}} recorder
 * @param {number} dashOffsetStep
 */
export default function flow(ele, recorder, dashOffsetStep) {
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
