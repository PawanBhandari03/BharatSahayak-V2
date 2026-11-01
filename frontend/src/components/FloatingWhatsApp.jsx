import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

// Always-visible shortcut: jumps to the WhatsApp QR section on the home page.
export default function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === '/register') return null;

  const go = () => {
    const scroll = () => document.getElementById('whatsapp')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (pathname === '/') scroll();
    else { navigate('/'); setTimeout(scroll, 700); }
  };

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Chat on WhatsApp: scan the QR code"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg
        hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
    >
      <MessageCircle size={20} aria-hidden="true" />
      <span className="hidden sm:inline">Try on WhatsApp</span>
    </button>
  );
}
