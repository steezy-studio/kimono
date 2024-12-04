import lottie, { AnimationItem } from "lottie-web";
import {
  LottieLayer,
  LottieLayer as LottieLayerConfig,
} from "../../../consts/config";

interface LottiePlayerProps extends LottieLayerConfig {
  appContainer: HTMLElement;
  lottieContainer: HTMLElement;
}

class LottiePlayer {
  appContainer: HTMLElement;
  ref: AnimationItem;
  config: LottieLayer;
  lottieContainer: HTMLElement;

  constructor(props: LottiePlayerProps) {
    this.config = props;
    this.appContainer = props.appContainer;
    this.ref = null!;
    this.lottieContainer = props.lottieContainer;
    this.initLottie();
  }

  private initLottie() {
    this.ref = lottie.loadAnimation({
      container: this.lottieContainer,
      path: [
        process.env.BASE_PATH,
        "assets",
        this.config.folder,
        "data.json",
      ].join("/"),
      autoplay: false,
      loop: false,
      renderer: "canvas",
    });

    this.ref.addEventListener("complete", () => {
      this.lottieContainer.dispatchEvent(new CustomEvent("lottie_completed"));
      if (this.config.hideOnCompleted) {
        this.lottieContainer.classList.add("hidden");
      }
      if (this.config.once) return;
      this.ref.goToAndStop(0);
    });
  }

  play() {
    if (!this.ref.isPaused) return;
    this.lottieContainer.dispatchEvent(new CustomEvent("lottie_playing"));
    this.ref.play();
  }
}

export default LottiePlayer;
