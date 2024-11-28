import _config, { Config } from "../consts/config";
import {
  default as Lottie,
  default as LottieLayer,
} from "./components/Lottie/Lottie";
const config = _config as Config;

class Scene {
  rootEl: HTMLElement;
  lottieList: LottieLayer[];

  constructor(rootId: string) {
    this.rootEl = document.getElementById(rootId)!;
    this.lottieList = [];
    this.initStaticLayers();
    this.initLottieLayers();
    this.appendControls();
  }

  createLayer(el: HTMLElement, name: string, classes: string[]) {
    const layerEl = document.createElement("div");
    layerEl.classList.add(...classes);
    layerEl.setAttribute("data-name", name);
    layerEl.appendChild(el);
    return layerEl;
  }

  appendControls() {
    const controls = document.createElement("div");
    controls.classList.add("controls");
    this.lottieList.forEach((l) => {
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
    config.data.forEach((l) => {
      if (l.__typename === "LOTTIE") {
        const lottie = new Lottie({ ...l, appContainer: this.rootEl });
        this.lottieList.push(lottie);
        const layerEl = this.createLayer(lottie.lottieContainer, l.name, [
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
        const layerEl = this.createLayer(img, layer.name, ["layer", "static"]);
        this.rootEl.appendChild(layerEl);
      }
    });
  }
}

new Scene("root");

export default Scene;
