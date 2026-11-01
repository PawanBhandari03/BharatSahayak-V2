import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Database, MessageSquare, ShieldCheck, Cpu, Zap, Target, Heart, ArrowRight, ExternalLink, Star } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useSchemes } from '../context/SchemesContext';
import { translate } from '../i18n/about';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const TEAM = [
  {
    name: 'PawanSingh Bhandari',
    role: 'Full-Stack + Cloud (AWS)',
    username: 'PawanBhandari03',
    avatar: 'P',
    image: '/avatars/pawan.svg',
    color: '#1B1740',
    bg: 'from-primary-700 to-primary-500',
    skills: [['React', 'Frontend'], ['Node.js', 'Backend'], ['Supabase', 'Database'], ['AWS', 'Deployment']],
    contribution: 'Built the React frontend and the Node.js backend, set up the Supabase database, and deployed the project on AWS.',
    github: 'https://github.com/PawanBhandari03',
    linkedin: 'https://www.linkedin.com/in/pawan-singh-bhandari-5817ab307',
    twitter: '#',
  },
  {
    name: 'Rahul Bramhankar',
    role: 'Backend + Messaging',
    username: 'RAHUL0408-B',
    avatar: 'R',
    image: '/avatars/rahul.svg',
    color: '#138808',
    bg: 'from-teal-900 to-teal-700',
    skills: [['React', 'Frontend'], ['Node.js', 'Backend'], ['Twilio', 'WhatsApp'], ['Mistral AI', 'Data pipeline']],
    contribution: 'Built the Twilio WhatsApp integration and the scheme data pipeline, and helped with the backend and frontend.',
    github: 'https://github.com/RAHUL0408-B',
    linkedin: 'https://www.linkedin.com/in/rahul-bramhankar-a424a328b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    twitter: '#',
  },
];

const TECH_STACK = [
  { icon: Code2, label: 'React 18 + Vite', category: 'Frontend', color: '#61DAFB' },
  { icon: Database, label: 'Node.js + Express', category: 'Backend', color: '#68A063' },
  { icon: Database, label: 'Supabase (PostgreSQL)', category: 'Database', color: '#47A248' },
  { icon: MessageSquare, label: 'Twilio WhatsApp API', category: 'Messaging', color: '#F22F46' },
  { icon: Cpu, label: 'Mistral AI', category: 'AI Engine', color: '#CC785C' },
  { icon: ShieldCheck, label: 'Twilio Voice', category: 'Voice', color: '#FF9933' },
];

const PROBLEM_STATS = [
  { value: 2.6, suffix: 'L Cr', label: 'Unclaimed annually', color: '#C2610A' },
  { value: 800, suffix: 'M+', label: 'Eligible Indians', color: '#1B1740' },
  { value: 5, prefix: '<', suffix: '%', label: 'Awareness rate', color: '#2196F3' },
  { value: 43000, prefix: '₹', label: 'Avg per person', color: '#138808' },
];

function TeamCard({ member, index }) {
  const { language } = useSchemes();
  const t = (x) => translate(language, x);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      whileHover={{ y: -6 }}
      className="rounded-2xl border p-6 group flex flex-col justify-between"
      style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
    >
      <div>
        {/* Avatar with a small initial badge */}
        <div className="relative w-20 h-20 mb-5">
          <img src={member.image} alt={member.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
          <span
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-white"
            style={{ background: member.color }}
            aria-hidden="true"
          >
            {member.avatar}
          </span>
        </div>

        <h3 className="text-ink font-bold text-xl mb-0.5">{member.name}</h3>
        <p className="font-medium text-sm mb-1" style={{ color: member.color }}>{t(member.role)}</p>
        <p className="text-ink/50 text-xs mb-4">@{member.username}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.skills.map(([tech, area]) => (
            <span key={tech} className="badge text-xs px-2.5 py-1" style={{ background: `${member.color}18`, color: member.color }}>
              {tech} · {t(area)}
            </span>
          ))}
        </div>

        <p className="text-ink/70 text-sm leading-relaxed mb-5">{t(member.contribution)}</p>

        {/* Social links */}
        <div className="flex gap-2">
          <a href={member.github} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-ink/65 hover:text-ink border border-dark-border hover:border-primary/40 transition-all">
            <Github size={13} /> GitHub
          </a>
          <a href={member.linkedin} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-ink/65 hover:text-ink border border-dark-border hover:border-primary/40 transition-all">
            <Linkedin size={13} /> LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProblemStat({ stat, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { language } = useSchemes();
  const t = (x) => translate(language, x);


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-6 rounded-2xl border"
      style={{ background: `${stat.color}08`, borderColor: `${stat.color}30` }}
    >
      <div className="text-3xl font-black rupee mb-1" style={{ color: stat.color }}>
        {stat.prefix && <span>{stat.prefix}</span>}
        {inView ? (
          <CountUp end={stat.value} duration={2} separator="," decimals={stat.value < 10 ? 1 : 0} />
        ) : '0'}
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div className="text-ink/75 text-sm">{t(stat.label)}</div>
    </motion.div>
  );
}

export default function About() {
  const { language } = useSchemes();
  const t = (x) => translate(language, x);
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl mb-6"
          >
            🏆
          </motion.div>
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Team Binary Builders
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-black text-ink mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('Building AI for')}{' '}
            <span className="gradient-text-secondary">{t("Bharat's Bottom Billion")}</span>
          </motion.h1>
          <motion.p
            className="text-ink/70 text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("We're two engineers who believe technology should solve real problems — not just for those with smartphones, but for every Indian citizen.")}
          </motion.p>

          {/* Hackathon badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mt-8"
            style={{ background: 'rgba(194, 97, 10, 0.1)', borderColor: 'rgba(194, 97, 10, 0.4)' }}
          >
            <Star size={16} className="text-accent fill-accent" />
            <span className="text-ink font-semibold">Catalyst Hack 2026</span>
            <span className="text-accent font-bold">Team Binary Builders</span>
          </motion.div>
        </div>

        {/* Team */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl font-black text-ink mb-2 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('Meet the Team')}
          </motion.h2>
          <p className="text-ink/60 text-center mb-10">{t('Two builders. One mission. Zero compromises.')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>

        {/* Problem statement */}
        <section className="mb-20">
          <div className="rounded-3xl p-8 md:p-12 border" style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="section-label">{t('The Problem')}</p>
              <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
                {t("India's Biggest")}{' '}
                <span className="gradient-text-primary">{t('Welfare Failure')}</span>
              </h2>
              <p className="text-ink/70 text-lg max-w-2xl mx-auto">
                {t('The Indian government spends ₹15+ lakh crore annually on welfare. Yet, less than 5% of eligible citizens know about all the schemes they qualify for.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {PROBLEM_STATS.map((stat, i) => <ProblemStat key={stat.label} stat={stat} index={i} />)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: '🔍', title: 'Discovery Problem', text: 'Schemes are buried in government portals — no single discovery engine exists.' },
                { icon: '📱', title: 'Access Problem', text: '67% of rural India has no smartphone. Applications require internet they don\'t have.' },
                { icon: '🗣️', title: 'Language Problem', text: 'Most scheme information is in English or urban Hindi — inaccessible to local dialects.' },
              ].map(item => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-xl border"
                  style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="text-ink font-bold mb-2">{t(item.title)}</h4>
                  <p className="text-ink/65 text-sm leading-relaxed">{t(item.text)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl font-black text-ink mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('Our')} <span className="gradient-text-primary">{t('Tech Stack')}</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${tech.color}18` }}>
                    <Icon size={20} style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="text-ink font-semibold text-sm">{tech.label}</div>
                    <div className="text-ink/55 text-xs">{t(tech.category)}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Mission */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl p-10 border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(27, 23, 64, 0.12), rgba(19, 136, 8, 0.08))', borderColor: 'rgba(27, 23, 64, 0.3)' }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">{t('Our Mission')}</h2>
            <blockquote className="text-xl text-ink/80 italic max-w-2xl mx-auto leading-relaxed mb-6">
              "{t('AI that finds what the government owes you — before you even know to ask.')}"
            </blockquote>
            <p className="text-ink/62 text-sm mb-8 max-w-xl mx-auto">
              {t("We believe every Indian citizen deserves to access every benefit they're entitled to — regardless of education, language, or internet access. BharatSahayak is our answer.")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-secondary">
                {t('View Demo Dashboard')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/schemes" className="btn-ghost">
                {t('Explore All Schemes')}
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
