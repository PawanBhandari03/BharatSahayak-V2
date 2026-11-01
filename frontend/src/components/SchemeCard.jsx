import { motion } from 'framer-motion';
import { Clock, FileText, CheckCircle, ExternalLink, Users, Phone, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSchemes } from '../context/SchemesContext';
import { translate, translateDepartment } from '../i18n/cards';

const CATEGORY_COLORS = {
  Agriculture: '#138808',
  'Social Welfare': '#1B1740',
  Housing: '#C2610A',
  Health: '#2196F3',
  Insurance: '#9C27B0',
  Energy: '#FF9933',
  Entrepreneurship: '#00BCD4',
  'Skill Development': '#607D8B',
  Education: '#3F51B5',
};

function DeadlineBadge({ daysLeft, deadline, t }) {
  if (!deadline) {
    return (
      <span className="badge bg-secondary/10 text-secondary text-xs">
        <CheckCircle size={10} /> {t('Check portal for dates')}
      </span>
    );
  }

  const isUrgent = daysLeft !== null && daysLeft < 30;
  const isVeryUrgent = daysLeft !== null && daysLeft < 10;
  const isPast = daysLeft !== null && daysLeft < 0;

  if (isPast) {
    return (
      <span className="badge bg-ink/5 text-ink/50 text-xs line-through">
        <Clock size={10} /> {t('Enrollment window closed')}
      </span>
    );
  }

  return (
    <span
      className={`badge text-xs ${
        isVeryUrgent ? 'bg-red-500/15 text-red-400' :
        isUrgent ? 'bg-accent/15 text-accent' :
        'bg-ink/5 text-ink/65'
      }`}
    >
      <Clock size={10} />
      {isVeryUrgent ? '🚨 ' : isUrgent ? '⚠️ ' : ''}
      {daysLeft !== null ? `${daysLeft} ${t('days left')}` : deadline}
    </span>
  );
}

export default function SchemeCard({ scheme, compact = false, status, onTrack }) {
  const { language } = useSchemes();
  const t = (s) => translate(language, s);
  // One accent for every category so the whole site reads as a single palette.
  const categoryColor = '#1B1740';

  const handleEligibility = (e) => {
    e.preventDefault();
    if (scheme.eligibleLevel === 'maybe') {
      toast(`${t('Possibly eligible. Tell us:')} ${(scheme.missing || []).join(', ')}.`, { duration: 5000 });
    } else if (scheme.isMatched) {
      toast.success(
        `✅ ${(scheme.reasons || []).slice(0, 2).join(' · ') || t('You fit the rules')} — ${scheme.documents.length} ${t('documents needed')}.`,
        {
          duration: 4000,
          style: { background: '#FFFFFF', color: '#1B1740', border: '1px solid #138808' },
        }
      );
    } else {
      toast.error(
        scheme.ineligibleReason || t('Not eligible with the details you entered.'),
        {
          duration: 4000,
          style: { background: '#FFFFFF', color: '#1B1740', border: '1px solid #C2610A' },
        }
      );
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (scheme.officialPortal) {
      toast.success(`📋 ${t('Opening official portal:')} ${scheme.officialPortal}`, {
        duration: 3000,
        icon: '🏛️',
        style: { background: '#FFFFFF', color: '#1B1740', border: '1px solid #1B1740' },
      });
      setTimeout(() => window.open(scheme.officialPortal, '_blank'), 1200);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative rounded-2xl border overflow-hidden group transition-all duration-300 flex flex-col h-full"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      {/* Category top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}60)` }} />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ border: `1px solid ${categoryColor}35`, borderRadius: '1rem', boxShadow: `0 8px 30px ${categoryColor}15` }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="mb-3">
          {scheme.isMatched && (
            <span className="badge bg-secondary/15 text-secondary text-xs mb-2 block w-fit">
              <CheckCircle size={9} /> {scheme.eligibleLevel === 'maybe' ? t('Possible — check details') : t('Fits your answers')}
            </span>
          )}
          <h3 className="text-ink font-bold text-base leading-snug line-clamp-2 min-h-[2.75rem]">{scheme.name}</h3>
          <p className="text-ink/60 text-xs mt-0.5 line-clamp-1">{translateDepartment(language, scheme.department)}</p>
        </div>

        {/* Benefit: a calm, fixed-height panel so every card lines up */}
        <div className="mb-3 rounded-lg border px-3 py-2 min-h-[3.5rem] flex flex-col justify-center" style={{ background: '#F2F8F0', borderColor: '#D3E5CF' }}>
          <div className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: '#14532D' }}>{scheme.benefitLabel}</div>
          {scheme.benefitType && <div className="text-xs mt-0.5" style={{ color: '#4B6B49' }}>{t(scheme.benefitType)}</div>}
        </div>

        {!compact && (
          <>
            {/* Full scheme name */}
            <p className="text-ink/55 text-xs italic mb-2 line-clamp-1 min-h-[1rem]">{scheme.fullName !== scheme.name ? scheme.fullName : ((scheme.eligibility || [])[0] || '')}</p>

            {/* Description */}
            <p className="text-ink/70 text-xs leading-relaxed mb-3 line-clamp-3 min-h-[3.7rem]">{scheme.description !== scheme.benefitLabel ? scheme.description : (scheme.eligibility || []).slice(1, 4).join(' · ')}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="badge text-xs px-2.5 py-1" style={{ background: `${categoryColor}18`, color: categoryColor }}>
                {t(scheme.category)}
              </span>
              {scheme.tags.slice(0, 3).map(tag => (
                <span key={tag} className="badge bg-ink/5 text-ink/62 text-xs px-2.5 py-1">
                  {t(tag)}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Real data row — deadline + docs + beneficiaries */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <DeadlineBadge daysLeft={scheme.deadlineDaysLeft} deadline={scheme.deadline} t={t} />
          <span className="badge bg-ink/5 text-ink/60 text-xs">
            <FileText size={10} /> {scheme.documentsNeeded} {t('docs')}
          </span>
          {scheme.beneficiariesCrore && (
            <span className="badge bg-secondary/8 text-secondary/60 text-xs">
              <Users size={10} /> {scheme.beneficiariesCrore} {t('Cr beneficiaries')}
            </span>
          )}
        </div>

        {/* Helpline (real) */}
        {scheme.helpline && !compact && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-ink/50">
            <Phone size={10} className="text-primary/60" />
            <span>{t('Helpline:')} <span className="text-ink/65">{scheme.helpline}</span></span>
          </div>
        )}

        {/* Official portal (real) */}
        {scheme.officialPortal && !compact && (
          <div className="flex items-center gap-1.5 mb-4 text-xs">
            <Globe size={10} className="text-secondary/60" />
            <a
              href={scheme.officialPortal}
              target="_blank"
              rel="noreferrer"
              className="text-secondary/70 hover:text-secondary truncate transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {scheme.officialPortal.replace('https://', '')}
            </a>
          </div>
        )}

        {onTrack && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="text-ink/55">{t('Status:')}</span>
            {[['applied', 'Applied'], ['received', 'Receiving']].map(([key, label]) => (
              <button key={key} type="button" onClick={() => onTrack(scheme.id, status === key ? null : key)}
                className={`px-2.5 py-1 rounded-full border ${status === key ? 'bg-ink text-white border-ink' : 'border-paper-line text-ink/70 hover:border-ink/50'}`}>
                {t(label)}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleEligibility}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border hover:scale-[1.02]"
            style={{ borderColor: `${categoryColor}40`, color: categoryColor, background: `${categoryColor}10` }}
          >
            {t('Why / why not')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1"
            style={{ background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}CC)` }}
          >
            {t('Apply Now')} <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
