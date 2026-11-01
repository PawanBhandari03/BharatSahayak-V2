// Display translations for the Schemes page. Filter VALUES stay in English; only the shown text changes.
import { translate as translateCards } from './cards';

const D = {
  'All Schemes': ['सभी योजनाएं', 'सर्व योजना'],
  'For You ✨': ['आपके लिए ✨', 'तुमच्यासाठी ✨'],
  'For You': ['आपके लिए', 'तुमच्यासाठी'],
  'All India': ['पूरा भारत', 'संपूर्ण भारत'],
  'J&K / Ladakh': ['जम्मू-कश्मीर / लद्दाख', 'जम्मू-काश्मीर / लडाख'],
  'Any Age': ['कोई भी उम्र', 'कोणतेही वय'],
  'Any Income': ['कोई भी आय', 'कोणतेही उत्पन्न'],
  'Up to ₹1L': ['₹1 लाख तक', '₹1 लाखांपर्यंत'],
  '₹1L-₹2L': ['₹1-2 लाख', '₹1-2 लाख'],
  '₹2L-₹5L': ['₹2-5 लाख', '₹2-5 लाख'],
  '₹5L+': ['₹5 लाख+', '₹5 लाख+'],
  Any: ['कोई भी', 'कोणतेही'],
  Farmer: ['किसान', 'शेतकरी'],
  Business: ['व्यवसाय', 'व्यवसाय'],
  Labor: ['मज़दूर', 'मजूर'],
  Widow: ['विधवा', 'विधवा'],
  'Senior Citizen': ['वरिष्ठ नागरिक', 'ज्येष्ठ नागरिक'],
  'Age Group': ['आयु वर्ग', 'वयोगट'],
  Income: ['आय', 'उत्पन्न'],
  Occupation: ['पेशा', 'व्यवसाय'],
  Schemes: ['योजनाएं', 'योजना'],
  'Explore Government': ['सरकारी', 'सरकारी'],
  'Schemes (heading)': ['योजनाएं खोजें', 'योजना शोधा'],
  'Find the schemes you qualify for — search by keyword, category, state, age, or income.': ['जिन योजनाओं के आप पात्र हैं उन्हें खोजें — कीवर्ड, श्रेणी, राज्य, उम्र या आय से।', 'तुम्ही पात्र असलेल्या योजना शोधा — कीवर्ड, प्रवर्ग, राज्य, वय किंवा उत्पन्नानुसार.'],
  "Search schemes by name, category... (e.g. 'kisan', 'widow', 'health')": ["योजना का नाम या श्रेणी खोजें... (जैसे 'किसान', 'विधवा', 'स्वास्थ्य')", "योजनेचे नाव किंवा प्रवर्ग शोधा... (उदा. 'शेतकरी', 'विधवा', 'आरोग्य')"],
  'Voice search': ['आवाज़ से खोजें', 'आवाजाने शोधा'],
  'Clear Filters': ['फ़िल्टर हटाएं', 'फिल्टर हटवा'],
  'Clear all filters': ['सभी फ़िल्टर हटाएं', 'सर्व फिल्टर हटवा'],
  'Please register first to see personalized schemes!': ['अपने लिए योजनाएं देखने के लिए पहले रजिस्टर करें!', 'तुमच्यासाठी योजना पाहण्यासाठी आधी नोंदणी करा!'],
  '🎙 Voice search coming soon! Type your query in Hindi or English.': ['🎙 आवाज़ से खोज जल्द आ रही है! अपना सवाल हिंदी या अंग्रेज़ी में लिखें।', '🎙 आवाजाने शोध लवकरच येत आहे! तुमचा प्रश्न हिंदी किंवा इंग्रजीत लिहा.'],
  'Loading...': ['लोड हो रहा है...', 'लोड होत आहे...'],
  'No schemes found': ['कोई योजना नहीं मिली', 'योजना सापडल्या नाहीत'],
  'Try different keywords or remove filters.': ['अलग शब्द आज़माएं या फ़िल्टर हटाएं।', 'वेगळे शब्द वापरून पहा किंवा फिल्टर हटवा.'],
  'No results for': ['इसके लिए कोई परिणाम नहीं:', 'यासाठी निकाल नाहीत:'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return translateCards(lang, text);
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}

export function schemesFound(lang, n) {
  if (lang === 'hi') return `${n} योजनाएं मिलीं`;
  if (lang === 'mr') return `${n} योजना सापडल्या`;
  return `${n} scheme${n !== 1 ? 's' : ''} found`;
}

export function forYouLabel(lang, n) {
  if (lang === 'hi') return `आपके लिए (${n}) ✨`;
  if (lang === 'mr') return `तुमच्यासाठी (${n}) ✨`;
  return `For You (${n}) ✨`;
}
