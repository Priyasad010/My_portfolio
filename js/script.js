/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Image loader (tries png/jpg/jpeg/webp, resolves null if missing) ---------- */
const EXTS = ['png', 'jpg', 'jpeg', 'webp'];
const imgCache = new Map();
function tryLoad(base) {
    if (imgCache.has(base)) return imgCache.get(base);
    const p = new Promise(resolve => {
        let i = 0;
        const next = () => {
            if (i >= EXTS.length) return resolve(null);
            const src = `${base}.${EXTS[i++]}`;
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = next;
            img.src = src;
        };
        next();
    });
    imgCache.set(base, p);
    return p;
}

/* ---------- Language (English / Sinhala) ---------- */
const en = {};
$$('[data-i18n]').forEach(el => { en[el.dataset.i18n] = el.innerHTML; });
$$('[data-i18n-ph]').forEach(el => { en[el.dataset.i18nPh] = el.getAttribute('placeholder'); });

Object.assign(en, {
    'form.sending': 'Sending...',
    'form.ok': 'Thank you! Your message has been sent.',
    'form.err': 'Oops! Something went wrong. Please try again.',
    'm.problem': 'The Problem',
    'm.approach': 'How I Built It',
    'm.outcome': 'Outcome',
    'm.features': 'Key Features',
    'm.challenges': 'Challenges Solved',
    'm.stack': 'Technology Stack',
    'm.links': 'Links',
    'm.shots': 'Screenshots',
    'm.noshots': 'Screenshots coming soon.',
    'cert.hint': 'Click a certificate to view it larger.',
    'cert.more': 'Show all ({n})',
    'cert.less': 'Show less'
});

const si = {
    'nav.home': 'මුල් පිටුව',
    'nav.about': 'මා ගැන',
    'nav.education': 'අධ්‍යාපනය',
    'nav.skills': 'කුසලතා',
    'nav.projects': 'ව්‍යාපෘති',
    'nav.certs': 'සහතික',
    'nav.contact': 'සම්බන්ධ වන්න',
    'hero.hi': 'ආයුබෝවන්, මම <span>Lasitha Priyasad</span>',
    'hero.p': 'මම නවීන, responsive සහ පරිශීලක-හිතකාමී වෙබ් අඩවි HTML, CSS සහ JavaScript භාවිතයෙන් නිර්මාණය කරන, ඒ ගැන උනන්දුවෙන් සිටින වෙබ් සංවර්ධකයෙක්. පිරිසිදු නිර්මාණය, කාර්යසාධනය සහ භාවිත පහසුව කෙරෙහි අවධානය යොමු කරමින්, නව තාක්ෂණයන් අඛණ්ඩව ඉගෙන ගනිමින් සැබෑ ව්‍යාපෘති ඔස්සේ දියුණු වෙමි.',
    'hero.hire': 'මා බඳවා ගන්න',
    'hero.cv': 'CV බාගන්න',
    'about.h': 'මා <span>ගැන</span>',
    'about.title': 'වෙබ් සංවර්ධක!',
    'about.p': 'මම ශ්‍රී ලංකාවේ ඌව වෙල්ලස්ස විශ්වවිද්‍යාලයේ පරිගණක විද්‍යාව සහ තොරතුරු තාක්ෂණය පිළිබඳ උපාධි අපේක්ෂකයෙක් වන අතර, වෙබ් සංවර්ධනය සහ නිර්මාණය කෙරෙහි දැඩි රුචියක් දක්වමි. HTML, CSS සහ JavaScript භාවිතයෙන් නවීන, responsive සහ පරිශීලක-හිතකාමී වෙබ් අඩවි ගොඩනැගීමට මම දක්ෂයෙක්, පිරිසිදු නිර්මාණය, කාර්යසාධනය සහ භාවිත පහසුව කෙරෙහි විශේෂ අවධානයක් යොමු කරමි. සැබෑ ව්‍යාපෘති හරහා නව තාක්ෂණයන් අඛණ්ඩව ඉගෙන ගනිමින්, ඵලදායී හා ආකර්ෂණීය ඩිජිටල් අත්දැකීම් නිර්මාණය කිරීමට කටයුතු කරමි.',
    'stat.1': 'අවුරුදු අත්දැකීම්',
    'stat.2': 'ප්‍රධාන ව්‍යාපෘති',
    'stat.3': 'සහතික සහ පාඨමාලා',
    'about.contact': 'මා අමතන්න',
    'edu.h': 'මගේ <span>අධ්‍යාපනය</span>',
    'edu.education': 'අධ්‍යාපනය',
    'edu.experience': 'අත්දැකීම්',
    'skills.h': 'මගේ <span>කුසලතා</span>',
    'skills.col1': 'Frontend සහ නිර්මාණය',
    'skills.col2': 'Coding සහ Backend',
    'skills.tech': 'මා භාවිත කරන තාක්ෂණයන්',
    'proj.h': 'මගේ <span>ව්‍යාපෘති</span>',
    'proj.details': 'විස්තර බලන්න',
    'cert.h': 'මගේ <span>සහතික</span>',
    'contact.h': 'මා <span>අමතන්න!</span>',
    'ph.name': 'සම්පූර්ණ නම',
    'ph.email': 'ඊමේල් ලිපිනය',
    'ph.phone': 'ජංගම දුරකථන අංකය',
    'ph.subject': 'විෂයය',
    'ph.message': 'ඔබේ පණිවිඩය',
    'form.submit': 'යවන්න',
    'form.sending': 'යවමින්...',
    'form.ok': 'ස්තූතියි! ඔබේ පණිවිඩය යවන ලදී.',
    'form.err': 'අපොයි! යම් දෙයක් වැරදුණා. කරුණාකර නැවත උත්සාහ කරන්න.',
    'footer.rights': 'සියලුම හිමිකම් ඇවිරිණි.',
    'm.problem': 'ගැටලුව',
    'm.approach': 'මා ගොඩනැගූ ආකාරය',
    'm.outcome': 'ප්‍රතිඵලය',
    'm.features': 'ප්‍රධාන ලක්ෂණ',
    'm.challenges': 'විසඳූ ගැටලු',
    'm.stack': 'තාක්ෂණ සමුච්චය',
    'm.links': 'සබැඳි',
    'm.shots': 'Screenshots',
    'm.noshots': 'Screenshots ඉක්මනින් එකතු කරනු ලැබේ.',
    'cert.hint': 'විශාල කර බැලීමට සහතිකය මත click කරන්න.',
    'cert.more': 'සියල්ල පෙන්වන්න ({n})',
    'cert.less': 'අඩුවෙන් පෙන්වන්න'
};

let lang = document.documentElement.getAttribute('lang') === 'si' ? 'si' : 'en';
const t = key => (lang === 'si' && si[key]) || en[key] || key;

function applyLang() {
    document.documentElement.setAttribute('lang', lang);
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', t(el.dataset.i18nPh)));
    $('#lang-toggle').textContent = lang === 'si' ? 'EN' : 'සිං';
    $('#year').textContent = new Date().getFullYear();
    const hint = $('#cert-hint');
    if (hint) hint.textContent = t('cert.hint');
    if (typeof updateCertToggle === 'function') updateCertToggle();
}

$('#lang-toggle').addEventListener('click', () => {
    lang = lang === 'si' ? 'en' : 'si';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
});

/* ---------- Preloader ---------- */
const preloader = $('#preloader');
const hidePreloader = () => preloader && preloader.classList.add('hide');
window.addEventListener('load', () => setTimeout(hidePreloader, 300));
setTimeout(hidePreloader, 4000); // safety net

/* ---------- Mobile menu ---------- */
const menuIcon = $('#menu-icon');
const navbar = $('.navbar');

menuIcon.addEventListener('click', () => {
    const open = navbar.classList.toggle('active');
    menuIcon.classList.toggle('bx-x', open);
    menuIcon.classList.toggle('bx-menu', !open);
    menuIcon.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

$$('.navbar a').forEach(link =>
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
        menuIcon.classList.add('bx-menu');
    })
);

/* ---------- Theme toggle ---------- */
const themeBtn = $('#theme-toggle');
const themeIcon = $('i', themeBtn);

function applyThemeIcon() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    themeIcon.className = light ? 'bx bx-moon' : 'bx bx-sun';
}
applyThemeIcon();

themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    applyThemeIcon();
});

/* ---------- Scroll: sticky header, active link, progress, back-to-top ---------- */
const header = $('.header');
const sections = $$('main section');
const navLinks = $$('.navbar a');
const progressBar = $('#scroll-progress');
const backToTop = $('#back-to-top');

function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('sticky', y > 50);
    progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    backToTop.classList.toggle('show', y > 500);

    let current = sections[0].id;
    sections.forEach(sec => {
        if (y >= sec.offsetTop - 150) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Typing animation ---------- */
const typingEl = $('#typing');
const roles = ['Web Developer', 'Full-Stack Developer', 'UI Designer', 'Graphic Designer'];
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
    const word = roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    typingEl.textContent = word.slice(0, charIdx);

    let delay = deleting ? 50 : 110;
    if (!deleting && charIdx === word.length) {
        deleting = true;
        delay = 1500;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 400;
    }
    setTimeout(type, delay);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingEl.textContent = roles[0];
} else {
    type();
}

/* ---------- Tech logo grid ---------- */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
const techs = [
    ['HTML5', 'html5/html5-original'], ['CSS3', 'css3/css3-original'],
    ['JavaScript', 'javascript/javascript-original'], ['TypeScript', 'typescript/typescript-original'],
    ['React', 'react/react-original'], ['Next.js', 'nextjs/nextjs-original'],
    ['Tailwind CSS', 'tailwindcss/tailwindcss-original'], ['Node.js', 'nodejs/nodejs-original'],
    ['Express', 'express/express-original'], ['PostgreSQL', 'postgresql/postgresql-original'],
    ['Prisma', 'prisma/prisma-original'], ['Python', 'python/python-original'],
    ['FastAPI', 'fastapi/fastapi-original'], ['OpenCV', 'opencv/opencv-original'],
    ['Kotlin', 'kotlin/kotlin-original'], ['Android', 'android/android-original'],
    ['Git', 'git/git-original'], ['GitHub', 'github/github-original'],
    ['Vercel', 'vercel/vercel-original'], ['Figma', 'figma/figma-original']
];
$('#tech-grid').innerHTML = techs.map(([name, path]) =>
    `<div class="tech reveal"><img src="${DEVICON}/${path}.svg" alt="${esc(name)} logo" loading="lazy" onerror="this.remove()"><span>${esc(name)}</span></div>`
).join('');

/* ---------- Lightbox ---------- */
const lightbox = $('#lightbox');
const lbImg = $('#lb-img');
const lbCaption = $('#lb-caption');
let lbItems = [], lbIndex = 0, lbReturnFocus = null;

function showLb() {
    const item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.caption || '';
    lbCaption.textContent = item.caption || '';
    const multi = lbItems.length > 1;
    $('.lb-prev').style.display = multi ? '' : 'none';
    $('.lb-next').style.display = multi ? '' : 'none';
}

function openLightbox(items, index = 0) {
    lbItems = items;
    lbIndex = index;
    lbReturnFocus = document.activeElement;
    showLb();
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    $('.overlay-close', lightbox).focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = '';
    if (modal.hidden) document.body.classList.remove('no-scroll');
    if (lbReturnFocus) lbReturnFocus.focus();
}

$('.lb-prev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showLb(); });
$('.lb-next').addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbItems.length; showLb(); });
lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.closest('[data-close]')) closeLightbox();
});

/* ---------- Project data + modal ---------- */
const projects = {
    'smart-class': {
        title: 'Smart Class Management System',
        meta: 'Group Project · IIT 372-2 Project II · Department of Computer Science and Informatics, Uva Wellassa University',
        overview: 'A centralized web-based platform developed for Thusitha Institute that brings the key academic and administrative operations of a tuition institute into a single system. Built as a group project using an Agile–Scrum methodology across four sprints: system architecture, smart attendance and payments, study area management, examinations, website management, testing and deployment.',
        features: [
            'Role-based authentication and access control',
            'Student and teacher management',
            'Class, subject and timetable management',
            'QR-based smart attendance',
            'AI-assisted classroom occupancy detection',
            'Conditional face verification for attendance validation',
            'Payment and receipt management',
            'Smart study area and library seat allocation',
            'Examination and result management',
            'Automated parent notifications via WhatsApp/SMS',
            'Learning material management and Moodle integration',
            'Reporting, monitoring and audit logging',
            'Dynamic institute website and promotional management'
        ],
        highlight: ['Layered attendance validation', 'Instead of relying only on QR scanning, the system compares the number of scanned students with the classroom occupancy estimated through computer vision. Face verification is triggered only when a mismatch is detected, which reduces unnecessary biometric processing.'],
        stack: [
            ['Frontend', 'React.js, Tailwind CSS, Vite, Chart.js'],
            ['Backend', 'Node.js, Express.js, JWT, bcrypt'],
            ['Database', 'PostgreSQL'],
            ['AI / Computer Vision', 'Python, FastAPI, YOLOv8, OpenCV, dlib, MediaPipe'],
            ['Integrations', 'Moodle, WhatsApp, Twilio, Stripe, Google Sheets API'],
            ['Deployment', 'Vercel, Render, Neon, Cloudinary']
        ],
        learned: 'Hands-on experience in full-stack development, database design, AI / computer vision integration, system architecture, API development, cloud deployment, testing and teamwork.',
        problem: 'The key academic and administrative operations of a tuition institute (attendance, payments, exams, study areas and parent communication) needed to live in one centralized system instead of being handled separately.',
        approach: [
            'Worked in four Agile–Scrum sprints covering system architecture, smart attendance and payments, study area management, examinations, website management, testing and deployment.',
            'Designed attendance as layers: a QR scan first, a computer-vision occupancy estimate to cross-check the count, and face verification only when the two numbers do not match.',
            'Built the AI / computer vision features with Python, FastAPI, YOLOv8, OpenCV, dlib and MediaPipe, alongside the React and Node.js / PostgreSQL system.'
        ],
        outcome: 'Delivered as the IIT 372-2 group project for Thusitha Institute, covering design, implementation, testing and cloud deployment (Vercel, Render, Neon, Cloudinary).',
        links: [],
        shots: 'images/projects/smart-class',
        captions: [
            'Public institute website (Sinhala, teacher showcase)',
            'Admin dashboard: students, users, monthly income and quick actions',
            'Student home: enrolled classes',
            'QR attendance: live session QR code with present / absent counts',
            'AI attendance observation: CCTV upload and QR vs AI head-count mismatch alert',
            'Online class fee payment (PayHere sandbox)',
            'Student exams and results with grades',
            'Teacher learning materials powered by Moodle'
        ]
    },
    'rideprofit': {
        title: 'RideProfit',
        meta: 'Personal Full-Stack Project · Android app + API + Admin dashboard',
        overview: 'RideProfit helps ride-hailing drivers in Sri Lanka decide in a second whether a request is worth taking. A floating card appears over the ride-hailing driver app and rates the ride green, amber or red, using the driver\'s own commission, fuel price and vehicle running cost. Built end to end: Android app, API, admin dashboard and a bank-transfer billing system, in English, Sinhala and Tamil. Built and unit-tested; currently in testing.',
        features: [
            'Accessibility-service screen reader and overlay card (Kotlin, Jetpack Compose)',
            'Room database with migrations, spoken and vibration alerts',
            'History, best working hours, daily profit goal and expense tracker',
            'CSV report sharing and weekly summary notification',
            'Free and Pro plans: the server decides who is Pro, the app caches the answer so it works offline',
            'Backend with driver accounts, JWT auth, billing ledger with void support, fuel price sync and app update policy',
            'Admin dashboard for payments, drivers and analytics in three languages',
            '169 unit tests, GitHub Actions CI, signed release builds with R8, privacy policy page and in-app permission disclosure'
        ],
        highlight: null,
        challenges: [
            'Reading screens without touching them',
            'Fair profit maths (no double-counted fuel)',
            'A payment flow that works with bank transfers',
            'A UI that works in three scripts (English, Sinhala, Tamil)'
        ],
        stack: [
            ['Android', 'Kotlin, Jetpack Compose, Room, WorkManager, AccessibilityService'],
            ['Backend', 'Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon)'],
            ['Admin dashboard', 'Next.js, Tailwind CSS'],
            ['Tooling', 'Vercel, GitHub Actions']
        ],
        learned: null,
        problem: 'Ride-hailing drivers have only a few seconds to accept or reject a request, and it is hard to tell whether it is really profitable once commission, fuel and pickup distance are counted.',
        approach: [
            'An accessibility service reads the ride request on screen without touching it, and a floating overlay card rates it green, amber or red using the driver\'s own commission, fuel price and vehicle running cost.',
            'Profit-per-km maths designed so that costs such as fuel are never double-counted.',
            'Free and Pro plans are decided by the server, and the answer is cached in the app so it still works offline.',
            'A bank-transfer billing flow with a ledger that supports voiding entries, plus an admin dashboard for payments, drivers and analytics.',
            'A full English, Sinhala and Tamil interface in the app and the dashboard.'
        ],
        outcome: 'Built end to end and unit-tested with 169 tests, GitHub Actions CI and signed release builds. Currently in testing.',
        links: [
            ['Privacy Policy', 'https://rideprofit-api.vercel.app/privacy?lang=en', 'bx-link-external'],
            ['Download APK', 'https://rideprofit-api.vercel.app/downloads/rideprofit.apk', 'bxl-android']
        ],
        note: 'Independent project, not affiliated with PickMe or Uber.',
        shots: 'images/projects/rideprofit'
    }
};

const modal = $('#project-modal');
const modalContent = $('#modal-content');
let modalReturnFocus = null;

async function loadShots(basePath) {
    const found = await Promise.all(Array.from({ length: 8 }, (_, i) => tryLoad(`${basePath}/${i + 1}`)));
    return found.map((src, i) => src && { src, n: i + 1 }).filter(Boolean);
}

async function openProject(id) {
    const p = projects[id];
    if (!p) return;
    modalReturnFocus = document.activeElement;

    const list = arr => `<ul class="modal-list">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    modalContent.innerHTML = `
        <h3 id="modal-title">${esc(p.title)}</h3>
        <p class="project-meta">${esc(p.meta)}</p>
        <p class="modal-text">${esc(p.overview)}</p>
        <div class="modal-shots" id="modal-shots"><p class="modal-empty">${esc(t('m.noshots'))}</p></div>
        ${p.problem ? `<div class="case-study">
            <h4>${esc(t('m.problem'))}</h4><p class="modal-text">${esc(p.problem)}</p>
            <h4>${esc(t('m.approach'))}</h4>${list(p.approach)}
            <h4>${esc(t('m.outcome'))}</h4><p class="modal-text">${esc(p.outcome)}</p>
        </div>` : ''}
        <h4>${esc(t('m.features'))}</h4>
        ${list(p.features)}
        ${p.highlight ? `<div class="modal-highlight"><strong>${esc(p.highlight[0])}</strong><p>${esc(p.highlight[1])}</p></div>` : ''}
        ${p.challenges ? `<h4>${esc(t('m.challenges'))}</h4>${list(p.challenges)}` : ''}
        <h4>${esc(t('m.stack'))}</h4>
        <ul class="modal-stack">${p.stack.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')}</ul>
        ${p.learned ? `<p class="modal-text">${esc(p.learned)}</p>` : ''}
        ${p.links.length ? `<div class="project-links">${p.links.map(([label, href, icon]) =>
            `<a href="${esc(href)}" target="_blank" rel="noopener"><i class='bx ${icon}'></i> ${esc(label)}</a>`).join('')}</div>` : ''}
        ${p.note ? `<p class="project-note">${esc(p.note)}</p>` : ''}
    `;

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('.overlay-close', modal).focus();
    $('.modal-box', modal).scrollTop = 0;

    const shots = await loadShots(p.shots);
    const box = $('#modal-shots');
    if (!box || modal.hidden || !shots.length) return;
    const items = shots.map(({ src, n }) => ({ src, caption: (p.captions && p.captions[n - 1]) || `${p.title} - ${n}` }));
    box.innerHTML = `<h4>${esc(t('m.shots'))}</h4><div class="gallery">${items.map((it, i) =>
        `<button class="gallery-item" data-i="${i}" title="${esc(it.caption)}" aria-label="Open screenshot: ${esc(it.caption)}"><img src="${esc(it.src)}" alt="${esc(it.caption)}" loading="lazy"></button>`).join('')}</div>`;
    $$('.gallery-item', box).forEach(b => b.addEventListener('click', () => openLightbox(items, +b.dataset.i)));
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (modalReturnFocus) modalReturnFocus.focus();
}

modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
});

$$('.project-card').forEach(card => {
    const open = () => openProject(card.dataset.project);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
    // Use the first available screenshot as the card thumbnail
    const base = `images/projects/${card.dataset.project}`;
    Promise.all([tryLoad(`${base}/cover`), tryLoad(`${base}/1`)]).then(([cover, first]) => {
        const src = cover || first;
        if (src) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${card.querySelector('h3').textContent} preview`;
            $('.project-thumb', card).appendChild(img);
        }
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (!lightbox.hidden) closeLightbox();
        else if (!modal.hidden) closeModal();
    } else if (!lightbox.hidden && lbItems.length > 1) {
        if (e.key === 'ArrowLeft') $('.lb-prev').click();
        if (e.key === 'ArrowRight') $('.lb-next').click();
    }
});

/* ---------- Certificates ---------- */
const certs = [
    ['azure-basics', 'Introduction to the Basics of Azure Services', 'Microsoft Learning via Simplilearn SkillUP', '22 Oct 2026'],
    ['pmp-basics', 'PMP Basics', 'Simplilearn SkillUP', '21 Oct 2026'],
    ['business-analytics-with-excel', 'Business Analytics with Excel', 'Microsoft Learning via Simplilearn SkillUP', '8 Jan 2026'],
    ['web-development-internship', 'Web Development Intern - Offer Letter', 'SaiKet Systems', '3 Jan 2026'],
    ['deepseek-for-beginners', 'DeepSeek for Beginners', 'Simplilearn SkillUP', '2 Jan 2026'],
    ['python-for-beginners', 'Python for Beginners', 'CODL, University of Moratuwa', '2 Jan 2026'],
    ['ai-ml-engineer-stage-1', 'AI/ML Engineer - Stage 1', 'SLIIT, Faculty of Computing', '23 Nov 2025'],
    ['creative-design-workshop-oct-2025', 'Creative Design Workshop (Season 22)', 'Southern IRAA', '25-27 Oct 2025'],
    ['creative-design-workshop-may-2025', 'Creative Design Workshop (Season 20)', 'Southern IRAA', '23-24 May 2025'],
    ['web-design-for-beginners', 'Web Design for Beginners', 'CODL, University of Moratuwa', '2025'],
    ['front-end-web-development', 'Front-End Web Development', 'CODL, University of Moratuwa', '2024 - 2025'],
    ['python-workshop-2024', 'Programming with Python Workshop (Season 09)', 'Southern IRAA', '7-8 Aug 2024']
];

const CERT_VISIBLE = 6;
const certGrid = $('#cert-grid');
const certToggle = $('#cert-toggle');
let certsExpanded = false;

certGrid.innerHTML = certs.map(([slug, title, issuer, date], i) => `
    <article class="cert-card has-img${i >= CERT_VISIBLE ? ' cert-extra' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="View certificate: ${esc(title)}">
        <div class="cert-thumb"><i class='bx bx-award'></i><img src="images/certificates/${slug}.jpg" alt="${esc(title)} certificate" loading="lazy" onerror="this.remove()"></div>
        <div class="cert-body">
            <h3>${esc(title)}</h3>
            <p>${esc(issuer)}</p>
            <span class="cert-year">${esc(date)}</span>
        </div>
    </article>`).join('');

const certItems = certs.map(([slug, title]) => ({ src: `images/certificates/${slug}.jpg`, caption: title }));
$$('.cert-card', certGrid).forEach(card => {
    const open = () => openLightbox(certItems, +card.dataset.i);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
});

function updateCertToggle() {
    certGrid.classList.toggle('expanded', certsExpanded);
    certToggle.textContent = certsExpanded ? t('cert.less') : t('cert.more').replace('{n}', certs.length);
}

certToggle.addEventListener('click', () => {
    certsExpanded = !certsExpanded;
    updateCertToggle();
    if (!certsExpanded) $('#certificates').scrollIntoView({ behavior: 'smooth' });
});

const certHint = document.createElement('p');
certHint.id = 'cert-hint';
certHint.className = 'cert-hint';
certHint.textContent = t('cert.hint');
$('.cert-more').after(certHint);
updateCertToggle();

/* ---------- Scroll reveal, skill bars, counters ---------- */
$$('.about-content, .about-img, .education-content, .skills-column, .project-card, .cert-card, .contact form, .stat, .tech-title')
    .forEach(el => el.classList.add('reveal'));

function animateCount(el) {
    const target = +el.dataset.target;
    const duration = 1500;
    const start = performance.now();
    (function step(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * p);
        if (p < 1) requestAnimationFrame(step);
    })(start);
}

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('show');
        $$('.progress', el).forEach(p => p.classList.add('show'));
        $$('.count', el).forEach(animateCount);
        obs.unobserve(el);
    });
}, { threshold: 0.15 });

$$('.reveal').forEach(el => observer.observe(el));

/* ---------- Contact form (AJAX via Formspree) ---------- */
const form = $('#contact-form');
const statusEl = $('#form-status');
const submitBtn = $('#submit-btn');

form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.className = '';
    statusEl.textContent = t('form.sending');
    submitBtn.disabled = true;

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        statusEl.className = 'success';
        statusEl.textContent = t('form.ok');
    } catch (err) {
        statusEl.className = 'error';
        statusEl.textContent = t('form.err');
    } finally {
        submitBtn.disabled = false;
    }
});

/* ---------- Init ---------- */
applyLang();
