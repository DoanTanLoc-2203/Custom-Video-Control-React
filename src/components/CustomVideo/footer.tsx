import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { getVideoBackground } from "../../utils";
import "./index.scss";

type Props = {
  videoPath: string;
  sliderDuration: number;
  sliderCurrentTime: number;
  handleChangeTimeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hanldeVideoPlayPause: () => void;
  isPlayingVideo: boolean;
  currentTime: string;
  durationTime: string;
  className?: string;
  style?: CSSProperties;
  volumn?: number;
  hanldeFullScreen: () => void;
  hanldeMutedVideo: () => void;
  handleChangeVolumn: (value: number) => void;
  isMutedVideo: boolean;
};

const VideoFooter: React.FC<Props> = ({
  videoPath,
  sliderDuration,
  sliderCurrentTime,
  handleChangeTimeValue,
  hanldeVideoPlayPause,
  isPlayingVideo,
  currentTime,
  durationTime,
  className,
  style,
  volumn,
  hanldeFullScreen,
  hanldeMutedVideo,
  handleChangeVolumn,
  isMutedVideo,
}) => {
  const [holderSecond, setHolderSecond] = useState(0);
  const rangeRef = useRef<HTMLInputElement>(null!);
  const imageRef = useRef<HTMLImageElement>(null!);
  const [posX, setPosX] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      navigator.userAgent,
    );

  const onVolumn = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeVolumn(Number(event.target.value));
  };

  const onHoverGetSecond = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    if (rangeRef.current) {
      setIsPreview(true);
      const boudary = rangeRef.current.getBoundingClientRect();
      const xValue = event.clientX - boudary.left;
      const newPos = calcPosition(xValue, rangeRef.current.clientWidth, 200);
      newPos && setPosX(newPos);
      const second =
        (xValue / rangeRef.current.offsetWidth) *
        Number(rangeRef.current.getAttribute("max"));
      setHolderSecond(second);
    }
  };

  const calcPosition = (posX: number, width: number, itemWidth: number) => {
    if (posX + itemWidth / 2 > width) {
      return width - itemWidth - 10;
    } else if (posX - itemWidth / 2 < 0) {
      return 10;
    } else return posX - itemWidth / 2;
  };

  const onMouseOut = () => {
    setIsPreview(false);
  };

  useEffect(() => {
    if (imageRef.current) {
      const getPreview = async () => {
        const img = imageRef.current as HTMLImageElement;
        const url = await getVideoBackground(videoPath, holderSecond);
        if (url) img.src = url as string;
      };
      getPreview();
    }
  }, [holderSecond, videoPath]);

  return (
    <div className={`video__footer ${className}`} style={style}>
      {!isMobile && (
        <img
          alt=""
          ref={imageRef}
          style={{
            border: "2px solid white",
            opacity: isPreview ? "1" : "0",
            transition: "opacity 0.4s",
            position: "absolute",
            width: "200px",
            height: "auto",
            bottom: "80px",
            left: posX,
          }}
        />
      )}
      <input
        ref={rangeRef}
        type="range"
        className="video__footer__slider"
        min={0}
        max={sliderDuration}
        step="1"
        value={sliderCurrentTime}
        onChange={handleChangeTimeValue}
        onMouseMove={onHoverGetSecond}
        onMouseOut={onMouseOut}
      />
      <div className="video__footer__control">
        <div className="video__footer__control--left">
          <button
            onClick={hanldeVideoPlayPause}
            className={"video__footer__btn-play-pause"}
            style={{ display: isPlayingVideo ? "flex" : "none" }}
          >
            <img src="/assets/img/svg/pause.svg" />
          </button>
          <button
            onClick={hanldeVideoPlayPause}
            className={
              "video__footer__btn-play-pause video__footer__btn-play-pause--play"
            }
            style={{ display: isPlayingVideo ? "none" : "flex" }}
          >
            <img src="/assets/img/svg/play.svg" />

            {/* <Icon
              svgName="play"
              color="white"
              width="18px"
              height="18px"
            /> */}
          </button>
          <p className="video__footer__time">
            {currentTime} / {durationTime}
          </p>
          <p
            onClick={hanldeMutedVideo}
            className={"video__footer__muted"}
            style={{ display: isMutedVideo ? "block" : "none" }}
          >
            <img src="/assets/img/svg/muted.svg" />
          </p>
          <p
            onClick={hanldeMutedVideo}
            className={"video__footer__muted"}
            style={{ display: isMutedVideo ? "none" : "block" }}
          >
            <img src="/assets/img/svg/unmuted.svg" />
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volumn}
            onChange={onVolumn}
            style={{ margin: "0" }}
          />
        </div>
        <div className="video__footer__control--right">
          <p className="video__footer__fullscreen" onClick={hanldeFullScreen}>
            <img src="/assets/img/svg/expand.svg" />
          </p>
        </div>
      </div>
    </div>
  );
};
export default VideoFooter;
