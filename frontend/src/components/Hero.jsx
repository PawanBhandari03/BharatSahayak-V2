import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import WhatsAppDemo from './WhatsAppDemo';

// Animated SVG India map with pulsing scheme nodes
function IndiaMapSVG() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 400 480" className="w-full max-w-2xl h-auto" fill="none">
        {/* Simplified India outline */}
        <path
          d="M200 20 L240 30 L280 50 L310 80 L330 120 L340 160 L330 200 L310 240 L280 270 L260 300 L240 330 L220 370 L200 410 L185 430 L170 410 L155 380 L140 340 L120 300 L100 260 L80 220 L70 180 L80 140 L100 100 L130 70 L160 45 Z"
          stroke="url(#mapGrad)"
          strokeWidth="1.5"
          fill="url(#mapFill)"
        />
        <defs>
          <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B1740" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
          <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B1740" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#138808" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Pulsing nodes — scheme hotspots */}
        {[
          { cx: 200, cy: 180, label: 'Delhi' },
          { cx: 160, cy: 250, label: 'Mumbai' },
          { cx: 250, cy: 230, label: 'Kolkata' },
          { cx: 180, cy: 330, label: 'Bengaluru' },
          { cx: 220, cy: 150, label: 'Chandigarh' },
          { cx: 130, cy: 200, label: 'Rajasthan' },
          { cx: 270, cy: 180, label: 'Bihar' },
        ].map((node, i) => (
          <g key={node.label}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="12"
              fill="#1B1740"
              opacity="0.1"
              style={{ animation: `pingRing ${1.5 + i * 0.3}s ease-out infinite`, animationDelay: `${i * 0.4}s` }}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="#2A2562"
              opacity="0.8"
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="2"
              fill="#6A5FB0"
            />
          </g>
        ))}

        {/* Connection lines */}
        {[
          [200, 180, 160, 250],
          [200, 180, 250, 230],
          [160, 250, 180, 330],
          [200, 180, 220, 150],
          [200, 180, 130, 200],
          [200, 180, 270, 180],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#1B1740"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        ))}
      </svg>
    </div>
  );
}

// Floating scheme badge with vibrant design and continuous floating motion
function FloatingBadge({ icon, title, amount, className, delay = 0, duration = 5, floatY = 14, borderGlow = 'rgba(27, 23, 64, 0.3)', badgeBg = 'rgba(255, 255, 255, 0.94)' }) {
  return (
    <motion.div
      className={`absolute flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -floatY, 0, floatY * 0.6, 0],
        rotate: [0, 1.8, 0, -1.8, 0]
      }}
      transition={{
        opacity: { delay, duration: 0.8 },
        scale: { delay, duration: 0.8 },
        y: { repeat: Infinity, duration: duration, ease: "easeInOut", delay: delay },
        rotate: { repeat: Infinity, duration: duration * 1.3, ease: "easeInOut", delay: delay }
      }}
      style={{
        background: badgeBg,
        borderColor: borderGlow,
        boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px 0 ${borderGlow}`
      }}
    >
      <span className="text-xl sm:text-2xl flex items-center justify-center shrink-0">{icon}</span>
      <div className="flex flex-col text-left">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-ink/80 leading-tight">{title}</span>
        <span className="text-xs sm:text-sm font-black text-ink tracking-tight leading-tight">{amount}</span>
      </div>
    </motion.div>
  );
}

// Each word is [text, role]. role picks the colour: 'amount' = big rupee figure, 'primary' = gradient
// highlight, 'accent' = closing word, 'ink' = plain. Kept per-language since word order differs.
const HEADLINE = {
  en: [['₹2.6', 'amount'], ['Lakh', 'ink'], ['Crore', 'ink'], ['Goes', 'ink'], ['Unclaimed', 'primary'], ['Every', 'ink'], ['Year.', 'accent']],
  hi: [['हर', 'ink'], ['साल', 'ink'], ['₹2.6', 'amount'], ['लाख', 'ink'], ['करोड़', 'ink'], ['का', 'ink'], ['दावा', 'primary'], ['नहीं', 'ink'], ['होता।', 'accent']],
  mr: [['दरवर्षी', 'ink'], ['₹2.6', 'amount'], ['लाख', 'ink'], ['कोटी', 'ink'], ['रुपयांचा', 'ink'], ['दावा', 'primary'], ['केला', 'ink'], ['जात नाही.', 'accent']],
};
const ROLE_CLASS = {
  amount: 'gradient-text-secondary rupee text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  primary: 'gradient-text-primary',
  accent: 'text-accent',
  ink: 'text-ink',
};

const T = {
  subheadLead: { en: 'BharatSahayak makes sure', hi: 'भारतसहायक सुनिश्चित करता है कि', mr: 'भारतसहाय्यक खात्री करतो की' },
  subheadBold: { en: 'yours reaches you.', hi: 'आपका हक़ आप तक पहुंचे.', mr: 'तुमचा हक्क तुमच्यापर्यंत पोहोचेल.' },
  tagline: {
    en: 'AI that brings government schemes to your doorstep — no internet, no hassle',
    hi: 'AI जो सरकारी योजनाएं आपके दरवाज़े तक पहुंचाए — बिना इंटरनेट, बिना झंझट',
    mr: 'AI जो सरकारी योजना तुमच्या दारापर्यंत आणतो — इंटरनेटशिवाय, त्रासाशिवाय',
  },
  ctaPrimary: { en: 'Check My Benefits', hi: 'अपने लाभ जांचें', mr: 'माझे फायदे तपासा' },
  ctaSecondary: { en: 'See How It Works', hi: 'यह कैसे काम करता है देखें', mr: 'हे कसे कार्य करते ते पहा' },
  statLabels: {
    en: ['Schemes in prototype', 'Eligible Indians', 'Avg Unclaimed/Person', 'Current Awareness'],
    hi: ['प्रोटोटाइप में योजनाएं', 'पात्र भारतीय', 'औसत अनक्लेम्ड/व्यक्ति', 'वर्तमान जागरूकता'],
    mr: ['प्रोटोटाइपमधील योजना', 'पात्र भारतीय', 'सरासरी दावा न केलेले/व्यक्ती', 'सध्याची जागरूकता'],
  },
  explore: { en: 'Explore', hi: 'अन्वेषण करें', mr: 'एक्सप्लोर करा' },
};

export default function Hero({ language = 'en' }) {
  const lang = T.subheadLead[language] ? language : 'en';
  const words = HEADLINE[lang];
  const statValues = ['14', '80 Cr', '₹43,000', '<5%'];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(27, 23, 64, 0.15) 0%, transparent 70%)' }} />
      </div>

      {/* India map background */}
      <IndiaMapSVG />

      {/* Floating scheme badges - Vibrant, moving background elements */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-0 overflow-hidden">
        {/* Top Left: PM-KISAN */}
        <FloatingBadge 
          icon="🌽" 
          title="PM-KISAN" 
          amount="₹6,000 / year" 
          className="hidden md:flex top-24 left-4 xl:left-2 text-emerald-400" 
          delay={0.4} 
          duration={5.5}
          floatY={14}
          borderGlow="rgba(19, 136, 8, 0.45)"
        />
        
        {/* Top Right: Ayushman Bharat */}
        <FloatingBadge 
          icon="🏥" 
          title="Ayushman Bharat" 
          amount="₹5 Lakh Cover" 
          className="hidden md:flex top-24 right-4 xl:right-2 text-sky-400" 
          delay={0.8} 
          duration={6.2}
          floatY={16}
          borderGlow="rgba(56, 189, 248, 0.45)"
        />

        {/* Center-Top / Upper Center Gap: PM Ujjwala */}
        <FloatingBadge 
          icon="🔥" 
          title="Free LPG PMUY" 
          amount="₹1,600 Subsidy" 
          className="hidden lg:flex top-20 left-1/2 -translate-x-1/2 text-amber-400" 
          delay={1.2} 
          duration={5.8}
          floatY={12}
          borderGlow="rgba(245, 158, 11, 0.45)"
        />

        {/* Middle Center (Between text and mockup): MahaDBT Grant */}
        <FloatingBadge 
          icon="💰" 
          title="MahaDBT Grant" 
          amount="₹25,000 Benefit" 
          className="hidden xl:flex top-1/2 left-[56%] -translate-y-1/2 text-primary-300" 
          delay={1.5} 
          duration={6.5}
          floatY={18}
          borderGlow="rgba(168, 85, 247, 0.45)"
        />

        {/* Bottom Left: PMAY */}
        <FloatingBadge 
          icon="🏠" 
          title="PMAY Housing" 
          amount="₹1.30 Lakh" 
          className="hidden md:flex bottom-16 left-4 xl:left-4 text-orange-400" 
          delay={1.8} 
          duration={5.2}
          floatY={15}
          borderGlow="rgba(194, 97, 10, 0.45)"
        />

        {/* Bottom Center / Right: Widow Pension */}
        <FloatingBadge 
          icon="👵" 
          title="Widow Pension" 
          amount="₹1,500 / month" 
          className="hidden lg:flex bottom-14 right-1/3 text-teal-300" 
          delay={2.1} 
          duration={6.0}
          floatY={13}
          borderGlow="rgba(45, 212, 191, 0.45)"
        />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Event badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border"
              style={{ background: 'rgba(27, 23, 64, 0.12)', borderColor: 'rgba(27, 23, 64, 0.3)', color: '#1B1740' }}
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Catalyst Hack 2026 · Team Binary Builders
            </motion.div>

            {/* Word-by-word headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-balance">
              {words.map(([word, role], i) => (
                <motion.span
                  key={`${lang}-${i}`}
                  className={`inline-block mr-2.5 sm:mr-3 mb-1.5 sm:mb-2 ${ROLE_CLASS[role]}`}
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-ink/80 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {T.subheadLead[lang]}{' '}
              <span className="text-ink font-semibold">{T.subheadBold[lang]}</span>
            </motion.p>

            {/* Tagline, in the chosen language */}
            <motion.p
              className="hindi text-base sm:text-lg text-ink/62 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {T.tagline[lang]}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <Link to="/register" className="btn-secondary text-base px-8 py-4 shadow-glow-secondary justify-center text-center">
                <span>{T.ctaPrimary[lang]}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/journey" className="btn-ghost text-base px-8 py-4 justify-center text-center">
                <Play size={16} className="fill-current" />
                <span>{T.ctaSecondary[lang]}</span>
              </Link>
            </motion.div>

            {/* Trust stat strip */}
            <motion.div
              className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 text-sm text-ink/60 border-t border-ink/5 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {statValues.map((value, i) => ({ value, label: T.statLabels[lang][i] })).map(({ value, label }) => (
                <div key={value} className="flex flex-col">
                  <span className="text-ink font-black text-lg">{value}</span>
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Live Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <motion.div
              className="relative w-full max-w-[340px] sm:max-w-[360px]"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            >
              {/* Outer decorative phone shell glow */}
              <div className="absolute inset-0 rounded-[36px] bg-primary/20 blur-xl -z-10" />
              
              <div className="rounded-[36px] border border-ink/10 p-2.5 bg-black shadow-glow-primary/20">
                <WhatsAppDemo interactive={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-ink/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest">{T.explore[lang]}</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
}
