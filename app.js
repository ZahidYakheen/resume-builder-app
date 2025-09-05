// Resume Builder Application JavaScript

// Global state
let currentUser = null;
let currentResume = null;
let currentTemplate = 'classic';

// Sample data for demo
const sampleData = {
    personalInfo: {
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1-555-0123",
        address: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexjohnson"
    },
    summary: "Experienced full-stack developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading development teams.",
    experience: [
        {
            company: "TechStart Inc.",
            position: "Senior Full Stack Developer",
            startDate: "2022-03",
            endDate: "Present",
            description: "• Led development of customer-facing web applications using React and Node.js\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews"
        }
    ],
    education: [
        {
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2016-09",
            endDate: "2020-05",
            gpa: "3.8"
        }
    ],
    skills: [
        { name: "JavaScript", level: 95 },
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 }
    ],
    projects: [
        {
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration",
            technologies: "React, Node.js, MongoDB, Stripe API",
            link: "github.com/alex/ecommerce-platform"
        }
    ]
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('resumeBuilderUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showDashboard();
            updateNavigation();
            console.log('User logged in:', currentUser.name);
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('resumeBuilderUser');
            showLandingPage();
        }
    } else {
        showLandingPage();
    }

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation buttons - use direct onclick for reliability
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const buildResumeBtn = document.getElementById('buildResumeBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) {
        loginBtn.onclick = () => {
            console.log('Login button clicked');
            showLogin();
        };
    }
    
    if (signupBtn) {
        signupBtn.onclick = () => {
            console.log('Signup button clicked');
            showSignup();
        };
    }
    
    if (buildResumeBtn) {
        buildResumeBtn.onclick = () => {
            console.log('Build resume button clicked');
            showSignup();
        };
    }
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log('Logout button clicked');
            logout();
        };
    }

    // Auth form switches
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
        switchToSignup.onclick = (e) => {
            e.preventDefault();
            console.log('Switch to signup clicked');
            showSignup();
        };
    }
    
    if (switchToLogin) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            console.log('Switch to login clicked');
            showLogin();
        };
    }

    // Forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            console.log('Login form submitted');
            handleLogin(e);
        };
    }
    
    if (signupForm) {
        signupForm.onsubmit = (e) => {
            console.log('Signup form submitted');
            handleSignup(e);
        };
    }

    // Dashboard buttons
    const createResumeBtn = document.getElementById('createResumeBtn');
    if (createResumeBtn) {
        createResumeBtn.onclick = () => {
            console.log('Create resume button clicked');
            createNewResume();
        };
    }

    // Builder buttons
    const backToDashboard = document.getElementById('backToDashboard');
    const saveResumeBtn = document.getElementById('saveResumeBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    
    if (backToDashboard) {
        backToDashboard.onclick = () => {
            console.log('Back to dashboard clicked');
            goToDashboard();
        };
    }
    
    if (saveResumeBtn) {
        saveResumeBtn.onclick = () => {
            console.log('Save resume clicked');
            saveResume();
        };
    }
    
    if (exportPdfBtn) {
        exportPdfBtn.onclick = () => {
            console.log('Export PDF clicked');
            exportToPDF();
        };
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            const tabName = btn.getAttribute('data-tab');
            console.log('Tab clicked:', tabName);
            showTab(tabName);
        };
    });

    // Template selector
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.onchange = () => {
            console.log('Template changed');
            changeTemplate();
        };
    }

    // Add buttons for resume sections
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
    
    if (addExperienceBtn) {
        addExperienceBtn.onclick = () => {
            console.log('Add experience clicked');
            addExperience();
        };
    }
    
    if (addEducationBtn) {
        addEducationBtn.onclick = () => {
            console.log('Add education clicked');
            addEducation();
        };
    }
    
    if (addSkillBtn) {
        addSkillBtn.onclick = () => {
            console.log('Add skill clicked');
            addSkill();
        };
    }
    
    if (addProjectBtn) {
        addProjectBtn.onclick = () => {
            console.log('Add project clicked');
            addProject();
        };
    }

    // Form field updates for personal info
    const personalFields = ['fullName', 'email', 'phone', 'address', 'linkedin'];
    personalFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.oninput = () => {
                console.log('Field updated:', fieldId);
                updatePreview();
            };
        }
    });

    const summaryField = document.getElementById('summary');
    if (summaryField) {
        summaryField.oninput = () => {
            console.log('Summary updated');
            updatePreview();
        };
    }
}

// Navigation functions
function showLandingPage() {
    console.log('Showing landing page');
    hideAllPages();
    document.getElementById('landingPage').classList.remove('hidden');
}

function showLogin() {
    console.log('Showing login page');
    hideAllPages();
    document.getElementById('loginPage').classList.remove('hidden');
}

function showSignup() {
    console.log('Showing signup page');
    hideAllPages();
    document.getElementById('signupPage').classList.remove('hidden');
}

function showDashboard() {
    console.log('Showing dashboard');
    hideAllPages();
    document.getElementById('dashboardPage').classList.remove('hidden');
    loadUserResumes();
}

function showBuilder(resumeId = null) {
    console.log('Showing builder, resume ID:', resumeId);
    hideAllPages();
    document.getElementById('builderPage').classList.remove('hidden');
    
    if (resumeId) {
        loadResume(resumeId);
    } else {
        initializeNewResume();
    }
    
    updatePreview();
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
}

function updateNavigation() {
    console.log('Updating navigation for user:', currentUser?.name);
    const navActions = document.getElementById('navActions');
    const navUser = document.getElementById('navUser');
    
    if (currentUser && navActions && navUser) {
        navActions.classList.add('hidden');
        navUser.classList.remove('hidden');
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) {
            userNameSpan.textContent = currentUser.name;
        }
    } else if (navActions && navUser) {
        navActions.classList.remove('hidden');
        navUser.classList.add('hidden');
    }
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    console.log('Handling login');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Simple validation (in real app, this would be server-side)
    const users = JSON.parse(localStorage.getItem('resumeBuilderUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log('Login successful for:', user.name);
        currentUser = user;
        localStorage.setItem('resumeBuilderUser', JSON.stringify(user));
        showToast('Welcome back!');
        showDashboard();
        updateNavigation();
    } else {
        console.log('Login failed for:', email);
        showToast('Invalid credentials', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    console.log('Handling signup');
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    console.log('Signup attempt for:', name, email);
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Simple validation
    const users = JSON.parse(localStorage.getItem('resumeBuilderUsers') || '[]');
    
    if (users.find(u => u.email === email)) {
        showToast('Email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('resumeBuilderUsers', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('resumeBuilderUser', JSON.stringify(newUser));
    
    console.log('Signup successful for:', newUser.name);
    showToast('Account created successfully!');
    showDashboard();
    updateNavigation();
}

function logout() {
    console.log('Logging out user:', currentUser?.name);
    currentUser = null;
    currentResume = null;
    localStorage.removeItem('resumeBuilderUser');
    showToast('Logged out successfully');
    showLandingPage();
    updateNavigation();
}

// Resume management functions
function loadUserResumes() {
    console.log('Loading user resumes for:', currentUser?.name);
    const resumesList = document.getElementById('resumesList');
    if (!resumesList) return;
    
    const resumes = JSON.parse(localStorage.getItem('resumeBuilderResumes') || '[]')
        .filter(r => r.userId === currentUser.id);
    
    console.log('Found resumes:', resumes.length);
    
    if (resumes.length === 0) {
        resumesList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                <h3>No resumes yet</h3>
                <p>Create your first resume to get started</p>
            </div>
        `;
        return;
    }
    
    resumesList.innerHTML = resumes.map(resume => `
        <div class="resume-card">
            <div class="resume-card-header">
                <h3 class="resume-card-title">${resume.name}</h3>
            </div>
            <div class="resume-card-preview">Resume Preview</div>
            <div class="resume-card-date">Last modified: ${formatDate(resume.updatedAt)}</div>
            <div class="resume-card-actions">
                <button class="btn btn--outline btn--sm" onclick="editResume('${resume.id}')">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="duplicateResume('${resume.id}')">Duplicate</button>
                <button class="btn btn--outline btn--sm" onclick="deleteResume('${resume.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function createNewResume() {
    console.log('Creating new resume');
    showBuilder();
}

function editResume(resumeId) {
    console.log('Editing resume:', resumeId);
    showBuilder(resumeId);
}

function duplicateResume(resumeId) {
    console.log('Duplicating resume:', resumeId);
    const resumes = JSON.parse(localStorage.getItem('resumeBuilderResumes') || '[]');
    const originalResume = resumes.find(r => r.id === resumeId);
    
    if (originalResume) {
        const duplicatedResume = {
            ...originalResume,
            id: 'resume_' + Date.now(),
            name: originalResume.name + ' (Copy)',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        resumes.push(duplicatedResume);
        localStorage.setItem('resumeBuilderResumes', JSON.stringify(resumes));
        
        showToast('Resume duplicated successfully!');
        loadUserResumes();
    }
}

function deleteResume(resumeId) {
    console.log('Deleting resume:', resumeId);
    if (confirm('Are you sure you want to delete this resume?')) {
        let resumes = JSON.parse(localStorage.getItem('resumeBuilderResumes') || '[]');
        resumes = resumes.filter(r => r.id !== resumeId);
        localStorage.setItem('resumeBuilderResumes', JSON.stringify(resumes));
        
        showToast('Resume deleted successfully!');
        loadUserResumes();
    }
}

function initializeNewResume() {
    console.log('Initializing new resume');
    currentResume = {
        id: 'resume_' + Date.now(),
        userId: currentUser.id,
        name: 'Untitled Resume',
        template: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
            personalInfo: {},
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: []
        }
    };
    
    populateFormFields();
}

function loadResume(resumeId) {
    console.log('Loading resume:', resumeId);
    const resumes = JSON.parse(localStorage.getItem('resumeBuilderResumes') || '[]');
    currentResume = resumes.find(r => r.id === resumeId);
    
    if (currentResume) {
        currentTemplate = currentResume.template || 'classic';
        const templateSelector = document.getElementById('templateSelector');
        if (templateSelector) {
            templateSelector.value = currentTemplate;
        }
        populateFormFields();
    }
}

function populateFormFields() {
    if (!currentResume) return;
    
    console.log('Populating form fields');
    const data = currentResume.data;
    
    // Personal info
    const fields = [
        { id: 'fullName', value: data.personalInfo.fullName || '' },
        { id: 'email', value: data.personalInfo.email || '' },
        { id: 'phone', value: data.personalInfo.phone || '' },
        { id: 'address', value: data.personalInfo.address || '' },
        { id: 'linkedin', value: data.personalInfo.linkedin || '' },
        { id: 'summary', value: data.summary || '' }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;
        }
    });
    
    // Experience, Education, Skills, Projects
    renderExperienceList();
    renderEducationList();
    renderSkillsList();
    renderProjectsList();
}

// Tab management
function showTab(tabName) {
    console.log('Showing tab:', tabName);
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    const clickedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// Experience management
function renderExperienceList() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    
    const experiences = currentResume?.data?.experience || [];
    console.log('Rendering experience list, count:', experiences.length);
    
    container.innerHTML = experiences.map((exp, index) => `
        <div class="experience-item">
            <div class="item-header">
                <h4 class="item-title">Experience ${index + 1}</h4>
                <button class="remove-item" onclick="removeExperience(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-control" value="${exp.company || ''}" 
                       onchange="updateExperience(${index}, 'company', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Position</label>
                <input type="text" class="form-control" value="${exp.position || ''}" 
                       onchange="updateExperience(${index}, 'position', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Date Range</label>
                <div class="date-inputs">
                    <input type="month" class="form-control" value="${exp.startDate || ''}" 
                           onchange="updateExperience(${index}, 'startDate', this.value)">
                    <input type="month" class="form-control" value="${exp.endDate || ''}" 
                           onchange="updateExperience(${index}, 'endDate', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="4" 
                          onchange="updateExperience(${index}, 'description', this.value)">${exp.description || ''}</textarea>
            </div>
        </div>
    `).join('');
}

function addExperience() {
    if (!currentResume) return;
    if (!currentResume.data.experience) currentResume.data.experience = [];
    
    console.log('Adding new experience');
    currentResume.data.experience.push({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });
    renderExperienceList();
    updatePreview();
}

function updateExperience(index, field, value) {
    if (currentResume && currentResume.data.experience[index]) {
        console.log('Updating experience:', index, field);
        currentResume.data.experience[index][field] = value;
        updatePreview();
    }
}

function removeExperience(index) {
    if (currentResume && currentResume.data.experience) {
        console.log('Removing experience:', index);
        currentResume.data.experience.splice(index, 1);
        renderExperienceList();
        updatePreview();
    }
}

// Education management (similar pattern)
function renderEducationList() {
    const container = document.getElementById('educationList');
    if (!container) return;
    
    const education = currentResume?.data?.education || [];
    
    container.innerHTML = education.map((edu, index) => `
        <div class="education-item">
            <div class="item-header">
                <h4 class="item-title">Education ${index + 1}</h4>
                <button class="remove-item" onclick="removeEducation(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Institution</label>
                <input type="text" class="form-control" value="${edu.institution || ''}" 
                       onchange="updateEducation(${index}, 'institution', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Degree</label>
                <input type="text" class="form-control" value="${edu.degree || ''}" 
                       onchange="updateEducation(${index}, 'degree', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Date Range</label>
                <div class="date-inputs">
                    <input type="month" class="form-control" value="${edu.startDate || ''}" 
                           onchange="updateEducation(${index}, 'startDate', this.value)">
                    <input type="month" class="form-control" value="${edu.endDate || ''}" 
                           onchange="updateEducation(${index}, 'endDate', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">GPA (optional)</label>
                <input type="text" class="form-control" value="${edu.gpa || ''}" 
                       onchange="updateEducation(${index}, 'gpa', this.value)">
            </div>
        </div>
    `).join('');
}

function addEducation() {
    if (!currentResume) return;
    if (!currentResume.data.education) currentResume.data.education = [];
    
    currentResume.data.education.push({
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        gpa: ''
    });
    renderEducationList();
    updatePreview();
}

function updateEducation(index, field, value) {
    if (currentResume && currentResume.data.education[index]) {
        currentResume.data.education[index][field] = value;
        updatePreview();
    }
}

function removeEducation(index) {
    if (currentResume && currentResume.data.education) {
        currentResume.data.education.splice(index, 1);
        renderEducationList();
        updatePreview();
    }
}

// Skills management
function renderSkillsList() {
    const container = document.getElementById('skillsList');
    if (!container) return;
    
    const skills = currentResume?.data?.skills || [];
    
    container.innerHTML = skills.map((skill, index) => `
        <div class="skill-item">
            <div class="item-header">
                <h4 class="item-title">Skill ${index + 1}</h4>
                <button class="remove-item" onclick="removeSkill(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Skill Name</label>
                <input type="text" class="form-control" value="${skill.name || ''}" 
                       onchange="updateSkill(${index}, 'name', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Proficiency Level</label>
                <div class="skill-level">
                    <input type="range" min="0" max="100" value="${skill.level || 50}" 
                           onchange="updateSkill(${index}, 'level', this.value); this.nextElementSibling.textContent = this.value + '%'">
                    <span class="skill-level-display">${skill.level || 50}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function addSkill() {
    if (!currentResume) return;
    if (!currentResume.data.skills) currentResume.data.skills = [];
    
    currentResume.data.skills.push({
        name: '',
        level: 50
    });
    renderSkillsList();
    updatePreview();
}

function updateSkill(index, field, value) {
    if (currentResume && currentResume.data.skills[index]) {
        currentResume.data.skills[index][field] = field === 'level' ? parseInt(value) : value;
        updatePreview();
    }
}

function removeSkill(index) {
    if (currentResume && currentResume.data.skills) {
        currentResume.data.skills.splice(index, 1);
        renderSkillsList();
        updatePreview();
    }
}

// Projects management
function renderProjectsList() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    
    const projects = currentResume?.data?.projects || [];
    
    container.innerHTML = projects.map((project, index) => `
        <div class="project-item">
            <div class="item-header">
                <h4 class="item-title">Project ${index + 1}</h4>
                <button class="remove-item" onclick="removeProject(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Project Name</label>
                <input type="text" class="form-control" value="${project.name || ''}" 
                       onchange="updateProject(${index}, 'name', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" 
                          onchange="updateProject(${index}, 'description', this.value)">${project.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Technologies</label>
                <input type="text" class="form-control" value="${project.technologies || ''}" 
                       onchange="updateProject(${index}, 'technologies', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Link (optional)</label>
                <input type="url" class="form-control" value="${project.link || ''}" 
                       onchange="updateProject(${index}, 'link', this.value)">
            </div>
        </div>
    `).join('');
}

function addProject() {
    if (!currentResume) return;
    if (!currentResume.data.projects) currentResume.data.projects = [];
    
    currentResume.data.projects.push({
        name: '',
        description: '',
        technologies: '',
        link: ''
    });
    renderProjectsList();
    updatePreview();
}

function updateProject(index, field, value) {
    if (currentResume && currentResume.data.projects[index]) {
        currentResume.data.projects[index][field] = value;
        updatePreview();
    }
}

function removeProject(index) {
    if (currentResume && currentResume.data.projects) {
        currentResume.data.projects.splice(index, 1);
        renderProjectsList();
        updatePreview();
    }
}

// Preview and template functions
function updatePreview() {
    if (!currentResume) return;
    
    // Update resume data from form fields
    const personalInfoFields = [
        { id: 'fullName', key: 'fullName' },
        { id: 'email', key: 'email' },
        { id: 'phone', key: 'phone' },
        { id: 'address', key: 'address' },
        { id: 'linkedin', key: 'linkedin' }
    ];
    
    personalInfoFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            currentResume.data.personalInfo[field.key] = element.value;
        }
    });
    
    const summaryField = document.getElementById('summary');
    if (summaryField) {
        currentResume.data.summary = summaryField.value;
    }
    
    const preview = document.getElementById('resumePreview');
    if (preview) {
        preview.className = `resume-preview ${currentTemplate}-template`;
        preview.innerHTML = generateResumeHTML();
    }
}

function changeTemplate() {
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        currentTemplate = templateSelector.value;
        if (currentResume) {
            currentResume.template = currentTemplate;
        }
        updatePreview();
    }
}

function generateResumeHTML() {
    const data = currentResume.data;
    const personalInfo = data.personalInfo || {};
    
    const contactInfo = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.address,
        personalInfo.linkedin
    ].filter(info => info).join(' • ');
    
    let html = `
        <div class="resume-header">
            <h1 class="resume-name">${personalInfo.fullName || 'Your Name'}</h1>
            <div class="resume-contact">${contactInfo}</div>
        </div>
    `;
    
    // Summary section
    if (data.summary) {
        html += `
            <div class="resume-section">
                <h2 class="resume-section-title">Professional Summary</h2>
                <p>${data.summary}</p>
            </div>
        `;
    }
    
    // Experience section
    if (data.experience && data.experience.length > 0) {
        html += `
            <div class="resume-section">
                <h2 class="resume-section-title">Work Experience</h2>
                ${data.experience.map(exp => `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <h3 class="resume-item-title">${exp.position || ''}</h3>
                                <div class="resume-item-subtitle">${exp.company || ''}</div>
                            </div>
                            <div class="resume-item-date">
                                ${formatDateRange(exp.startDate, exp.endDate)}
                            </div>
                        </div>
                        <div class="resume-item-description">${exp.description || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Education section
    if (data.education && data.education.length > 0) {
        html += `
            <div class="resume-section">
                <h2 class="resume-section-title">Education</h2>
                ${data.education.map(edu => `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <h3 class="resume-item-title">${edu.degree || ''}</h3>
                                <div class="resume-item-subtitle">${edu.institution || ''}</div>
                                ${edu.gpa ? `<div class="resume-item-subtitle">GPA: ${edu.gpa}</div>` : ''}
                            </div>
                            <div class="resume-item-date">
                                ${formatDateRange(edu.startDate, edu.endDate)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Skills section
    if (data.skills && data.skills.length > 0) {
        html += `
            <div class="resume-section">
                <h2 class="resume-section-title">Skills</h2>
                <div class="skills-grid">
                    ${data.skills.map(skill => `
                        <div class="skill-item-preview">
                            <span>${skill.name}</span>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Projects section
    if (data.projects && data.projects.length > 0) {
        html += `
            <div class="resume-section">
                <h2 class="resume-section-title">Projects</h2>
                ${data.projects.map(project => `
                    <div class="resume-item">
                        <h3 class="resume-item-title">${project.name}</h3>
                        <div class="resume-item-description">${project.description}</div>
                        ${project.technologies ? `<div class="resume-item-subtitle"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
                        ${project.link ? `<div class="resume-item-subtitle"><strong>Link:</strong> <a href="https://${project.link}" target="_blank">${project.link}</a></div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    return html;
}

// Utility functions
function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return dateString;
    }
}

function formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) return '';
    
    try {
        const start = startDate ? new Date(startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        const end = endDate ? new Date(endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
        return `${start} - ${end}`;
    } catch (e) {
        return `${startDate || ''} - ${endDate || 'Present'}`;
    }
}

// Save and export functions
function saveResume() {
    if (!currentResume) {
        showToast('No resume to save', 'error');
        return;
    }
    
    console.log('Saving resume:', currentResume.id);
    currentResume.updatedAt = new Date().toISOString();
    
    let resumes = JSON.parse(localStorage.getItem('resumeBuilderResumes') || '[]');
    const existingIndex = resumes.findIndex(r => r.id === currentResume.id);
    
    if (existingIndex >= 0) {
        resumes[existingIndex] = currentResume;
    } else {
        resumes.push(currentResume);
    }
    
    localStorage.setItem('resumeBuilderResumes', JSON.stringify(resumes));
    showToast('Resume saved successfully!');
}

function exportToPDF() {
    const element = document.getElementById('resumePreview');
    if (!element) {
        showToast('Preview not available for export', 'error');
        return;
    }
    
    console.log('Exporting to PDF');
    
    const opt = {
        margin: 0.5,
        filename: `${currentResume?.data?.personalInfo?.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Save before export
    saveResume();
    
    try {
        html2pdf().set(opt).from(element).save().then(() => {
            showToast('PDF downloaded successfully!');
        }).catch((error) => {
            console.error('PDF export error:', error);
            showToast('Failed to download PDF', 'error');
        });
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('PDF export not available', 'error');
    }
}

function goToDashboard() {
    console.log('Going to dashboard');
    if (currentResume) {
        saveResume();
    }
    showDashboard();
}

// Toast notifications
function showToast(message, type = 'success') {
    console.log('Toast:', message, type);
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Auto-save functionality
setInterval(() => {
    if (currentResume && currentUser && document.getElementById('builderPage') && !document.getElementById('builderPage').classList.contains('hidden')) {
        console.log('Auto-saving...');
        saveResume();
    }
}, 30000); // Auto-save every 30 seconds

// Debug helper
window.resumeBuilderDebug = {
    currentUser,
    currentResume,
    showDashboard,
    showBuilder,
    showLogin,
    showSignup
};