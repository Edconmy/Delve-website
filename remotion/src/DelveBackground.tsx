import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";

export const BG_VIDEO_CONFIG = {
  durationInFrames: 210, // 7s @ 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};

const NUM_IMAGES = 5;
const SEGMENT = BG_VIDEO_CONFIG.durationInFrames / NUM_IMAGES; // 42 frames each
const CROSS_FADE = 8; // frames to crossfade between images

const IMAGES = [
  staticFile("images/img1.jpg"),
  staticFile("images/img2.jpg"),
  staticFile("images/img3.jpg"),
  staticFile("images/img4.jpg"),
  staticFile("images/img5.jpg"),
];

function imageOpacity(frame: number, index: number): number {
  const start = index * SEGMENT;
  const local = frame - start;

  // Each image owns [start, start+SEGMENT).
  // The first CROSS_FADE frames fade in, the last CROSS_FADE frames fade out.
  // For the first image (index 0) also handle the tail of the loop (frame near 210)
  // so the last image fades back into the first for a seamless loop.

  // Primary visibility window
  if (index === 0) {
    // Also visible at the very end of the loop (tail crossfade)
    const tailLocal = frame - BG_VIDEO_CONFIG.durationInFrames;
    const tailOpacity =
      tailLocal >= -CROSS_FADE && tailLocal < 0
        ? interpolate(tailLocal, [-CROSS_FADE, 0], [0, 1], {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 0;
    if (tailOpacity > 0) return tailOpacity;
  }

  if (local < -CROSS_FADE || local >= SEGMENT) return 0;

  if (local < 0) {
    // Pre-segment fade-in (first image only handled above; others don't need this)
    return 0;
  }
  if (local < CROSS_FADE) {
    return interpolate(local, [0, CROSS_FADE], [0, 1], {
      easing: Easing.out(Easing.quad),
    });
  }
  if (local >= SEGMENT - CROSS_FADE) {
    return interpolate(local, [SEGMENT - CROSS_FADE, SEGMENT], [1, 0], {
      easing: Easing.in(Easing.quad),
    });
  }
  return 1;
}

function kenBurnsStyle(frame: number, index: number): React.CSSProperties {
  const start = index * SEGMENT;
  const local = Math.max(0, frame - start);

  // Alternate between zoom-in and subtle pan-right for variety
  const scale = interpolate(local, [0, SEGMENT], [1.0, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const panDir = index % 2 === 0 ? 1 : -1;
  const panX = interpolate(local, [0, SEGMENT], [0, panDir * 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    transform: `scale(${scale}) translateX(${panX}%)`,
    transformOrigin: "center center",
  };
}

export const DelveBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F1E", overflow: "hidden" }}>

      {/* Image layers — stacked, each controlling its own opacity */}
      {IMAGES.map((src, i) => {
        const opacity = imageOpacity(frame, i);
        if (opacity === 0) return null;
        return (
          <AbsoluteFill
            key={i}
            style={{ opacity, overflow: "hidden" }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                ...kenBurnsStyle(frame, i),
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Dark navy overlay — ensures text placed over the video in Squarespace stays legible */}
      <AbsoluteFill
        style={{
          background: "rgba(10, 15, 30, 0.55)",
        }}
      />

      {/* Radial vignette — deepens corners */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%)",
        }}
      />

    </AbsoluteFill>
  );
};
