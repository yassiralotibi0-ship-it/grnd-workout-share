// Constants
const API_BASE_URL = 'https://fitness-database.onrender.com/api';
// Deep link scheme - try custom scheme first, then universal link
const APP_SCHEME = 'grnd://workout-share'; 
const APP_STORE_LINK = 'https://apps.apple.com/us/app/grnd-fitness/id123456789'; // TODO: Update with actual ID
const PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.fitnessapp.saudi'; // TODO: Update with actual ID

// DOM Elements
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const workoutContent = document.getElementById('workout-content');
const planNameEl = document.getElementById('plan-name');
const daysCountEl = document.getElementById('days-count');
const exercisesCountEl = document.getElementById('exercises-count');
const musclesCountEl = document.getElementById('muscles-count');
const daysContainer = document.getElementById('days-container');
const openAppBtn = document.getElementById('header-action-btn');
const downloadBtn = document.getElementById('download-btn');

// Main Execution
document.addEventListener('DOMContentLoaded', () => {
    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('id');

    if (shareId) {
        fetchWorkoutPlan(shareId);
        setupDeepLinks(shareId);
    } else {
        showError('No workout ID provided');
    }
    
    // Setup generic download buttons
    setupDownloadButtons();
});

// Fetch Workout Data
async function fetchWorkoutPlan(id) {
    try {
        // Need to use the import endpoint as per Android source code
        const response = await fetch(`${API_BASE_URL}/workout-plans/import/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch workout');
        }

        const data = await response.json();
        
        if (data && data.data) {
            renderWorkout(data.data);
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error:', error);
        showError();
    }
}

// Render the UI
function renderWorkout(plan) {
    // Hide loading, show content
    loadingState.classList.add('hidden');
    workoutContent.classList.remove('hidden');

    // Update Header Stats
    // Plan might be the raw plan or wrapped in a share object
    const workoutData = plan.plan || plan; 
    
    planNameEl.textContent = workoutData.name || 'برنامج تمرين';
    
    const workouts = workoutData.workouts || [];
    daysCountEl.textContent = workouts.length;

    // Calculate total exercises and muscles
    let totalExercises = 0;
    const allMuscles = new Set();
    
    workouts.forEach(day => {
        const exercises = day.exercises || [];
        totalExercises += exercises.length;
        
        exercises.forEach(ex => {
            ex.primaryMuscles?.forEach(m => allMuscles.add(m));
        });
    });

    exercisesCountEl.textContent = totalExercises;
    musclesCountEl.textContent = allMuscles.size;

    // Render Days
    daysContainer.innerHTML = '';
    
    workouts.forEach((day, index) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const exercisesHtml = (day.exercises || []).map(ex => `
            <div class="exercise-item">
                <div class="exercise-thumb">
                    <img src="${ex.gifUrl || 'https://via.placeholder.com/48?text=GRND'}" 
                         alt="${ex.nameAr || ex.nameEn}" 
                         onerror="this.src='https://via.placeholder.com/48?text=GRND'">
                </div>
                <div class="exercise-info">
                    <span class="exercise-name">${ex.nameAr || ex.nameEn}</span>
                    <div class="exercise-details">
                        <span class="detail-pill">${ex.sets || 3} جولات</span>
                        <span class="detail-pill">${ex.reps || '12-10'} عدة</span>
                    </div>
                </div>
            </div>
        `).join('');

        dayCard.innerHTML = `
            <div class="day-header">
                <span class="day-title">${day.name || `اليوم ${index + 1}`}</span>
                <span class="day-meta">${day.exercises?.length || 0} تمارين</span>
            </div>
            <div class="exercise-list">
                ${exercisesHtml}
            </div>
        `;
        
        daysContainer.appendChild(dayCard);
    });
}

// Show Error State
function showError(message) {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    if (message) {
        errorState.querySelector('p').textContent = message;
    }
}

// Deep Linking Logic
function setupDeepLinks(id) {
    const deepLink = `${APP_SCHEME}?id=${id}`;
    
    // Prepare the "Open App" button
    openAppBtn.onclick = (e) => {
        e.preventDefault();
        tryOpenApp(deepLink);
    };
}

function setupDownloadButtons() {
    downloadBtn.onclick = () => {
        // Detect OS
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            window.location.href = PLAY_STORE_LINK;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            window.location.href = APP_STORE_LINK;
        } else {
            // Default to App Store or Landing Page
             window.location.href = APP_STORE_LINK;
        }
    };
}

// Intelligent Deep Linking Redirect
function tryOpenApp(initialUrl) {
    // 1. Try to open the app via custom scheme
    window.location.href = initialUrl;
    
    // 2. If it fails (timeout), fallback to App Store
    setTimeout(() => {
        if (document.hidden || document.webkitHidden) {
            // App opened, do nothing
            return;
        }
        
        // App didn't open, redirect to store
        // Detect OS again for correct store
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            window.location.href = PLAY_STORE_LINK;
        } else {
            window.location.href = APP_STORE_LINK;
        }
    }, 2500);
}
