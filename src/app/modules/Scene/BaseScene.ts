import _config, { Config, ConfigItem } from "../../../consts/config";
import createElementFromString from "../../../utils/createElementFromString";
import Lottie from "../Lottie/Lottie";
const config = _config as Config;

class BaseScene {
  rootEl: HTMLElement;
  lottieItems: Lottie[];
  sceneItems: HTMLElement[];
  loadedAssets: number;
  paralaxStrength: number;

  constructor(rootId: string) {
    this.rootEl = document.getElementById(rootId)!;
    this.lottieItems = [];
    this.sceneItems = [];
    this.loadedAssets = 0;
    this.paralaxStrength = 100;
    this.loadScene();
  }

  async loadScene() {
    await this.initStaticLayers();
    await this.initLottieLayers();
  }

  createLayer(el: HTMLElement, config: ConfigItem, classes: string[]) {
    const layerEl = document.createElement("div");
    layerEl.classList.add(...classes);
    layerEl.setAttribute("data-name", config.name);
    layerEl.setAttribute(
      "data-paralax-amount",
      String(this.paralaxStrength * config.paralaxAmount),
    );
    this.sceneItems.push(layerEl);
    layerEl.appendChild(el);
    return layerEl;
  }

  async initLottieLayers() {
    config.data.forEach((layer) => {
      if (layer.__typename === "LOTTIE") {
        const svgSrc = [".", "assets", layer.folder, "object.svg"].join("/");
        const lottie = new Lottie({ ...layer, appContainer: this.rootEl });
        const layerEl = this.createLayer(lottie.lottieContainer, layer, [
          "layer",
          "lottie",
        ]);

        // add event map svg element
        createElementFromString<SVGElement>(svgSrc).then((svg) => {
          layerEl.appendChild(svg!);
          const path = svg.querySelector("g path");
          path?.addEventListener("click", () => {
            lottie.play();
          });
        });

        this.rootEl.appendChild(layerEl);
        this.lottieItems.push(lottie);
      }
    });

    const loadLotties = this.lottieItems.map((lottie) => {
      return new Promise((res) => {
        lottie.ref.addEventListener("loaded_images", (e) => {
          this.loadedAssets++;
          res(e);
        });
      });
    });

    await Promise.all(loadLotties);
  }

  async initStaticLayers() {
    let imgs: HTMLImageElement[] = [];

    config.data.forEach((layer) => {
      if (layer.__typename === "STATIC") {
        const img = new Image();
        img.src = [".", "assets", layer.folder, layer.asset.src].join("/");
        const layerEl = this.createLayer(img, layer, ["layer", "static"]);
        this.rootEl.appendChild(layerEl);
        imgs.push(img);
      }
    });

    const loadImgs = imgs.map((img) => {
      return new Promise((res) => {
        img.onload = () => {
          this.loadedAssets++;
          res("");
        };
      });
    });
    await Promise.all(loadImgs);
  }
}

export default BaseScene;
