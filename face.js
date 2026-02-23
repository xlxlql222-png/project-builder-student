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
    const MODEL_URL = "https://teachablemachine.withgoogle.com/models/H46875_G2/";

    let model, maxPredictions;

    // Load model
    async function loadModel() {
        if (!model) {
            try {
                // tmImage.load can take the base URL directly or separate URLs
                model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
                maxPredictions = model.getTotalClasses();
            } catch (e) {
                console.error("AI 모델 로딩 에러:", e);
                loader.innerHTML = `<div class="spinner"></div><p style="color: #ff4b4b;">AI 모델 로딩 실패!<br>(${e.message})</p>`;
                throw e;
            }
        }
    }

    // Trigger file select
    if (uploadArea) {
        uploadArea.onclick = () => imageUpload.click();
    }

    // Handle Image Selection
    if (imageUpload) {
        imageUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    
                    // Wait for image to load fully before predicting
                    imagePreview.onload = async () => {
                        imagePreview.classList.remove('hidden');
                        uploadPlaceholder.classList.add('hidden');
                        loader.classList.remove('hidden');
                        resultContainer.classList.add('hidden');
                        await predict();
                    };
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Run Prediction
    async function predict() {
        try {
            await loadModel();
            if (!model) return;

            // model.predict can take an image, video, or canvas
            const prediction = await model.predict(imagePreview);
            
            loader.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            labelContainer.innerHTML = '';

            // Sort predictions by probability
            prediction.sort((a, b) => b.probability - a.probability);
            
            const topResult = prediction[0].className.toLowerCase();
            const topProb = (prediction[0].probability * 100).toFixed(0);

            let finalMsg = "";
            if (topResult.includes("dog") || topResult.includes("강아지")) {
                finalMsg = `🐶 이 친구는 ${topProb}% 확률로 강아지네요!`;
            } else if (topResult.includes("cat") || topResult.includes("고양이")) {
                finalMsg = `🐱 이 친구는 ${topProb}% 확률로 고양이예요!`;
            } else {
                finalMsg = `✨ 분석 결과: ${prediction[0].className} (${topProb}%)`;
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
        } catch (e) {
            console.error("분석 에러 상세:", e);
            loader.classList.add('hidden');
            alert(`이미지 분석 중 오류가 발생했습니다.\n에러 내용: ${e.message}`);
        }
    }

    if (retryBtn) {
        retryBtn.onclick = () => location.reload();
    }
});
