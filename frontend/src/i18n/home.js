// Display translations for the landing page (everything below the hero) and the stats strip.
// Keys are the English strings used on the page. Anything missing falls back to English.
const D = {
  // features
  'Key Features': ['मुख्य विशेषताएं', 'मुख्य वैशिष्ट्ये'],
  '5 Ways BharatSahayak': ['भारतसहायक के 5 तरीके', 'भारतसहाय्यकचे 5 मार्ग'],
  'Changes Everything': ['जो सब कुछ बदल देते हैं', 'जे सर्व काही बदलतात'],
  'Life Timeline AI': ['जीवन समयरेखा AI', 'जीवन कालरेषा AI'],
  'Predicts future eligibility milestones. Know at age 58 you become eligible for ₹3,000/month senior pension — plan ahead.': [
    'भविष्य की पात्रता के पड़ाव बताता है। जानें कि 58 की उम्र में आप ₹3,000/माह की वरिष्ठ पेंशन के पात्र बनते हैं — पहले से योजना बनाएं।',
    'भविष्यातील पात्रतेचे टप्पे सांगतो. वय 58 व्या वर्षी तुम्ही ₹3,000/महिना ज्येष्ठ निवृत्तीवेतनासाठी पात्र ठरता हे जाणून घ्या — आधीच नियोजन करा.'],
  Predictive: ['पूर्वानुमान', 'भाकित'],
  'Lost Benefit Detector': ['छूटे लाभ की पहचान', 'हुकलेल्या लाभाचा शोध'],
  'AI scans your entire life history and detects benefits you missed in the past 5 years. Retroactively recovers your money.': [
    'AI आपके पूरे जीवन-विवरण को खंगालकर पिछले 5 सालों में छूटे लाभ ढूंढता है और आपका पैसा वापस दिलाने में मदद करता है।',
    'AI तुमच्या संपूर्ण जीवन-माहितीचा शोध घेऊन गेल्या 5 वर्षांत हुकलेले लाभ शोधतो आणि तुमचे पैसे परत मिळवण्यास मदत करतो.'],
  'AI Powered': ['AI-संचालित', 'AI-आधारित'],
  'Voice Call Assistant': ['वॉइस कॉल सहायक', 'व्हॉइस कॉल सहाय्यक'],
  'Our AI calls your basic keypad phone in your language — Hindi, Marathi, Telugu. No smartphone, no internet needed. Works on 2G.': [
    'हमारा AI आपके साधारण कीपैड फ़ोन पर आपकी भाषा — हिंदी, मराठी, तेलुगु — में कॉल करता है। स्मार्टफ़ोन या इंटरनेट की ज़रूरत नहीं। 2G पर भी चलता है।',
    'आमचा AI तुमच्या साध्या कीपॅड फोनवर तुमच्या भाषेत — हिंदी, मराठी, तेलुगू — कॉल करतो. स्मार्टफोन किंवा इंटरनेटची गरज नाही. 2G वरही चालते.'],
  'Works Offline': ['इंटरनेट के बिना', 'इंटरनेटशिवाय'],
  'WhatsApp Sync': ['WhatsApp सिंक', 'WhatsApp सिंक'],
  'No Aadhaar number, no OTP, no password. Your answers stay on your device. No middlemen.': [
    'न आधार नंबर, न OTP, न पासवर्ड। आपके जवाब आपके डिवाइस पर रहते हैं। कोई बिचौलिया नहीं।',
    'आधार नंबर नाही, OTP नाही, पासवर्ड नाही. तुमची उत्तरे तुमच्या डिव्हाइसवर राहतात. कोणताही मध्यस्थ नाही.'],
  'Seamless Sync': ['सहज सिंक', 'सहज सिंक'],
  'Benefit Wallet': ['लाभ वॉलेट', 'लाभ वॉलेट'],
  'A single dashboard showing all schemes received, pending, and available. Like a bank account for your government benefits.': [
    'एक ही डैशबोर्ड जिसमें प्राप्त, लंबित और उपलब्ध सभी योजनाएं दिखती हैं। आपके सरकारी लाभों के लिए बैंक खाते जैसा।',
    'मिळालेल्या, प्रलंबित आणि उपलब्ध सर्व योजना दाखवणारा एकच डॅशबोर्ड. तुमच्या सरकारी लाभांसाठी बँक खात्यासारखा.'],
  'Real-time Updates': ['रियल-टाइम अपडेट', 'रिअल-टाइम अपडेट'],
  // WhatsApp demo block
  'WhatsApp Bot Demo': ['WhatsApp बॉट डेमो', 'WhatsApp बॉट डेमो'],
  'Savitribai Discovers': ['सावित्रीबाई को मिले', 'सावित्रीबाईंना मिळाले'],
  'in 2 Minutes': ['2 मिनट में', '2 मिनिटांत'],
  "Savitribai — 52-year-old widow farmer from Osmanabad — sends one WhatsApp message. Our AI finds 9 schemes worth ₹1.37 lakh she's eligible for. All in her language.": [
    'सावित्रीबाई — उस्मानाबाद की 52 साल की विधवा किसान — एक WhatsApp संदेश भेजती हैं। हमारा AI ₹1.37 लाख की 9 योजनाएं ढूंढता है जिनकी वे पात्र हैं। सब कुछ उनकी भाषा में।',
    'सावित्रीबाई — उस्मानाबादच्या 52 वर्षांच्या विधवा शेतकरी — एक WhatsApp संदेश पाठवतात. आमचा AI ₹1.37 लाखांच्या 9 योजना शोधतो ज्यांच्यासाठी त्या पात्र आहेत. सर्व काही त्यांच्या भाषेत.'],
  'PM-KISAN — ₹6,000/year (3 installments)': ['PM-KISAN — ₹6,000/वर्ष (3 किस्तों में)', 'PM-KISAN — ₹6,000/वर्ष (3 हप्त्यांत)'],
  'Widow Pension — ₹1,500/month = ₹18,000/year': ['विधवा पेंशन — ₹1,500/माह = ₹18,000/वर्ष', 'विधवा निवृत्तीवेतन — ₹1,500/महिना = ₹18,000/वर्ष'],
  'PMUY Free LPG — ₹1,600 subsidy one-time': ['PMUY मुफ़्त LPG — ₹1,600 सब्सिडी, एक बार', 'PMUY मोफत LPG — ₹1,600 अनुदान, एकदा'],
  'MahaDBT Grant — ₹25,000 for farm equipment': ['MahaDBT अनुदान — खेती के उपकरणों के लिए ₹25,000', 'MahaDBT अनुदान — शेती उपकरणांसाठी ₹25,000'],
  'Try Live Simulator': ['लाइव सिम्युलेटर आज़माएं', 'लाइव्ह सिम्युलेटर वापरून पहा'],
  // no smartphone block
  '100% Offline Access': ['100% ऑफ़लाइन पहुंच', '100% ऑफलाइन प्रवेश'],
  'No Smartphone?': ['स्मार्टफ़ोन नहीं है?', 'स्मार्टफोन नाही?'],
  'No Problem.': ['कोई बात नहीं।', 'काही हरकत नाही.'],
  "We believe that public welfare shouldn't require expensive technology. You can access all AI capabilities of BharatSahayak by dialing a toll-free number from any basic keypad phone.": [
    'हमारा मानना है कि जन-कल्याण के लिए महंगी तकनीक ज़रूरी नहीं होनी चाहिए। किसी भी साधारण कीपैड फ़ोन से टोल-फ़्री नंबर डायल करके आप भारतसहायक की सभी AI सुविधाएं पा सकते हैं।',
    'आमचा विश्वास आहे की सार्वजनिक कल्याणासाठी महागड्या तंत्रज्ञानाची गरज नसावी. कोणत्याही साध्या कीपॅड फोनवरून टोल-फ्री नंबर डायल करून तुम्ही भारतसहाय्यकच्या सर्व AI सुविधा मिळवू शकता.'],
  'Dial Toll-Free': ['टोल-फ़्री डायल करें', 'टोल-फ्री डायल करा'],
  'The helpline number will be shown here once voice calls go live.': ['वॉइस कॉल शुरू होने पर हेल्पलाइन नंबर यहां दिखाया जाएगा।', 'व्हॉइस कॉल सुरू झाल्यावर हेल्पलाइन नंबर येथे दाखवला जाईल.'],
  'Choose Language': ['भाषा चुनें', 'भाषा निवडा'],
  'Listen & interact in Hindi or Marathi.': ['हिंदी या मराठी में सुनें और बात करें।', 'हिंदी किंवा मराठीत ऐका आणि संवाद साधा.'],
  'Speak to AI': ['AI से बात करें', 'AI शी बोला'],
  'Answer simple profile questions.': ['प्रोफ़ाइल के आसान सवालों के जवाब दें।', 'प्रोफाइलचे सोपे प्रश्न सोडवा.'],
  'Get SMS Alerts': ['SMS अलर्ट पाएं', 'SMS अलर्ट मिळवा'],
  'Receive schemes checklist via SMS.': ['SMS से योजनाओं की सूची पाएं।', 'SMS द्वारे योजनांची यादी मिळवा.'],
  'Voice Helpline': ['वॉइस हेल्पलाइन', 'व्हॉइस हेल्पलाइन'],
  'Coming soon': ['जल्द आ रहा है', 'लवकरच येत आहे'],
  'ILLUSTRATIVE EXAMPLE': ['उदाहरण (केवल समझाने के लिए)', 'उदाहरण (फक्त स्पष्टीकरणासाठी)'],
  '"Ramdas Patil, 68, from a remote village in Maharashtra recovered ₹28,000 in unclaimed agricultural subsidies using just his basic Nokia keypad phone."': [
    '"रामदास पाटिल, 68, महाराष्ट्र के एक दूरदराज़ गांव से, सिर्फ़ अपने साधारण Nokia कीपैड फ़ोन से ₹28,000 की बिना दावे वाली कृषि सब्सिडी वापस पा सके।"',
    '"रामदास पाटील, 68, महाराष्ट्रातील दुर्गम गावातून, फक्त त्यांच्या साध्या Nokia कीपॅड फोनचा वापर करून ₹28,000 चे दावा न केलेले कृषी अनुदान मिळवू शकले."'],
  'Voice calls coming soon': ['वॉइस कॉल जल्द आ रहे हैं', 'व्हॉइस कॉल लवकरच येत आहेत'],
  // WhatsApp QR block
  'Live Bot': ['लाइव बॉट', 'लाइव्ह बॉट'],
  'Number:': ['नंबर:', 'नंबर:'],
  'Send code:': ['कोड भेजें:', 'कोड पाठवा:'],
  'Open Twilio WhatsApp': ['Twilio WhatsApp खोलें', 'Twilio WhatsApp उघडा'],
  'Get Schemes Directly on': ['योजनाएं सीधे', 'योजना थेट'],
  'WhatsApp (heading)': ['WhatsApp पर पाएं', 'WhatsApp वर मिळवा'],
  'No websites to navigate, no complex credentials. Our WhatsApp AI bot, connected to Twilio, lets you manage your government benefits through simple chat messages.': [
    'न वेबसाइट खंगालनी, न जटिल लॉगिन। Twilio से जुड़ा हमारा WhatsApp AI बॉट आपको सरल चैट संदेशों से अपने सरकारी लाभ संभालने देता है।',
    'वेबसाइट शोधण्याची गरज नाही, गुंतागुंतीचे लॉगिन नाही. Twilio शी जोडलेला आमचा WhatsApp AI बॉट तुम्हाला साध्या चॅट संदेशांद्वारे तुमचे सरकारी लाभ सांभाळू देतो.'],
  'Scan or Tap': ['स्कैन करें या टैप करें', 'स्कॅन करा किंवा टॅप करा'],
  'Scan the QR scanner code with your phone or click the button to open WhatsApp.': ['अपने फ़ोन से QR कोड स्कैन करें या WhatsApp खोलने के लिए बटन दबाएं।', 'तुमच्या फोनने QR कोड स्कॅन करा किंवा WhatsApp उघडण्यासाठी बटण दाबा.'],
  'Connect to Twilio Bot': ['Twilio बॉट से जुड़ें', 'Twilio बॉटशी जोडा'],
  'Send the message "join spent-opinion" to activate your chat session with +1 415 523 8886.': ['+1 415 523 8886 पर "join spent-opinion" संदेश भेजकर अपना चैट सत्र शुरू करें।', '+1 415 523 8886 वर "join spent-opinion" हा संदेश पाठवून तुमचे चॅट सत्र सुरू करा.'],
  'Instant AI Scheme Match': ['तुरंत AI योजना मिलान', 'त्वरित AI योजना जुळणी'],
  'Receive your personalized document checklist and government scheme matches instantly.': ['आपके लिए तैयार दस्तावेज़ों की सूची और सरकारी योजनाओं के मिलान तुरंत पाएं।', 'तुमच्यासाठी तयार कागदपत्रांची यादी आणि सरकारी योजनांच्या जुळण्या त्वरित मिळवा.'],
  // team banner
  'Built to close the': ['बनाया गया है', 'तयार केले आहे'],
  'benefits gap': ['लाभों की खाई पाटने के लिए', 'लाभांतील दरी भरून काढण्यासाठी'],
  "Team Binary Builders — PawanSingh Bhandari & Rahul Bramhankar — solving one of India's biggest public welfare gaps.": [
    'टीम Binary Builders — PawanSingh Bhandari और Rahul Bramhankar — भारत की सबसे बड़ी जन-कल्याण खाइयों में से एक को पाटने में जुटे हैं।',
    'टीम Binary Builders — PawanSingh Bhandari आणि Rahul Bramhankar — भारतातील सर्वात मोठ्या सार्वजनिक कल्याण दऱ्यांपैकी एक भरून काढत आहेत.'],
  'Annual unclaimed benefits': ['सालाना बिना दावे के लाभ', 'वार्षिक दावा न केलेले लाभ'],
  'Eligible citizens': ['पात्र नागरिक', 'पात्र नागरिक'],
  'Setup time at CSC': ['CSC पर सेटअप समय', 'CSC वर सेटअप वेळ'],
  'Avg per-person recovery': ['प्रति व्यक्ति औसत वसूली', 'प्रति व्यक्ती सरासरी वसुली'],
  'Meet Team Binary Builders': ['टीम Binary Builders से मिलें', 'टीम Binary Builders ला भेटा'],
  // stats strip
  'Benefits Unclaimed': ['बिना दावे के लाभ', 'दावा न केलेले लाभ'],
  'Going unclaimed every year': ['हर साल बिना दावे के रह जाते हैं', 'दरवर्षी दावा न होता राहतात'],
  Schemes: ['योजनाएं', 'योजना'],
  'In this prototype, growing with each verified record': ['इस प्रोटोटाइप में, हर सत्यापित रिकॉर्ड के साथ बढ़ती हुई', 'या प्रोटोटाइपमध्ये, प्रत्येक सत्यापित नोंदीसह वाढत आहे'],
  Citizens: ['नागरिक', 'नागरिक'],
  'Deserving direct welfare support': ['जो सीधी कल्याण सहायता के हक़दार हैं', 'जे थेट कल्याण मदतीस पात्र आहेत'],
  Awareness: ['जागरूकता', 'जागरूकता'],
  'Of citizens know their rights': ['नागरिक अपने अधिकार जानते हैं', 'नागरिकांना त्यांचे हक्क माहीत आहेत'],
  'The Problem We Solve': ['जो समस्या हम सुलझाते हैं', 'आम्ही सोडवत असलेली समस्या'],
  'The Numbers Are': ['आंकड़े', 'आकडे'],
  Staggering: ['चौंकाने वाले हैं', 'थक्क करणारे आहेत'],
  "Every year, billions of rupees in benefits go unclaimed — not because people don't deserve them, but because they don't know they exist.": [
    'हर साल अरबों रुपये के लाभ बिना दावे के रह जाते हैं — इसलिए नहीं कि लोग उनके हक़दार नहीं, बल्कि इसलिए कि उन्हें उनके होने का पता ही नहीं।',
    'दरवर्षी अब्जावधी रुपयांच्या लाभांवर दावा केला जात नाही — लोक त्यासाठी पात्र नाहीत म्हणून नव्हे, तर ते अस्तित्वात आहेत हे त्यांना माहीत नाही म्हणून.'],
  'Total unclaimed benefits annually': ['सालाना कुल बिना दावे के लाभ', 'वार्षिक एकूण दावा न केलेले लाभ'],
  '₹2,60,000 Crore': ['₹2,60,000 करोड़', '₹2,60,000 कोटी'],
  "That's India's entire health budget — going to waste.": ['यह भारत का पूरा स्वास्थ्य बजट है — जो बेकार जा रहा है।', 'हे भारताचे संपूर्ण आरोग्य बजेट आहे — जे वाया जात आहे.'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return text;
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}
