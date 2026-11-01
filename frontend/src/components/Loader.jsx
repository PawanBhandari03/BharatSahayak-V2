import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg">
      <div className="flex flex-col items-center gap-8">
        {/* Logo pulse */}
        <div className="relative">
          {/* Ping rings */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-0 scale-125 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />

          {/* Logo circle */}
          <motion.div
            className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/logo.svg" alt="" className="w-24 h-24 rounded-2xl" />
          </motion.div>
        </div>

        {/* Name */}
        <div className="text-center">
          <motion.h1
            className="text-2xl font-bold text-ink"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Bharat<span className="gradient-text-primary">Sahayak</span>
          </motion.h1>
          <motion.p
            className="text-sm text-ink/60 mt-1 hindi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            भारत सहायक — आपकी सेवा में
          </motion.p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-dark-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #1B1740, #138808)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        <motion.p
          className="text-xs text-ink/50"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Finding your benefits...
        </motion.p>
      </div>
    </div>
  );
}
