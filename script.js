// Mobile Navigation Toggle
const mobileToggle = document.createElement('div');
mobileToggle.className = 'mobile-toggle';
mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('header .container').appendChild(mobileToggle);

const nav = document.querySelector('nav');
const navLinks = document.querySelector('nav ul');

mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Play button animation
const playButtons = document.querySelectorAll('.play-button');
playButtons.forEach(button => {
    button.addEventListener('click', function() {
        const videoCard = this.closest('.video-card');
        const videoTitle = videoCard.querySelector('h3').textContent;
        alert(`Memutar video: ${videoTitle}\n(Dalam implementasi nyata, ini akan memutar video pembelajaran)`);
    });
});

// AI Tutor Button
const aiTutorButton = document.querySelector('.ai-tutor .btn-primary');
if (aiTutorButton) {
    aiTutorButton.addEventListener('click', function() {
        alert('Selamat datang di AI Tutor!\n(Dalam implementasi nyata, ini akan membuka antarmuka AI Tutor)');
    });
}

// Download Button
const downloadButtons = document.querySelectorAll('.btn-secondary');
downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        alert('Mengunduh konten untuk mode offline...\n(Dalam implementasi nyata, ini akan memulai proses unduh)');
    });
});

// Register Button
const registerButton = document.querySelector('.btn-register');
if (registerButton) {
    registerButton.addEventListener('click', function() {
        alert('Membuka halaman pendaftaran...\n(Dalam implementasi nyata, ini akan membuka formulir pendaftaran)');
    });
}

// Login Button
const loginButton = document.querySelector('.btn-login');
if (loginButton) {
    loginButton.addEventListener('click', function() {
        alert('Membuka halaman masuk...\n(Dalam implementasi nyata, ini akan membuka formulir login)');
    });
}

// Progress Bar Animation
const progressBars = document.querySelectorAll('.progress-fill');
progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
        bar.style.transition = 'width 2s ease-in-out';
        bar.style.width = width;
    }, 300);
});

// Feature Card Hover Effect Enhancement
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Subject Card Hover Effect Enhancement
const allSubjectCards = document.querySelectorAll('.subject-card');
allSubjectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Video Card Hover Effect Enhancement
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Testimonial Card Hover Effect Enhancement
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Stat Card Hover Effect Enhancement
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Form Submission Handling (if forms were added)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form telah dikirim! (Ini hanya simulasi)');
        this.reset();
    });
});

// Mulai Belajar Button - Scroll to Curriculum Section
const startLearningButton = document.querySelector('.hero-buttons .btn-primary');
if (startLearningButton) {
    startLearningButton.addEventListener('click', function(e) {
        e.preventDefault();
        const materiSection = document.getElementById('materi');
        if (materiSection) {
            materiSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Load curriculum data from JSON and initialize grade switching
let curriculumData = {};

// Fetch curriculum data from JSON file
fetch('curriculum.json')
    .then(response => response.json())
    .then(data => {
        curriculumData = data;
        // Render subjects for default grade (7)
        renderSubjects('7');
    })
    .catch(error => {
        console.error('Error loading curriculum data:', error);
    });

// Grade Switching Functionality
const gradeButtons = document.querySelectorAll('.grade-btn');
const currentGradeSpan = document.getElementById('current-grade');
const subjectsContainer = document.getElementById('subjects-container');

gradeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        gradeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get selected grade
        const selectedGrade = this.getAttribute('data-grade');
        
        // Update current grade display
        currentGradeSpan.textContent = selectedGrade;
        
        // Render subjects for selected grade
        renderSubjects(selectedGrade);
    });
});

// Function to render subjects for a specific grade
function renderSubjects(grade) {
    if (!curriculumData.grades || !curriculumData.grades[grade]) return;
    
    const subjects = curriculumData.grades[grade].subjects;
    let subjectCardsHTML = '';
    
    subjects.forEach(subject => {
        subjectCardsHTML += `
            <div class="subject-card" data-grade="${grade}" data-subject-id="${subject.id}">
                <i class="${subject.icon} subject-icon"></i>
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
            </div>
        `;
    });
    
    subjectsContainer.innerHTML = subjectCardsHTML;
    
    // Add click event listeners to subject cards
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-subject-id');
            if (subjectId) {
                window.location.href = `subject.html?id=${subjectId}`;
            }
        });
    });
}

// Window Scroll Event for Header Shadow
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Animate feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
            icon.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0)';
            }, 100);
        }, 200 * index);
    });
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 300);
    });
    
    // Initialize progress display
    if (window.ProgressTracker) {
        window.ProgressTracker.updateProgressDisplay();
    }
});