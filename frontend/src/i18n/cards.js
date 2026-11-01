// Display translations for the scheme card and the benefit wallet. Anything missing falls back to English.
import { translate as translateForm } from './register';

const D = {
  // categories and benefit types shown on cards and in the Schemes filters
  All: ['सभी', 'सर्व'],
  Agriculture: ['कृषि', 'शेती'],
  Health: ['स्वास्थ्य', 'आरोग्य'],
  Energy: ['ऊर्जा', 'ऊर्जा'],
  Housing: ['आवास', 'गृहनिर्माण'],
  Insurance: ['बीमा', 'विमा'],
  Pension: ['पेंशन', 'निवृत्तीवेतन'],
  'Social Welfare': ['सामाजिक कल्याण', 'सामाजिक कल्याण'],
  Entrepreneurship: ['उद्यमिता', 'उद्योजकता'],
  'Skill Development': ['कौशल विकास', 'कौशल्य विकास'],
  Education: ['शिक्षा', 'शिक्षण'],
  'Women & Child': ['महिला एवं बाल', 'महिला व बाल'],
  'One-time': ['एक बार', 'एकदा'],
  'Per month': ['प्रति माह', 'दरमहा'],
  'Per year': ['प्रति वर्ष', 'दरवर्षी'],
  'Per cylinder': ['प्रति सिलेंडर', 'प्रति सिलिंडर'],
  Central: ['केंद्रीय', 'केंद्रीय'],
  'Government of India': ['भारत सरकार', 'भारत सरकार'],

  // scheme card
  'Check portal for dates': ['तारीख़ों के लिए पोर्टल देखें', 'तारखांसाठी पोर्टल पहा'],
  'Enrollment window closed': ['नामांकन की अवधि समाप्त', 'नोंदणीची मुदत संपली'],
  'days left': ['दिन बाकी', 'दिवस शिल्लक'],
  'Possible — check details': ['संभव — विवरण जांचें', 'शक्य — तपशील तपासा'],
  'Fits your answers': ['आपके जवाबों से मेल खाती है', 'तुमच्या उत्तरांशी जुळते'],
  docs: ['दस्तावेज़', 'कागदपत्रे'],
  'Cr beneficiaries': ['करोड़ लाभार्थी', 'कोटी लाभार्थी'],
  'Helpline:': ['हेल्पलाइन:', 'हेल्पलाइन:'],
  'Status:': ['स्थिति:', 'स्थिती:'],
  Applied: ['आवेदन किया', 'अर्ज केला'],
  Receiving: ['लाभ मिल रहा है', 'लाभ मिळत आहे'],
  'Why / why not': ['क्यों / क्यों नहीं', 'का / का नाही'],
  'Apply Now': ['अभी आवेदन करें', 'आता अर्ज करा'],
  'Possibly eligible. Tell us:': ['शायद पात्र हैं। हमें बताएं:', 'कदाचित पात्र आहात. आम्हाला सांगा:'],
  'You fit the rules': ['आप नियमों में फ़िट हैं', 'तुम्ही नियमांत बसता'],
  'documents needed': ['दस्तावेज़ चाहिए', 'कागदपत्रे आवश्यक'],
  'Not eligible with the details you entered.': ['आपके दिए विवरण के अनुसार पात्र नहीं।', 'तुम्ही दिलेल्या माहितीनुसार पात्र नाही.'],
  'Opening official portal:': ['आधिकारिक पोर्टल खुल रहा है:', 'अधिकृत पोर्टल उघडत आहे:'],
  // wallet
  'Benefit Wallet': ['लाभ वॉलेट', 'लाभ वॉलेट'],
  'matched for your profile': ['आपकी प्रोफ़ाइल के लिए मिलीं', 'तुमच्या प्रोफाइलसाठी जुळल्या'],
  'Register to see your matched schemes': ['अपनी मिली योजनाएं देखने के लिए रजिस्टर करें', 'जुळलेल्या योजना पाहण्यासाठी नोंदणी करा'],
  'Still to claim': ['अभी पाना बाकी', 'अजून मिळवायचे'],
  'No schemes matched yet.': ['अभी तक कोई योजना नहीं मिली।', 'अजून कोणतीही योजना जुळली नाही.'],
  'Register with your details to see your benefit wallet.': ['अपना लाभ वॉलेट देखने के लिए अपनी जानकारी के साथ रजिस्टर करें।', 'तुमचे लाभ वॉलेट पाहण्यासाठी तुमच्या माहितीसह नोंदणी करा.'],
  Received: ['प्राप्त', 'मिळाले'],
  Available: ['उपलब्ध', 'उपलब्ध'],
  Pending: ['लंबित', 'प्रलंबित'],
  Future: ['भविष्य', 'भविष्यात'],
  scheme: ['योजना', 'योजना'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return translateForm(lang, text);
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}

// "Government of Maharashtra" -> "महाराष्ट्र सरकार" / "Government of India" is in the dictionary.
export function translateDepartment(lang, dept) {
  if (!dept || lang === 'en') return dept;
  const m = /^Government of (.+)$/.exec(dept);
  if (!m || m[1] === 'India') return translate(lang, dept);
  return `${translateForm(lang, m[1])} सरकार`;
}
