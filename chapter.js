// Chapter Detail Page Script

// Get chapter information from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const subjectId = urlParams.get('subject');
const chapterIndex = parseInt(urlParams.get('chapter'));

// Load curriculum data and display chapter details
let curriculumData = {};

// Fetch curriculum data from JSON file
fetch('curriculum.json')
    .then(response => response.json())
    .then(data => {
        curriculumData = data;
        if (subjectId !== null && !isNaN(chapterIndex)) {
            displayChapterDetails(subjectId, chapterIndex);
        } else {
            // Handle invalid parameters
            document.querySelector('.chapter-detail').innerHTML = `
                <div class="container">
                    <h2>Chapter not found</h2>
                    <a href="index.html" class="btn-primary">Back to Home</a>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error loading curriculum data:', error);
    });

// Function to display chapter details
function displayChapterDetails(subjectId, chapterIndex) {
    // Find the subject and chapter in the curriculum data
    let subject = null;
    let chapter = null;
    
    for (const gradeKey in curriculumData.grades) {
        const gradeData = curriculumData.grades[gradeKey];
        const foundSubject = gradeData.subjects.find(sub => sub.id === subjectId);
        if (foundSubject && foundSubject.detail.chapters[chapterIndex]) {
            subject = foundSubject;
            chapter = foundSubject.detail.chapters[chapterIndex];
            break;
        }
    }
    
    if (!subject || !chapter) {
        document.querySelector('.chapter-detail').innerHTML = `
            <div class="container">
                <h2>Chapter not found</h2>
                <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }
    
    // Update back button link
    const backLink = document.getElementById('back-to-subject');
    backLink.href = `subject.html?id=${subjectId}`;
    
    // Update chapter header
    document.getElementById('chapter-title').textContent = chapter.title;
    document.getElementById('chapter-description').textContent = `Bab ${chapterIndex + 1} dari mata pelajaran ${subject.detail.title}`;
    
    // Generate learning material content
    generateLearningMaterial(chapter, subjectId, chapterIndex);
    
    // Update chapter description with more context
    const subjectTitle = subject ? subject.detail.title : 'Mata Pelajaran';
    document.getElementById('chapter-description').textContent = `Bab ${chapterIndex + 1} dari mata pelajaran ${subjectTitle}`;
    
    // Render related resources
    renderChapterResources(subject.detail.resources, chapter.title);
    
    // Set up chapter completion button
    setupCompletionButton(subjectId, chapterIndex);
}

// Function to generate learning material content
function generateLearningMaterial(chapter, subjectId, chapterIndex) {
    const materialContent = document.getElementById('material-content');
    
    // In a real implementation, this would fetch detailed content from a database or API
    // For now, we'll generate sample content based on the topics
    let contentHTML = `
        <div class="chapter-intro">
            <p>Selamat datang di bab "${chapter.title}". Di bab ini, Anda akan mempelajari konsep-konsep penting berikut:</p>
        </div>
        
        <div class="chapter-topics">
            <h3>Topik Pembahasan:</h3>
            <ul>
    `;
    
    chapter.topics.forEach((topic, index) => {
        // Handle both string and object formats
        const topicName = typeof topic === 'string' ? topic : topic.name;
        const explanation = typeof topic === 'string' ? 
            `Penjelasan mendetail tentang ${topicName.toLowerCase()} akan ditampilkan di sini. Materi ini mencakup definisi, contoh penerapan, dan latihan untuk memperkuat pemahaman Anda.` : 
            topic.explanation;
            
        contentHTML += `
                <li>
                    <strong>Topik ${index + 1}: ${topicName}</strong>
                    <p>${explanation}</p>
                </li>
        `;
    });
    
    contentHTML += `
            </ul>
        </div>
        
        <div class="chapter-summary">
            <h3>Ringkasan</h3>
            <p>Setelah mempelajari bab ini, Anda diharapkan dapat memahami konsep dasar ${chapter.title.toLowerCase()} dan mampu menerapkannya dalam situasi nyata. Lanjutkan ke bab berikutnya untuk memperluas pengetahuan Anda.</p>
        </div>
        
        <div class="chapter-examples">
            <h3>Contoh Soal dan Pembahasan</h3>
            <div class="example-problem">
                <p><strong>Contoh 1:</strong> Berikut adalah contoh penerapan konsep ${chapter.title.toLowerCase()} dalam bentuk soal dan pembahasan yang mudah dipahami.</p>
                <div class="solution">
                    <p><strong>Penyelesaian:</strong> Langkah-langkah penyelesaian akan dijelaskan secara rinci untuk membantu Anda memahami proses berpikir yang digunakan.</p>
                </div>
            </div>
            
            <div class="example-problem">
                <p><strong>Contoh 2:</strong> Soal tambahan untuk memperkuat pemahaman konsep ${chapter.title.toLowerCase()} dengan pendekatan yang berbeda.</p>
                <div class="solution">
                    <p><strong>Penyelesaian:</strong> Pendekatan alternatif untuk menyelesaikan masalah yang sama, menunjukkan fleksibilitas dalam berpikir matematis.</p>
                </div>
            </div>
        </div>
        
        <div class="practice-exercises">
            <h3>Latihan Mandiri</h3>
            <p>Untuk menguji pemahaman Anda, cobalah menyelesaikan latihan berikut:</p>
            <ol>
                <li>Soal latihan 1 dengan konsep ${chapter.title.toLowerCase()}</li>
                <li>Soal latihan 2 yang menggabungkan beberapa konsep</li>
                <li>Soal tantangan untuk pemahaman lebih mendalam</li>
            </ol>
            <p>Jawaban dan pembahasan tersedia di bagian latihan soal pada halaman utama mata pelajaran.</p>
        </div>
    `;
    
    materialContent.innerHTML = contentHTML;
}

// Function to render chapter resources
function renderChapterResources(resources, chapterTitle) {
    const resourcesContainer = document.getElementById('chapter-resources');
    let resourcesHTML = '';
    
    // Filter resources related to this chapter (in a real app, this would be more sophisticated)
    const chapterResources = resources.filter(resource => 
        resource.title.toLowerCase().includes(chapterTitle.toLowerCase()) ||
        resource.title.toLowerCase().includes('bab') ||
        resource.title.toLowerCase().includes('chapter')
    );
    
    // If no specific resources found, show all resources
    const displayResources = chapterResources.length > 0 ? chapterResources : resources.slice(0, 3);
    
    displayResources.forEach(resource => {
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

// Function to set up chapter completion button
function setupCompletionButton(subjectId, chapterIndex) {
    const completeBtn = document.getElementById('complete-chapter-btn');
    
    // Check if chapter is already completed
    const userProgress = JSON.parse(localStorage.getItem('smartzoneProgress')) || { subjects: {} };
    const isCompleted = userProgress.subjects[subjectId] && 
                      userProgress.subjects[subjectId].completedChapters && 
                      userProgress.subjects[subjectId].completedChapters.includes(chapterIndex);
    
    if (isCompleted) {
        completeBtn.textContent = '✓ Bab Selesai';
        completeBtn.classList.add('completed');
        completeBtn.disabled = true;
    } else {
        completeBtn.addEventListener('click', function() {
            // Mark chapter as completed
            if (window.ProgressTracker) {
                window.ProgressTracker.completeChapter(subjectId, chapterIndex);
                
                // Update button appearance
                this.textContent = '✓ Bab Selesai';
                this.classList.add('completed');
                this.disabled = true;
            }
        });
    }
}