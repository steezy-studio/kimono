import _config, { Config, ConfigItem } from "../consts/config";
import isTouchDevice from "../utils/isTouchDevice";
import {
  default as Lottie,
  default as LottieLayer,
} from "./components/Lottie/Lottie";
const config = _config as Config;

class Scene {
  rootEl: HTMLElement;
  lottieItems: LottieLayer[];
  sceneItems: HTMLElement[];
  paralaxDestination: { x: number; y: number };
  paralaxPosition: { x: number; y: number };

  constructor(rootId: string) {
    this.rootEl = document.getElementById(rootId)!;
    this.lottieItems = [];
    this.sceneItems = [];
    this.paralaxDestination = { x: 0, y: 0 };
    this.paralaxPosition = { x: 0, y: 0 };
    this.initStaticLayers();
    this.initLottieLayers();
    this.appendControls();
    this.attachParalax();
    this.raf();
  }

  raf() {
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
    window.requestAnimationFrame(this.raf.bind(this));
  }

  attachParalax() {
    // TODO: add mby drag event
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

  createLayer(el: HTMLElement, config: ConfigItem, classes: string[]) {
    const layerEl = document.createElement("div");
    layerEl.classList.add(...classes);
    layerEl.setAttribute("data-name", config.name);
    layerEl.setAttribute(
      "data-paralax-amount",
      String(100 * config.paralaxAmount),
    );
    this.sceneItems.push(layerEl);
    layerEl.appendChild(el);
    return layerEl;
  }

  appendControls() {
    const controls = document.createElement("div");
    controls.classList.add("controls");
    this.lottieItems.forEach((l) => {
      const toggle = document.createElement("div");
      toggle.classList.add("control");
      toggle.innerText = `${l.config.name}${l.config.once ? " (*)" : ""}`;
      toggle.addEventListener("click", () => {
        l.play();
      });

      l.ref.addEventListener("complete", () => {
        if (l.config.once) {
          toggle.classList.add("disabled");
        }
      });

      controls.appendChild(toggle);
    });
    this.rootEl.appendChild(controls);
  }

  initLottieLayers() {
    config.data.forEach((layer) => {
      if (layer.__typename === "LOTTIE") {
        const lottie = new Lottie({ ...layer, appContainer: this.rootEl });
        this.lottieItems.push(lottie);
        const layerEl = this.createLayer(lottie.lottieContainer, layer, [
          "layer",
          "lottie",
        ]);
        this.rootEl.appendChild(layerEl);
      }
    });
  }

  initStaticLayers() {
    config.data.forEach((layer) => {
      if (layer.__typename === "STATIC") {
        const img = new Image();
        img.src = [".", "assets", layer.folder, layer.asset.src].join("/");
        const layerEl = this.createLayer(img, layer, ["layer", "static"]);
        this.rootEl.appendChild(layerEl);
      }
    });
  }
}

new Scene("root");

export default Scene;
