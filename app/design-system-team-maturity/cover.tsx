import { motion, useReducedMotion } from "framer-motion";
import { D_STROKES, DS_VIEWBOX, S_STROKES } from "./paths";

const DRAW_DURATION = 0.5;
const DRAW_STAGGER = 0.2;
const S_GLYPH_DELAY = 0.45;

export const Cover = ({ className }: { className?: string }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox={DS_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Design System Team Maturity cover</title>
      <desc>Hand-drawn D and S letters for design system team maturity.</desc>

      {D_STROKES.map((stroke, index) => (
        <motion.path
          animate={{ opacity: 1, pathLength: 1, pathOffset: 0 }}
          className="stroke-foreground"
          d={stroke.d}
          fill="none"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0.2, pathLength: 0, pathOffset: 0 }
          }
          key={stroke.id}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={stroke.strokeWidth ?? 4}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: index * DRAW_STAGGER,
                  duration: DRAW_DURATION,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {S_STROKES.map((stroke, index) => (
        <motion.path
          animate={{ opacity: 1, pathLength: 1, pathOffset: 0 }}
          className="stroke-foreground"
          d={stroke.d}
          fill="none"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0.2, pathLength: 0, pathOffset: 0 }
          }
          key={stroke.id}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={stroke.strokeWidth ?? 4}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: S_GLYPH_DELAY + index * DRAW_STAGGER,
                  duration: DRAW_DURATION,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </svg>
  );
};
