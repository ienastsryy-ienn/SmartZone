// Get subject ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const subjectId = urlParams.get('id');

// Load curriculum data and display subject details
let curriculumData = {};

// Fetch curriculum data from JSON file
fetch('curriculum.json')
    .then(response => response.json())
    .then(data => {
        curriculumData = data;
        if (subjectId) {
            displaySubjectDetails(subjectId);
        }
    })
    .catch(error => {
        console.error('Error loading curriculum data:', error);
    });

// Function to display subject details
function displaySubjectDetails(id) {
    // Find the subject in the curriculum data
    let subject = null;
    let grade = null;
    
    for (const gradeKey in curriculumData.grades) {
        const gradeData = curriculumData.grades[gradeKey];
        const foundSubject = gradeData.subjects.find(sub => sub.id === id);
        if (foundSubject) {
            subject = foundSubject;
            grade = gradeKey;
            break;
        }
    }
    
    if (!subject) {
        document.querySelector('.subject-detail').innerHTML = `
            <div class="container">
                <h2>Subject not found</h2>
                <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }
    
    // Update subject header
    document.getElementById('subject-title').textContent = subject.detail.title;
    document.getElementById('subject-overview').textContent = subject.detail.overview;
    document.querySelector('.subject-icon-large i').className = subject.icon;
    
    // Render chapters
    renderChapters(subject.detail.chapters, subject.id);
    
    // Render resources
    renderResources(subject.detail.resources);
    
    // Update progress display
    updateSubjectProgress(subject.id, subject.detail.chapters.length);
}

// Function to render chapters
function renderChapters(chapters, subjectId) {
    const chaptersContainer = document.getElementById('chapters-container');
    let chaptersHTML = '';
    
    chapters.forEach((chapter, index) => {
        chaptersHTML += `
            <div class="chapter-card">
                <div class="chapter-header">
                    <span class="chapter-number">Bab ${index + 1}</span>
                    <h3><a href="chapter.html?subject=${subjectId}&chapter=${index}" class="chapter-title-link">${chapter.title}</a></h3>
                </div>
                <div class="chapter-topics">
                    <ul>
                        ${Array.isArray(chapter.topics) ? chapter.topics.map(topic => 
                          `<li><i class="fas fa-circle"></i> ${typeof topic === 'string' ? topic : topic.name}</li>`
                        ).join('') : ''}
                    </ul>
                </div>
                <div class="chapter-actions">
                    <button class="btn-primary complete-chapter-btn" data-subject-id="${subjectId}" data-chapter-index="${index}">
                        Tandai Selesai
                    </button>
                </div>
            </div>
        `;
    });
    
    chaptersContainer.innerHTML = chaptersHTML;
    
    // Add event listeners for chapter completion
    document.querySelectorAll('.complete-chapter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-subject-id');
            const chapterIndex = parseInt(this.getAttribute('data-chapter-index'));
            
            if (subjectId !== null && !isNaN(chapterIndex)) {
                window.ProgressTracker.completeChapter(subjectId, chapterIndex);
                
                // Visual feedback
                this.textContent = '✓ Selesai';
                this.classList.add('completed');
                this.disabled = true;
            }
        });
    });
}

// Function to update subject progress display
function updateSubjectProgress(subjectId, totalChapters) {
    const progress = window.ProgressTracker.getSubjectProgress(subjectId, totalChapters);
    
    const progressFill = document.getElementById('subject-progress-fill');
    const progressText = document.getElementById('subject-progress-text');
    const pointsElement = document.getElementById('subject-points');
    
    if (progressFill) {
        progressFill.style.width = `${progress.percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progress.completed}/${progress.total} bab`;
    }
    
    if (pointsElement) {
        pointsElement.textContent = progress.points;
    }
}

// Function to render resources
function renderResources(resources) {
    const resourcesContainer = document.getElementById('resources-container');
    let resourcesHTML = '';
    
    resources.forEach(resource => {
        let resourceIcon = '';
        let resourceInfo = '';
        
        switch (resource.type) {
            case 'video':
                resourceIcon = 'fas fa-video';
                resourceInfo = `${resource.duration}`;
                break;
            case 'exercise':
                resourceIcon = 'fas fa-tasks';
                resourceInfo = `${resource.questions} soal`;
                break;
            case 'summary':
                resourceIcon = 'fas fa-file-alt';
                resourceInfo = `${resource.pages} halaman`;
                break;
            default:
                resourceIcon = 'fas fa-folder';
        }
        
        resourcesHTML += `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="${resourceIcon}"></i>
                </div>
                <div class="resource-info">
                    <h4>${resource.title}</h4>
                    <p>${resourceInfo}</p>
                </div>
                <div class="resource-action">
                    <button class="btn-primary">Akses</button>
                </div>
            </div>
        `;
    });
    
    resourcesContainer.innerHTML = resourcesHTML;
}