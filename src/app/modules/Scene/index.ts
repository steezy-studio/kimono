import isTouchDevice from "../../../utils/isTouchDevice";
import BaseScene from "./BaseScene";

class Scene extends BaseScene {
  paralaxDestination: { x: number; y: number };
  paralaxPosition: { x: number; y: number };
  isSunUp: boolean;
  sunPosition: number;
  sunEl: HTMLElement;
  onReady: () => void;

  constructor(appId: string, onReady?: () => void) {
    super(appId);
    this.paralaxDestination = { x: 0, y: 0 };
    this.paralaxPosition = { x: 0, y: 0 };
    this.isSunUp = false;
    this.sunPosition = 0;
    this.sunEl = this.sceneItems.find((item) => item.dataset.name === "sun");
    this.onReady = onReady;

    this.animate();
    this.attachParalax();
  }

  revealScene() {
    const staggeredScene = this.sceneItems.map((item, i) => {
      return new Promise((res) => {
        setTimeout(() => {
          item.classList.add("show");
          res("");
        }, i * 300);
      });
    });

    Promise.all(staggeredScene).then(this.onReady);
  }

  sunrise() {
    const sunTarget = this.loadedAssets / this.sceneItems.length;
    const distance = sunTarget - this.sunPosition;
    const step = 0.01;
    this.sunPosition += distance * step;
    this.sunEl.style.transform = `translateY(${60 * (1 - this.sunPosition)}%)`;
    this.isSunUp = this.sunPosition >= 0.99;

    if (this.isSunUp) {
      this.revealScene();
    }
  }

  paralax() {
    const distX = this.paralaxDestination.x - this.paralaxPosition.x;
    const distY = this.paralaxDestination.y - this.paralaxPosition.y;
    const step = 0.05;
    this.paralaxPosition.x += distX * step;
    this.paralaxPosition.y += distY * step;

    this.sceneItems.forEach((item) => {
      const paralaxAmount = Number(item.dataset.paralaxAmount);
      const distance = paralaxAmount * 100;
      const x = this.paralaxPosition.x * distance;
      const y = this.paralaxPosition.y * distance;
      // item.style.transform = `scale(${1 - distX * paralaxAmount * 0.1}) translate(${x}px, ${y}px)`;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  animate() {
    function raf() {
      if (this.isSunUp) {
        this.paralax();
      } else {
        this.sunrise();
      }
      window.requestAnimationFrame(raf.bind(this));
    }

    window.requestAnimationFrame(raf.bind(this));
  }

  attachParalax() {
    if (isTouchDevice()) return;
    function handleMouseMove(e: MouseEvent) {
      const w = this.rootEl.clientWidth;
      const h = this.rootEl.clientHeight;
      const x = e.clientX;
      const y = e.clientY;
      const normX = (x - w / 2) / (w / 2);
      const normY = (y - h / 2) / (h / 2);
      this.paralaxDestination = { x: normX, y: normY };
    }
    this.rootEl.addEventListener("mousemove", handleMouseMove.bind(this));
  }
}

export default Scene;
