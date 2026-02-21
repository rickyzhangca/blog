import { motion } from "framer-motion";

const OUTER_RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;

export const Cover = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 240 160"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Ephemeral Design cover</title>
    <motion.circle
      animate={{
        opacity: [1, 0.5, 0.3],
        strokeDasharray: [`${CIRCUMFERENCE} 0`, `${CIRCUMFERENCE} 0`, "7 7"],
      }}
      cx="120"
      cy="80"
      initial={{ opacity: 1, strokeDasharray: `${CIRCUMFERENCE} 0` }}
      r={OUTER_RADIUS}
      stroke="#000"
      strokeWidth={2}
      transition={{ duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }}
    />
  </svg>
);
