import dat = require("dat.gui");
import Scene from "./modules/Scene";

new Scene("root").onReady = () => {
  const gui = new dat.GUI({ name: "Settings" });
  gui.close();
  const folder = gui.addFolder("paralaxAmount");
  folder.open();
  const layers = document.querySelectorAll(".layer") as NodeListOf<HTMLElement>;

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

  layers.forEach((el) => {
    const name = el.dataset.name!;
    const paralaxAmount = Number(el.dataset.paralaxAmount);
    folder.add({ [name]: paralaxAmount }, name, -1, 1).onChange((val) => {
      el.setAttribute("data-paralax-amount", val);
    });
  });
};

export default Scene;
