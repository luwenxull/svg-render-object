import { IRenderObject } from '../objects';
/**
 *
 *
 * @export
 * @param {IRenderObject} renderObject
 * @param {number} factor
 * @param {() => void} end
 */
export default function scale(
  renderObject: IRenderObject,
  factor: number,
  end?: () => void
): void;
