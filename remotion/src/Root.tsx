import React from "react";
import { Composition } from "remotion";
import { DelveLoop, VIDEO_CONFIG } from "./DelveLoop";
import { DelveBackground, BG_VIDEO_CONFIG } from "./DelveBackground";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DelveLoop"
        component={DelveLoop}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="DelveBackground"
        component={DelveBackground}
        durationInFrames={BG_VIDEO_CONFIG.durationInFrames}
        fps={BG_VIDEO_CONFIG.fps}
        width={BG_VIDEO_CONFIG.width}
        height={BG_VIDEO_CONFIG.height}
      />
    </>
  );
};
