export default function getElementCenter(el: Element) {
  const bb = el.getBoundingClientRect();
  const pathCenterX = bb.left + bb.width / 2;
  const pathCenterY = bb.top + bb.height / 2;

  return {
    x: pathCenterX,
    y: pathCenterY,
  };
}
