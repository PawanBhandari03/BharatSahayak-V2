import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useSchemes } from '../context/SchemesContext';
import { translate } from '../i18n/home';

const STATS = [
  {
    value: 2.6,
    prefix: '₹',
    suffix: 'L Cr',
    label: 'Benefits Unclaimed',
    sublabel: 'Going unclaimed every year',
    color: '#C2610A',
    icon: '💸',
  },
  {
    value: 14,
    suffix: "",
    label: 'Schemes',
    sublabel: 'In this prototype, growing with each verified record',
    color: '#1B1740',
    icon: '📋',
  },
  {
    value: 800,
    suffix: 'M',
    label: 'Citizens',
    sublabel: 'Deserving direct welfare support',
    color: '#138808',
    icon: '👥',
  },
  {
    value: 5,
    prefix: '<',
    suffix: '%',
    label: 'Awareness',
    sublabel: 'Of citizens know their rights',
    color: '#2196F3',
    icon: '📉',
  },
];

function StatCard({ stat, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { language } = useSchemes();
  const t = (s) => translate(language, s);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative p-8 rounded-2xl border text-center group hover:scale-105 transition-transform duration-300"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 40px ${stat.color}20` }}
      />

      {/* Icon */}
      <div className="text-4xl mb-4">{stat.icon}</div>

      {/* Counter */}
      <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: stat.color }}>
        {stat.prefix && <span>{stat.prefix}</span>}
        {inView ? (
          <CountUp
            end={stat.value}
            duration={2.5}
            separator=","
            decimals={stat.value % 1 !== 0 ? 1 : 0}
            useEasing
          />
        ) : (
          <span>0</span>
        )}
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>

      <div className="text-ink font-semibold text-lg mb-1">{t(stat.label)}</div>
      <div className="text-ink/60 text-sm">{t(stat.sublabel)}</div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
        style={{ background: stat.color }}
      />
    </motion.div>
  );
}

export default function StatsCounter() {
  const { language } = useSchemes();
  const t = (s) => translate(language, s);
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('The Problem We Solve')}
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-ink mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('The Numbers Are')}{' '}
            <span className="gradient-text-primary">{t('Staggering')}</span>
          </motion.h2>
          <motion.p
            className="text-ink/65 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t("Every year, billions of rupees in benefits go unclaimed — not because people don't deserve them, but because they don't know they exist.")}
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* ₹2.6L Crore highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-8 rounded-2xl text-center border"
          style={{ background: 'rgba(194, 97, 10, 0.06)', borderColor: 'rgba(194, 97, 10, 0.3)' }}
        >
          <p className="text-ink/75 text-sm uppercase tracking-wider mb-3">{t('Total unclaimed benefits annually')}</p>
          <div className="text-5xl md:text-7xl font-black rupee gradient-text-secondary mb-2">
            {t('₹2,60,000 Crore')}
          </div>
          <p className="text-ink/60 text-sm">{t("That's India's entire health budget — going to waste.")}</p>
        </motion.div>
      </div>
    </section>
  );
}
