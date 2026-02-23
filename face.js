document.addEventListener('DOMContentLoaded', async () => {
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('result-container');
    const labelContainer = document.getElementById('label-container');
    const resultMessage = document.getElementById('result-message');
    const retryBtn = document.getElementById('retry-btn');

    // [중요] 사용자의 Teachable Machine 모델 URL
    const MODEL_URL = "https://teachablemachine.withgoogle.com/models/xdalpkbz/";

    let model, maxPredictions;

    // Load model
    async function loadModel() {
        if (!model) {
            try {
                const modelURL = MODEL_URL + "model.json";
                const metadataURL = MODEL_URL + "metadata.json";
                model = await tmImage.load(modelURL, metadataURL);
                maxPredictions = model.getTotalClasses();
            } catch (e) {
                console.error("Model Loading Error:", e);
                alert("AI 모델 로딩에 실패했습니다. 인터넷 연결을 확인해주세요.");
            }
        }
    }

    // Trigger file select
    if (uploadArea) {
        uploadArea.onclick = () => imageUpload.click();
    }

    // Handle Image Selection
    if (imageUpload) {
        imageUpload.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    imagePreview.src = event.target.result;
                    imagePreview.classList.remove('hidden');
                    uploadPlaceholder.classList.add('hidden');
                    
                    // Show Loader
                    loader.classList.remove('hidden');
                    resultContainer.classList.add('hidden');

                    // Predict
                    await predict();
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Run Prediction
    async function predict() {
        await loadModel();
        if (!model) return;

        const prediction = await model.predict(imagePreview);
        
        // Hide Loader, Show Results
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        labelContainer.innerHTML = '';

        // Sort predictions by probability
        prediction.sort((a, b) => b.probability - a.probability);
        
        const topResult = prediction[0].className;
        const topProb = (prediction[0].probability * 100).toFixed(0);

        let finalMsg = "";
        if (topResult.includes("Dog") || topResult.includes("강아지")) {
            finalMsg = `🐶 당신은 귀염뽀짝 ${topProb}% 강아지상!`;
        } else if (topResult.includes("Cat") || topResult.includes("고양이")) {
            finalMsg = `🐱 당신은 도도한 ${topProb}% 고양이상!`;
        } else {
            finalMsg = `✨ 당신은 매력적인 ${topResult}상! (${topProb}%)`;
        }
        
        resultMessage.innerText = finalMsg;

        prediction.forEach(p => {
            const prob = (p.probability * 100).toFixed(0);
            const className = p.className.replace("Dog", "강아지").replace("Cat", "고양이");
            
            const barWrap = document.createElement('div');
            barWrap.className = 'prediction-item';
            barWrap.innerHTML = `
                <div class="prediction-label"><span>${className}</span><span>${prob}%</span></div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${prob}%"></div>
                </div>
            `;
            labelContainer.appendChild(barWrap);
        });
    }

    if (retryBtn) {
        retryBtn.onclick = () => location.reload();
    }
});
