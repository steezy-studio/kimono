export default function getElementCenter(el: Element) {
  if (!el) {
    return {
      x: 0,
      y: 0,
    };
  }
  const bb = el.getBoundingClientRect();
  const pathCenterX = bb.left + bb.width / 2;
  const pathCenterY = bb.top + bb.height / 2;

  return {
    x: pathCenterX,
    y: pathCenterY,
  };
}
