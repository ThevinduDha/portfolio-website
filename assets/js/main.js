/**
 * THEVINDU DHARMADASA - PORTFOLIO CORE SCRIPTS
 * Interactive UX, Theme Management, Dual Resume Engine, Modals & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initNavbarScroll();
  initScrollSpy();
  initCounterStats();
  initSkillsFiltering();
  initProjectModal();
  initResumeModal();
  initTerminalTabs();
  initContactForm();
  initScrollTop();
  initMobileDrawer();
  initSriLankaClock();
});

/* ==========================================================================
   1. THEME TOGGLING (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const mobileToggleBtn = document.getElementById('mobile-theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default to dark for premium cyber-editorial feel
  setTheme(initialTheme, false);

  function toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', toggle);
}

function setTheme(theme, notify = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (notify) {
    showToast(
      theme === 'dark' ? '🌙 Dark theme activated' : '☀️ Light theme activated',
      'info'
    );
  }
}

/* ==========================================================================
   2. HERO TYPING ANIMATION
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('hero-typing-text');
  if (!typingElement) return;

  const titles = [
    "Data Science Undergraduate & Analyst",
    "Machine Learning & Deep Learning Developer",
    "Full-Stack Software Engineer (React, Spring Boot)",
    "Aspiring Data Engineer (ETL, SSIS, Star Schema)",
    "Champion @ SLIIT Mini Hackathon 2026"
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 75;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 70;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 800);
}

/* ==========================================================================
   3. NAVBAR SCROLL & ACTIVE SPY
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. ANIMATED STATS COUNTER
   ========================================================================== */
function initCounterStats() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const targetStr = counter.getAttribute('data-target');
          const isDecimal = targetStr.includes('.');
          const target = parseFloat(targetStr);
          const duration = 1800;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = start + (target - start) * easeOut;

            if (isDecimal) {
              counter.textContent = currentVal.toFixed(1);
            } else {
              counter.textContent = Math.floor(currentVal).toLocaleString();
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = targetStr;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   5. RESUME MANAGEMENT (DUAL CV TRACKS)
   ========================================================================== */
window.downloadResume = function(track) {
  let fileUrl = '';
  let fileName = '';
  let trackName = '';

  if (track === 'ds') {
    fileUrl = 'assets/cv/Thevindu_Dharmadasa_DataScience_CV.pdf';
    fileName = 'Thevindu_Dharmadasa_DataScience_CV.pdf';
    trackName = 'Data Science & AI';
  } else {
    fileUrl = 'assets/cv/Thevindu_Dharmadasa_SoftwareEngineering_CV.pdf';
    fileName = 'Thevindu_Dharmadasa_SoftwareEngineering_CV.pdf';
    trackName = 'Software Engineering';
  }

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`📄 Downloading Thevindu's ${trackName} CV...`, 'success');
};

function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-modal-btn');
  const closeBtn = document.getElementById('close-resume-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   6. SKILLS & TECHNICAL ARSENAL FILTERING
   ========================================================================== */
function initSkillsFiltering() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.96)';
          setTimeout(() => {
            const currentActiveBtn = document.querySelector('.skills-filter-nav .filter-btn.active');
            const currentFilter = currentActiveBtn ? currentActiveBtn.getAttribute('data-filter') : 'all';
            if (currentFilter !== 'all' && !categories.includes(currentFilter)) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT DEEP-DIVE MODAL
   ========================================================================== */
const projectDetailsData = {
  agrishield: {
    title: "AgriShield AI: Crop Disease Early Warning System",
    category: "Machine Learning • Computer Vision • Geospatial AI",
    timeline: "Sep 2026 – Oct 2026",
    role: "Machine Learning & Data Science Developer",
    techStack: ["Python", "PyTorch", "EfficientNet-B0", "OpenCV", "Scikit-learn", "FastAPI", "React", "Leaflet", "Supabase", "Google Gemini API"],
    description: "An end-to-end agricultural intelligence platform giving farmers real-time crop disease diagnosis and automated early warning capabilities across agrarian regions in Sri Lanka.",
    highlights: [
      "Trained an EfficientNet-B0 classifier with PyTorch transfer learning across 20,000+ PlantVillage images spanning 15 crop disease classes.",
      "Engineered automated disease severity grading using OpenCV HSV color-space analysis to compute necrotic surface area ratios.",
      "Built an outbreak surveillance system with Leaflet geospatial mapping, clustering disease incidences into live regional risk zones.",
      "Human-in-the-loop triage pipeline that escalates low-confidence or high-severity cases directly to agricultural extension officers.",
      "Integrated Google Gemini API to generate actionable treatment recommendations in English, Sinhala, and Tamil alongside Open-Meteo weather hazard warnings."
    ],
    github: "https://github.com/ThevinduDha"
  },
  studyai: {
    title: "StudyAI: AI-Powered Grounded Learning Platform",
    category: "RAG Pipeline • Vector Embeddings • MERN Stack",
    timeline: "Sep 2026",
    role: "Full-Stack & AI Developer",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Python", "RAG", "Google text-embedding-004", "Cosine Similarity", "Google Gemini API"],
    description: "A full-stack grounded study platform transforming dense academic textbooks and course notes into context-verified flashcards, interactive quizzes, and synthesized study guides.",
    highlights: [
      "Engineered a Retrieval-Augmented Generation (RAG) architecture using semantic document chunking and Google text-embedding-004 vectors.",
      "Implemented high-speed cosine similarity search in Python to pull relevant context chunks with verified page/source citations.",
      "Developed context-aware MCQ generation and flashcard review workflows using Google Gemini API to eliminate hallucination.",
      "Full MERN stack web app with JWT authentication, document uploads, and structured MongoDB schema for revision history."
    ],
    github: "https://github.com/ThevinduDha/studyAI"
  },
  olist_dw: {
    title: "Enterprise E-Commerce Data Warehouse & BI Pipeline (Olist)",
    category: "Data Engineering • Star Schema • SSIS ETL • Power BI",
    timeline: "Sep 2026 – Oct 2026",
    role: "Data Engineer & BI Developer",
    techStack: ["Python", "SQL Server (MSSQL)", "SSIS", "ETL", "Data Modeling", "Star Schema", "Power BI", "DAX", "REST APIs"],
    description: "An enterprise-grade analytical data warehouse designed and built from scratch for 99,000+ Brazilian e-commerce transactions across diverse fragmented data sources.",
    highlights: [
      "Extracted and integrated data from SQL Server, CSV, JSON, Excel, and external REST APIs using custom Python ingestion scripts.",
      "Engineered robust SSIS ETL workflows with data cleaning, schema reconciliation, deduplication, and surrogate key generation.",
      "Modeled a Star Schema with a central FACT_SALES table and departmental data marts for sales, customer logistics, and product reviews.",
      "Created interactive Power BI dashboards utilizing advanced DAX measures to track customer acquisition cost (CAC), churn, and category margins."
    ],
    github: "https://github.com/ThevinduDha/IT3101-Olist-DWBI"
  },
  hardware_restock: {
    title: "Smart Hardware Inventory & ML Restocking Predictor (Athukorala Traders)",
    category: "Full-Stack SE • Machine Learning • Java Spring Boot",
    timeline: "Jan 2026 – Jun 2026",
    role: "Full-Stack & Machine Learning Developer",
    techStack: ["Java", "Spring Boot", "MySQL", "JWT", "Scikit-learn", "XGBoost", "Joblib", "PayHere Sandbox", "Git"],
    description: "An intelligent management and inventory replenishment system for Athukorala Traders hardware enterprise featuring predictive demand analytics.",
    highlights: [
      "Engineered a dual-model restocking intelligence engine with Scikit-learn and XGBoost to classify replenishment urgency and predict reorder quantity.",
      "Derived rolling sales averages, demand pressure indicators, lag sales, and lead time metrics to feed the predictive models.",
      "Seamlessly linked ML models with the Java Spring Boot backend via Joblib and ProcessBuilder, generating live restock recommendations.",
      "Engineered the Discounts & Promotion engine with full CRUD, scheduling, live price synchronization, and PayHere Sandbox payment integration."
    ],
    github: "https://github.com/ThevinduDha/Athukorala-Traders-System"
  },
  lankarail: {
    title: "LankaRail: Web-Based Train Reservation System",
    category: "Software Engineering • Spring Boot • MySQL",
    timeline: "University Software Engineering Project (Y2S1)",
    role: "Backend & Systems Developer",
    techStack: ["Java", "Spring Boot", "MySQL", "Bootstrap", "JWT Authentication", "REST APIs", "Postman", "Agile"],
    description: "A comprehensive passenger train booking and schedule management platform built for Sri Lanka Railways with enterprise-level security and role-based permissions.",
    highlights: [
      "Architected backend micro-services with Spring Boot and JPA/Hibernate for train schedules, route stations, and passenger reservations.",
      "Implemented secure JWT authentication with role-based access control (RBAC) separating passengers and station managers.",
      "Engineered the core Train Management CRUD module, fare calculator, seat availability checks, and automatic PDF e-ticket issuance.",
      "Tested API endpoints with Postman and followed Agile sprint workflows in a 6-member engineering squad."
    ],
    github: "https://github.com/ThevinduDha/Train-Reservation-Website"
  },
  groove_haven: {
    title: "Groove Haven: Online Music Store & Streaming Platform",
    category: "Full-Stack SE • React Vite • Spring Boot • Audio Streaming",
    timeline: "Academic & Personal Full-Stack Project",
    role: "Full-Stack Developer",
    techStack: ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "React.js (Vite)", "MySQL", "REST APIs", "CSS3"],
    description: "A feature-rich social music streaming application enabling users to stream tracks, curate custom playlists, comment, and empower artists with analytics.",
    highlights: [
      "Engineered a custom React audio player with play/pause, scrub slider, volume control, track queues, and duration indicators.",
      "Designed a normalized relational MySQL schema with Hibernate ORM covering artists, albums, tracks, likes, and nested comments.",
      "Built an artist analytics dashboard to monitor streaming frequency, listener engagement trends, and royalty summaries.",
      "Supported multipart media file uploads for audio tracks and high-resolution album cover artwork."
    ],
    github: "https://github.com/ThevinduDha/Groove-Haven-Music-Store"
  },
  walmart_analytics: {
    title: "Walmart Sales Data Analysis & SQL Insights",
    category: "Data Analytics • SQL • Exploratory Data Analysis",
    timeline: "Jul 2026 – Present",
    role: "Data Analyst",
    techStack: ["PostgreSQL", "SQL", "Jupyter Notebook", "Python", "Data Cleansing"],
    description: "In-depth exploratory data analysis and database query modeling on 10,000+ sales records from Walmart branches.",
    highlights: [
      "Extracted customer purchasing trends, branch-level profit benchmarks, and peak sales timeframes using complex SQL queries.",
      "Structured a robust relational database schema and applied data cleaning methods on missing values and anomalies.",
      "Generated business insights into product line profitability and customer satisfaction scores."
    ],
    github: "https://github.com/ThevinduDha/Walmart-Sales-Data-Analysis-Project"
  },
  stroke_ml: {
    title: "Stroke Risk Prediction & ML Preprocessing Pipeline",
    category: "Machine Learning • Healthcare Analytics • Scikit-learn",
    timeline: "Group Data Science Project",
    role: "ML Developer & Data Preprocessor",
    techStack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    description: "Comprehensive medical data preprocessing and machine learning classification pipeline to predict patient stroke susceptibility.",
    highlights: [
      "Tackled severe dataset class imbalance using SMOTE oversampling and stratified k-fold cross validation.",
      "Conducted extensive Exploratory Data Analysis (EDA) on clinical risk factors (BMI, hypertension, glucose levels).",
      "Benchmarked multiple classification algorithms (Random Forest, Logistic Regression, XGBoost) to achieve optimal sensitivity and recall."
    ],
    github: "https://github.com/ThevinduDha/Stroke-Prediction-ML-Model"
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const openBtns = document.querySelectorAll('.view-project-details-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projKey];

      if (data) {
        populateProjectModal(data);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function populateProjectModal(data) {
  const titleEl = document.getElementById('modal-project-title');
  const catEl = document.getElementById('modal-project-category');
  const descEl = document.getElementById('modal-project-desc');
  const techEl = document.getElementById('modal-project-tech');
  const highlightsEl = document.getElementById('modal-project-highlights');
  const githubLink = document.getElementById('modal-project-github');

  if (titleEl) titleEl.textContent = data.title;
  if (catEl) catEl.textContent = `${data.category} • ${data.timeline}`;
  if (descEl) descEl.textContent = data.description;

  if (techEl) {
    techEl.innerHTML = data.techStack
      .map(t => `<span class="tag-pill">${t}</span>`)
      .join('');
  }

  if (highlightsEl) {
    highlightsEl.innerHTML = data.highlights
      .map(h => `<li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${h}</span></li>`)
      .join('');
  }

  if (githubLink) {
    githubLink.href = data.github;
  }
}

/* ==========================================================================
   8. TERMINAL CODE TABS
   ========================================================================== */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.term-tab');
  const body = document.getElementById('terminal-content');
  if (!tabs.length || !body) return;

  const codeSnippets = {
    overview: `<span class="code-comment"># Thevindu Dharmadasa - Developer Blueprint</span>
<span class="code-keyword">class</span> <span class="code-fn">ThevinduDharmadasa</span>:
    <span class="code-keyword">def</span> <span class="code-fn">__init__</span>(<span class="code-var">self</span>):
        <span class="code-var">self</span>.name = <span class="code-string">"Thevindu Dharmadasa"</span>
        <span class="code-var">self</span>.institution = <span class="code-string">"SLIIT (Sri Lanka)"</span>
        <span class="code-var">self</span>.degree = <span class="code-string">"B.Sc. (Hons) in Data Science"</span>
        <span class="code-var">self</span>.honors = [<span class="code-string">"Dean's List Awardee"</span>, <span class="code-string">"Hackathon Champion"</span>]
        <span class="code-var">self</span>.specializations = [
            <span class="code-string">"Data Science & AI/ML"</span>,
            <span class="code-string">"Full-Stack Software Engineering"</span>,
            <span class="code-string">"Data Engineering & BI Pipelines"</span>
        ]
        <span class="code-var">self</span>.status = <span class="code-string">"Open for Internships & Projects"</span>

    <span class="code-keyword">def</span> <span class="code-fn">get_mission</span>(<span class="code-var">self</span>):
        <span class="code-keyword">return</span> <span class="code-string">"Transforming raw data into actionable intelligence and building scalable software."</span>`,

    tech: `{
  <span class="code-string">"languages"</span>: [<span class="code-string">"Python"</span>, <span class="code-string">"Java"</span>, <span class="code-string">"JavaScript"</span>, <span class="code-string">"TypeScript"</span>, <span class="code-string">"SQL"</span>, <span class="code-string">"R"</span>],
  <span class="code-string">"machine_learning"</span>: [<span class="code-string">"PyTorch"</span>, <span class="code-string">"EfficientNet"</span>, <span class="code-string">"Scikit-learn"</span>, <span class="code-string">"XGBoost"</span>, <span class="code-string">"OpenCV"</span>, <span class="code-string">"RAG"</span>],
  <span class="code-string">"data_engineering"</span>: [<span class="code-string">"SSIS"</span>, <span class="code-string">"Star Schema"</span>, <span class="code-string">"ETL Pipelines"</span>, <span class="code-string">"Power BI"</span>, <span class="code-string">"Databricks"</span>],
  <span class="code-string">"full_stack"</span>: [<span class="code-string">"React"</span>, <span class="code-string">"Next.js"</span>, <span class="code-string">"Spring Boot"</span>, <span class="code-string">"Node.js"</span>, <span class="code-string">"FastAPI"</span>, <span class="code-string">"Express"</span>],
  <span class="code-string">"databases"</span>: [<span class="code-string">"PostgreSQL"</span>, <span class="code-string">"MySQL"</span>, <span class="code-string">"SQL Server"</span>, <span class="code-string">"MongoDB"</span>, <span class="code-string">"Supabase"</span>]
}`,

    philosophy: `<span class="code-comment">### Engineering Philosophy & Standards</span>

- <strong>Purpose-Driven Code:</strong> Build software that solves tangible challenges.
- <strong>Rigorous Validation:</strong> ML models evaluated against real distributions, not just benchmarks.
- <strong>Architectural Cleanliness:</strong> Separation of concerns, testability, and clean REST APIs.
- <strong>Continuous Mastery:</strong> Daily experimentation with PyTorch, Spring Boot, and GenAI.`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      if (codeSnippets[target]) {
        body.innerHTML = codeSnippets[target];
      }
    });
  });
}

/* ==========================================================================
   9. INTERACTIVE CONTACT FORM & EMAIL DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');

  // Copy email to clipboard utility
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'thevinduhansaja81@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Copied thevinduhansaja81@gmail.com to clipboard!', 'success');
      }).catch(() => {
        showToast('Email: thevinduhansaja81@gmail.com', 'info');
      });
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const categorySelect = document.getElementById('form-category');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : 'General Inquiry';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('⚠️ Please fill out all required fields.', 'info');
      return;
    }

    // Change button state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Preparing Email...</span>`;
    }

    // Compose formatted mailto link
    const mailtoSubject = encodeURIComponent(`[${category}] ${subject} - from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Hello Thevindu,\n\n${message}\n\n--------------------\nSender Name: ${name}\nSender Email: ${email}\nCategory: ${category}\nSent via Portfolio Website.`
    );

    const mailtoUrl = `mailto:thevinduhansaja81@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;

      showToast('🚀 Opening your email client to dispatch...', 'success');

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      }

      form.reset();
    }, 600);
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">${message}</div>
  `;

  container.appendChild(toast);

  // Trigger entrance animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }, duration);
}

/* ==========================================================================
   11. SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   12. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   13. SRI LANKA LOCAL TIME CLOCK
   ========================================================================== */
function initSriLankaClock() {
  const clockEl = document.getElementById('sri-lanka-time');
  if (!clockEl) return;

  function update() {
    const options = {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' (IST)';
  }

  update();
  setInterval(update, 1000);
}
