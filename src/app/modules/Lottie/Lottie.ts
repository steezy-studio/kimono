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
  }

  private loadAssets(basePath: string) {
    function loadSeqence(json) {
      const images = json.assets
        .filter((asset) => asset.p)
        .map((asset) => {
          return fetch(`${basePath}/images/${asset.p}`, {
            headers: { "Content-Type": "image/png" },
          }).then((r) =>
            r.blob().then((blob) => {
              const blobUrl = URL.createObjectURL(blob);
              const slug = blobUrl.split("/")[3];
              asset.p = slug;
            }),
          );
        });
      return images;
    }

    return new Promise((res) => {
      fetch(`${basePath}/data.json`).then((r) =>
        r.json().then((json) => {
          const sequence = loadSeqence(json);
          Promise.all(sequence).then(() => res(json));
        }),
      );
    });
  }

  initLottie() {
    return new Promise((res) => {
      const basePath = [
        process.env.BASE_PATH,
        "assets",
        this.config.folder,
      ].join("/");

      this.loadAssets(basePath).then((json) => {
        this.ref = lottie.loadAnimation({
          container: this.lottieContainer,
          animationData: json,
          assetsPath: `blob:${process.env.BASE_PATH}/`,
          autoplay: false,
          loop: false,
          renderer: "svg",
        });

        this.ref.addEventListener("complete", () => {
          this.lottieContainer.dispatchEvent(
            new CustomEvent("lottie_completed"),
          );
          if (this.config.hideOnCompleted) {
            this.lottieContainer.classList.add("hidden");
          }
          if (this.config.once) return;
          this.ref.goToAndStop(0);
        });
        res("");
      });
    });
  }

  play() {
    if (!this.ref.isPaused) return;
    this.lottieContainer.dispatchEvent(new CustomEvent("lottie_playing"));
    this.ref.play();
  }
}

export default LottiePlayer;
