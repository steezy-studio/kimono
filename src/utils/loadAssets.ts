async function requestAsset(
  asset: string,
  onLoad: () => void,
  onError: (e: any) => void,
  contentType: string = "application/json",
) {
  try {
    const response = await fetch(asset, {
      headers: {
        "Content-Type": contentType,
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Sec-Fetch-Dest": "image",
      },
    });
    onLoad();
    return response;
  } catch (e) {
    onError(e);
    return e;
  }
}

export default async function loadAssets(
  assets: string[],
  contentType: string = "application/json",
) {
  const length = assets.length;
  let fetchedCount = 0;

  const onLoad = () => {
    fetchedCount += 1;
  };

  const onError = (e: any) => {
    console.error(e);
  };

  return await Promise.all(
    assets.map((path) => requestAsset(path, onLoad, onError, contentType)),
  );
}
