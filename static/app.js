const $=id=>document.getElementById(id);
const translations={
en:{subtitle:'CONNECTED ROAD SAFETY',workspace:'WORKSPACE',overview:'Overview',network:'Hazard network',driver:'Driver experience',platform:'PLATFORM',api:'API documentation ↗',demoOnline:'SIMULATION ONLINE',foot:'A concept for connected vehicle safety. All detections are simulated.',command:'Command center',demo:'DEMO MODE',eyebrow:'VEHICLE-POWERED HAZARD INTELLIGENCE',headline:'Every vehicle, <em>an extra set of eyes.</em>',heroDesc:'Detect camels on the road, warn the driver, and share verified hazards with vehicles approaching behind.',run:'Simulate a detection',viewDriver:'View driver alert ↗',camel:'CAMEL DETECTED',vehicle1:'Vehicle 01 · detected',vehicle2:'Vehicle 02 · warned',notice:'PROTOTYPE ONLY — Sample vehicles, GPS positions, hazards and alerts. No real detection or live driver notifications.',hazards:'ACTIVE HAZARDS',hazardsFoot:'Shared by connected vehicles',critical:'HIGH PRIORITY',criticalFoot:'Require extra caution',reports:'VEHICLE REPORTS',reportsFoot:'Simulated observations this session',confirmed:'CORROBORATED',confirmedFoot:'Reports from multiple vehicles',geospatial:'GEOSPATIAL OVERVIEW',mapTitle:'Connected hazard map',criticalTag:'Critical',warningTag:'Warning',mapSetup:'Google Maps is ready to connect',mapHelp:'Add a Maps JavaScript API key in your .env file to enable the map.',mapBar:'Sample highway segments · Saudi Arabia',stream:'LIVE EVENT STREAM',feedTitle:'Hazard activity',refresh:'UPDATES EVERY 8 SECONDS',driverEyebrow:'THE DRIVER EXPERIENCE',driverTitle:'A warning before the danger.',driverDesc:'A vehicle detects a hazard, and the system demonstrates how an approaching driver on the same road could be warned.',distanceLabel:'Approaching vehicle distance',sameRoad:'Vehicle is on the affected road, approaching the hazard',thresholdNote:'Demonstration threshold: 3 km. This is not a validated safe warning distance.',ahead:'CAMEL HAZARD AHEAD',approach:'Approaching a reported hazard',noAlert:'Move closer to the hazard to preview an alert.',alertTitle:'Caution: camel reported ahead',alertDesc:'Possible camels on your route. Slow down safely and stay alert.',playAudio:'Play alert sound',simNavigation:'SIMULATED NAVIGATION',flowEyebrow:'FROM ONE VEHICLE TO MANY',flowTitle:'One detection. A safer road network.',detect:'Detect',detectDesc:'Dashcam or phone camera identifies a camel.',locate:'Locate',locateDesc:'Vehicle GPS links the report to a road segment.',verify:'Corroborate',verifyDesc:'Multiple independent reports increase confidence.',warn:'Warn',warnDesc:'Approaching drivers receive a contextual alert.',footer:'HOBAL · CONCEPT PROTOTYPE',footerRight:'FastAPI · Google Maps · Vehicle-powered detection',mapConnected:'Google Maps connected',keyRequired:'API key required',mapUnavailable:'Map unavailable',empty:'No active demo hazards.',report:'Simulated vehicle report',multi:'Multiple vehicles reported',single:'Single vehicle report',demoToast:'Simulated vehicle detection added',confirmAction:'Confirm from second vehicle',error:'Could not connect to server'},
ar:{subtitle:'سلامة الطرق المتصلة',workspace:'مساحة العمل',overview:'نظرة عامة',network:'شبكة المخاطر',driver:'تجربة السائق',platform:'المنصة',api:'توثيق API ↗',demoOnline:'المحاكاة تعمل',foot:'تصور أولي لسلامة المركبات المتصلة. جميع عمليات الرصد تجريبية.',command:'مركز التحكم',demo:'وضع تجريبي',eyebrow:'رصد المخاطر عبر المركبات',headline:'كل مركبة، <em>عين إضافية على الطريق.</em>',heroDesc:'نرصد الإبل على الطريق، وننبه السائق، ونشارك البلاغات المؤكدة مع المركبات القادمة خلفه.',run:'محاكاة اكتشاف جمل',viewDriver:'شاهد تنبيه السائق ↗',camel:'تم رصد إبل',vehicle1:'المركبة 01 · رصدت',vehicle2:'المركبة 02 · تنبهت',notice:'نموذج تجريبي فقط — المركبات والمواقع والبلاغات والتنبيهات افتراضية، ولا يوجد كشف أو إشعارات حقيقية.',hazards:'المخاطر النشطة',hazardsFoot:'مشاركة بين المركبات',critical:'أولوية عالية',criticalFoot:'تتطلب حذرًا إضافيًا',reports:'بلاغات المركبات',reportsFoot:'عمليات رصد تجريبية في هذه الجلسة',confirmed:'بلاغات متكررة',confirmedFoot:'رصد من أكثر من مركبة',geospatial:'نظرة جغرافية',mapTitle:'خريطة المخاطر المتصلة',criticalTag:'مرتفع',warningTag:'تحذير',mapSetup:'خرائط Google جاهزة للربط',mapHelp:'أضف مفتاح Maps JavaScript API في ملف .env لتفعيل الخريطة.',mapBar:'طرق سريعة تجريبية · السعودية',stream:'سجل الأحداث',feedTitle:'نشاط البلاغات',refresh:'تحديث كل 8 ثوانٍ',driverEyebrow:'تجربة السائق',driverTitle:'تحذير قبل الوصول للخطر.',driverDesc:'ترصد مركبة خطرًا، ويوضح النظام كيف يمكن تنبيه سائق آخر يقترب من نفس الطريق.',distanceLabel:'مسافة المركبة القادمة عن الخطر',sameRoad:'المركبة تقترب من الخطر على نفس الطريق',thresholdNote:'مسافة المحاكاة: 3 كم. هذه ليست مسافة أمان معتمدة.',ahead:'تحذير: إبل على الطريق',approach:'تقترب من موقع بلاغ',noAlert:'قرّب المركبة من موقع الخطر لتجربة التنبيه.',alertTitle:'انتبه: بلاغ عن إبل أمامك',alertDesc:'قد توجد إبل على مسارك. خفّف السرعة بأمان وانتبه للطريق.',playAudio:'تشغيل التحذير الصوتي',simNavigation:'ملاحة تجريبية',flowEyebrow:'من مركبة إلى شبكة',flowTitle:'رصد واحد. شبكة طرق أكثر أمانًا.',detect:'الكشف',detectDesc:'كاميرا السيارة أو الجوال ترصد الإبل.',locate:'تحديد الموقع',locateDesc:'يربط GPS البلاغ بمقطع الطريق.',verify:'التأكيد',verifyDesc:'تكرار البلاغ من مركبات مستقلة يزيد الثقة.',warn:'التنبيه',warnDesc:'تنبيه السائقين القادمين حسب اتجاههم.',footer:'HOBAL · نموذج أولي',footerRight:'FastAPI · Google Maps · كشف عبر المركبات',mapConnected:'خرائط Google متصلة',keyRequired:'مفتاح API مطلوب',mapUnavailable:'الخريطة غير متاحة',empty:'لا توجد بلاغات تجريبية نشطة.',report:'بلاغ مركبة تجريبي',multi:'رصدته عدة مركبات',single:'بلاغ مركبة واحدة',demoToast:'أُضيف بلاغ تجريبي من مركبة',confirmAction:'تأكيد من مركبة ثانية',error:'تعذر الاتصال بالخادم'},
ur:{subtitle:'منسلک سڑکوں کی حفاظت',workspace:'ورک اسپیس',overview:'جائزہ',network:'خطرات کا نیٹ ورک',driver:'ڈرائیور کا تجربہ',platform:'پلیٹ فارم',api:'API دستاویزات ↗',demoOnline:'ڈیمو فعال ہے',foot:'منسلک گاڑیوں کی حفاظت کا ابتدائی تصور۔ تمام مشاہدات فرضی ہیں۔',command:'کنٹرول سینٹر',demo:'ڈیمو موڈ',eyebrow:'گاڑیوں کے ذریعے خطرات کی شناخت',headline:'ہر گاڑی، <em>سڑک پر ایک اضافی نظر۔</em>',heroDesc:'سڑک پر اونٹوں کی شناخت، ڈرائیور کو خبردار کرنا، اور پیچھے آنے والی گاڑیوں کو اطلاع دینا۔',run:'فرضی شناخت چلائیں',viewDriver:'ڈرائیور الرٹ دیکھیں ↗',camel:'اونٹ کی شناخت',vehicle1:'گاڑی 01 · شناخت',vehicle2:'گاڑی 02 · انتباہ',notice:'صرف ڈیمو — گاڑیاں، GPS مقامات، خطرات اور الرٹس فرضی ہیں۔ حقیقی شناخت یا اطلاعات نہیں بھیجی جاتیں۔',hazards:'فعال خطرات',hazardsFoot:'منسلک گاڑیوں کے ذریعے مشترک',critical:'زیادہ خطرہ',criticalFoot:'اضافی احتیاط ضروری',reports:'گاڑیوں کی رپورٹس',reportsFoot:'اس سیشن میں فرضی مشاہدات',confirmed:'متعدد رپورٹس',confirmedFoot:'ایک سے زیادہ گاڑیوں کی اطلاع',geospatial:'جغرافیائی جائزہ',mapTitle:'منسلک خطرات کا نقشہ',criticalTag:'شدید',warningTag:'انتباہ',mapSetup:'Google Maps منسلک ہونے کے لیے تیار ہے',mapHelp:'نقشہ فعال کرنے کے لیے .env میں Maps JavaScript API کلید شامل کریں۔',mapBar:'فرضی شاہراہیں · سعودی عرب',stream:'واقعات کی فہرست',feedTitle:'خطرات کی سرگرمی',refresh:'ہر 8 سیکنڈ بعد تازہ کاری',driverEyebrow:'ڈرائیور کا تجربہ',driverTitle:'خطرے سے پہلے انتباہ۔',driverDesc:'ایک گاڑی خطرہ شناخت کرتی ہے اور نظام اسی سڑک پر آنے والے ڈرائیور کے لیے فرضی انتباہ دکھاتا ہے۔',distanceLabel:'آنے والی گاڑی کا فاصلہ',sameRoad:'گاڑی اسی سڑک پر خطرے کی جانب آ رہی ہے',thresholdNote:'ڈیمو کی حد: 3 کلومیٹر۔ یہ تصدیق شدہ محفوظ فاصلہ نہیں ہے۔',ahead:'آگے اونٹ کا خطرہ',approach:'رپورٹ شدہ خطرے کے قریب',noAlert:'انتباہ دیکھنے کے لیے گاڑی کو قریب لائیں۔',alertTitle:'احتیاط: آگے اونٹوں کی اطلاع',alertDesc:'آپ کے راستے پر اونٹ ہو سکتے ہیں۔ محفوظ طریقے سے رفتار کم کریں۔',playAudio:'صوتی انتباہ چلائیں',simNavigation:'فرضی نیویگیشن',flowEyebrow:'ایک گاڑی سے پورے نیٹ ورک تک',flowTitle:'ایک شناخت۔ زیادہ محفوظ سڑکیں۔',detect:'شناخت',detectDesc:'ڈیش کیم یا فون اونٹ شناخت کرتا ہے۔',locate:'مقام',locateDesc:'گاڑی کا GPS رپورٹ کو سڑک سے جوڑتا ہے۔',verify:'تصدیق',verifyDesc:'مختلف گاڑیوں کی رپورٹس اعتماد بڑھاتی ہیں۔',warn:'انتباہ',warnDesc:'قریب آنے والے ڈرائیور کو مناسب اطلاع۔',footer:'HOBAL · ابتدائی ڈیمو',footerRight:'FastAPI · Google Maps · گاڑیوں سے شناخت',mapConnected:'Google Maps منسلک ہے',keyRequired:'API کلید درکار ہے',mapUnavailable:'نقشہ دستیاب نہیں',empty:'کوئی فعال فرضی خطرہ نہیں۔',report:'فرضی گاڑی کی رپورٹ',multi:'متعدد گاڑیوں کی اطلاع',single:'ایک گاڑی کی اطلاع',demoToast:'فرضی گاڑی کی رپورٹ شامل کر دی گئی',confirmAction:'دوسری گاڑی سے تصدیق',error:'سرور سے رابطہ نہیں ہو سکا'}};
let lang=localStorage.getItem('cw_lang')||'en',events=[];
Object.assign(translations.en,{manualNav:'Report a camel',reportEyebrow:'COMMUNITY REPORTING',reportTitle:'Spotted camels? Share a sighting.',reportIntro:'Upload a photo and its location. A trained model can check the image before publishing a provisional marker.',manualBadge:'DRIVER SUBMISSION',uploadTitle:'Choose a camel photo',uploadHelp:'JPG, PNG or WEBP · up to 8 MB',roadLabel:'Road or location name',latLabel:'Latitude',lngLabel:'Longitude',useGPS:'Use my location',noteLabel:'Optional details',submitReport:'Analyze & submit sighting',reportSafety:'Only submit when safely stopped. GPS is the reporter location, not necessarily the camel position. Not an emergency service.'});
Object.assign(translations.ar,{manualNav:'بلاغ عن إبل',reportEyebrow:'بلاغات المجتمع',reportTitle:'شفت إبل على الطريق؟ شارك البلاغ.',reportIntro:'ارفع صورة وحدد الموقع. يفحصها المودل المدرّب قبل إضافة بلاغ مبدئي للخريطة.',manualBadge:'بلاغ من سائق',uploadTitle:'اختر صورة الإبل',uploadHelp:'JPG أو PNG أو WEBP · حتى 8 ميجابايت',roadLabel:'اسم الطريق أو الموقع',latLabel:'خط العرض',lngLabel:'خط الطول',useGPS:'استخدم موقعي',noteLabel:'تفاصيل إضافية (اختياري)',submitReport:'فحص الصورة وإرسال البلاغ',reportSafety:'ارفع البلاغ بعد التوقف في مكان آمن فقط. GPS يحدد موقع المبلّغ وليس بالضرورة موقع الإبل. النظام ليس خدمة طوارئ.'});
Object.assign(translations.ur,{manualNav:'اونٹ کی اطلاع دیں',reportEyebrow:'کمیونٹی رپورٹس',reportTitle:'سڑک پر اونٹ دیکھے؟ اطلاع دیں۔',reportIntro:'تصویر اور مقام شامل کریں۔ تربیت یافتہ ماڈل دستیاب ہو تو تصویر چیک کر کے عارضی رپورٹ نقشے پر دکھائے گا۔',manualBadge:'ڈرائیور رپورٹ',uploadTitle:'اونٹ کی تصویر منتخب کریں',uploadHelp:'JPG، PNG یا WEBP · زیادہ سے زیادہ 8 MB',roadLabel:'سڑک یا مقام کا نام',latLabel:'عرض البلد',lngLabel:'طول البلد',useGPS:'میرا مقام استعمال کریں',noteLabel:'اضافی تفصیلات',submitReport:'تصویر جانچیں اور رپورٹ بھیجیں',reportSafety:'صرف محفوظ جگہ رک کر رپورٹ دیں۔ GPS اطلاع دینے والے کا مقام ہے، ضروری نہیں اونٹ کا عین مقام ہو۔ یہ ایمرجنسی سروس نہیں ہے۔'});
Object.assign(translations.en,{reportEyebrow:'COMMUNITY VIDEO REPORTING',reportTitle:'Saw camels on the road? Share the footage.',reportIntro:'Upload dashcam footage. YOLO analyzes sampled video frames and plots provisional detections on the map as processing progresses.',manualBadge:'DRIVER VIDEO REPORT',uploadTitle:'Choose dashcam video',uploadHelp:'MP4, MOV, AVI, MKV, WEBM · 100 MB max · 3 minutes',submitReport:'Analyze video & update map',reportSafety:'Only upload when safely stopped. Location is user-provided, not extracted from the video. Reports are provisional.',videoPreview:'VIDEO ANALYSIS',footage:'Uploaded dashcam footage',videoEmpty:'Your video and detections will appear here',mapPreview:'LIVE MAP UPDATE',locationPreview:'Reported hazard location',analysisNote:'Map marker appears when YOLO detects camels in sampled frames'});
Object.assign(translations.ar,{reportEyebrow:'بلاغات الفيديو',reportTitle:'شفت إبل على الطريق؟ شارك المقطع.',reportIntro:'ارفع مقطع الداش كام. يحلل YOLO لقطات من الفيديو ويضيف بلاغًا مبدئيًا على الخريطة أثناء التحليل.',manualBadge:'بلاغ فيديو من سائق',uploadTitle:'اختر مقطع داش كام',uploadHelp:'MP4، MOV، AVI، MKV، WEBM · حتى 100 ميجابايت · 3 دقائق',submitReport:'تحليل المقطع وتحديث الخريطة',reportSafety:'ارفع المقطع بعد التوقف الآمن فقط. الموقع يدخله المستخدم وليس مستخرجًا من الفيديو. البلاغات مبدئية.',videoPreview:'تحليل الفيديو',footage:'مقطع الداش كام المرفوع',videoEmpty:'سيظهر الفيديو والكشف هنا',mapPreview:'تحديث الخريطة المباشر',locationPreview:'موقع البلاغ',analysisNote:'تظهر العلامة على الخريطة عند كشف الإبل في لقطات الفيديو'});
Object.assign(translations.ur,{reportEyebrow:'ویڈیو رپورٹ',reportTitle:'سڑک پر اونٹ دیکھے؟ ویڈیو شیئر کریں۔',reportIntro:'ڈیش کیم ویڈیو اپ لوڈ کریں۔ YOLO منتخب فریموں کا تجزیہ کر کے نقشے پر عارضی اطلاع دکھاتا ہے۔',manualBadge:'ڈرائیور ویڈیو رپورٹ',uploadTitle:'ڈیش کیم ویڈیو منتخب کریں',uploadHelp:'MP4، MOV، AVI، MKV، WEBM · 100 MB تک · 3 منٹ',submitReport:'ویڈیو کا تجزیہ اور نقشہ اپ ڈیٹ کریں',reportSafety:'صرف محفوظ جگہ رک کر ویڈیو اپ لوڈ کریں۔ مقام صارف فراہم کرتا ہے۔ رپورٹ عارضی ہے۔',videoPreview:'ویڈیو تجزیہ',footage:'اپ لوڈ کردہ ویڈیو',videoEmpty:'ویڈیو اور نتائج یہاں نظر آئیں گے',mapPreview:'لائیو نقشہ',locationPreview:'خطرے کا مقام',analysisNote:'YOLO کے اونٹ تلاش کرنے پر نقشے پر نشان ظاہر ہوگا'});
Object.assign(translations.en,{speedLabel:'Speed (km/h)',headingLabel:'Driving direction',dirN:'North ↑',dirNE:'North-east ↗',dirE:'East →',dirSE:'South-east ↘',dirS:'South ↓',dirSW:'South-west ↙',dirW:'West ←',dirNW:'North-west ↖',mapHint:'Tip: click the live map to set the starting point.',driveAlert:'⚠ Camels on the road ahead',waitAnalysis:'Analysing ahead…',driveTime:'Video',driveAnalysed:'analysed',driveCamels:'camels on map',slowDown:'slow down',closing:'closing in fast, slow down now',camelsN:'camels',camelOne:'camel',camelPopup:'Detected at second',speech:'Warning, camels on the road ahead',locationPreview:'Live drive map',analysisNote:'The car follows the video; a camel appears where it was confirmed'});
Object.assign(translations.ar,{speedLabel:'السرعة (كم/س)',headingLabel:'اتجاه السير',dirN:'شمال ↑',dirNE:'شمال شرق ↗',dirE:'شرق →',dirSE:'جنوب شرق ↘',dirS:'جنوب ↓',dirSW:'جنوب غرب ↙',dirW:'غرب ←',dirNW:'شمال غرب ↖',mapHint:'تقدر تضغط على الخريطة المباشرة لتحديد نقطة البداية.',driveAlert:'⚠ انتبه، إبل على الطريق',waitAnalysis:'جاري تحليل اللي قدام…',driveTime:'الفيديو',driveAnalysed:'المحلَّل',driveCamels:'إبل على الخريطة',slowDown:'خفّف السرعة',closing:'تقترب بسرعة، خفّف الحين',camelsN:'إبل',camelOne:'ناقة',camelPopup:'انكشفت عند الثانية',speech:'تحذير، إبل على الطريق أمامك',locationPreview:'خريطة الرحلة المباشرة',analysisNote:'السيارة تمشي مع الفيديو، والناقة تظهر في مكان تأكيد الكشف'});
Object.assign(translations.ur,{speedLabel:'رفتار (کلومیٹر/گھنٹہ)',headingLabel:'سمت',driveAlert:'⚠ آگے سڑک پر اونٹ',waitAnalysis:'تجزیہ جاری…',slowDown:'رفتار کم کریں',closing:'تیزی سے قریب، فوراً رفتار کم کریں',camelsN:'اونٹ',camelOne:'اونٹ',speech:'خبردار، آگے سڑک پر اونٹ ہیں'});

/* ---------- production wording (overrides the prototype strings above) ---------- */
Object.assign(translations.en,{
 subtitle:'CONNECTED ROAD SAFETY',foot:'Camel detection from dashcam video, shared with drivers on a live map.',
 sysChecking:'CHECKING SYSTEM…',sysReady:'SYSTEM ONLINE · MODEL READY',sysNoModel:'MODEL WEIGHTS MISSING',sysOffline:'SERVER OFFLINE',
 run:'Report a camel',viewDriver:'View hazard map',
 hazardsFoot:'Live on the map now',reportsFoot:'Detections and confirmations',criticalFoot:'Camels getting close fast',confirmedFoot:'Confirmed by more than one driver',
 mapBar:'Saudi Arabia · live camel hazards',refresh:'UPDATES EVERY 8 SECONDS',
 footer:'HOBAL · CONNECTED ROAD SAFETY',footerRight:'YOLO11 · FastAPI · Live maps',
 empty:'No active hazards right now.',confirmAction:'Confirm sighting',clearAction:'Mark as cleared',
 srcVideo:'Dashcam video',srcPhoto:'Photo report',srcApi:'Connected vehicle',
 multi:'Confirmed by several drivers',single:'One report',watchVideo:'Watch video',reported:'Reported',min:'min ago',
 driveAlert:'Camels on the road ahead',analysisNote:'The car follows the video; a camel marker drops where the model confirmed it',
 locationPreview:'Live drive map',editReport:'Report details',hideReport:'Hide details',
 reportIntro:'Upload dashcam footage. The model analyses it as it plays, follows your car on the map, and marks every confirmed camel for drivers behind you.',
 reportSafety:'Upload only when safely stopped. Reports are shared with nearby drivers and expire automatically.',
 needCoords:'Enter the start point first (type it, click the map, or use your location).',
 uploading:'Uploading video…',analysing:'Analysing video…',statusFail:'Could not get the analysis status.',maxSize:'Maximum video size: 100 MB',
 gpsAsk:'Requesting location…',gpsOk:'Location added.',gpsFail:'Location unavailable. Enter coordinates manually.',
 detections:'detections'});
Object.assign(translations.ar,{
 foot:'كشف الإبل من مقاطع الداش كام ومشاركتها مع السائقين على خريطة مباشرة.',
 sysChecking:'جاري فحص النظام…',sysReady:'النظام يعمل · المودل جاهز',sysNoModel:'ملف المودل غير موجود',sysOffline:'الخادم غير متصل',
 run:'بلّغ عن إبل',viewDriver:'عرض خريطة المخاطر',
 hazardsFoot:'ظاهرة على الخريطة الآن',reportsFoot:'عمليات الكشف والتأكيد',criticalFoot:'إبل تقترب بسرعة',confirmedFoot:'أكّدها أكثر من سائق',
 mapBar:'السعودية · بلاغات الإبل المباشرة',mapHelp:'أضف مفتاح Maps JavaScript API في ملف .env لتفعيل خرائط Google.',
 footer:'HOBAL · سلامة الطرق المتصلة',footerRight:'YOLO11 · FastAPI · خرائط مباشرة',
 empty:'لا توجد بلاغات نشطة حاليًا.',confirmAction:'تأكيد البلاغ',clearAction:'تم خلو الطريق',
 srcVideo:'مقطع داش كام',srcPhoto:'بلاغ بصورة',srcApi:'مركبة متصلة',
 multi:'أكّده أكثر من سائق',single:'بلاغ واحد',watchVideo:'شاهد المقطع',reported:'أُبلغ عنه',min:'دقيقة',
 driveAlert:'انتبه، إبل على الطريق',analysisNote:'السيارة تمشي مع الفيديو، وتظهر الناقة في مكان تأكيد الكشف',
 locationPreview:'خريطة الرحلة المباشرة',editReport:'تفاصيل البلاغ',hideReport:'إخفاء التفاصيل',
 reportTitle:'شفت إبل على الطريق؟ شارك المقطع.',
 reportIntro:'ارفع مقطع الداش كام، ويحلله المودل أثناء التشغيل، ويتتبع سيارتك على الخريطة، ويحدد كل ناقة مؤكدة للسائقين القادمين خلفك.',
 reportSafety:'ارفع المقطع بعد التوقف في مكان آمن فقط. تُشارك البلاغات مع السائقين القريبين وتنتهي تلقائيًا.',
 mapHint:'تقدر تضغط على الخريطة لتحديد نقطة البداية.',
 needCoords:'حدد نقطة البداية أولًا (اكتبها، أو اضغط على الخريطة، أو استخدم موقعك).',
 uploading:'جاري رفع المقطع…',analysing:'جاري تحليل المقطع…',statusFail:'تعذر جلب حالة التحليل.',maxSize:'الحد الأقصى لحجم المقطع 100 ميجابايت',
 gpsAsk:'جاري تحديد الموقع…',gpsOk:'تمت إضافة الموقع.',gpsFail:'تعذر تحديد الموقع. أدخل الإحداثيات يدويًا.',
 detections:'كشف',waitAnalysis:'جاري تحليل ما أمامك…'});
Object.assign(translations.ur,{
 foot:'ڈیش کیم ویڈیو سے اونٹوں کی شناخت، لائیو نقشے پر ڈرائیوروں کے ساتھ۔',
 sysChecking:'سسٹم کی جانچ…',sysReady:'سسٹم فعال · ماڈل تیار',sysNoModel:'ماڈل فائل موجود نہیں',sysOffline:'سرور دستیاب نہیں',
 run:'اونٹ کی اطلاع دیں',viewDriver:'خطرات کا نقشہ',
 hazardsFoot:'اس وقت نقشے پر',reportsFoot:'شناخت اور تصدیق',criticalFoot:'تیزی سے قریب آتے اونٹ',confirmedFoot:'ایک سے زیادہ ڈرائیوروں کی تصدیق',
 mapBar:'سعودی عرب · اونٹوں کے لائیو خطرات',
 footer:'HOBAL · منسلک سڑکوں کی حفاظت',footerRight:'YOLO11 · FastAPI · لائیو نقشے',
 empty:'اس وقت کوئی فعال خطرہ نہیں۔',confirmAction:'تصدیق کریں',clearAction:'سڑک صاف ہے',
 srcVideo:'ڈیش کیم ویڈیو',srcPhoto:'تصویری رپورٹ',srcApi:'منسلک گاڑی',
 multi:'کئی ڈرائیوروں کی تصدیق',single:'ایک رپورٹ',watchVideo:'ویڈیو دیکھیں',reported:'رپورٹ',min:'منٹ پہلے',
 driveAlert:'آگے سڑک پر اونٹ',analysisNote:'گاڑی ویڈیو کے ساتھ چلتی ہے؛ تصدیق کی جگہ اونٹ کا نشان آتا ہے',
 locationPreview:'لائیو سفر کا نقشہ',editReport:'رپورٹ کی تفصیل',hideReport:'تفصیل چھپائیں',
 needCoords:'پہلے آغاز کا مقام درج کریں۔',uploading:'ویڈیو اپ لوڈ ہو رہی ہے…',analysing:'ویڈیو کا تجزیہ…',statusFail:'تجزیے کی حالت نہیں ملی۔',maxSize:'زیادہ سے زیادہ 100 MB',
 gpsAsk:'مقام معلوم کیا جا رہا ہے…',gpsOk:'مقام شامل ہو گیا۔',gpsFail:'مقام دستیاب نہیں۔',detections:'شناخت',mapHint:'آغاز کا مقام منتخب کرنے کے لیے نقشے پر کلک کریں۔'});
function t(k){return (translations[lang]||translations.en)[k]||translations.en[k]||k}
function setLanguage(l){lang=l;localStorage.setItem('cw_lang',l);document.documentElement.lang=l;document.documentElement.dir=l==='en'?'ltr':'rtl';
 document.querySelectorAll('[data-i]').forEach(el=>{const key=el.dataset.i;if(key==='headline')el.innerHTML=t(key);else el.textContent=t(key)});
 $('lang-current').textContent={en:'English',ar:'العربية',ur:'اردو'}[l];
 document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('selected',b.dataset.lang===l);b.querySelector('small').textContent=b.dataset.lang===l?'✓':''});
 $('lang-menu').hidden=true;$('lang-trigger').setAttribute('aria-expanded','false');render();updateSummary()}
$('lang-trigger').onclick=()=>{let menu=$('lang-menu');menu.hidden=!menu.hidden;$('lang-trigger').setAttribute('aria-expanded',String(!menu.hidden))};document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>setLanguage(b.dataset.lang));document.addEventListener('click',e=>{if(!e.target.closest('.lang-wrap')){$('lang-menu').hidden=true;$('lang-trigger').setAttribute('aria-expanded','false')}});
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function api(url,opts){let r=await fetch(url,opts);if(!r.ok)throw Error(r.status);return r.json()}

/* ---------- one map wrapper: Google Maps when a key is set, otherwise OpenStreetMap ---------- */
let MAPKIND=null;
function loadLeaflet(){if(window.L)return Promise.resolve();return new Promise((ok,bad)=>{const c=document.createElement('link');c.rel='stylesheet';c.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(c);const sc=document.createElement('script');sc.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';sc.onload=ok;sc.onerror=bad;document.head.appendChild(sc)})}
function loadGoogle(key){return new Promise((ok,bad)=>{window.__mapsReady=ok;const sc=document.createElement('script');sc.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(key)+'&callback=__mapsReady&v=weekly';sc.onerror=bad;sc.async=true;document.head.appendChild(sc)})}
const emojiURL=(e,size)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><text x="50%" y="55%" font-size="${Math.round(size*.8)}" text-anchor="middle" dominant-baseline="middle">${e}</text></svg>`);
function makeMap(el,center,zoom){
 el.innerHTML='';
 if(MAPKIND==='g'){
  const m=new google.maps.Map(el,{center:{lat:center[0],lng:center[1]},zoom,streetViewControl:false,mapTypeControl:false,styles:[{featureType:'poi',stylers:[{visibility:'off'}]}]});
  const ll=p=>({lat:p[0],lng:p[1]});
  return {
   marker(p,o){const opt={map:m,position:ll(p),zIndex:o.z||1};
    if(o.emoji)opt.icon={url:emojiURL(o.emoji,o.size),scaledSize:new google.maps.Size(o.size,o.size),anchor:new google.maps.Point(o.size/2,o.size/2)};
    else opt.icon={path:google.maps.SymbolPath.CIRCLE,scale:o.size,fillColor:o.dot,fillOpacity:1,strokeColor:'#fff',strokeWeight:3};
    const mk=new google.maps.Marker(opt);let w=null;
    return {set:q=>mk.setPosition(ll(q)),remove:()=>mk.setMap(null),popup:h=>{w=new google.maps.InfoWindow({content:h});mk.addListener('click',()=>w.open({anchor:mk,map:m}))}}},
   line(color){const l=new google.maps.Polyline({map:m,strokeColor:color,strokeOpacity:.9,strokeWeight:4});return {set:pts=>l.setPath(pts.map(ll)),remove:()=>l.setMap(null)}},
   view(p,z){m.setCenter(ll(p));if(z)m.setZoom(z)},pan(p){m.panTo(ll(p))},
   inView(p){const b=m.getBounds();return !b||b.contains(ll(p))},
   fit(pts){const b=new google.maps.LatLngBounds();pts.forEach(p=>b.extend(ll(p)));m.fitBounds(b,60);if(pts.length===1)m.setZoom(11)},
   onClick(fn){m.addListener('click',e=>fn(e.latLng.lat(),e.latLng.lng()))},resize(){}}}
 const m=L.map(el).setView(center,zoom);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(m);
 return {
  marker(p,o){const mk=o.emoji?L.marker(p,{zIndexOffset:o.z||0,icon:L.divIcon({html:`<div class="rm-emoji" style="font-size:${o.size}px">${o.emoji}</div>`,className:'',iconSize:[o.size,o.size],iconAnchor:[o.size/2,o.size/2]})})
    :L.circleMarker(p,{radius:o.size,fillColor:o.dot,color:'#fff',weight:3,fillOpacity:1});mk.addTo(m);
   return {set:q=>mk.setLatLng(q),remove:()=>mk.remove(),popup:h=>mk.bindPopup(h)}},
  line(color){const l=L.polyline([],{color,weight:4,opacity:.9}).addTo(m);return {set:pts=>l.setLatLngs(pts),remove:()=>l.remove()}},
  view(p,z){m.setView(p,z||m.getZoom())},pan(p){m.panTo(p)},
  inView(p){return m.getBounds().pad(-.2).contains(p)},
  fit(pts){if(pts.length===1)m.setView(pts[0],11);else m.fitBounds(pts,{padding:[50,50]})},
  onClick(fn){m.on('click',e=>fn(e.latlng.lat,e.latlng.lng))},resize(){m.invalidateSize()}}}

/* ---------- hazard network: map, KPIs and feed ---------- */
let hazardMap=null,hazardMarkers=[],fitted=false;
const srcLabel=e=>t(e.source==='manual_video'?'srcVideo':e.source==='manual_photo'?'srcPhoto':'srcApi');
const ago=e=>Math.max(0,Math.floor((Date.now()-Date.parse(e.detected_at))/60000));
function render(){
 const critical=events.filter(x=>x.severity==='critical');
 $('active').textContent=events.length;$('critical').textContent=critical.length;
 $('reports').textContent=events.reduce((n,e)=>n+(e.report_count||1),0);
 $('confirmed').textContent=events.filter(e=>e.report_count>1).length;$('feed-count').textContent=events.length;
 $('feed').innerHTML=events.length?events.slice().reverse().map(e=>`<div class="event" data-id="${esc(e.id)}"><div class="event-icon ${esc(e.severity)}">⚠</div><div class="event-content"><div class="event-title"><strong>${esc(e.road)}</strong><small>${ago(e)} ${t('min')}</small></div><p>${esc(srcLabel(e))} · ${esc(e.id)}</p><span class="tag ${esc(e.severity)}">${esc(t(e.severity==='critical'?'criticalTag':'warningTag'))}</span><span class="event-meta">${Math.round(e.confidence*100)}% · ${t(e.report_count>1?'multi':'single')}</span><div class="event-actions"><button class="confirm-btn" data-confirm="${esc(e.id)}">+ ${t('confirmAction')}</button><button class="confirm-btn ghost" data-clear="${esc(e.id)}">✓ ${t('clearAction')}</button></div></div></div>`).join(''):`<p style="padding:24px;color:#8a9c90">${t('empty')}</p>`;
 document.querySelectorAll('[data-confirm]').forEach(b=>b.onclick=async ev=>{ev.stopPropagation();await api('/api/hazards/'+encodeURIComponent(b.dataset.confirm)+'/corroborate',{method:'POST'});await refresh()});
 document.querySelectorAll('[data-clear]').forEach(b=>b.onclick=async ev=>{ev.stopPropagation();await api('/api/hazards/'+encodeURIComponent(b.dataset.clear)+'/resolve',{method:'POST'});await refresh()});
 document.querySelectorAll('.event').forEach(el=>el.onclick=()=>{const e=events.find(x=>x.id===el.dataset.id);if(hazardMap&&e){hazardMap.view([e.lat,e.lng],13);$('network').scrollIntoView({behavior:'smooth'})}});
 updateMarkers()}
function updateMarkers(){if(!hazardMap)return;hazardMarkers.forEach(x=>x.remove());
 hazardMarkers=events.map(e=>{const m=hazardMap.marker([e.lat,e.lng],{dot:e.severity==='critical'?'#d85f50':'#e6ae58',size:e.severity==='critical'?11:9});
  m.popup(`<div style="font:13px sans-serif;min-width:170px"><b>🐪 ${esc(e.road)}</b><br>${esc(srcLabel(e))} · ${Math.round(e.confidence*100)}%<br><small>${t('reported')} ${ago(e)} ${t('min')} · ${t(e.report_count>1?'multi':'single')}</small>${e.video_url?`<br><a href="${esc(e.video_url)}" target="_blank">▶ ${t('watchVideo')}</a>`:''}</div>`);return m});
 if(!fitted&&events.length){fitted=true;hazardMap.fit(events.map(e=>[e.lat,e.lng]))}}
async function refresh(){try{events=await api('/api/hazards');render()}catch(e){console.warn(e)}}
async function initMaps(){let key='';try{key=(await api('/api/config')).google_maps_api_key||''}catch(e){}
 if(key){try{await loadGoogle(key);MAPKIND='g'}catch(e){}}
 if(!MAPKIND){try{await loadLeaflet();MAPKIND='l'}catch(e){$('map-status').textContent=t('mapUnavailable');return}}
 $('map-status').textContent=MAPKIND==='g'?'GOOGLE MAPS':'OPENSTREETMAP';
 hazardMap=makeMap($('map'),[24.8,44.8],6);updateMarkers();
 initReportMap()}
async function checkSystem(){const el=$('sys-status');try{const s=await api('/api/model/status');el.dataset.i=s.weights_present?'sysReady':'sysNoModel'}catch(e){el.dataset.i='sysOffline'}el.textContent=t(el.dataset.i);el.closest('.pulse-line')?.classList.toggle('bad',el.dataset.i!=='sysReady')}
document.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.side-link').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.target).scrollIntoView({behavior:'smooth'})});
$('go-report').onclick=()=>$('report-section').scrollIntoView({behavior:'smooth'});
$('go-map').onclick=()=>$('network').scrollIntoView({behavior:'smooth'});

/* ---------- live drive: the video plays, the car moves on the map, camels appear when confirmed ---------- */
let RM=null,carMk=null,startMk=null,trail=null,camelMks=[],route=null,job=null;
function initReportMap(){RM=makeMap($('report-map'),[24.8,44.8],7);RM.onClick((la,lo)=>setStart(la,lo));
 $('live-map-status').textContent=MAPKIND==='g'?'GOOGLE MAPS':'OPENSTREETMAP';
 const r=routeFromInputs();if(r){route=r;placeCar([r.lat,r.lng],true)}}
function dest(lat,lng,hd,km){const r=6371,d=km/r,b=hd*Math.PI/180,p1=lat*Math.PI/180,l1=lng*Math.PI/180;
 const p2=Math.asin(Math.sin(p1)*Math.cos(d)+Math.cos(p1)*Math.sin(d)*Math.cos(b));
 const l2=l1+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(p1),Math.cos(d)-Math.sin(p1)*Math.sin(p2));
 return [p2*180/Math.PI,((l2*180/Math.PI)+540)%360-180]}
function routeFromInputs(){const la=parseFloat($('report-lat').value),lo=parseFloat($('report-lng').value);if(!isFinite(la)||!isFinite(lo))return null;return {lat:la,lng:lo,heading:Number($('report-heading').value),speed_kmh:Number($('report-speed').value)||100}}
const posAt=tm=>dest(route.lat,route.lng,route.heading,route.speed_kmh*tm/3600);
function placeCar(p,center){if(!RM)return;if(!startMk)startMk=RM.marker(p,{emoji:'🏁',size:20,z:10});if(!carMk)carMk=RM.marker(p,{emoji:'🚙',size:32,z:1000});else carMk.set(p);if(center)RM.view(p,15)}
const busy=()=>job&&job.status==='processing';
function setStart(la,lo){if(busy())return;$('report-lat').value=la.toFixed(6);$('report-lng').value=lo.toFixed(6);resetStart()}
function resetStart(){if(busy())return;route=routeFromInputs();clearDrive();if(startMk){startMk.remove();startMk=null}if(route)placeCar([route.lat,route.lng],false)}
['report-lat','report-lng','report-heading','report-speed'].forEach(id=>$(id).addEventListener('change',resetStart));

const videoInput=$('report-video'),videoEl=$('report-preview'),overlay=$('detection-overlay');
let videoFrames=[],jobTimer=null,shown=0,lastAlertSeen=null,autoPaused=false,lastPan=0,audioCtx=null;
function clearDrive(){camelMks.forEach(c=>c.remove());camelMks=[];if(trail){trail.remove();trail=null}shown=0;lastAlertSeen=null;$('drive-camels').textContent='0';$('drive-alert').className='drive-alert';$('video-stage').classList.remove('alerting')}
videoInput.addEventListener('change',()=>{const f=videoInput.files[0];if(!f)return;
 if(videoEl.dataset.url)URL.revokeObjectURL(videoEl.dataset.url);
 videoEl.dataset.url=URL.createObjectURL(f);videoEl.src=videoEl.dataset.url;
 $('video-empty').hidden=true;$('video-chip').textContent='VIDEO READY';videoFrames=[];job=null;clearDrive()});

/* layout: after the analysis starts the form folds away so video and map get the full width */
function setCollapsed(on){$('report-form').classList.toggle('collapsed',on);$('report-summary').hidden=false;updateSummary();setTimeout(()=>{RM&&RM.resize();drawBoxes()},350)}
function updateSummary(){const f=videoInput.files[0],c=$('report-form').classList.contains('collapsed');if(!$('rs-text'))return;
 const dir=$('report-heading').selectedOptions[0];
 $('rs-text').textContent=[f?f.name:'',$('report-road').value,($('report-speed').value||'')+' km/h',dir?dir.textContent:''].filter(Boolean).join(' · ');
 const b=$('toggle-form').querySelector('span');b.dataset.i=c?'editReport':'hideReport';b.textContent=t(b.dataset.i)}
$('toggle-form').onclick=()=>setCollapsed(!$('report-form').classList.contains('collapsed'));

function drawBoxes(){
 const ctx=overlay.getContext('2d'),rect=videoEl.getBoundingClientRect();
 if(!rect.width||!rect.height)return;
 if(overlay.width!==Math.round(rect.width*devicePixelRatio)||overlay.height!==Math.round(rect.height*devicePixelRatio)){overlay.width=Math.round(rect.width*devicePixelRatio);overlay.height=Math.round(rect.height*devicePixelRatio)}
 ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ctx.clearRect(0,0,rect.width,rect.height);
 if(!videoFrames.length||!videoEl.videoWidth)return;
 const at=videoEl.currentTime;let frame=null;
 for(const x of videoFrames){if(!frame||Math.abs(x.time-at)<Math.abs(frame.time-at))frame=x}
 if(!frame||Math.abs(frame.time-at)>0.35)return;
 const ratio=Math.min(rect.width/videoEl.videoWidth,rect.height/videoEl.videoHeight);
 const w=videoEl.videoWidth*ratio,h=videoEl.videoHeight*ratio,ox=(rect.width-w)/2,oy=(rect.height-h)/2;
 const fs=Math.max(11,Math.min(14,Math.round(w/50)));ctx.font=`700 ${fs}px system-ui,sans-serif`;ctx.textBaseline='middle';ctx.direction='ltr';ctx.textAlign='left';
 const boxes=frame.detections.map(d=>{const [x1,y1,x2,y2]=d.bbox;return {x:ox+x1*ratio,y:oy+y1*ratio,bw:(x2-x1)*ratio,bh:(y2-y1)*ratio,c:d.confidence}}).sort((a,b)=>b.c-a.c);
 const used=[];
 for(const b of boxes){
  ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.strokeRect(b.x,b.y,b.bw,b.bh);
  ctx.lineWidth=2;ctx.strokeStyle='#4dff9a';ctx.strokeRect(b.x,b.y,b.bw,b.bh);
  const txt='CAMEL '+Math.round(b.c*100)+'%',lw=ctx.measureText(txt).width+12,lh=fs+8;
  let lx=Math.min(Math.max(b.x,ox),ox+w-lw),ly=b.y-lh-2;if(ly<oy)ly=b.y+2;
  if(used.some(u=>lx<u[0]+u[2]&&lx+lw>u[0]&&ly<u[1]+lh&&ly+lh>u[1]))continue;
  used.push([lx,ly,lw]);
  ctx.fillStyle='rgba(6,20,12,.85)';ctx.beginPath();ctx.roundRect?ctx.roundRect(lx,ly,lw,lh,4):ctx.rect(lx,ly,lw,lh);ctx.fill();
  ctx.fillStyle='#4dff9a';ctx.fillText(txt,lx+6,ly+lh/2+1)}}
window.addEventListener('resize',()=>{drawBoxes();RM&&RM.resize();hazardMap&&hazardMap.resize()});
function beep(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();[0,.22,.44].forEach(o=>{const g=audioCtx.createGain(),osc=audioCtx.createOscillator();osc.type='square';osc.frequency.value=880;osc.connect(g);g.connect(audioCtx.destination);g.gain.value=.12;osc.start(audioCtx.currentTime+o);osc.stop(audioCtx.currentTime+o+.14)})}catch(e){}}
function speak(){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t('speech'));u.lang={en:'en-US',ar:'ar-SA',ur:'ur-PK'}[lang];speechSynthesis.speak(u)}

function tick(){
 const tm=videoEl.currentTime||0;
 $('drive-time').textContent=tm.toFixed(1)+' s';
 if(job)$('drive-analysed').textContent=Number(busy()?job.processed_seconds:job.duration||0).toFixed(1)+' s';
 if(route&&RM){const p=posAt(tm);placeCar(p,false);
  if(!trail)trail=RM.line('#2f9e66');const pts=[];for(let k=0;k<=24;k++)pts.push(posAt(tm*k/24));trail.set(pts);
  const n=performance.now();if(!videoEl.paused&&n-lastPan>700){lastPan=n;if(!RM.inView(p))RM.pan(p)}}
 const alerts=((job&&job.alerts)||[]).filter(a=>a.time<=tm+0.05);
 if(alerts.length!==shown&&RM){
  camelMks.forEach(c=>c.remove());
  camelMks=alerts.map(a=>{const m=RM.marker([a.lat,a.lng],{emoji:'🐪',size:36,z:500});m.popup(`<b>🐪 ${a.camels} · ${Math.round(a.confidence*100)}%</b><br>${t('camelPopup')} ${a.time.toFixed(1)}`);return m});
  if(alerts.length>shown&&!videoEl.paused){const a=alerts[alerts.length-1];if(lastAlertSeen!==a.time){lastAlertSeen=a.time;beep();setTimeout(speak,650)}}
  shown=alerts.length;$('drive-camels').textContent=shown;if(shown)refresh()}
 const cur=alerts.filter(a=>tm-a.time<4).pop(),box=$('drive-alert');
 if(cur){box.className='drive-alert show'+(cur.level==='high'?' high':'');$('drive-alert-sub').textContent=`${cur.camels} ${cur.camels>1?t('camelsN'):t('camelOne')} · ${t(cur.level==='high'?'closing':'slowDown')}`}
 else box.className='drive-alert';
 $('video-stage').classList.toggle('alerting',!!cur);
 if(busy()){
  if(!videoEl.paused&&tm>job.processed_seconds+0.6){videoEl.pause();autoPaused=true}
  if(autoPaused&&job.processed_seconds>=tm+1.5){autoPaused=false;videoEl.play().catch(()=>{})}
 }else if(autoPaused){autoPaused=false;videoEl.play().catch(()=>{})}
 $('drive-wait').hidden=!autoPaused;
 drawBoxes();requestAnimationFrame(tick)}
requestAnimationFrame(tick);

$('locate-me').onclick=()=>{if(!navigator.geolocation){$('report-status').textContent=t('gpsFail');return}
 $('report-status').textContent=t('gpsAsk');
 navigator.geolocation.getCurrentPosition(pos=>{$('report-lat').value=pos.coords.latitude.toFixed(6);$('report-lng').value=pos.coords.longitude.toFixed(6);resetStart();if(route&&RM)RM.view([route.lat,route.lng],15);$('report-status').textContent=t('gpsOk')},
  ()=>{$('report-status').textContent=t('gpsFail')},{enableHighAccuracy:true,timeout:12000})};
async function pollVideo(jobId){
 try{const d=await api('/api/reports/video/'+encodeURIComponent(jobId));
  job=d;if(d.route&&!route)route=d.route;
  $('progress-fill').style.width=d.progress+'%';$('progress-text').textContent=d.progress+'%';
  $('detection-count').textContent=d.detections_count+' '+t('detections');
  $('video-chip').textContent=d.status.toUpperCase();videoFrames=d.frames||[];
  $('report-status').textContent=d.status==='processing'?t('analysing')+' '+d.progress+'%':d.message;
  if(d.alerts&&d.alerts.length)$('live-map-status').textContent='● DETECTED';
  if(d.status!=='processing'){clearInterval(jobTimer);jobTimer=null;$('submit-report').disabled=false;refresh()}
 }catch(e){clearInterval(jobTimer);jobTimer=null;$('submit-report').disabled=false;$('report-status').textContent=t('statusFail')}}
$('report-form').onsubmit=async e=>{e.preventDefault();const f=videoInput.files[0];if(!f)return;
 if(f.size>100*1024*1024){$('report-status').textContent=t('maxSize');return}
 route=routeFromInputs();if(!route){$('report-status').textContent=t('needCoords');return}
 const fd=new FormData();fd.append('video',f);fd.append('road',$('report-road').value);
 fd.append('lat',route.lat);fd.append('lng',route.lng);fd.append('speed',route.speed_kmh);fd.append('heading',route.heading);
 fd.append('description',$('report-note').value);
 $('submit-report').disabled=true;$('report-status').textContent=t('uploading');
 $('progress-fill').style.width='0%';$('progress-text').textContent='0%';
 clearDrive();if(startMk){startMk.remove();startMk=null}placeCar([route.lat,route.lng],true);
 try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume()}catch(_){}
 try{const res=await fetch('/api/reports/video',{method:'POST',body:fd});
  const d=await res.json();if(!res.ok)throw Error(d.detail||'Upload failed');
  if(jobTimer)clearInterval(jobTimer);
  job={status:'processing',processed_seconds:0,alerts:[],route};
  setCollapsed(true);$('video-live-anchor')?.scrollIntoView();
  $('report-section').scrollIntoView({behavior:'smooth'});
  videoEl.currentTime=0;videoEl.play().catch(()=>{});
  await pollVideo(d.job_id);
  if(busy())jobTimer=setInterval(()=>pollVideo(d.job_id),500);
 }catch(err){$('report-status').textContent=err.message;$('submit-report').disabled=false}};

setLanguage(lang);refresh();initMaps();checkSystem();setInterval(refresh,8000);setInterval(checkSystem,30000);