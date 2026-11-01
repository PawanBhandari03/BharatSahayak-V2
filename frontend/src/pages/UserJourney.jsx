import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Volume2, VolumeX } from 'lucide-react';
import WhatsAppDemo from '../components/WhatsAppDemo';
import { VerticalTimeline } from '../components/Timeline';
import toast from 'react-hot-toast';
import { useSchemes } from '../context/SchemesContext';
import { translate } from '../i18n/journey';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// What the simulated call says, in each site language. Spoken with the browser's own speech voice.
const SCRIPTS = {
  en: 'Hello! I am BharatSahayak AI. I have found 9 government schemes for Savitribai Patil. First, the Widow Pension scheme: you may receive 1,500 rupees every month. Second, PM-KISAN: farming families receive 6,000 rupees a year in three instalments. Third, MahaDBT: Maharashtra farmers get a subsidy on farm equipment. Would you like the full list of documents on WhatsApp?',
  hi: 'नमस्ते! मैं भारतसहायक AI हूँ। सावित्रीबाई पाटिल जी के लिए मैं 9 सरकारी योजनाओं की जानकारी लेकर आया हूँ। सबसे पहले, विधवा पेंशन योजना। आपको हर महीने पंद्रह सौ रुपये मिल सकते हैं। दूसरी योजना, पीएम किसान सम्मान निधि। किसान परिवारों को हर साल छह हज़ार रुपये, तीन किस्तों में मिलते हैं। तीसरी योजना, महाडीबीटी, जिसमें महाराष्ट्र के किसानों को कृषि उपकरणों पर अनुदान मिलता है। क्या आप चाहेंगी कि मैं दस्तावेज़ों की पूरी सूची व्हाट्सऐप पर भेजूँ?',
  mr: 'नमस्कार! मी भारतसहाय्यक AI आहे. सावित्रीबाई पाटील यांच्यासाठी मी 9 सरकारी योजनांची माहिती घेऊन आलो आहे. सर्वात आधी, विधवा निवृत्तीवेतन योजना. तुम्हाला दर महिन्याला पंधराशे रुपये मिळू शकतात. दुसरी योजना, पीएम किसान सन्मान निधी. शेतकरी कुटुंबांना दरवर्षी सहा हजार रुपये, तीन हप्त्यांमध्ये मिळतात. तिसरी योजना, महाडीबीटी, ज्यात महाराष्ट्रातील शेतकऱ्यांना शेती उपकरणांसाठी अनुदान मिळते. तुम्हाला कागदपत्रांची संपूर्ण यादी व्हॉट्सॲपवर पाठवू का?',
};
const SPEECH_LANG = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

const toastStyle = { background: '#FFFFFF', color: '#1B1740', border: '1px solid #138808' };

// Browsers load their voice list late, so wait for it (up to 1.5 s) before choosing a voice.
const loadVoices = () => new Promise((resolve) => {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) { resolve(now); return; }
  const done = () => resolve(synth.getVoices());
  synth.addEventListener('voiceschanged', done, { once: true });
  setTimeout(done, 1500);
});

function VoiceCallSimulator() {
  const { language } = useSchemes();
  const t = (x) => translate(language, x);
  const script = SCRIPTS[language] || SCRIPTS.en;

  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [notice, setNotice] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const run = useRef(0); // bumps on every start/stop so stale speech callbacks are ignored
  const timer = useRef(null);

  const stop = () => {
    run.current += 1;
    clearInterval(timer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  // Stop speaking if the page is left or the language is switched mid-call.
  useEffect(() => stop, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickVoice = (voices, code) => {
    const base = code.slice(0, 2);
    // Marathi voices are rare; a Hindi voice reads Devanagari well enough.
    return voices.find((v) => v.lang.replace('_', '-').startsWith(code))
      || voices.find((v) => v.lang.startsWith(base))
      || (base === 'mr' ? voices.find((v) => v.lang.startsWith('hi')) : null);
  };

  const startCall = async () => {
    stop();
    const id = run.current;
    setDone(false);
    setProgress(0);
    setSeconds(0);
    setNotice('');
    setVoiceName('');
    setPlaying(true);
    toast.success(t('📞 Starting the voice demo...'), { style: toastStyle });

    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);

    if (!('speechSynthesis' in window)) {
      setNotice(t('No voice for this language was found on this device. Open this page in Microsoft Edge or Chrome to hear it.'));
      return;
    }

    const voices = await loadVoices();
    if (id !== run.current) return;
    const code = SPEECH_LANG[language] || 'en-IN';
    const voice = pickVoice(voices, code);
    if (voice) setVoiceName(voice.name);
    else if (language !== 'en') {
      setNotice(t('No voice for this language was found on this device. Open this page in Microsoft Edge or Chrome to hear it.'));
    }

    // Long utterances get cut off in some browsers, so speak one sentence at a time.
    const sentences = script.match(/[^।.?!]+[।.?!]?/g).map((x) => x.trim()).filter(Boolean);
    const total = sentences.reduce((n, x) => n + x.length, 0);
    let spoken = 0;

    const finish = () => {
      clearInterval(timer.current);
      setPlaying(false);
      setDone(true);
      setProgress(100);
    };

    const next = (i) => {
      if (id !== run.current) return;
      if (i >= sentences.length) { finish(); toast.success(t('✅ Simulation finished.'), { style: toastStyle }); return; }
      const u = new SpeechSynthesisUtterance(sentences[i]);
      u.lang = code;
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.onend = () => { spoken += sentences[i].length; setProgress(Math.round((spoken / total) * 100)); next(i + 1); };
      u.onerror = (e) => {
        if (id !== run.current || e.error === 'interrupted' || e.error === 'canceled') return;
        // The device cannot speak this language: stop and say so instead of pretending the call finished.
        setNotice(t('No voice for this language was found on this device. Open this page in Microsoft Edge or Chrome to hear it.'));
        stop();
      };
      window.speechSynthesis.speak(u);
    };
    next(0);
  };

  const mm = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8DFCF' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border" style={{ background: '#F5EFE3' }}>
        <h3 className="text-ink font-bold flex items-center gap-2">
          <Phone size={18} className="text-secondary" />
          {t('Voice Call Simulator')}
        </h3>
        <p className="text-ink/60 text-xs mt-0.5">{t('A demo of how an AI voice call would sound (simulation only)')}</p>
      </div>

      <div className="p-6">
        <div
          className="rounded-2xl p-6 text-center mb-6"
          style={{ background: playing ? 'rgba(19, 136, 8, 0.1)' : '#FBF7F0', border: '1px solid ' + (playing ? 'rgba(19, 136, 8, 0.3)' : '#E8DFCF') }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center text-3xl mx-auto mb-3">
            🤖
          </div>
          <div className="text-ink font-bold mb-0.5">BharatSahayak AI</div>
          <div className={`text-sm ${playing || done ? 'text-secondary' : 'text-ink/60'}`}>
            {playing ? t('● Calling Savitribai...') : done ? t('✓ Call Ended') : t('AI Voice Bot — Hindi/Marathi')}
          </div>

          {(playing || done) && (
            <div className="mt-4 mb-2">
              <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ background: '#138808', width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-ink/50 mt-1">
                <span>{mm}</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {playing && (
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: '#138808' }}
                  animate={{ height: [4, 16, 4] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* What the voice says */}
        <div
          className="rounded-xl p-4 mb-5 text-xs leading-relaxed hindi text-ink/75 max-h-32 overflow-y-auto scrollbar-hide"
          style={{ background: '#FFFFFF', border: '1px solid #E8DFCF' }}
        >
          {script}
        </div>

        {playing ? (
          <button
            onClick={stop}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #C2610A, #E07B1F)' }}
          >
            <VolumeX size={20} />
            {t('Stop')}
          </button>
        ) : (
          <button
            onClick={startCall}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #138808, #1E9E12)' }}
          >
            <Volume2 size={20} />
            {t('Play voice demo')}
          </button>
        )}

        {voiceName && !notice && <p className="text-ink/45 text-xs mt-3 text-center">{voiceName}</p>}
        {notice && (
          <p className="mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed" style={{ background: 'rgba(194, 97, 10, 0.08)', color: '#7A3E06', border: '1px solid rgba(194, 97, 10, 0.3)' }}>
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}

export default function UserJourney() {
  const [activeStep, setActiveStep] = useState(-1);
  const { language } = useSchemes();
  const t = (x) => translate(language, x);

  const handleStepActivate = (step) => {
    setActiveStep(step);
  };

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
        <div className="text-center mb-16">
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {t('Self-Serve — No CSC Needed')}
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-black text-ink mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {language === 'hi' ? (<><span className="gradient-text-primary">वेबसाइट</span> से{' '}
            <span className="gradient-text-secondary">₹1,37,000</span> के लाभ तक</>)
              : language === 'mr' ? (<><span className="gradient-text-primary">वेबसाइट</span> पासून{' '}
            <span className="gradient-text-secondary">₹1,37,000</span> च्या लाभांपर्यंत</>)
              : (<>From <span className="gradient-text-primary">Website</span> to{' '}
            <span className="gradient-text-secondary">₹1,37,000</span> in Benefits</>)}
          </motion.h1>
          <motion.p
            className="text-ink/65 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('No CSC visit. No middleman. Open the website → fill a 2-minute form → AI finds all your government benefits, and you can keep chatting on WhatsApp.')}
          </motion.p>
        </div>

        {/* Step activators */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setActiveStep(-1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${activeStep === -1 ? 'border-ink/30 text-ink bg-ink/10' : 'border-dark-border text-ink/60 hover:text-ink'}`}
          >
            {t('Reset')}
          </button>
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              onClick={() => setActiveStep(i - 1)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${
                activeStep >= i - 1
                  ? 'border-primary bg-primary/20 text-ink'
                  : 'border-dark-border text-ink/60 hover:text-ink'
              }`}
            >
              {i}
            </button>
          ))}
          <button
            onClick={() => setActiveStep(4)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-secondary/40 text-secondary bg-secondary/10 hover:bg-secondary/20"
          >
            {t('Complete Journey')}
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Vertical timeline */}
          <div>
            <VerticalTimeline activeStep={activeStep} />
          </div>

          {/* Right: Simulators */}
          <div className="space-y-8 lg:sticky lg:top-28">
            {/* WhatsApp simulator */}
            <div>
              <h3 className="text-ink font-bold text-lg mb-4 flex items-center gap-2">
                💬 {t('WhatsApp Chat Simulator')}
                <span className="badge bg-secondary/15 text-secondary text-xs">{t('Interactive')}</span>
              </h3>
              <WhatsAppDemo interactive={true} />
              <p className="text-ink/50 text-xs mt-2 text-center">
                {t('Try typing: "kisan", "pension", "help", "schemes", or your own query')}
              </p>
            </div>

            {/* Voice call simulator */}
            <VoiceCallSimulator />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
