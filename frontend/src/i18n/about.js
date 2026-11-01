// Display translations for the About page. Anything missing falls back to English.
import { translate as translateSections } from './sections';

const D = {
  'Building AI for': ['AI बना रहे हैं', 'AI तयार करत आहोत'],
  "Bharat's Bottom Billion": ['भारत के सबसे वंचित लोगों के लिए', 'भारताच्या सर्वाधिक वंचित लोकांसाठी'],
  "We're two engineers who believe technology should solve real problems — not just for those with smartphones, but for every Indian citizen.": [
    'हम दो इंजीनियर हैं जो मानते हैं कि तकनीक को असली समस्याएं सुलझानी चाहिए — सिर्फ़ स्मार्टफ़ोन वालों के लिए नहीं, बल्कि हर भारतीय नागरिक के लिए।',
    'आम्ही दोन इंजिनिअर आहोत ज्यांचा विश्वास आहे की तंत्रज्ञानाने खऱ्या समस्या सोडवाव्यात — फक्त स्मार्टफोन असलेल्यांसाठी नव्हे, तर प्रत्येक भारतीय नागरिकासाठी.'],
  'Meet the Team': ['टीम से मिलें', 'टीमला भेटा'],
  'Two builders. One mission. Zero compromises.': ['दो निर्माता। एक मिशन। कोई समझौता नहीं।', 'दोन निर्माते. एक ध्येय. तडजोड शून्य.'],
  'Full-Stack + Cloud (AWS)': ['फ़ुल-स्टैक + क्लाउड (AWS)', 'फुल-स्टॅक + क्लाउड (AWS)'],
  'Backend + Messaging': ['बैकएंड + मैसेजिंग', 'बॅकएंड + मेसेजिंग'],
  'Built the React frontend and the Node.js backend, set up the Supabase database, and deployed the project on AWS.': ['React फ़्रंटएंड और Node.js बैकएंड बनाया, Supabase डेटाबेस सेट किया और प्रोजेक्ट को AWS पर डिप्लॉय किया।', 'React फ्रंटएंड आणि Node.js बॅकएंड तयार केले, Supabase डेटाबेस सेट केला आणि प्रोजेक्ट AWS वर डिप्लॉय केला.'],
  'Built the Twilio WhatsApp integration and the scheme data pipeline, and helped with the backend and frontend.': ['Twilio WhatsApp इंटीग्रेशन और योजना डेटा पाइपलाइन बनाई, तथा बैकएंड और फ़्रंटएंड में मदद की।', 'Twilio WhatsApp इंटिग्रेशन आणि योजना डेटा पाइपलाइन तयार केली, तसेच बॅकएंड आणि फ्रंटएंडमध्ये मदत केली.'],
  'Data pipeline': ['डेटा पाइपलाइन', 'डेटा पाइपलाइन'],
  Deployment: ['डिप्लॉयमेंट', 'डिप्लॉयमेंट'],
  WhatsApp: ['WhatsApp', 'WhatsApp'],
  'The Problem': ['समस्या', 'समस्या'],
  "India's Biggest": ['भारत की सबसे बड़ी', 'भारतातील सर्वात मोठे'],
  'Welfare Failure': ['कल्याण विफलता', 'कल्याण अपयश'],
  'The Indian government spends ₹15+ lakh crore annually on welfare. Yet, less than 5% of eligible citizens know about all the schemes they qualify for.': [
    'भारत सरकार हर साल कल्याण पर ₹15+ लाख करोड़ खर्च करती है। फिर भी 5% से कम पात्र नागरिकों को उन सभी योजनाओं की जानकारी है जिनके वे पात्र हैं।',
    'भारत सरकार दरवर्षी कल्याणावर ₹15+ लाख कोटी खर्च करते. तरीही 5% पेक्षा कमी पात्र नागरिकांना त्यांच्यासाठी असलेल्या सर्व योजनांची माहिती आहे.'],
  'Unclaimed annually': ['सालाना बिना दावे के', 'वार्षिक दावा न केलेले'],
  'Eligible Indians': ['पात्र भारतीय', 'पात्र भारतीय'],
  'Awareness rate': ['जागरूकता दर', 'जागरूकता दर'],
  'Avg per person': ['प्रति व्यक्ति औसत', 'प्रति व्यक्ती सरासरी'],
  'Discovery Problem': ['खोज की समस्या', 'शोधाची समस्या'],
  'Schemes are buried in government portals — no single discovery engine exists.': ['योजनाएं सरकारी पोर्टलों में दबी हैं — कोई एक खोज इंजन मौजूद नहीं।', 'योजना सरकारी पोर्टलमध्ये दडलेल्या आहेत — एकही शोध इंजिन अस्तित्वात नाही.'],
  'Access Problem': ['पहुंच की समस्या', 'पोहोचण्याची समस्या'],
  "67% of rural India has no smartphone. Applications require internet they don't have.": ['ग्रामीण भारत के 67% के पास स्मार्टफ़ोन नहीं है। आवेदन के लिए इंटरनेट चाहिए जो उनके पास नहीं।', 'ग्रामीण भारतातील 67% लोकांकडे स्मार्टफोन नाही. अर्जासाठी इंटरनेट लागते जे त्यांच्याकडे नाही.'],
  'Language Problem': ['भाषा की समस्या', 'भाषेची समस्या'],
  'Most scheme information is in English or urban Hindi — inaccessible to local dialects.': ['ज़्यादातर योजना जानकारी अंग्रेज़ी या शहरी हिंदी में है — स्थानीय बोलियों वालों की पहुंच से बाहर।', 'बहुतेक योजना माहिती इंग्रजी किंवा शहरी हिंदीत आहे — स्थानिक बोलींच्या लोकांच्या आवाक्याबाहेर.'],
  Our: ['हमारा', 'आमचा'],
  'Tech Stack': ['टेक स्टैक', 'टेक स्टॅक'],
  Frontend: ['फ़्रंटएंड', 'फ्रंटएंड'],
  Backend: ['बैकएंड', 'बॅकएंड'],
  Database: ['डेटाबेस', 'डेटाबेस'],
  Messaging: ['मैसेजिंग', 'मेसेजिंग'],
  'AI Engine': ['AI इंजन', 'AI इंजिन'],
  Voice: ['वॉइस', 'व्हॉइस'],
  'Our Mission': ['हमारा मिशन', 'आमचे ध्येय'],
  "We believe every Indian citizen deserves to access every benefit they're entitled to — regardless of education, language, or internet access. BharatSahayak is our answer.": [
    'हमारा मानना है कि हर भारतीय नागरिक को उन सभी लाभों तक पहुंच मिलनी चाहिए जिनके वे हक़दार हैं — चाहे शिक्षा, भाषा या इंटरनेट पहुंच कुछ भी हो। भारतसहायक हमारा जवाब है।',
    'आमचा विश्वास आहे की प्रत्येक भारतीय नागरिकाला त्याला पात्र असलेल्या प्रत्येक लाभापर्यंत पोहोचता आले पाहिजे — शिक्षण, भाषा किंवा इंटरनेट काहीही असो. भारतसहाय्यक हे आमचे उत्तर आहे.'],
  'View Demo Dashboard': ['डेमो डैशबोर्ड देखें', 'डेमो डॅशबोर्ड पहा'],
  'Explore All Schemes': ['सभी योजनाएं देखें', 'सर्व योजना पहा'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return translateSections(lang, text);
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}
