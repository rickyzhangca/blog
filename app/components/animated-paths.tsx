'use client';

import { motion } from 'framer-motion';

const AnimatedPaths = () => (
  <>
    <motion.path
      animate={{ pathLength: 1 }}
      d="M56 23L50.2265 33L61.7735 33L56 23ZM55 132C55 132.552 55.4477 133 56 133C56.5523 133 57 132.552 57 132L55 132ZM56 32L55 32L55 132L56 132L57 132L57 32L56 32Z"
      fill="transparent"
      initial={{ pathLength: 0 }}
      stroke="black"
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    />

    <motion.path
      animate={{ pathLength: 1 }}
      d="M184 132L174 126.226V137.774L184 132ZM56 131C55.4477 131 55 131.448 55 132C55 132.552 55.4477 133 56 133V131ZM175 132V131L56 131V132V133L175 133V132Z"
      fill="transparent"
      initial={{ pathLength: 0 }}
      stroke="black"
      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
    />

    <motion.path
      animate={{ pathLength: 1 }}
      d="M56 131.826L168.347 36.4787"
      initial={{ pathLength: 0 }}
      stroke="black"
      strokeDasharray="4 6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.5}
      strokeWidth={2}
      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
    />
  </>
);

export default AnimatedPaths;
