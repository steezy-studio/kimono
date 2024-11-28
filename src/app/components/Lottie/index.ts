import lottie from "lottie-web";

interface LottieProps {
  src: string;
  appContainer: HTMLElement;
}

class LottieLayer {
  src: string;
  appContainer: HTMLElement;

  constructor(props: LottieProps) {
    this.src = props.src;
    this.appContainer = props.appContainer;
  }

  initLottie() {
    const lottieContainer = document.createElement("div");

    lottie.loadAnimation({
      container: lottieContainer,
      path: this.src,
    });
  }
}

export default LottieLayer;
