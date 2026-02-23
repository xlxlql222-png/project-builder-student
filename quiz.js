document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const questionContainer = document.querySelector('.question-container');
    const answersContainer = document.querySelector('.answers-container');
    const progressBar = document.querySelector('.progress-bar-fill');
    
    // 질문 데이터
    const questions = [
        {
            q: "주말 오후, 짝남에게 '심심해'라고 카톡이 왔다! 나의 반응은?",
            a: [
                { text: "바로 전화 건다! \"심심해? 나랑 놀자!\" 📞", type: "E" },
                { text: "설레서 침대 팡팡 치다가... \"나도 심심해ㅎㅎ\" 답장", type: "I" }
            ]
        },
        {
            q: "친구들과 파티 중, 낯선 사람이 말을 걸어온다면?",
            a: [
                { text: "자연스럽게 대화를 이어가며 금방 친해진다. 🥂", type: "E" },
                { text: "어색하게 웃으며 친구 곁으로 슬쩍 피한다. 😅", type: "I" }
            ]
        },
        {
            q: "데이트 룩을 고를 때, 내가 더 중요하게 생각하는 건?",
            a: [
                { text: "오늘의 주인공은 나! 시선 집중 화려한 스타일 ✨", type: "S" },
                { text: "은은하고 분위기 있게, 청순한 꾸안꾸 스타일 🌸", type: "F" }
            ]
        },
        {
            q: "썸남이 우울해 보인다. 어떻게 위로해줄까?",
            a: [
                { text: "\"누가 그랬어! 내가 혼내줄게!\" 맛집 데려가기 🍖", type: "T" },
                { text: "조용히 이야기를 들어주며 공감해준다. 🥺", type: "F" }
            ]
        }
    ];

    // 결과 데이터
    const results = {
        "ET": {
            title: "통통 튀는 인간 비타민! 🍊",
            subtitle: "하이틴 로맨스 여주인공 재질",
            desc: "당신은 어디서나 분위기 메이커! 솔직하고 당당한 매력으로 상대방의 마음을 무장해제 시키는 사랑스러운 스타일이에요. <br> #발랄함 #직진녀 #인기쟁이"
        },
        "EF": {
            title: "사랑스러운 애교 장인! 💖",
            subtitle: "로맨틱 코미디 여주인공 재질",
            desc: "존재 자체가 러블리! 풍부한 감수성과 애교로 주변 사람들을 행복하게 만드는 능력이 있어요. 연애할 땐 사랑꾼 그 자체! <br> #사랑둥이 #감성충만 #해피바이러스"
        },
        "IT": {
            title: "시크한 차도녀 본부장님! 😎",
            subtitle: "오피스 로맨스 여주인공 재질",
            desc: "일도 사랑도 똑부러지게! 겉으론 차가워 보이지만 내 사람에겐 따뜻한 반전 매력의 소유자. 지적이고 세련된 매력이 넘쳐요. <br> #걸크러쉬 #능력캐 #츤데레"
        },
        "IF": {
            title: "청순가련 첫사랑 기억조작녀 🌿",
            subtitle: "감성 멜로 드라마 여주인공 재질",
            desc: "보호본능 자극하는 청초한 분위기. 섬세하고 배려심이 깊어 누군가의 잊지 못할 첫사랑으로 기억될 스타일이에요. <br> #청순보스 #분위기여신 #아련함"
        }
    };

    let currentQuestion = 0;
    let score = { "E": 0, "I": 0, "T": 0, "F": 0, "S": 0 };

    // 시작하기
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            showQuestion();
        });
    }

    function showQuestion() {
        if (!questions[currentQuestion]) return;
        const q = questions[currentQuestion];
        questionContainer.innerText = q.q;
        answersContainer.innerHTML = '';
        
        // 진행바 업데이트
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        q.a.forEach(answer => {
            const btn = document.createElement('button');
            btn.classList.add('answer-btn');
            btn.innerText = answer.text;
            btn.addEventListener('click', () => {
                score[answer.type]++;
                nextQuestion();
            });
            answersContainer.appendChild(btn);
        });
    }

    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        questionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        const type1 = score.E >= score.I ? "E" : "I";
        const type2 = score.T >= score.F ? "T" : "F";
        
        let finalKey = type1 + type2; 
        if (!results[finalKey]) finalKey = "EF";

        const result = results[finalKey];
        
        document.getElementById('result-title').innerText = result.title;
        document.getElementById('result-subtitle').innerText = result.subtitle;
        document.getElementById('result-desc').innerHTML = result.desc;
    }

    const retryBtn = document.getElementById('retry-btn');
    if(retryBtn) {
        retryBtn.addEventListener('click', () => {
            currentQuestion = 0;
            score = { "E": 0, "I": 0, "T": 0, "F": 0, "S": 0 };
            resultScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
        });
    }
});
