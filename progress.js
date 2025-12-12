// Progress Tracking System

// Initialize progress data
let userProgress = JSON.parse(localStorage.getItem('smartzoneProgress')) || {
    subjects: {},
    totalPoints: 0,
    level: 1
};

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('smartzoneProgress', JSON.stringify(userProgress));
}

// Mark a chapter as completed
function completeChapter(subjectId, chapterIndex) {
    if (!userProgress.subjects[subjectId]) {
        userProgress.subjects[subjectId] = {
            completedChapters: [],
            points: 0
        };
    }
    
    // Check if chapter is already completed
    if (!userProgress.subjects[subjectId].completedChapters.includes(chapterIndex)) {
        userProgress.subjects[subjectId].completedChapters.push(chapterIndex);
        userProgress.subjects[subjectId].points += 10; // 10 points per chapter
        userProgress.totalPoints += 10;
        
        // Level up every 100 points
        userProgress.level = Math.floor(userProgress.totalPoints / 100) + 1;
        
        saveProgress();
        updateProgressDisplay();
    }
}

// Get progress for a subject
function getSubjectProgress(subjectId, totalChapters) {
    if (!userProgress.subjects[subjectId]) {
        return {
            completed: 0,
            total: totalChapters,
            percentage: 0,
            points: 0
        };
    }
    
    const completed = userProgress.subjects[subjectId].completedChapters.length;
    return {
        completed: completed,
        total: totalChapters,
        percentage: Math.round((completed / totalChapters) * 100),
        points: userProgress.subjects[subjectId].points
    };
}

// Get overall progress
function getOverallProgress() {
    let totalCompleted = 0;
    let totalChapters = 0;
    
    for (const subjectId in userProgress.subjects) {
        totalCompleted += userProgress.subjects[subjectId].completedChapters.length;
        // We would need to know total chapters per subject for accurate calculation
    }
    
    return {
        totalPoints: userProgress.totalPoints,
        level: userProgress.level,
        completedChapters: totalCompleted
    };
}

// Update progress display in UI
function updateProgressDisplay() {
    // Update overall progress if elements exist
    const pointsElement = document.getElementById('total-points');
    const levelElement = document.getElementById('current-level');
    
    if (pointsElement) {
        pointsElement.textContent = userProgress.totalPoints;
    }
    
    if (levelElement) {
        levelElement.textContent = userProgress.level;
    }
    
    // Update subject-specific progress
    document.querySelectorAll('.subject-progress').forEach(element => {
        const subjectId = element.getAttribute('data-subject-id');
        const totalChapters = parseInt(element.getAttribute('data-total-chapters'));
        
        if (subjectId && totalChapters) {
            const progress = getSubjectProgress(subjectId, totalChapters);
            const progressBar = element.querySelector('.progress-fill');
            const progressText = element.querySelector('.progress-text');
            
            if (progressBar) {
                progressBar.style.width = `${progress.percentage}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${progress.completed}/${progress.total} bab`;
            }
        }
    });
}

// Initialize progress system
document.addEventListener('DOMContentLoaded', function() {
    updateProgressDisplay();
    
    // Add event listeners for chapter completion
    document.querySelectorAll('.complete-chapter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-subject-id');
            const chapterIndex = parseInt(this.getAttribute('data-chapter-index'));
            
            if (subjectId !== null && !isNaN(chapterIndex)) {
                completeChapter(subjectId, chapterIndex);
                
                // Visual feedback
                this.textContent = '✓ Selesai';
                this.classList.add('completed');
                this.disabled = true;
            }
        });
    });
});

// Export functions for use in other files
window.ProgressTracker = {
    completeChapter,
    getSubjectProgress,
    getOverallProgress,
    updateProgressDisplay
};