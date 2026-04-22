import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { loadFont as loadMonoFont } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadSansFont } from "@remotion/google-fonts/IBMPlexSans";

const { fontFamily: monoFont } = loadMonoFont();
const { fontFamily: sansFont } = loadSansFont();

export const VIDEO_CONFIG = {
  durationInFrames: 300, // 10s @ 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};

const NAVY = "#0A0F1E";
const YELLOW = "#FED72B";

const SERVICES = [
  {
    title: "Talent Advisory",
    subtitle: "Placing people who transform organisations",
  },
  {
    title: "Organisation Design",
    subtitle: "Building teams structured to perform",
  },
  {
    title: "Service Design",
    subtitle: "Human-centred design for complex problems",
  },
];

// Frames each service occupies
const SEGMENT = VIDEO_CONFIG.durationInFrames / SERVICES.length; // 100
const FADE = 18; // frames to fade in / fade out
const MAX_LINE = 360; // max width of yellow accent line in px

function serviceOpacity(frame: number, index: number): number {
  const start = index * SEGMENT;
  const local = frame - start;
  if (local < 0 || local >= SEGMENT) return 0;
  if (local < FADE) {
    return interpolate(local, [0, FADE], [0, 1], {
      easing: Easing.out(Easing.quad),
    });
  }
  if (local >= SEGMENT - FADE) {
    return interpolate(local, [SEGMENT - FADE, SEGMENT], [1, 0], {
      easing: Easing.in(Easing.quad),
    });
  }
  return 1;
}

function accentLineWidth(frame: number, index: number): number {
  const start = index * SEGMENT;
  const local = frame - start;
  if (local < 0 || local >= SEGMENT) return 0;
  if (local < FADE) {
    return interpolate(local, [0, FADE], [0, MAX_LINE], {
      easing: Easing.out(Easing.cubic),
    });
  }
  if (local >= SEGMENT - FADE) {
    return interpolate(local, [SEGMENT - FADE, SEGMENT], [MAX_LINE, 0], {
      easing: Easing.in(Easing.cubic),
    });
  }
  return MAX_LINE;
}

export const DelveLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // Diagonal stripe drifts upward — loops perfectly:
  // 0.2 px/frame × 300 frames = 60px = exactly 1 stripe repeat cycle
  const stripeOffset = (frame * 0.2) % 60;

  // DELVE logo breathes once per 10s loop (sin completes one full cycle)
  const breathPhase = Math.sin((frame / VIDEO_CONFIG.durationInFrames) * Math.PI * 2);
  const logoBrightness = interpolate(breathPhase, [-1, 1], [0.88, 1.0]);

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>

      {/* Animated diagonal stripe texture — matches site's hero pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent 0px,
            transparent 28px,
            rgba(254, 215, 43, 0.038) 28px,
            rgba(254, 215, 43, 0.038) 30px
          )`,
          backgroundPosition: `${stripeOffset}px ${stripeOffset}px`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial vignette — adds depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Center content column ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* DELVE wordmark */}
        <div
          style={{
            color: YELLOW,
            fontSize: 152,
            fontWeight: 700,
            letterSpacing: "0.3em",
            lineHeight: 1,
            fontFamily: monoFont,
            opacity: logoBrightness,
            marginRight: "-0.3em", // compensate for letterSpacing on last char
          }}
        >
          DELVE
        </div>

        {/* Gradient separator */}
        <div
          style={{
            width: 640,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(254,215,43,0.35), transparent)",
            marginTop: 20,
            marginBottom: 60,
          }}
        />

        {/* Service labels — stacked, only one visible per segment */}
        <div style={{ position: "relative", width: 1280, height: 108 }}>
          {SERVICES.map((service, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                opacity: serviceOpacity(frame, i),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 46,
                  fontWeight: 400,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  fontFamily: monoFont,
                }}
              >
                {service.title}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.42)",
                  fontSize: 18,
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  fontFamily: sansFont,
                }}
              >
                {service.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Animated yellow accent line */}
        <div
          style={{
            position: "relative",
            width: MAX_LINE,
            height: 3,
            marginTop: 52,
          }}
        >
          {/* Track */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(254,215,43,0.12)",
              borderRadius: 2,
            }}
          />
          {/* Active fill — one per service, same position, only one non-zero at a time */}
          {SERVICES.map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: accentLineWidth(frame, i),
                height: 3,
                backgroundColor: YELLOW,
                borderRadius: 2,
                transform: "translateX(-50%)",
              }}
            />
          ))}
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 44,
          }}
        >
          {SERVICES.map((_, i) => {
            const op = serviceOpacity(frame, i);
            const w = interpolate(op, [0, 1], [8, 28]);
            const bg =
              op > 0.25 ? YELLOW : "rgba(255,255,255,0.2)";
            return (
              <div
                key={i}
                style={{
                  width: w,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: bg,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Bottom attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          width: "100%",
          textAlign: "center",
          color: "rgba(255,255,255,0.16)",
          fontSize: 12,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          fontFamily: monoFont,
        }}
      >
        edward conmy · dublin
      </div>

    </AbsoluteFill>
  );
};
