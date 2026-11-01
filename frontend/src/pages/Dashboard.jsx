import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Wifi, WifiOff, Clock, Bell, Calendar, AlertTriangle,
  ArrowRight, PhoneCall, LogOut, UserPlus, Sparkles, Zap, FileStack, CheckCircle
} from 'lucide-react';
import BenefitWallet from '../components/BenefitWallet';
import SchemeCard from '../components/SchemeCard';
import { LifeTimeline } from '../components/Timeline';
import { useUser } from '../context/UserContext';
import { useSchemes } from '../context/SchemesContext';
import { computeWallet, generateTimeline, getAvatar, matchSchemesForUser, readTracking, writeTracking } from '../utils/schemeMatcher';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { translate, walletTitle, alertParts } from '../i18n/dashboard';
import { translate as translateForm } from '../i18n/register';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

// ─────────────────────────────
// Empty state — not registered
// ─────────────────────────────
function NotRegistered({ lang }) {
  const t = (s) => translate(lang, s);
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate"
      className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 pt-20"
    >
      <div className="text-7xl mb-2">🗂️</div>
      <h1 className="text-3xl font-black text-ink">{t('No Profile Found')}</h1>
      <p className="text-ink/65 max-w-md">
        {t("You haven't registered yet. Fill in your details and our AI will find all government schemes you qualify for — in under 2 minutes.")}
      </p>
      <Link to="/register" className="btn-secondary text-base px-8 py-4">
        <UserPlus size={18} />
        {t("Register Now — It's Free")}
      </Link>
      <Link to="/schemes" className="text-sm text-ink/50 hover:text-ink transition-colors">
        {t('Browse all schemes first →')}
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────
// Profile card — dynamic
// ─────────────────────────────
function ProfileCard({ user, wallet, lang }) {
  const t = (s) => translate(lang, s);
  const tf = (s) => translateForm(lang, s);
  const avatar = getAvatar(user);
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      <div>
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-4">
          {avatar || initials}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-ink font-bold text-xl">{user.name}</h2>
            <p className="text-primary text-sm font-medium">{tf(user.occupation)}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-ink/60">
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {user.district ? `${user.district}, ${tf(user.state)}` : tf(user.state)}
              </span>
              <span>{t('Age')} {user.age}</span>
              {user.hasSmartphone && (
                <span className={`flex items-center gap-1 ${user.hasSmartphone.includes('Yes') ? 'text-secondary' : 'text-accent'}`}>
                  {user.hasSmartphone.includes('Yes') ? <Wifi size={11} /> : <WifiOff size={11} />}
                  {user.hasSmartphone.includes('Yes') ? t('Smartphone') : t('Feature Phone')}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            {user.mobile && <span className="badge bg-secondary/15 text-secondary">📱 {t('Mobile added')}</span>}
            {user.category && <span className="badge bg-primary/15 text-primary/80">📋 {tf(user.category)} {t('Category')}</span>}
            {user.hasBPL === 'Yes' && (
              <span className="badge bg-orange-500/15 text-orange-400">🃏 {t('BPL Card Holder')}</span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-dark-border">
          <div className="text-center">
            <div className="font-bold text-ink text-sm">{user.income ? tf(user.income) : t('Not set')}</div>
            <div className="text-ink/55 text-xs mt-0.5">{t('Annual Income')}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-ink text-sm">{user.children !== undefined && user.children !== '' ? user.children : '—'}</div>
            <div className="text-ink/55 text-xs mt-0.5">{t('Children')}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-secondary text-sm">{wallet.count} {t('schemes')}</div>
            <div className="text-ink/55 text-xs mt-0.5">{t('You Qualify')}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DeadlineCard({ item, index, lang }) {
  const t = (s) => translate(lang, s);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-xl border"
      style={{
        background: item.urgent ? 'rgba(194, 97, 10, 0.06)' : '#FFFFFF',
        borderColor: item.urgent ? 'rgba(194, 97, 10, 0.3)' : '#E8DFCF',
      }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.urgent ? 'bg-accent/20' : 'bg-primary/10'}`}>
        <Clock size={18} className={item.urgent ? 'text-accent' : 'text-primary'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-ink font-semibold text-sm truncate">{item.scheme}</div>
        <div className="text-ink/60 text-xs">₹{item.amount?.toLocaleString('en-IN')} {t('benefit')}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`font-bold text-sm ${item.urgent ? 'text-accent' : 'text-ink/80'}`}>
          {item.daysLeft} {t('days')}
        </div>
        <div className="text-ink/50 text-xs">{item.deadline}</div>
      </div>
    </motion.div>
  );
}

const WHATSAPP_JOIN = 'https://wa.me/14155238886?text=join%20spent-opinion';

function VoiceCallCard({ user, lang }) {
  const t = (s) => translate(lang, s);
  const tf = (s) => translateForm(lang, s);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border p-5"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
          <PhoneCall size={22} className="text-secondary" />
        </div>
        <div>
          <h3 className="text-ink font-bold">{t('Ask on WhatsApp or call')}</h3>
          <p className="text-ink/60 text-xs">{t('Same schemes, in Hindi, Marathi or English')}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/65">{t('Your state')}</span>
          <span className="text-ink font-medium">{tf(user.state)}</span>
        </div>
        {user.mobile && (
          <div className="flex justify-between">
            <span className="text-ink/65">{t('Mobile saved')}</span>
            <span className="text-ink font-medium">+91-{user.mobile}</span>
          </div>
        )}
        <p className="text-ink/55 text-xs pt-1">{t('Reminders are not switched on yet. This site does not call or message you by itself.')}</p>
      </div>

      <a href={WHATSAPP_JOIN} target="_blank" rel="noopener noreferrer"
        className="w-full btn-secondary py-3 text-sm justify-center">
        <Calendar size={15} />
        {t('Open the WhatsApp bot')}
      </a>
    </motion.div>
  );
}

// ─────────────────────────────
// Deadlines — from matched schemes with deadlines
// ─────────────────────────────
function useDeadlines(matchedSchemes) {
  return useMemo(() => {
    return matchedSchemes
      .filter(s => s.isMatched && s.deadline && s.deadlineDaysLeft !== null && s.deadlineDaysLeft > 0)
      .sort((a, b) => a.deadlineDaysLeft - b.deadlineDaysLeft)
      .slice(0, 5)
      .map(s => ({
        scheme: s.name,
        amount: s.benefitAmount,
        deadline: s.deadline,
        daysLeft: s.deadlineDaysLeft,
        urgent: s.deadlineDaysLeft < 30,
      }));
  }, [matchedSchemes]);
}

// ─────────────────────────────
// Main Dashboard
// ─────────────────────────────
export default function Dashboard() {
  const { user, aiRecommendations, clearUser } = useUser();
  const { schemes, language } = useSchemes();
  const t = (s) => translate(language, s);
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(readTracking);

  // Matching runs live on the shared scheme list, so the dashboard always reflects the current data
  const matchedSchemes = useMemo(() => (user ? matchSchemesForUser(user, schemes) : []), [user, schemes]);
  const deadlines = useDeadlines(matchedSchemes);

  const track = (id, status) => {
    setTracking((prev) => {
      const next = { ...prev };
      if (status) next[id] = status; else delete next[id];
      writeTracking(next);
      return next;
    });
  };

  // If no user registered, show prompt
  if (!user) return <NotRegistered lang={language} />;

  const eligibleSchemes = matchedSchemes.filter(s => s.isMatched);
  const wallet = computeWallet(matchedSchemes, tracking, user);
  const timeline = generateTimeline(user, matchedSchemes);

  const handleLogout = () => {
    clearUser();
    toast.success(t('Profile cleared. Register again anytime.'), {
      style: { background: '#F5EFE3', color: '#1B1740', border: '1px solid #E8DFCF' }
    });
    navigate('/');
  };

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <motion.div className="mb-8 flex items-start justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div>
            <p className="section-label">{t('Benefit Dashboard')}</p>
            <h1 className="text-3xl md:text-4xl font-black text-ink">
              {walletTitle(language, user.name?.split(' ')[0])}{' '}
              <span className="gradient-text-secondary">{t('Benefit Wallet')}</span>
            </h1>
            <p className="text-ink/60 text-sm mt-1">
              {eligibleSchemes.length} {t('schemes matched')} · {t('Updated just now')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-ink/60 border border-dark-border hover:text-accent hover:border-accent/30 transition-all mt-2"
          >
            <LogOut size={13} /> {t('Clear Profile')}
          </button>
        </motion.div>

        {/* Alert Banner */}
        {wallet.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl border flex items-center justify-between gap-4"
            style={{ background: 'rgba(194, 97, 10, 0.08)', borderColor: 'rgba(194, 97, 10, 0.25)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">🔔</span>
              <div className="text-sm">
                <span className="text-ink font-bold">{alertParts(language, wallet)[0]}</span>{' '}
                <span className="text-ink/75">{alertParts(language, wallet)[1]}</span>
                <span className="text-accent font-extrabold rupee">₹{wallet.total?.toLocaleString('en-IN')}</span>{' '}
                <span className="text-ink/75">{alertParts(language, wallet)[2]}</span>
              </div>
            </div>
            <Link to="/schemes" className="hidden sm:inline-flex text-xs font-bold text-accent hover:underline shrink-0">
              {t('View Matches →')}
            </Link>
          </motion.div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          {/* Sticky on wide screens so the column stays in view while the longer right column scrolls */}
          <div className="xl:col-span-1 space-y-6 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto scrollbar-hide">
            <ProfileCard user={user} wallet={wallet} lang={language} />
            <VoiceCallCard user={user} lang={language} />

            {/* Deadlines */}
            {deadlines.length > 0 && (
              <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
                <h3 className="text-ink font-bold mb-4 flex items-center gap-2">
                  <Bell size={16} className="text-accent" />
                  {t('Upcoming Deadlines')}
                </h3>
                <div className="space-y-2">
                  {deadlines.map((item, i) => (
                    <DeadlineCard key={item.scheme} item={item} index={i} lang={language} />
                  ))}
                </div>
              </div>
            )}

            {/* Ineligible count */}
            {matchedSchemes.filter(s => !s.isMatched).length > 0 && (
              <div className="rounded-2xl border p-4 text-center"
                style={{ background: '#F5EFE3', borderColor: '#E8DFCF' }}>
                <p className="text-ink/60 text-xs mb-1">
                  {matchedSchemes.filter(s => !s.isMatched).length} {t('schemes')} — {t('currently ineligible')}
                </p>
                <p className="text-ink/45 text-xs">{t('Update your profile to check again')}</p>
              </div>
            )}
          </div>

          {/* CENTER + RIGHT */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* AI Recommendations */}
            {aiRecommendations && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(to right, rgba(27, 23, 64, 0.15), rgba(19, 136, 8, 0.1))', borderColor: 'rgba(27, 23, 64, 0.3)' }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                
                <h3 className="text-ink font-bold text-xl mb-3 flex items-center gap-2">
                  <Sparkles className="text-primary" size={20} />
                  {t('AI Recommendations')}
                </h3>
                
                <p className="text-ink/55 text-xs mb-3">{t('AI-written summary. It can make mistakes, so check the official portal before applying.')}</p>
                <p className="text-ink/88 italic mb-6 border-l-2 border-primary/50 pl-3 text-sm leading-relaxed">
                  "{aiRecommendations.personalizedMessage}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Priority Schemes */}
                  <div>
                    <h4 className="text-ink font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Zap className="text-secondary" size={16} />
                      {t('Top Priority Schemes')}
                    </h4>
                    <div className="space-y-3">
                      {aiRecommendations.topSchemes?.map((s, idx) => (
                        <div key={idx} className="bg-dark/40 rounded-xl p-3 border border-dark-border">
                          <p className="text-ink font-medium text-sm mb-1">{s.name}</p>
                          <p className="text-ink/65 text-xs">{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Required */}
                  <div>
                    <h4 className="text-ink font-semibold mb-3 flex items-center gap-2 text-sm">
                      <FileStack className="text-accent" size={16} />
                      {t('Documents to Arrange')}
                    </h4>
                    <ul className="space-y-2">
                      {aiRecommendations.documentsToArrange?.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-ink/80">
                          <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefit Wallet */}
            <BenefitWallet wallet={wallet} />

            {/* Matched Schemes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-ink font-bold text-lg flex items-center gap-2">
                  ✅ {t('Your Matched Schemes')}
                  <span className="badge bg-secondary/15 text-secondary text-xs">
                    {eligibleSchemes.length} {t('matches')}
                  </span>
                </h3>
                <Link to="/schemes"
                  className="text-sm text-primary hover:text-ink transition-colors flex items-center gap-1">
                  {t('View All')} <ArrowRight size={14} />
                </Link>
              </div>

              {eligibleSchemes.length === 0 ? (
                <div className="p-8 rounded-2xl border text-center"
                  style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-ink font-semibold mb-1">{t('No exact matches found')}</p>
                  <p className="text-ink/60 text-sm">
                    {t('Try updating your profile — some schemes have very specific eligibility criteria.')}
                  </p>
                  <Link to="/register"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-ink border border-primary/40 hover:bg-primary/10 transition-all">
                    {t('Update Profile')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eligibleSchemes.slice(0, 8).map(scheme => (
                    <SchemeCard key={scheme.id} scheme={scheme} status={tracking[scheme.id]} onTrack={track} />
                  ))}
                </div>
              )}
            </div>

            {/* Life Timeline */}
            {timeline.length > 0 && (
              <div className="rounded-2xl border p-5 overflow-hidden"
                style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
                <h3 className="text-ink font-bold mb-1 flex items-center gap-2">
                  🗓 {t('Your Benefits Timeline')}
                </h3>
                <p className="text-ink/60 text-xs mb-5">
                  {t('Future scheme eligibility based on your age and profile')}
                </p>
                <LifeTimeline milestones={timeline} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
