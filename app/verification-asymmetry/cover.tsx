import { motion } from 'framer-motion';

export const Cover = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 240 160"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Verification asymmetry cover</title>
    <motion.path
      animate={{ pathLength: 1 }}
      className="stroke-foreground"
      d="M56 132L56 23"
      initial={{ pathLength: 0 }}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      transition={{ duration: 1, ease: 'easeInOut' }}
    />
    <motion.g
      animate={{ y: -109, scale: 1 }}
      initial={{ y: 0, scale: 0 }}
      transition={{ duration: 1.05, ease: 'easeInOut' }}
    >
      <path
        d="M0 -5 L10 0 L0 5 Z"
        fill="currentColor"
        transform="translate(56 132) rotate(-90)"
      />
    </motion.g>
    <motion.path
      animate={{ pathLength: 1 }}
      className="stroke-foreground"
      d="M56 132L184 132"
      initial={{ pathLength: 0 }}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      transition={{ duration: 1, ease: 'easeInOut' }}
    />
    <motion.g
      animate={{ x: 128, scale: 1 }}
      initial={{ x: 0, scale: 0 }}
      transition={{ duration: 1.05, ease: 'easeInOut' }}
    >
      <path
        d="M0 -5 L10 0 L0 5 Z"
        fill="currentColor"
        transform="translate(56 132)"
      />
    </motion.g>
    <motion.path
      animate={{ pathLength: 1 }}
      className="stroke-foreground/50"
      d="M56 131.826L168.347 36.4787"
      initial={{ pathLength: 0 }}
      strokeDasharray="4 6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.3}
      strokeWidth={2}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
    />
  </svg>
);
