import * as dat from "dat.gui";
import _config, { Config, ConfigItem } from "../consts/config";
import createElementFromString from "../utils/createElementFromString";
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
  paralaxStrength: number;

  constructor(rootId: string) {
    this.rootEl = document.getElementById(rootId)!;
    this.lottieItems = [];
    this.sceneItems = [];
    this.paralaxDestination = { x: 0, y: 0 };
    this.paralaxPosition = { x: 0, y: 0 };
    this.paralaxStrength = 100;
    this.initStaticLayers();
    this.initLottieLayers();
    this.attachParalax();
    this.raf();
    this.addGUI();
  }

  addGUI() {
    const gui = new dat.GUI({ name: "Settings" });
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
      String(this.paralaxStrength * config.paralaxAmount),
    );
    this.sceneItems.push(layerEl);
    layerEl.appendChild(el);
    return layerEl;
  }

  initLottieLayers() {
    config.data.forEach((layer) => {
      if (layer.__typename === "LOTTIE") {
        const svgSrc = [".", "assets", layer.folder, "object.svg"].join("/");
        const lottie = new Lottie({ ...layer, appContainer: this.rootEl });
        const layerEl = this.createLayer(lottie.lottieContainer, layer, [
          "layer",
          "lottie",
        ]);

        createElementFromString<SVGElement>(svgSrc).then((svg) => {
          layerEl.appendChild(svg!);
          const path = svg.querySelector("g path");
          path?.addEventListener("click", () => {
            lottie.play();
          });
          path?.addEventListener("mouseenter", () => {
            layerEl.classList.add("hover");
          });
          path?.addEventListener("mouseleave", () => {
            layerEl.classList.remove("hover");
          });
        });

        this.rootEl.appendChild(layerEl);
        this.lottieItems.push(lottie);
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
