import dat = require("dat.gui");
import isTouchDevice from "../../../utils/isTouchDevice";
import BaseScene from "./BaseScene";

class Scene extends BaseScene {
  paralaxDestination: { x: number; y: number };
  paralaxPosition: { x: number; y: number };
  isSunUp: boolean;
  constructor(appId: string) {
    super(appId);
    this.animate();
    this.isSunUp = false;
    this.paralaxDestination = { x: 0, y: 0 };
    this.paralaxPosition = { x: 0, y: 0 };
    this.attachParalax();
    this.addGUI();
  }

  revealScene() {
    this.sceneItems.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add("show");
      }, i * 150);
    });
  }

  animate() {
    let sunPosition = 0;
    function paralax() {
      const distX = this.paralaxDestination.x - this.paralaxPosition.x;
      const distY = this.paralaxDestination.y - this.paralaxPosition.y;
      const step = 0.05;
      this.paralaxPosition.x += distX * step;
      this.paralaxPosition.y += distY * step;

      this.sceneItems.forEach((item) => {
        const distance = Number(item.dataset.paralaxAmount);
        const x = this.paralaxPosition.x * distance;
        const y = this.paralaxPosition.y * distance;
        item.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    function sunrise() {
      const sun = document.querySelector(
        '[data-name="sun"] img',
      ) as HTMLImageElement;
      const sunTarget = this.loadedAssets / this.sceneItems.length;
      const distance = sunTarget - sunPosition;
      sunPosition += distance * 0.01;
      sun.style.transform = `translateY(${70 * (1 - sunPosition)}%)`;
      this.isSunUp = sunPosition >= 0.99;
      if (this.isSunUp) {
        this.revealScene();
      }
    }

    function raf() {
      if (this.isSunUp) {
        paralax.bind(this)();
      } else {
        sunrise.bind(this)();
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

  addGUI() {
    const gui = new dat.GUI({ name: "Settings" });
    gui.close();
    const folder = gui.addFolder("paralaxAmount");
    folder.open();

    gui.add({ "event-maps": false }, "event-maps").onChange((val) => {
      const eventMaps = document.querySelectorAll(".layer svg");
      eventMaps.forEach((obj) => {
        if (val) {
          obj.classList.add("show");
        } else {
          obj.classList.remove("show");
        }
      });
    });

    this.sceneItems.forEach((el) => {
      const name = el.dataset.name!;
      const paralaxAmount = Number(el.dataset.paralaxAmount);
      folder
        .add({ [name]: paralaxAmount }, name, 0, this.paralaxStrength)
        .onChange((val) => {
          el.setAttribute("data-paralax-amount", val);
        });
    });
  }
}

export default Scene;
