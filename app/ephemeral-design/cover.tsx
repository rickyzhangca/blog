import { motion } from "framer-motion";

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
      cx="120"
      cy="80"
      r="40"
      className="stroke-foreground"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      strokeWidth={2}
    />
    <motion.circle
      cx="120"
      cy="80"
      r="25"
      className="stroke-foreground/50"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
      strokeWidth={2}
    />
  </svg>
);
