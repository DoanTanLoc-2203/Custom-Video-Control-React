export const getVideoBackground = (videoPath: string, second?: number) => {
  return new Promise((resolve) => {
    const videoBackgroundItem = document.createElement("video");
    videoBackgroundItem.src = videoPath;
    videoBackgroundItem.loop = true;
    videoBackgroundItem.autoplay = true;
    videoBackgroundItem.muted = true;
    videoBackgroundItem.crossOrigin = "anonymous";
    // console.log("videoBackgroundItem", videoBackgroundItem);
    const canvasVideo = document.createElement("canvas");
    if (second) videoBackgroundItem.currentTime = second;
    videoBackgroundItem.addEventListener("canplaythrough", () => {
      const context = canvasVideo.getContext("2d");
      canvasVideo.width = 640;
      canvasVideo.height = 360;
      context?.drawImage(
        videoBackgroundItem,
        0,
        0,
        canvasVideo.width,
        canvasVideo.height,
      );
      videoBackgroundItem.pause();
      return resolve(canvasVideo.toDataURL("image/jpeg"));
    });
  });
};
