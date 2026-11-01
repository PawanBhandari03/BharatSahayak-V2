import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useSchemes } from '../context/SchemesContext';
import { translate } from '../i18n/cards';

const DEFAULT_CHART = [
  { name: 'Received',  value: 0, color: '#138808' },
  { name: 'Available', value: 0, color: '#1B1740' },
  { name: 'Pending',   value: 0, color: '#C2610A' },
  { name: 'Future',    value: 0, color: '#2196F3' },
];

function MetricCard({ label, value, color, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { language } = useSchemes();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl border"
      style={{ background: `${color}0D`, borderColor: `${color}30` }}
    >
      <div className="text-xs text-ink/60 mb-1">{translate(language, label)}</div>
      <div className="text-xl font-black rupee" style={{ color }}>
        ₹{inView && value > 0
          ? <CountUp end={value} duration={1.8} separator="," />
          : value.toLocaleString('en-IN')
        }
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }) {
  const { language } = useSchemes();
  if (active && payload?.length) {
    const d = payload[0];
    return (
      <div className="px-4 py-3 rounded-xl border text-sm"
        style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
        <div className="font-bold" style={{ color: d.payload.color }}>{translate(language, d.name)}</div>
        <div className="text-ink">₹{d.value.toLocaleString('en-IN')}</div>
      </div>
    );
  }
  return null;
}

// wallet prop is passed from Dashboard (computed dynamically)
// Falls back to zeros if not provided
export default function BenefitWallet({ wallet }) {
  const { language } = useSchemes();
  const t = (s) => translate(language, s);
  const w = wallet || {
    total: 0, received: 0, available: 0, pending: 0, future: 0, count: 0,
    chartData: DEFAULT_CHART,
  };

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const hasData = w.total > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between"
        style={{ background: '#F5EFE3' }}>
        <div>
          <h3 className="text-ink font-bold text-lg">💰 {t('Benefit Wallet')}</h3>
          <p className="text-ink/60 text-xs">
            {hasData
              ? `${w.count} ${language === 'en' ? `scheme${w.count !== 1 ? 's' : ''}` : t('scheme')} ${t('matched for your profile')}`
              : t('Register to see your matched schemes')}
          </p>
        </div>
        {hasData && (
          <div className="text-right">
            <div className="text-ink/60 text-xs">{t('Still to claim')}</div>
            <div className="text-2xl font-black text-secondary rupee">
              ₹{inView
                ? <CountUp end={w.total} duration={2.2} separator="," />
                : w.total.toLocaleString('en-IN')
              }
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {!hasData ? (
          <div className="text-center py-10 text-ink/50">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">{t('No schemes matched yet.')}</p>
            <p className="text-xs mt-1">{t('Register with your details to see your benefit wallet.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Chart */}
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={w.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={inView ? 0 : 9999}
                    animationDuration={1200}
                  >
                    {w.chartData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={val => (
                      <span style={{ color: 'rgba(27,23,64,0.7)', fontSize: 12 }}>{t(val)}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Received"  value={w.received}  color="#138808" delay={0.1} />
              <MetricCard label="Available" value={w.available + (w.possible || 0)} color="#1B1740" delay={0.2} />
              <MetricCard label="Pending"   value={w.pending}   color="#C2610A" delay={0.3} />
              <MetricCard label="Future"    value={w.future}    color="#2196F3" delay={0.4} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
