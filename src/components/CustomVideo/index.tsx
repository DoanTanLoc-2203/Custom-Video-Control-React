import React, { useEffect, useState } from "react";
import { CustomHTMLDivElement, CustomHTMLVideoElement } from "../../types";
import VideoFooter from "./footer";
import "./index.scss";

type Props = {
  url: string;
};

const CustomVideo: React.FC<Props> = ({ url }) => {
  const timeOut = React.useRef<NodeJS.Timer>();
  const videoRef = React.useRef<CustomHTMLVideoElement>(null!);
  const videoWrapperRef = React.useRef<CustomHTMLDivElement>(null!);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00:00");
  const [durationTime, setDurationTime] = useState("");
  const [isShowControlMenu, setShowControlMenu] = useState(false);
  const isIPhone = /iPhone/.test(navigator.userAgent);
  const [isMutedVideo, setMutedVideo] = useState(false);
  const [volumn, setVolumn] = useState(1);

  // const showControl = React.useCallback(() => {
  //   clearTimeout(timeOut.current!);
  //   if (!isShowControlMenu) setShowControlMenu(true);
  //   timeOut.current = setTimeout(() => {
  //     setShowControlMenu(false);
  //   }, 3000);
  // }, [isShowControlMenu, isFullScreen]);

  const moveShowControl = () => {
    setShowControlMenu(true);
    clearTimeout(timeOut.current!);
    timeOut.current = setTimeout(function () {
      setShowControlMenu(false);
    }, 3000);
  };

  const getSliderDuration = () => {
    if (!videoRef.current || !videoRef.current.duration) return 0;
    return videoRef.current.duration;
  };

  const getSliderCurrentTime = () => {
    if (!videoRef.current || !videoRef.current.currentTime) return 0;
    return videoRef.current.currentTime;
  };

  const handleChangeTimeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Number(e.target.value);
  };

  const hanldeVideoPlayPause = () => {
    if (videoRef.current?.paused || videoRef.current?.ended) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const convertTime = (time: number) => {
    const h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60).toString();
    if (m.length < 2) m = "0" + m;
    let s = Math.floor((time % 3600) % 60).toString();
    if (s.length < 2) s = "0" + s;
    return h + ":" + m + ":" + s;
  };

  const hanldeUpdateTime = () => {
    if (!videoRef.current || !videoRef.current.currentTime) return;
    const time = convertTime(videoRef.current.currentTime);
    setCurrentTime(time);
  };

  const hanldeLoadDataVideo = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const time = convertTime(videoRef.current.duration);
    setDurationTime(time);
  };

  const handlePlayVideo = () => {
    setIsPlayingVideo(true);
  };

  const handlePauseVideo = () => {
    setIsPlayingVideo(false);
  };

  const hanldeFullScreen = () => {
    if (!isIPhone) {
      const elem = videoWrapperRef.current;
      if (isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
          /* Firefox */
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
          /* Chrome, Safari and Opera */
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
          /* IE/Edge */
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      }
    } else {
      videoRef.current.webkitEnterFullscreen();
    }
  };

  const hanldeChangeVolume = (value: number) => {
    setVolumn(value);
  };

  const hanldeChangeVolumeVideo = () => {
    if (videoRef.current) {
      const videoVolumn = videoRef.current.volume;
      const videoMuted = videoRef.current.muted;
      setVolumn(videoVolumn);
      setMutedVideo(videoMuted);
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    };
  }, []);

  const handleResize = () => {
    if (document.fullscreenElement && !isIPhone) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  };

  const hanldeMutedVideo = () => {
    if (isMutedVideo) {
      setMutedVideo(false);
    } else {
      setMutedVideo(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volumn;
    }
    if (volumn === 0) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
    }
  }, [volumn]);

  useEffect(() => {
    if (isMutedVideo) {
      setVolumn(0);
    } else {
      setVolumn(1);
    }
  }, [isMutedVideo]);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [url]);

  return (
    <div
      className="video__wrapper"
      ref={videoWrapperRef}
      style={{ width: "100%" }}
      onMouseMove={moveShowControl}
    >
      <video
        playsInline
        crossOrigin="anonymous"
        ref={videoRef}
        onTimeUpdate={hanldeUpdateTime}
        src={url}
        onLoadedData={hanldeLoadDataVideo}
        className="video"
        onPause={handlePauseVideo}
        onPlay={handlePlayVideo}
        muted={isMutedVideo}
        onVolumeChange={hanldeChangeVolumeVideo}
        onClick={hanldeVideoPlayPause}
      />
      <VideoFooter
        videoPath={url}
        sliderDuration={getSliderDuration()}
        sliderCurrentTime={getSliderCurrentTime()}
        handleChangeTimeValue={handleChangeTimeValue}
        hanldeVideoPlayPause={hanldeVideoPlayPause}
        isPlayingVideo={isPlayingVideo}
        currentTime={currentTime}
        durationTime={durationTime}
        volumn={volumn}
        className="archive-video__footer--full"
        style={{
          opacity: isShowControlMenu ? "1" : "0",
          transition: "0.5s",
        }}
        hanldeFullScreen={hanldeFullScreen}
        hanldeMutedVideo={hanldeMutedVideo}
        handleChangeVolumn={hanldeChangeVolume}
        isMutedVideo={isMutedVideo}
      />
    </div>
  );
};

export default CustomVideo;
