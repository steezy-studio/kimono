import lottie, { AnimationItem } from "lottie-web";
import {
  LottieLayer,
  LottieLayer as LottieLayerConfig,
} from "../../../consts/config";

interface LottiePlayerProps extends LottieLayerConfig {
  appContainer: HTMLElement;
}

class LottiePlayer {
  appContainer: HTMLElement;
  lottieContainer: HTMLElement;
  ref: AnimationItem;
  config: LottieLayer;

  constructor(props: LottiePlayerProps) {
    this.config = props;
    this.appContainer = props.appContainer;
    this.ref = null!;
    this.initLottie();
  }

  private initLottie() {
    this.lottieContainer = document.createElement("div");
    this.ref = lottie.loadAnimation({
      container: this.lottieContainer,
      path: [".", "assets", this.config.folder, "data.json"].join("/"),
      autoplay: false,
      loop: false,
      renderer: "canvas",
    });

    this.ref.addEventListener("complete", () => {
      if (this.config.hideOnCompleted) this.ref.destroy();
      if (this.config.once) return;
      this.ref.goToAndStop(0);
    });
  }

  play() {
    if (!this.ref.isPaused) return;
    this.ref.play();
  }
}

export default LottiePlayer;
