interface BaseLayer {
  id: number;
  name: string;
  zIndex: number;
  paralaxAmount: number;
  folder: string;
}

export interface LottieLayer extends BaseLayer {
  __typename: "LOTTIE";
  once: boolean;
  hideOnCompleted: boolean;
}

export interface StaticLayer extends BaseLayer {
  __typename: "STATIC";
  asset: {
    src: string;
    width: number;
    height: number;
  };
}

export type ConfigItem = LottieLayer | StaticLayer;

export type Config = { data: ConfigItem[] };

const config = {
  data: [
    {
      __typename: "STATIC",
      id: 0,
      name: "background",
      zIndex: 100,
      paralaxAmount: 0,
      folder: "00-background",
      asset: {
        src: "00-background.jpg",
        width: 1920,
        height: 1080,
      },
    },
    {
      __typename: "STATIC",
      id: 1,
      name: "sun",
      zIndex: 200,
      paralaxAmount: 0.02,
      folder: "01-sun",
      asset: {
        src: "01-sun.png",
        width: 1920,
        height: 1080,
      },
    },
    {
      __typename: "STATIC",
      id: 13,
      name: "cloud-left",
      zIndex: 1400,
      paralaxAmount: 0.05,
      folder: "13-cloud-left",
      asset: {
        src: "13-cloud-left.png",
        width: 1920,
        height: 1080,
      },
    },
    {
      __typename: "STATIC",
      id: 14,
      name: "cloud-right",
      zIndex: 1500,
      paralaxAmount: 0.05,
      folder: "14-cloud-right",
      asset: {
        src: "14-cloud_right.png",
        width: 1920,
        height: 1080,
      },
    },
    {
      __typename: "LOTTIE",
      id: 2,
      hideOnCompleted: false,
      name: "crater",
      zIndex: 300,
      paralaxAmount: 0,
      once: true,
      folder: "02-crater",
    },
    {
      __typename: "LOTTIE",
      id: 3,
      hideOnCompleted: false,
      name: "cloud-rain",
      zIndex: 400,
      paralaxAmount: 0.04,
      once: true,
      folder: "03-cloud-rain",
    },
    {
      __typename: "LOTTIE",
      id: 4,
      hideOnCompleted: false,
      name: "box-right",
      zIndex: 500,
      paralaxAmount: 0.1,
      once: false,
      folder: "04-box-right",
    },
    {
      __typename: "LOTTIE",
      id: 5,
      hideOnCompleted: false,
      name: "tree",
      zIndex: 600,
      paralaxAmount: 0.01,
      once: false,
      folder: "05-tree",
    },
    {
      __typename: "LOTTIE",
      id: 6,
      hideOnCompleted: true,
      name: "bird-white",
      zIndex: 700,
      paralaxAmount: 0.2,
      once: true,
      folder: "06-bird-white",
    },
    {
      __typename: "LOTTIE",
      id: 7,
      hideOnCompleted: false,
      name: "box-left",
      zIndex: 800,
      paralaxAmount: 0.2,
      once: false,
      folder: "07-box-left1",
    },
    {
      __typename: "LOTTIE",
      id: 8,
      hideOnCompleted: false,
      name: "box-left2",
      zIndex: 900,
      paralaxAmount: 0.5,
      once: false,
      folder: "08-box-left2",
    },
    {
      __typename: "LOTTIE",
      id: 9,
      hideOnCompleted: false,
      name: "cloud-center1",
      zIndex: 1000,
      paralaxAmount: 0.02,
      once: false,
      folder: "09-cloud-center1",
    },
    {
      __typename: "LOTTIE",
      id: 10,
      hideOnCompleted: false,
      name: "cloud-center2",
      zIndex: 1100,
      paralaxAmount: 0.02,
      once: false,
      folder: "10-cloud-center2",
    },
    {
      __typename: "LOTTIE",
      id: 11,
      hideOnCompleted: false,
      name: "flowers",
      zIndex: 1200,
      paralaxAmount: 0.03,
      once: false,
      folder: "11-flowers",
    },
    {
      __typename: "LOTTIE",
      id: 12,
      hideOnCompleted: true,
      name: "bird-orange",
      zIndex: 1300,
      paralaxAmount: 0.4,
      once: true,
      folder: "12-bird-orange",
    },
  ],
};

export default config;
