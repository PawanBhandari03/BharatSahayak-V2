// Display translations for the Journey page. Anything missing falls back to English.
import { translate as translateSections } from './sections';

const D = {
  'Self-Serve — No CSC Needed': ['खुद करें — CSC की ज़रूरत नहीं', 'स्वतः करा — CSC ची गरज नाही'],
  'No CSC visit. No middleman. Open the website → fill a 2-minute form → AI finds all your government benefits, and you can keep chatting on WhatsApp.': [
    'न CSC जाना, न कोई बिचौलिया। वेबसाइट खोलें → 2 मिनट का फ़ॉर्म भरें → AI आपके सारे सरकारी लाभ ढूंढता है, और आप WhatsApp पर बात जारी रख सकते हैं।',
    'CSC ला जाण्याची गरज नाही, मध्यस्थ नाही. वेबसाइट उघडा → 2 मिनिटांचा फॉर्म भरा → AI तुमचे सर्व सरकारी लाभ शोधतो, आणि तुम्ही WhatsApp वर गप्पा सुरू ठेवू शकता.'],
  Reset: ['रीसेट', 'रीसेट'],
  'Complete Journey': ['पूरी यात्रा', 'पूर्ण प्रवास'],
  'WhatsApp Chat Simulator': ['WhatsApp चैट सिम्युलेटर', 'WhatsApp चॅट सिम्युलेटर'],
  Interactive: ['इंटरैक्टिव', 'परस्परसंवादी'],
  'Try typing: "kisan", "pension", "help", "schemes", or your own query': ['लिखकर देखें: "kisan", "pension", "help", "schemes" या अपना सवाल', 'लिहून पहा: "kisan", "pension", "help", "schemes" किंवा तुमचा प्रश्न'],
  'Voice Call Simulator': ['वॉइस कॉल सिम्युलेटर', 'व्हॉइस कॉल सिम्युलेटर'],
  'A demo of how an AI voice call would sound (simulation only)': ['AI वॉइस कॉल कैसी सुनाई देगी इसका डेमो (केवल सिमुलेशन)', 'AI व्हॉइस कॉल कसा ऐकू येईल याचा डेमो (फक्त सिम्युलेशन)'],
  'AI Voice Bot — Hindi/Marathi': ['AI वॉइस बॉट — हिंदी/मराठी', 'AI व्हॉइस बॉट — हिंदी/मराठी'],
  '● Calling Savitribai...': ['● सावित्रीबाई को कॉल हो रहा है...', '● सावित्रीबाईंना कॉल होत आहे...'],
  '✓ Call Ended': ['✓ कॉल समाप्त', '✓ कॉल संपला'],
  'Playing AI Voice Call...': ['AI वॉइस कॉल चल रही है...', 'AI व्हॉइस कॉल सुरू आहे...'],
  'Simulate AI Voice Call (Hindi)': ['AI वॉइस कॉल सिमुलेट करें (हिंदी)', 'AI व्हॉइस कॉल सिम्युलेट करा (हिंदी)'],
  '📞 Simulating AI voice call in Hindi...': ['📞 हिंदी में AI वॉइस कॉल का सिमुलेशन...', '📞 हिंदीत AI व्हॉइस कॉलचे सिम्युलेशन...'],
  '📞 Starting the voice demo...': ['📞 वॉइस डेमो शुरू हो रहा है...', '📞 व्हॉइस डेमो सुरू होत आहे...'],
  'Your browser cannot speak, so only the text is shown.': ['आपका ब्राउज़र बोल नहीं सकता, इसलिए केवल टेक्स्ट दिख रहा है।', 'तुमचा ब्राउझर बोलू शकत नाही, म्हणून फक्त मजकूर दाखवला आहे.'],
  'No voice for this language was found on this device. Open this page in Microsoft Edge or Chrome to hear it.': ['इस डिवाइस पर इस भाषा की आवाज़ नहीं मिली। सुनने के लिए इस पेज को Microsoft Edge या Chrome में खोलें।', 'या डिव्हाइसवर या भाषेचा आवाज सापडला नाही. ऐकण्यासाठी हे पेज Microsoft Edge किंवा Chrome मध्ये उघडा.'],
  Stop: ['रोकें', 'थांबवा'],
  'Play voice demo': ['वॉइस डेमो चलाएं', 'व्हॉइस डेमो वाजवा'],
  '✅ Simulation finished.': ['✅ सिमुलेशन पूरा हुआ।', '✅ सिम्युलेशन पूर्ण झाले.'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return translateSections(lang, text);
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}
