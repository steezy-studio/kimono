import lottie from "lottie-web";

interface LottieProps {
  src: string;
}

class Lottie {
  src: string;
  constructor(props: LottieProps) {
    this.src = props.src;
    console.log(lottie);
  }
}

export default Lottie;
