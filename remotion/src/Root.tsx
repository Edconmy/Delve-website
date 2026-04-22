import React from "react";
import { Composition } from "remotion";
import { DelveLoop, VIDEO_CONFIG } from "./DelveLoop";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DelveLoop"
      component={DelveLoop}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
  );
};
