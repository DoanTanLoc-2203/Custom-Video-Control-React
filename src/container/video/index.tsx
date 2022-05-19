import React, { useEffect, useState } from "react";
import CustomVideo from "../../components/CustomVideo";
import { getVideoBackground } from "../../utils";
import "./index.scss";

type Props = {};

const videoList = [
  {
    id: 1,
    url: "test.mp4",
    name: "test video ",
  },
  {
    id: 2,
    url: "test2.mp4",
    name: "test video 2",
  },
  {
    id: 3,
    url: "test3.mp4",
    name: "test video 3",
  },
];

type VideoList = {
  url: string;
  background: string;
  name: string;
};

const VideoContainer: React.FC<Props> = ({}) => {
  const [list, setList] = useState<VideoList[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>(videoList[0].url);

  useEffect(() => {
    setVideoList();
  }, []);

  const setVideoList = async () => {
    const listVideo: VideoList[] = [];
    videoList.forEach(async (item: any, index: number) => {
      const background = (await getVideoBackground(item.url)) as string;
      const itemVideo = { url: item.url, background, name: item.name };
      listVideo.push(itemVideo);
      setList((_item) => [...listVideo]);
    });
  };

  const setActiveUrl = (url: string) => () => {
    setVideoUrl(url);
  };

  return (
    <>
      <div className="container">
        <div className="container--left">
          <CustomVideo url={videoUrl} />
        </div>
        <div className="container--right">
          <ul className="container__list">
            {list.map((item: VideoList, index: number) => {
              return (
                <li
                  key={index}
                  className="container__thumb"
                  onClick={setActiveUrl(item.url)}
                >
                  <p
                    className="container__thumb__img"
                    style={{ backgroundImage: `url(${item.background})` }}
                  ></p>
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default VideoContainer;
