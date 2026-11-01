import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Mic, ChevronDown, SlidersHorizontal, UserCheck } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { useSchemes } from '../context/SchemesContext';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { matchSchemesForUser } from '../utils/schemeMatcher';
import { translate, schemesFound, forYouLabel } from '../i18n/schemes';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const FILTER_TABS = ['All Schemes', 'For You ✨'];
const STATES_FILTER = ['All India', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Gujarat', 'J&K / Ladakh'];
const AGE_GROUPS = ['Any Age', '18-30', '31-50', '51-60', '60+'];
const INCOME_GROUPS = ['Any Income', 'Up to ₹1L', '₹1L-₹2L', '₹2L-₹5L', '₹5L+'];
const OCCUPATIONS = ['Any', 'Farmer', 'Student', 'Business', 'Labor', 'Widow', 'Senior Citizen'];

function FilterChip({ label, active, onClick }) {
  const { language } = useSchemes();
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
        active
          ? 'text-ink border-primary bg-primary/20'
          : 'text-ink/65 border-dark-border hover:text-ink hover:border-primary/40'
      }`}
    >
      {translate(language, label)}
    </button>
  );
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const { language } = useSchemes();
  const t = (s) => translate(language, s);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all"
        style={{
          background: value && value !== options[0] ? 'rgba(27, 23, 64, 0.15)' : '#FFFFFF',
          borderColor: value && value !== options[0] ? 'rgba(27, 23, 64, 0.5)' : '#E8DFCF',
          color: value && value !== options[0] ? '#1B1740' : 'rgba(27,23,64,0.7)'
        }}
      >
        {t(label)}: <span className="font-medium">{t(value || options[0])}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-44 rounded-xl border border-dark-border z-20 py-1 overflow-hidden shadow-xl"
            style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === opt ? 'text-ink bg-primary/20' : 'text-ink/75 hover:text-ink hover:bg-ink/5'
                }`}
              >
                {t(opt)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ query }) {
  const { language } = useSchemes();
  const t = (s) => translate(language, s);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full text-center py-20"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-ink font-bold text-xl mb-2">{t('No schemes found')}</h3>
      <p className="text-ink/60 text-sm">
        {t('No results for')} "{query}". {t('Try different keywords or remove filters.')}
      </p>
    </motion.div>
  );
}

function SchemeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border p-5 space-y-3 animate-pulse" style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
      <div className="h-4 bg-dark-border rounded w-3/4" />
      <div className="h-3 bg-dark-border rounded w-1/2" />
      <div className="h-8 bg-dark-border rounded" />
      <div className="flex gap-2">
        <div className="h-6 bg-dark-border rounded-full w-16" />
        <div className="h-6 bg-dark-border rounded-full w-20" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-dark-border rounded-xl flex-1" />
        <div className="h-9 bg-dark-border rounded-xl flex-1" />
      </div>
    </div>
  );
}

export default function Schemes() {
  const { user } = useUser();
  const { schemes: allSchemes, loading: schemesLoading, error: schemesError, language } = useSchemes();
  const t = (s) => translate(language, s);
  const forYouCount = useMemo(() => (user ? matchSchemesForUser(user, allSchemes).filter((s) => s.isMatched).length : 0), [user, allSchemes]);
  const categories = useMemo(() => ['All', ...new Set(allSchemes.map((s) => s.category))], [allSchemes]);
  const [schemes, setSchemes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const loading = schemesLoading && allSchemes.length === 0;
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(FILTER_TABS[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [state, setState] = useState(user ? user.state || 'All India' : 'All India');
  const [age, setAge] = useState('Any Age');
  const [income, setIncome] = useState('Any Income');
  const [occupation, setOccupation] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // "For You" re-runs the shared eligibility engine on the full list; otherwise show everything
    const baseSchemes = (activeTab === FILTER_TABS[1] && user)
      ? matchSchemesForUser(user, allSchemes).filter((s) => s.isMatched)
      : allSchemes;
    setSchemes(baseSchemes);
    setFiltered(baseSchemes);
  }, [activeTab, user, allSchemes]);

  useEffect(() => {
    let result = [...schemes];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (state !== 'All India') {
      result = result.filter(s => s.state === state || s.state === 'All India');
    }
    // Age / income / occupation filters read the scheme's own rules (null = no limit)
    const rule = (s) => s._record?.eligibility || {};
    if (age !== 'Any Age') {
      const [lo, hi] = age === '60+' ? [60, 120] : age.split('-').map(Number);
      result = result.filter(s => (rule(s).minAge ?? 0) <= hi && (rule(s).maxAge ?? 200) >= lo);
    }
    if (income !== 'Any Income') {
      const floor = { 'Up to ₹1L': 0, '₹1L-₹2L': 100000, '₹2L-₹5L': 200000, '₹5L+': 500000 }[income];
      result = result.filter(s => rule(s).maxAnnualIncome == null || rule(s).maxAnnualIncome >= floor);
    }
    if (occupation !== 'Any') {
      const key = { Farmer: 'farmer', Student: 'student', Business: 'self-employed', Labor: 'labour', Widow: 'widow', 'Senior Citizen': '' }[occupation];
      result = result.filter(s => {
        const occ = rule(s).occupations || ['any'];
        if (occupation === 'Widow') return /widow/i.test(rule(s).maritalStatus || '') || occ.some(o => /widow/i.test(o));
        if (occupation === 'Senior Citizen') return (rule(s).minAge ?? 0) >= 60;
        return occ.includes('any') || occ.some(o => o.toLowerCase().includes(key));
      });
    }
    setFiltered(result);
  }, [search, activeCategory, state, age, income, occupation, schemes]);

  const handleVoiceSearch = () => {
    toast.success(t('🎙 Voice search coming soon! Type your query in Hindi or English.'), {
      style: { background: '#F5EFE3', color: '#1B1740', border: '1px solid #1B1740' }
    });
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setState('All India');
    setAge('Any Age');
    setIncome('Any Income');
    setOccupation('Any');
  };

  const hasFilters = search || activeCategory !== 'All' || state !== 'All India' || age !== 'Any Age' || income !== 'Any Income' || occupation !== 'Any';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {allSchemes.length} {t('Schemes')}
          </motion.p>
          <motion.h1
            className="text-3xl md:text-4xl font-black text-ink mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('Explore Government')} <span className="gradient-text-primary">{language === 'en' ? 'Schemes' : t('Schemes (heading)')}</span>
          </motion.h1>
          <motion.p
            className="text-ink/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('Find the schemes you qualify for — search by keyword, category, state, age, or income.')}
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-5 text-ink/50 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search schemes by name, category... (e.g. 'kisan', 'widow', 'health')")}
              className="w-full pl-12 pr-24 py-4 rounded-2xl text-ink placeholder-white/25 border outline-none focus:border-primary/60 transition-colors text-sm"
              style={{ background: '#F5EFE3', borderColor: '#E8DFCF' }}
            />
            <div className="absolute right-3 flex gap-2">
              <button
                onClick={handleVoiceSearch}
                className="p-2.5 rounded-xl transition-all hover:bg-primary/20"
                title={t('Voice search')}
              >
                <Mic size={16} className="text-primary" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-all ${showFilters ? 'bg-primary/20 text-primary' : 'hover:bg-ink/5 text-ink/60'}`}
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-4 rounded-2xl border border-dark-border" style={{ background: '#FFFFFF' }}>
                <FilterDropdown label="State" options={STATES_FILTER} value={state} onChange={setState} />
                <FilterDropdown label="Age Group" options={AGE_GROUPS} value={age} onChange={setAge} />
                <FilterDropdown label="Income" options={INCOME_GROUPS} value={income} onChange={setIncome} />
                <FilterDropdown label="Occupation" options={OCCUPATIONS} value={occupation} onChange={setOccupation} />
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-accent border border-accent/30 hover:bg-accent/10 transition-all">
                    <X size={13} /> {t('Clear Filters')}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs and Categories */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === FILTER_TABS[1] && !user) {
                    toast.error(t('Please register first to see personalized schemes!'), { style: { background: '#F5EFE3', color: '#1B1740', border: '1px solid #C2610A' }});
                    return;
                  }
                  setActiveTab(tab);
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  activeTab === tab
                    ? 'bg-secondary/20 text-secondary border-secondary'
                    : 'bg-[#F5EFE3] text-ink/65 border-dark-border hover:text-ink'
                }`}
              >
                {tab === FILTER_TABS[1] && user ? forYouLabel(language, forYouCount) : t(tab)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-ink/60 text-sm">
            {loading ? t('Loading...') : schemesFound(language, filtered.length)}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-accent hover:underline">
              {t('Clear all filters')}
            </button>
          )}
        </div>

        {/* Scheme grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => <SchemeCardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState query={search} />
          ) : (
            filtered.map((scheme, i) => (
              <motion.div
                key={scheme.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <SchemeCard scheme={scheme} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
