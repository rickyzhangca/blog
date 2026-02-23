import { motion } from "framer-motion";

export const Cover = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 240 160"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Design System Team Maturity cover</title>
    <motion.rect
      x="40"
      y="50"
      width="40"
      height="60"
      rx="4"
      stroke="#000"
      strokeWidth={2}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.rect
      x="100"
      y="40"
      width="40"
      height="80"
      rx="4"
      stroke="#000"
      strokeWidth={2}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
    />
    <motion.rect
      x="160"
      y="30"
      width="40"
      height="100"
      rx="4"
      stroke="#000"
      strokeWidth={2}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
    />
  </svg>
);
