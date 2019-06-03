import { Selection } from 'd3-selection';
import 'd3-transition';
/**
 *
 *
 * @export
 * @param {Selection<SVGElement, any, any, any>} ele
 * @param {number} factor
 * @param {() => void} [end]
 */
export default function scale(
  ele: Selection<SVGElement, any, any, any>,
  factor: number,
  end?: () => void
): void;
