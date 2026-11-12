/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- UI text ---------- */
const en = {
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
};
const t = key => en[key] || key;

$('#year').textContent = new Date().getFullYear();

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

// Layout measurements are cached and only refreshed when the page size changes,
// so scrolling never forces the browser to recalculate layout.
let sectionTops = [], maxScroll = 0, ticking = false;

function measure() {
    sectionTops = sections.map(sec => sec.offsetTop);
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
}

function update() {
    ticking = false;
    const y = window.scrollY;

    header.classList.toggle('sticky', y > 50);
    progressBar.style.width = (maxScroll > 0 ? (y / maxScroll) * 100 : 0) + '%';
    backToTop.classList.toggle('show', y > 500);

    let current = sections[0].id;
    sectionTops.forEach((top, i) => {
        if (y >= top - 150) current = sections[i].id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

function onScroll() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
// ResizeObserver callbacks run after layout, so reading sizes here is free.
new ResizeObserver(() => { measure(); onScroll(); }).observe(document.body);
window.addEventListener('resize', () => { measure(); onScroll(); });

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

/* ---------- Skills: grouped technologies (no percentages) ---------- */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
const skillGroups = [
    ['Frontend', 'bx-layout', [
        ['HTML5', 'html5/html5-original'], ['CSS3', 'css3/css3-original'], ['JavaScript', 'javascript/javascript-original'],
        ['TypeScript', 'typescript/typescript-original'], ['React', 'react/react-original'], ['Next.js', 'nextjs/nextjs-original'],
        ['Tailwind CSS', 'tailwindcss/tailwindcss-original']]],
    ['Backend & Database', 'bx-server', [
        ['Node.js', 'nodejs/nodejs-original'], ['Express', 'express/express-original'],
        ['PostgreSQL', 'postgresql/postgresql-original'], ['Prisma', 'prisma/prisma-original']]],
    ['AI & Mobile', 'bx-chip', [
        ['Python', 'python/python-original'], ['FastAPI', 'fastapi/fastapi-original'], ['OpenCV', 'opencv/opencv-original'],
        ['Kotlin', 'kotlin/kotlin-original'], ['Android', 'android/android-original']]],
    ['Tools & Cloud', 'bx-cloud', [
        ['Git', 'git/git-original'], ['GitHub', 'github/github-original'], ['Vercel', 'vercel/vercel-original'], ['Figma', 'figma/figma-original']]]
];
$('#skill-groups').innerHTML = skillGroups.map(([title, icon, items]) => `
    <div class="skill-group">
        <h3><i class='bx ${icon}'></i> ${esc(title)}</h3>
        <div class="tech-row">${items.map(([name, path]) =>
            `<div class="tech"><img src="${DEVICON}/${path}.svg" alt="${esc(name)} logo" loading="lazy" onerror="this.remove()"><span>${esc(name)}</span></div>`).join('')}</div>
    </div>`).join('');

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

/* ---------- Architecture diagrams (inline SVG; colours come from the theme via CSS) ---------- */
let svgUid = 0;
function archSvg(w, h, label, build) {
    const id = `arr${++svgUid}`;
    const box = (x, y, bw, bh, title, lines = []) => {
        const n = lines.length + 1, lh = 17;
        const first = y + bh / 2 - ((n - 1) * lh) / 2 + 5;
        return `<rect class="arch-box" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10"/>` +
            `<text class="arch-t" x="${x + bw / 2}" y="${first}">${esc(title)}</text>` +
            lines.map((l, i) => `<text class="arch-s" x="${x + bw / 2}" y="${first + (i + 1) * lh}">${esc(l)}</text>`).join('');
    };
    const link = (d, both = false) => `<path class="arch-line" d="${d}" marker-end="url(#${id})"${both ? ` marker-start="url(#${id})"` : ''}/>`;
    const line = d => `<path class="arch-line" d="${d}"/>`;
    const text = (x, y, s, cls = 'arch-lbl') => `<text class="${cls}" x="${x}" y="${y}">${esc(s)}</text>`;
    const group = (x, y, gw, gh) => `<rect class="arch-group" x="${x}" y="${y}" width="${gw}" height="${gh}" rx="14"/>`;
    return `<svg class="arch" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">` +
        `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arch-head" d="M0 0L10 5L0 10z"/></marker></defs>` +
        build({ box, link, line, text, group }) + '</svg>';
}

const smartSystemSvg = archSvg(640, 450,
    'Smart Class Management System architecture: users use a React web app on Vercel, which talks to a Node.js and Express API on Render. The API uses PostgreSQL on Neon, a Python FastAPI AI service, Cloudinary media storage, and integrations such as Moodle, Twilio, PayHere or Stripe and Google Sheets.',
    ({ box, link, line }) =>
        box(170, 10, 300, 50, 'Users', ['Admin · Teacher · Student']) + link('M320 60V92') +
        box(170, 92, 300, 72, 'React.js web app', ['Vite · Tailwind CSS · Chart.js', 'hosted on Vercel']) + link('M320 164V196', true) +
        box(170, 196, 300, 72, 'Node.js / Express API', ['JWT · bcrypt · role-based access', 'hosted on Render']) +
        line('M320 268V298') + line('M80 298H560') +
        link('M80 298V328', true) + link('M240 298V328', true) + link('M400 298V328', true) + link('M560 298V328', true) +
        box(10, 328, 140, 112, 'PostgreSQL', ['hosted on Neon']) +
        box(170, 328, 140, 112, 'AI service', ['Python · FastAPI', 'YOLOv8 · OpenCV', 'dlib · MediaPipe']) +
        box(330, 328, 140, 112, 'Cloudinary', ['media storage']) +
        box(490, 328, 140, 112, 'Integrations', ['Moodle · Twilio', 'PayHere / Stripe', 'Google Sheets']));

const smartFlowSvg = archSvg(640, 330,
    'Layered attendance validation: students scan a QR code giving a scanned count, and a CCTV image is analysed by an AI model giving an estimated head count. The two counts are compared. If they match, attendance is accepted. If they differ, face verification runs.',
    ({ box, link, text }) =>
        box(10, 10, 210, 70, 'QR scan', ['students scan the class QR', 'scanned count']) +
        box(420, 10, 210, 70, 'CCTV + AI head count', ['YOLOv8 · OpenCV', 'estimated count']) +
        link('M115 80V108H270V132') + link('M525 80V108H370V132') +
        box(215, 132, 210, 56, 'Compare the two counts') +
        link('M270 188V214H120V240') + link('M370 188V214H520V240') +
        text(195, 207, 'match') + text(445, 207, 'mismatch') +
        box(10, 240, 220, 70, 'Counts match', ['attendance is accepted']) +
        box(410, 240, 220, 70, 'Counts differ', ['face verification runs', '(dlib · MediaPipe)']));

const rideSystemSvg = archSvg(640, 460,
    'RideProfit architecture: on the driver phone an accessibility service reads a ride request from the PickMe or Uber app, a profit engine uses commission, fuel and running cost, and an overlay card shows a green, amber or red rating. History is kept in a Room database. The app syncs with a Node.js API on Vercel that uses PostgreSQL on Neon. A Next.js admin dashboard uses the same API. GitHub Actions runs the tests.',
    ({ box, link, text, group }) =>
        group(10, 10, 290, 440) + text(24, 34, "Driver's phone: Android app", 'arch-gt') + text(24, 52, 'Kotlin · Jetpack Compose', 'arch-gs') +
        box(25, 68, 260, 50, 'PickMe / Uber driver app', ['ride request on screen']) + link('M155 118V146') +
        box(25, 146, 260, 50, 'Accessibility Service', ['reads the fare and distance']) + link('M155 196V224') +
        box(25, 224, 260, 60, 'Profit engine', ['commission · fuel · running cost', 'profit per km']) + link('M155 284V312') +
        box(25, 312, 260, 50, 'Overlay card', ['green / amber / red rating']) + link('M155 362V390') +
        box(25, 390, 260, 50, 'Room database', ['history · expenses · offline cache']) +
        box(360, 30, 270, 66, 'Next.js admin dashboard', ['payments · drivers · analytics', 'hosted on Vercel']) + link('M495 96V146', true) +
        box(360, 146, 270, 104, 'Node.js API', ['Express · TypeScript · Prisma', 'accounts (JWT) · Free / Pro plan', 'billing ledger · fuel prices', 'hosted on Vercel']) +
        link('M495 250V300', true) + box(360, 300, 270, 56, 'PostgreSQL', ['hosted on Neon']) +
        link('M300 198H360', true) + text(330, 188, 'sync') +
        box(360, 390, 270, 60, 'GitHub Actions CI', ['169 unit tests · signed builds']));

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
        shotsDir: 'images/projects/smart-class',
        shots: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'],
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
        shotsDir: 'images/projects/rideprofit',
        portrait: true, // phone screenshots: taller gallery thumbnails
        shots: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
        captions: [
            'Home: setup checklist, active vehicle and today\'s stats',
            'Settings: plan, commission rates and language (English, Sinhala, Tamil)',
            'Settings: fuel prices with automatic Ceypetco updates',
            'Vehicle profiles, each with its own cost per km and green threshold',
            'Pro features: weekly summary, big ride alert and daily profit goal',
            'Upgrade to Pro: what Pro gives you'
        ]
    }
};

projects['smart-class'].diagrams = [
    { title: 'System architecture', svg: smartSystemSvg },
    { title: 'Layered attendance validation', svg: smartFlowSvg }
];
projects['rideprofit'].diagrams = [{ title: 'System architecture', svg: rideSystemSvg }];

const modal = $('#project-modal');
const modalContent = $('#modal-content');
let modalReturnFocus = null;

function openProject(id) {
    const p = projects[id];
    if (!p) return;
    modalReturnFocus = document.activeElement;

    const list = arr => `<ul class="modal-list">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const items = p.shots.map((file, i) => ({
        src: `${p.shotsDir}/${file}`,
        caption: (p.captions && p.captions[i]) || `${p.title} - ${i + 1}`
    }));
    const shotsHtml = items.length
        ? `<h4>${esc(t('m.shots'))}</h4><div class="gallery${p.portrait ? ' portrait' : ''}">${items.map((it, i) =>
            `<button type="button" class="gallery-item" data-i="${i}" title="${esc(it.caption)}" aria-label="Open screenshot: ${esc(it.caption)}"><img src="${esc(it.src)}" alt="${esc(it.caption)}" loading="lazy"></button>`).join('')}</div>`
        : `<p class="modal-empty">${esc(t('m.noshots'))}</p>`;
    modalContent.innerHTML = `
        <h3 id="modal-title">${esc(p.title)}</h3>
        <p class="project-meta">${esc(p.meta)}</p>
        <p class="modal-text">${esc(p.overview)}</p>
        <div class="modal-shots" id="modal-shots">${shotsHtml}</div>
        ${p.problem ? `<div class="case-study">
            <h4>${esc(t('m.problem'))}</h4><p class="modal-text">${esc(p.problem)}</p>
            <h4>${esc(t('m.approach'))}</h4>${list(p.approach)}
            <h4>${esc(t('m.outcome'))}</h4><p class="modal-text">${esc(p.outcome)}</p>
        </div>` : ''}
        ${p.diagrams ? `<h4>Architecture</h4>${p.diagrams.map(d =>
            `<p class="arch-cap">${esc(d.title)}</p><div class="arch-wrap">${d.svg}</div>`).join('')}<p class="arch-hint">Swipe sideways to see the whole diagram.</p>` : ''}
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

    $$('.gallery-item', modalContent).forEach(b => b.addEventListener('click', () => openLightbox(items, +b.dataset.i)));
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (modalReturnFocus) modalReturnFocus.focus();
}

modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
});

// Whole card is clickable with the mouse; keyboard users use the real "View Details" button inside it.
$$('.project-card').forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.project));
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
    <article class="cert-card has-img${i >= CERT_VISIBLE ? ' cert-extra' : ''}" data-i="${i}">
        <button type="button" class="cert-thumb" aria-label="View certificate: ${esc(title)}"><i class='bx bx-award'></i><img src="images/certificates/thumbs/${slug}.webp" alt="${esc(title)} certificate" width="600" height="424" loading="lazy" onerror="this.remove()"></button>
        <div class="cert-body">
            <h3>${esc(title)}</h3>
            <p>${esc(issuer)}</p>
            <span class="cert-year">${esc(date)}</span>
        </div>
    </article>`).join('');

// Grid shows small WebP thumbnails; the lightbox opens the full-size JPG.
const certItems = certs.map(([slug, title]) => ({ src: `images/certificates/${slug}.jpg`, caption: title }));
$$('.cert-card', certGrid).forEach(card => {
    card.addEventListener('click', () => openLightbox(certItems, +card.dataset.i));
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
$$('.about-content, .about-img, .education-content, .skill-group, .skill-extra, .project-card, .cert-card, .contact form, .stat')
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

/* ---------- Email (assembled in JS so scrapers do not harvest it) ---------- */
const emailLink = $('#email-text');
const emailAddr = `${emailLink.dataset.user}@${emailLink.dataset.domain}`;
emailLink.textContent = emailAddr;
emailLink.href = `mailto:${emailAddr}`;
$$('[data-mail]').forEach(a => { a.href = `mailto:${emailAddr}`; });

$('#copy-email').addEventListener('click', async () => {
    const status = $('#copy-status');
    try {
        await navigator.clipboard.writeText(emailAddr);
        status.textContent = 'Email address copied!';
    } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = emailAddr;
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (err) {}
        ta.remove();
        status.textContent = ok ? 'Email address copied!' : emailAddr;
    }
    setTimeout(() => { status.textContent = ''; }, 2500);
});

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


/* ---------- Command palette (Ctrl+K / Cmd+K, or the search button in the header) ---------- */
const palette = $('#palette');
const paletteInput = $('#palette-search');
const paletteList = $('#palette-list');
let paletteItemsShown = [], paletteActive = 0, paletteReturnFocus = null;

function showToast(message) {
    let toast = $('#toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

const goTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};
const openUrl = url => window.open(url, '_blank', 'noopener');

const paletteItems = [
    { group: 'Go to', label: 'Home', icon: 'bx-home', keys: 'top start hero intro', run: () => goTo('home') },
    { group: 'Go to', label: 'About', icon: 'bx-user', keys: 'me bio who', run: () => goTo('about') },
    { group: 'Go to', label: 'Education and experience', icon: 'bx-book', keys: 'university degree internship leo club work', run: () => goTo('education') },
    { group: 'Go to', label: 'Skills', icon: 'bx-code-alt', keys: 'technologies stack tools react node', run: () => goTo('skills') },
    { group: 'Go to', label: 'Projects', icon: 'bx-briefcase', keys: 'work portfolio apps', run: () => goTo('projects') },
    { group: 'Go to', label: 'Certificates', icon: 'bx-award', keys: 'courses certifications workshops', run: () => goTo('certificates') },
    { group: 'Go to', label: 'Contact', icon: 'bx-envelope', keys: 'form message hire reach', run: () => goTo('contact') },
    { group: 'Projects', label: 'Smart Class Management System', icon: 'bx-qr-scan', keys: 'smart class attendance react ai thusitha', run: () => openProject('smart-class') },
    { group: 'Projects', label: 'RideProfit', icon: 'bx-car', keys: 'ride profit android kotlin overlay pickme uber', run: () => openProject('rideprofit') },
    { group: 'Actions', label: 'Download CV', icon: 'bx-download', keys: 'resume pdf', run: () => {
        const a = document.createElement('a');
        a.href = 'cv/Lasitha_Priyasad_CV.pdf';
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } },
    { group: 'Actions', label: 'Send an email', icon: 'bx-envelope', keys: 'mail contact', run: () => { window.location.href = `mailto:${emailAddr}`; } },
    { group: 'Actions', label: 'Copy email address', icon: 'bx-copy', keys: 'mail clipboard', run: async () => {
        try { await navigator.clipboard.writeText(emailAddr); showToast('Email address copied!'); }
        catch (e) { showToast(emailAddr); }
    } },
    { group: 'Actions', label: 'Toggle dark / light theme', icon: 'bx-sun', keys: 'theme mode colour', run: () => themeBtn.click() },
    { group: 'Links', label: 'GitHub', icon: 'bxl-github', keys: 'code repositories', run: () => openUrl('https://github.com/Priyasad010') },
    { group: 'Links', label: 'LinkedIn', icon: 'bxl-linkedin', keys: 'profile network', run: () => openUrl('https://www.linkedin.com/in/lasitha-priyasad-3184732ab') },
    { group: 'Links', label: 'WhatsApp', icon: 'bxl-whatsapp', keys: 'chat message', run: () => openUrl('https://wa.me/94743398128') }
];

function renderPalette() {
    if (!paletteItemsShown.length) {
        paletteList.innerHTML = '<li class="palette-empty">No matches. Try "projects", "cv" or "github".</li>';
        paletteInput.removeAttribute('aria-activedescendant');
        return;
    }
    let lastGroup = '';
    paletteList.innerHTML = paletteItemsShown.map((it, i) => {
        const head = it.group !== lastGroup ? `<li class="palette-group" role="presentation">${esc(it.group)}</li>` : '';
        lastGroup = it.group;
        return `${head}<li id="pal-${i}" role="option" class="palette-item${i === paletteActive ? ' active' : ''}" aria-selected="${i === paletteActive}" data-i="${i}">` +
            `<i class='bx ${it.icon}'></i><span>${esc(it.label)}</span></li>`;
    }).join('');
    paletteInput.setAttribute('aria-activedescendant', `pal-${paletteActive}`);
    const active = $('.palette-item.active', paletteList);
    if (active) active.scrollIntoView({ block: 'nearest' });
}

function filterPalette() {
    const words = paletteInput.value.toLowerCase().split(' ').filter(Boolean);
    paletteItemsShown = paletteItems.filter(it => {
        const hay = `${it.label} ${it.keys} ${it.group}`.toLowerCase();
        return words.every(w => hay.includes(w));
    });
    paletteActive = 0;
    renderPalette();
}

function openPalette() {
    if (!palette.hidden) return;
    paletteReturnFocus = document.activeElement;
    paletteInput.value = '';
    filterPalette();
    palette.hidden = false;
    document.body.classList.add('no-scroll');
    paletteInput.focus();
}

function closePalette() {
    if (palette.hidden) return;
    palette.hidden = true;
    if (modal.hidden && lightbox.hidden) document.body.classList.remove('no-scroll');
    if (paletteReturnFocus && paletteReturnFocus.focus) paletteReturnFocus.focus();
}

function runPaletteItem(i) {
    const item = paletteItemsShown[i];
    if (!item) return;
    closePalette();
    // let the palette close (and focus return) before the action runs
    setTimeout(() => item.run(), 0);
}

paletteInput.addEventListener('input', filterPalette);
paletteInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!paletteItemsShown.length) return;
        paletteActive = (paletteActive + (e.key === 'ArrowDown' ? 1 : -1) + paletteItemsShown.length) % paletteItemsShown.length;
        renderPalette();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        runPaletteItem(paletteActive);
    } else if (e.key === 'Escape') {
        e.stopPropagation();
        closePalette();
    }
});
paletteList.addEventListener('click', e => {
    const li = e.target.closest('.palette-item');
    if (li) runPaletteItem(+li.dataset.i);
});
paletteList.addEventListener('mousemove', e => {
    const li = e.target.closest('.palette-item');
    if (li && +li.dataset.i !== paletteActive) {
        paletteActive = +li.dataset.i;
        $$('.palette-item', paletteList).forEach(n => {
            const on = +n.dataset.i === paletteActive;
            n.classList.toggle('active', on);
            n.setAttribute('aria-selected', on);
        });
        paletteInput.setAttribute('aria-activedescendant', `pal-${paletteActive}`);
    }
});
palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });
$('#palette-btn').addEventListener('click', openPalette);
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.hidden ? openPalette() : closePalette();
    }
});
