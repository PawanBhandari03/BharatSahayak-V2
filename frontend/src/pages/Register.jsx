import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Loader2, Phone, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useSchemes } from '../context/SchemesContext';
import { matchSchemesForUser } from '../utils/schemeMatcher';
import { PERSONAS } from '../demo/personas';

// ───────────────────────── options ─────────────────────────
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman & Nicobar', 'Chandigarh',
  'Dadra & Nagar Haveli', 'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Strings are kept identical to what the matchers and dashboard already expect.
const MAIN_JOBS = [
  'Farmer / Kisan', 'Agricultural Labourer', 'Daily Wage Worker', 'Street Vendor / Small Trader',
  'Self-Employed (Small Business)', 'Student', 'Homemaker', 'Private Employee', 'Government Employee',
];
const OTHER_JOBS = [
  'Domestic Worker', 'Construction Worker', 'Artisan / Craftsperson', 'Fisherman',
  'Widow / Pensioner', 'Person with Disability', 'Other',
];
const INCOMES = [
  'Up to ₹50,000/year', '₹50,001 – ₹1,00,000', '₹1,00,001 – ₹1,50,000', '₹1,50,001 – ₹2,00,000',
  '₹2,00,001 – ₹3,00,000', '₹3,00,001 – ₹5,00,000', 'Above ₹5,00,000',
];
const INCOME_UPPER = [50000, 100000, 150000, 200000, 300000, 500000, 999999];
const incomeToNumber = (range) => {
  const i = INCOMES.indexOf(range);
  return i >= 0 ? INCOME_UPPER[i] : 0;
};
const INCOME_LOWER = [0, 50001, 100001, 150001, 200001, 300001, 500001];
const incomeLowerBound = (range) => {
  const i = INCOMES.indexOf(range);
  return i >= 0 ? INCOME_LOWER[i] : undefined;
};
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const MARITAL = ['Single', 'Married', 'Widow / Widower', 'Divorced / Separated'];

const EMPTY = {
  name: '', age: '', gender: '', state: '', district: '', mobile: '',
  occupation: '', income: '', category: '', hasLand: '',
  maritalStatus: '', children: '0', hasBPL: '', hasSmartphone: '',
};
const DRAFT_KEY = 'bs_form_draft_v2';

// Which form fields belong to each step (used by the "Fill demo data" button).
const STEP_FIELDS = [
  ['age', 'gender', 'state', 'district', 'name', 'mobile'],
  ['occupation', 'hasLand', 'income', 'category'],
  ['maritalStatus', 'children', 'hasBPL', 'hasSmartphone'],
];

const STEPS = [
  { title: 'About you', hint: 'Just the basics' },
  { title: 'Work and income', hint: 'This decides most schemes' },
  { title: 'Your family', hint: 'Optional — skip anything you like' },
];

// ───────────────────────── small UI pieces ─────────────────────────
function Field({ label, required, hint, error, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label className="text-[15px] font-semibold text-ink">
          {label}
          {required ? <span className="text-saffron-deep ml-1" aria-hidden="true">*</span> : <span className="ml-2 text-xs font-normal text-ink/45">optional</span>}
        </label>
        {hint && <span className="text-xs text-ink/50 text-right">{hint}</span>}
      </div>
      {children}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

function Chips({ options, value, onChange, cols = 'flex flex-wrap', label }) {
  return (
    <div className={`${cols} gap-2`} role="radiogroup" aria-label={label}>
      {options.map((opt) => {
        const text = typeof opt === 'string' ? opt : opt.label;
        const val = typeof opt === 'string' ? opt : opt.value;
        const on = value === val;
        return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(on ? '' : val)}
            className={`min-h-[44px] px-4 py-2 rounded-lg border text-[15px] text-left transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper
              ${on ? 'bg-ink border-ink text-white font-semibold' : 'bg-white border-paper-line text-ink hover:border-ink/50'}`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

const inputCls = `w-full min-h-[48px] px-4 rounded-lg bg-white border border-paper-line text-[16px] text-ink
  placeholder:text-ink/35 focus:outline-none focus:border-ink focus:ring-2 focus:ring-saffron/60`;

// ───────────────────────── steps ─────────────────────────
function StepAbout({ f, set, errors }) {
  return (
    <>
      <Field label="Your age" required error={errors.age}>
        <input
          type="number" inputMode="numeric" min="1" max="110" className={`${inputCls} max-w-[160px]`}
          placeholder="e.g. 52" value={f.age} onChange={(e) => set({ age: e.target.value })}
        />
      </Field>
      <Field label="Gender" required error={errors.gender}>
        <Chips label="Gender" options={['Female', 'Male', 'Other']} value={f.gender} onChange={(v) => set({ gender: v })} />
      </Field>
      <Field label="State" required error={errors.state}>
        <select className={inputCls} value={f.state} onChange={(e) => set({ state: e.target.value })}>
          <option value="">Choose your state</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="District or town">
          <input className={inputCls} placeholder="e.g. Osmanabad" value={f.district} onChange={(e) => set({ district: e.target.value })} />
        </Field>
        <Field label="Your name" hint="Only to greet you">
          <input className={inputCls} placeholder="e.g. Savitribai" value={f.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
      </div>
      <Field label="Mobile number" hint="Only if you want reminders. No OTP.">
        <div className="flex items-stretch max-w-[320px]">
          <span className="flex items-center px-3 rounded-l-lg border border-r-0 border-paper-line bg-paper text-ink/60 text-[15px]">+91</span>
          <input
            type="tel" inputMode="numeric" maxLength={10} className={`${inputCls} rounded-l-none`} placeholder="10-digit number"
            value={f.mobile} onChange={(e) => set({ mobile: e.target.value.replace(/\D/g, '') })}
          />
        </div>
      </Field>
    </>
  );
}

function StepWork({ f, set, errors }) {
  const isFarmer = /farmer/i.test(f.occupation);
  const inOther = OTHER_JOBS.includes(f.occupation);
  return (
    <>
      <Field label="What work do you do?" required error={errors.occupation}>
        <Chips label="Occupation" options={MAIN_JOBS} value={f.occupation} onChange={(v) => set({ occupation: v, hasLand: /farmer/i.test(v) ? f.hasLand : '' })} />
        <select
          className={`${inputCls} mt-3`} aria-label="Other occupation"
          value={inOther ? f.occupation : ''} onChange={(e) => set({ occupation: e.target.value, hasLand: '' })}
        >
          <option value="">Something else…</option>
          {OTHER_JOBS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>

      {isFarmer && (
        <Field label="Do you own farm land?">
          <Chips label="Owns land" options={['Yes', 'No']} value={f.hasLand} onChange={(v) => set({ hasLand: v })} />
        </Field>
      )}

      <Field label="Family income for one year" required error={errors.income} hint="An estimate is fine">
        <Chips label="Annual income" cols="grid sm:grid-cols-2" options={INCOMES} value={f.income} onChange={(v) => set({ income: v })} />
      </Field>

      <Field label="Social category" hint="Some schemes are only for certain categories">
        <Chips label="Category" options={CATEGORIES} value={f.category} onChange={(v) => set({ category: v })} />
      </Field>
    </>
  );
}

function StepFamily({ f, set }) {
  const kids = Number(f.children) || 0;
  return (
    <>
      <Field label="Marital status">
        <Chips label="Marital status" options={MARITAL} value={f.maritalStatus} onChange={(v) => set({ maritalStatus: v })} />
      </Field>
      <Field label="Children">
        <div className="inline-flex items-center rounded-lg border border-paper-line bg-white">
          <button type="button" aria-label="Fewer children" disabled={kids <= 0} onClick={() => set({ children: String(kids - 1) })}
            className="w-12 h-12 flex items-center justify-center text-ink disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-l-lg"><Minus size={18} /></button>
          <span className="w-12 text-center text-lg font-semibold text-ink" aria-live="polite">{kids}</span>
          <button type="button" aria-label="More children" disabled={kids >= 10} onClick={() => set({ children: String(kids + 1) })}
            className="w-12 h-12 flex items-center justify-center text-ink disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-r-lg"><Plus size={18} /></button>
        </div>
      </Field>
      <Field label="Do you have a BPL / ration card?">
        <Chips label="BPL card" options={['Yes', 'No']} value={f.hasBPL} onChange={(v) => set({ hasBPL: v })} />
      </Field>
      <Field label="Which phone do you use?">
        <Chips
          label="Phone type"
          options={[{ label: 'Smartphone', value: 'Yes - smartphone' }, { label: 'Keypad phone', value: 'No - keypad phone' }]}
          value={f.hasSmartphone} onChange={(v) => set({ hasSmartphone: v })}
        />
      </Field>
    </>
  );
}

// ───────────────────────── page ─────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const { schemes, loading: schemesLoading } = useSchemes();
  const [params] = useSearchParams();
  const demo = params.get('demo') === '1';

  const [form, setForm] = useState(() => {
    try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(DRAFT_KEY))?.form || {}) }; } catch { return EMPTY; }
  });
  const [step, setStep] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY))?.step || 0; } catch { return 0; }
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step })); } catch { /* ignore */ }
  }, [form, step]);

  // Lock page scroll behind the full-screen layer.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const set = (patch) => { setForm((p) => ({ ...p, ...patch })); setErrors({}); };

  // Fills only the fields on the current step from the chosen demo persona, so a presenter can click once per page.
  const [personaKey, setPersonaKey] = useState(PERSONAS[0].key);
  const fillStep = () => {
    const p = PERSONAS.find((x) => x.key === personaKey) || PERSONAS[0];
    const patch = {};
    STEP_FIELDS[step].forEach((k) => { patch[k] = p.profile[k]; });
    set(patch);
  };

  const validate = (s = step) => {
    const e = {};
    if (s === 0) {
      const age = Number(form.age);
      if (!form.age || age < 1 || age > 110) e.age = 'Please enter your age';
      if (!form.gender) e.gender = 'Please choose one';
      if (!form.state) e.state = 'Please choose your state';
    }
    if (s === 1) {
      if (!form.occupation) e.occupation = 'Please choose your work';
      if (!form.income) e.income = 'Please choose an income range';
    }
    if (form.mobile && form.mobile.length !== 10 && s === 0) e.mobile = 'Mobile number should have 10 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };

  // Results come from the local rules immediately; the AI summary and database save happen afterwards.
  const finish = (data) => {
    if (!schemes.length) {
      setErrors({ submit: schemesLoading ? 'Still loading the scheme list, please try again in a moment.' : 'Could not load the scheme list. Check your connection and that the backend is running.' });
      return;
    }
    setBusy(true);
    const profile = {
      ...data, name: data.name.trim() || 'Friend',
      annualIncome: incomeToNumber(data.income), annualIncomeMin: incomeLowerBound(data.income),
    };
    const all = matchSchemesForUser(profile, schemes);
    saveUser(profile, all, null);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }

    const API_URL = (import.meta.env.VITE_API_URL || 'https://bharatsahayak.onrender.com').replace(/\/api\/?$/, '');
    axios
      .post(`${API_URL}/api/ai-recommend`, { profile, matchedSchemes: all.filter((s) => s.isMatched) }, { timeout: 25000 })
      .then((res) => saveUser(profile, all, res.data))
      .catch((err) => console.warn('AI summary skipped:', err?.message));

    navigate('/dashboard');
  };

  const submit = () => { if (validate()) finish(form); };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink font-sans">
      {/* tricolour rule */}
      <div className="h-1.5 flex" aria-hidden="true">
        <span className="flex-1 bg-saffron" /><span className="flex-1 bg-white" /><span className="flex-1 bg-india" />
      </div>

      <div className="min-h-[calc(100%-6px)] lg:grid lg:grid-cols-[minmax(320px,0.9fr)_1.4fr]">
        {/* left: why / reassurance */}
        <aside className="bg-ink text-white px-6 py-8 lg:px-12 lg:py-14 lg:sticky lg:top-0 lg:h-[calc(100vh-6px)] flex flex-col">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">
            <ArrowLeft size={16} /> BharatSahayak
          </Link>
          <div className="mt-8 lg:mt-auto lg:mb-auto">
            <h1 className="font-display text-[32px] leading-[1.15] lg:text-[44px] font-semibold">
              Find the benefits you are already owed.
            </h1>
            <p className="mt-4 text-white/70 text-[16px] leading-relaxed max-w-md">
              Answer a few simple questions. We check them against government schemes and show you what you can apply for.
            </p>
            <ul className="mt-8 hidden sm:block space-y-3 text-[15px] text-white/85">
              {['Only 5 answers are required', 'No Aadhaar number, no OTP, no password', 'Free, in Hindi, Marathi and English'].map((t) => (
                <li key={t} className="flex items-start gap-3"><Check size={18} className="mt-0.5 text-saffron shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <p className="hidden lg:flex items-center gap-2 text-xs text-white/50 mt-8"><ShieldCheck size={14} /> Your answers stay on your device until you ask for reminders.</p>
        </aside>

        {/* right: wizard */}
        <main className="px-5 py-8 sm:px-10 lg:px-16 lg:py-14 pb-28">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between text-sm text-ink/60 mb-2">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{STEPS[step].hint}</span>
            </div>
            <div className="h-1.5 rounded-full bg-paper-line overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <div className="h-full bg-saffron transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <h2 className="font-display text-[28px] font-semibold mt-5 mb-4">{STEPS[step].title}</h2>

            <div className="mb-7 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-saffron-deep/60 bg-saffron/10 px-3 py-2">
              <button type="button" onClick={fillStep}
                className="min-h-[40px] px-4 rounded-lg bg-ink text-white text-sm font-semibold hover:bg-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
                Fill demo data
              </button>
              <span className="text-xs text-ink/60">as</span>
              {PERSONAS.map((p) => (
                <button key={p.key} type="button" title={p.blurb} onClick={() => setPersonaKey(p.key)}
                  aria-pressed={personaKey === p.key}
                  className={`min-h-[32px] px-3 rounded-full text-xs font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                    ${personaKey === p.key ? 'bg-saffron border-saffron text-ink' : 'bg-white border-paper-line text-ink/70 hover:border-ink/40'}`}>
                  {p.label}
                </button>
              ))}
            </div>

            {step === 0 && <StepAbout f={form} set={set} errors={errors} />}
            {step === 1 && <StepWork f={form} set={set} errors={errors} />}
            {step === 2 && <StepFamily f={form} set={set} />}
            {errors.mobile && <p role="alert" className="-mt-3 mb-4 text-sm font-medium text-red-700">{errors.mobile}</p>}
            {errors.submit && <p role="alert" className="mb-4 text-sm font-medium text-red-700">{errors.submit}</p>}

            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={back}
                  className="min-h-[48px] px-5 rounded-lg border border-paper-line bg-white text-ink font-medium inline-flex items-center gap-2 hover:border-ink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button type="button" onClick={last ? submit : next} disabled={busy}
                className="min-h-[48px] px-7 rounded-lg bg-saffron text-ink font-semibold inline-flex items-center gap-2 hover:brightness-95 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                {busy ? <><Loader2 size={16} className="animate-spin" /> Finding schemes…</> : last ? <>See my benefits <ArrowRight size={16} /></> : <>Continue <ArrowRight size={16} /></>}
              </button>
              {last && !busy && <span className="text-sm text-ink/50 hidden sm:inline">You can skip these</span>}
            </div>

            <p className="mt-10 text-xs text-ink/50 flex items-center gap-2"><Phone size={13} /> Prefer a call or WhatsApp? Those work too — no form needed.</p>
          </div>
        </main>
      </div>

      {/* demo dock: only with ?demo=1 */}
      {demo && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-ink text-white rounded-xl shadow-lg px-3 py-2 flex flex-wrap items-center gap-2 max-w-[95vw]">
          <span className="text-xs uppercase tracking-wider text-white/60 px-1">Demo</span>
          {PERSONAS.map((p) => (
            <button key={p.key} type="button" title={p.blurb}
              onClick={() => { setForm({ ...EMPTY, ...p.profile }); finish({ ...EMPTY, ...p.profile }); }}
              className="min-h-[36px] px-3 rounded-lg bg-white/10 hover:bg-saffron hover:text-ink text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
              {p.label}
            </button>
          ))}
          <button type="button" onClick={() => { setForm(EMPTY); setStep(0); setErrors({}); try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } }}
            className="min-h-[36px] px-3 rounded-lg border border-white/30 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
