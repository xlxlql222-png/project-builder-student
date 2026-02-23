// Teachable Machine Model URL
// Replace with your own model URL if needed
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/hS9-R6G-H/"; 

let model, maxPredictions;

async function initModel() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Failed to load model:", error);
        alert("모델을 불러오는데 실패했습니다. URL을 확인해주세요.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('result-container');
    const labelContainer = document.getElementById('label-container');
    const resultMessage = document.getElementById('result-message');
    const retryBtn = document.getElementById('retry-btn');
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const contactToggle = document.getElementById('contact-toggle');
    const contactModal = document.getElementById('contact-modal');
    const closeModal = document.querySelector('.close-modal');

    // Initialize Model
    initModel();

    // Theme Logic
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon('light');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.innerHTML = '<path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>';
        } else {
            themeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        }
    }

    // Modal Logic
    contactToggle.addEventListener('click', () => contactModal.style.display = 'flex');
    closeModal.addEventListener('click', () => contactModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) contactModal.style.display = 'none';
    });

    // Upload Logic
    uploadArea.addEventListener('click', () => imageInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--accent-primary)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) handleImage(files[0]);
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleImage(e.target.files[0]);
    });

    function handleImage(file) {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
            
            predict();
        };
        reader.readAsDataURL(file);
    }

    async function predict() {
        if (!model) {
            alert("모델이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        // Allow some time for loader to show
        setTimeout(async () => {
            const prediction = await model.predict(imagePreview);
            displayResults(prediction);
            loader.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        }, 800);
    }

    function displayResults(prediction) {
        labelContainer.innerHTML = '';
        
        // Sort predictions by probability
        prediction.sort((a, b) => b.probability - a.probability);
        
        const topResult = prediction[0];
        let message = "";
        
        // Map class names to Korean friendly terms
        const classMap = {
            "Dog": "귀여운 강아지상 🐶",
            "Cat": "도도한 고양이상 🐱",
            "Rabbit": "깜찍한 토끼상 🐰",
            "Dinosaur": "듬직한 공룡상 🦖",
            "Bear": "푸근한 곰상 🐻"
        };

        const resultTitle = classMap[topResult.className] || topResult.className;
        resultMessage.textContent = `당신은 ${resultTitle} 입니다!`;

        prediction.forEach(p => {
            const prob = (p.probability * 100).toFixed(0);
            const label = classMap[p.className] || p.className;
            
            const item = document.createElement('div');
            item.className = 'prediction-item';
            item.innerHTML = `
                <div class="prediction-label">
                    <span>${label}</span>
                    <span>${prob}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${prob}%"></div>
                </div>
            `;
            labelContainer.appendChild(item);
        });
    }

    retryBtn.addEventListener('click', () => {
        imagePreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        imageInput.value = '';
    });
});
