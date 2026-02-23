document.addEventListener('DOMContentLoaded', async () => {
    const imageInput = document.getElementById('image-input');
    const uploadArea = document.getElementById('image-upload-area');
    const faceImage = document.getElementById('face-image');
    const uploadLabel = document.getElementById('upload-label');
    const predictBtn = document.getElementById('predict-btn');
    const loading = document.getElementById('loading');
    const resultArea = document.getElementById('result-area');
    const labelContainer = document.getElementById('label-container');
    const resultMessage = document.getElementById('result-message');

    // [중요] 사용자의 Teachable Machine 모델 URL로 변경해주세요!
    // 예: "https://teachablemachine.withgoogle.com/models/xdalpkbz/"
    const MODEL_URL = "https://teachablemachine.withgoogle.com/models/xdalpkbz/"; 

    let model, maxPredictions;

    // 모델 로드
    async function initModel() {
        if (!model) {
            loading.style.display = 'block';
            try {
                const modelURL = MODEL_URL + "model.json";
                const metadataURL = MODEL_URL + "metadata.json";
                model = await tmImage.load(modelURL, metadataURL);
                maxPredictions = model.getTotalClasses();
                loading.style.display = 'none';
            } catch (e) {
                console.error("모델 로드 실패:", e);
                loading.innerHTML = "<p>모델을 불러오지 못했습니다. URL을 확인해주세요!</p>";
            }
        }
    }

    // 사진 클릭 시 파일 선택창 열기
    uploadArea.addEventListener('click', () => imageInput.click());

    // 파일 선택 시 이미지 미리보기
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                faceImage.src = event.target.result;
                faceImage.style.display = 'block';
                uploadLabel.style.display = 'none';
                predictBtn.style.display = 'block';
                initModel(); // 미리 모델 로딩 시작
            };
            reader.readAsDataURL(file);
        }
    });

    // 분석 실행
    predictBtn.addEventListener('click', async () => {
        if (!model) {
            alert("모델을 불러오는 중입니다. 잠시만 기다려주세요!");
            return;
        }

        loading.style.display = 'block';
        predictBtn.style.display = 'none';
        
        const prediction = await model.predict(faceImage);
        
        loading.style.display = 'none';
        resultArea.style.display = 'block';
        labelContainer.innerHTML = '';

        // 결과 정렬 및 표시
        prediction.sort((a, b) => b.probability - a.probability);
        
        const topResult = prediction[0].className;
        const topProb = (prediction[0].probability * 100).toFixed(0);

        let finalMsg = "";
        if (topResult.includes("Dog") || topResult.includes("강아지")) {
            finalMsg = `🐾 당신은 귀여운 ${topProb}% 강아지상!`;
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
            barWrap.className = 'result-bar-wrap';
            barWrap.innerHTML = `
                <div class="result-label"><span>${className}</span><span>${prob}%</span></div>
                <div class="result-bar">
                    <div class="result-fill" style="width: ${prob}%"></div>
                </div>
            `;
            labelContainer.appendChild(barWrap);
        });
        
        // 결과로 스크롤 이동
        resultArea.scrollIntoView({ behavior: 'smooth' });
    });
});
