document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progress-text');

    // Data
    let currentGender = 'female';
    let currentQuestionIdx = 0;
    let score = { E: 0, I: 0, T: 0, F: 0 };

    const questions = {
        female: [
            { q: "드디어 짝남과의 첫 데이트! 옷장을 열었는데 내 마음은?", a: [
                { t: "오늘의 주인공은 나! 화사하고 눈에 띄는 룩 ✨", v: "E" },
                { t: "은은하고 수수한 꾸안꾸! 편안한 게 최고 🌿", v: "I" }
            ]},
            { q: "데이트 중 예상치 못한 비가 온다면? 내 반응은?", a: [
                { t: "어떡해! 내 머리... 속상한 티가 팍팍 난다 😭", v: "F" },
                { t: "에잇, 비 오는 것도 낭만이지! 근처 실내 카페로 가자! ☕", v: "T" }
            ]},
            { q: "친구들과 파티 중, 낯선 사람이 말을 걸어온다면?", a: [
                { t: "오! 새로운 친구? 금방 친해진다 🥂", v: "E" },
                { t: "어색하게 웃으며 슬쩍 친구 뒤로 숨는다 😅", v: "I" }
            ]},
            { q: "썸남이 '오늘 좀 피곤하네'라고 말한다면?", a: [
                { t: "무슨 일 있어? 어디 아파? ㅠㅠ 걱정부터 앞선다", v: "F" },
                { t: "얼른 들어가서 쉬어! 비타민이라도 보내줄까?", v: "T" }
            ]},
            { q: "고백하기 직전의 떨리는 순간, 나는?", a: [
                { t: "못 먹어도 고! 당당하게 내 마음을 표현한다 🔥", v: "E" },
                { t: "상대방의 눈치를 보며 타이밍을 한참 고민한다 💓", v: "I" }
            ]},
            { q: "함께 영화를 보는데 슬픈 장면이 나온다면?", a: [
                { t: "이미 눈물 펑펑... 감정이입 200% 완료 🥺", v: "F" },
                { t: "슬프긴 한데... 저 상황이 이해가 안 가기도? 🤔", v: "T" }
            ]}
        ],
        male: [
            { q: "짝사랑하는 그녀가 다른 남자와 웃고 있다면?", a: [
                { t: "질투 폭발! 슬쩍 가서 대화에 끼어든다 🤨", v: "E" },
                { t: "멀리서 지켜보며 속으로만 끙끙 앓는다 😔", v: "I" }
            ]},
            { q: "기념일에 그녀에게 줄 선물을 고를 때 나는?", a: [
                { t: "그녀에게 꼭 필요할 것 같은 실용적인 아이템 ⌚", v: "T" },
                { t: "정성이 가득 담긴 편지와 꽃다발 🌹", v: "F" }
            ]},
            { q: "그녀와 다퉜을 때, 화해하는 나의 스타일은?", a: [
                { t: "일단 만나서 풀자! 바로 집 앞으로 찾아간다 🏃", v: "E" },
                { t: "생각 정리할 시간이 필요해... 톡으로 진심을 전한다 📱", v: "I" }
            ]},
            { q: "그녀가 힘든 고민을 털어놓는다면?", a: [
                { t: "해결책을 찾아주려 노력하며 현실적인 조언을 한다", v: "T" },
                { t: "그저 묵묵히 들어주며 내 편이 되어준다", v: "F" }
            ]},
            { q: "친구들이 나를 볼 때 더 많이 하는 말은?", a: [
                { t: "너 진짜 분위기 메이커다! 성격 좋아~", v: "E" },
                { t: "너 가끔 무슨 생각 하는지 모르겠어... 시크해!", v: "I" }
            ]},
            { q: "사랑에 빠졌을 때 내 모습은?", a: [
                { t: "온 세상이 핑크빛! 하루 종일 싱글벙글한다", v: "F" },
                { t: "최대한 티 안 내려고 노력하며 쿨한 척한다", v: "T" }
            ]}
        ]
    };

    const results = {
        female: {
            EF: { t: "러블리 뿜뿜 로코 여주 🍭", s: "로맨틱 코미디의 주인공", d: "당신은 존재 자체가 사랑스러운 인간 비타민! 솔직한 감정 표현과 긍정적인 에너지가 당신의 무기예요. 누굴 만나든 금방 매료시키는 마법 같은 매력을 가졌네요.", tip: "가끔은 상대방의 속도에 맞춰 천천히 다가가는 여유도 필요해요!" },
            ET: { t: "걸크러쉬 하이틴 여주 ✨", s: "하이틴 성장물의 주인공", d: "당당하고 주도적인 당신! 일도 사랑도 쟁취하는 멋진 언니 스타일이에요. 시원시원한 성격 뒤에 숨겨진 의리 있는 모습이 사람들을 끌어당깁니다.", tip: "때로는 약한 모습을 보여주는 것이 상대방의 보호본능을 자극할 수 있어요." },
            IF: { t: "청초아련 첫사랑 여주 🌿", s: "서정적인 멜로물의 주인공", d: "맑고 깨끗한 분위기의 당신은 모두의 기억 속에 남는 첫사랑 이미지예요. 섬세하고 배려심 깊은 마음씨로 조용히 상대방의 마음을 녹이는 힘이 있습니다.", tip: "당신의 마음을 조금 더 명확하게 표현한다면 오해를 줄일 수 있어요!" },
            IT: { t: "시크도도 반전매력 여주 😎", s: "세련된 오피스 로맨스의 주인공", d: "차분하고 지적인 매력이 돋보이는 당신! 겉으로는 조금 차가워 보일 수 있지만, 내 사람에게만 보여주는 따뜻한 온도 차가 치명적인 매력 포인트입니다.", tip: "먼저 미소 지으며 다가가는 연습을 해보세요. 세상이 더 부드러워질 거예요!" }
        },
        male: {
            EF: { t: "다정다감 댕댕이 남주 🐶", s: "청춘 로맨스의 주인공", d: "그녀를 위해 모든 걸 다 줄 것 같은 헌신적인 스타일! 풍부한 공감 능력과 세심한 배려로 그녀를 공주님처럼 만들어주는 마법사 같은 존재네요.", tip: "그녀의 의견을 묻는 것도 좋지만, 가끔은 리더십 있게 이끄는 모습도 보여주세요!" },
            ET: { t: "자신감 뿜뿜 직진 남주 🏎️", s: "로맨틱 코미디의 주인공", d: "사랑은 쟁취하는 것! 망설임 없이 그녀에게 다가가는 용기가 당신의 가장 큰 장점입니다. 시원시원하고 열정적인 당신의 모습에 그녀도 반할 수밖에 없네요.", tip: "너무 앞만 보고 달리기보다 그녀의 감정 변화를 살피는 세심함이 필요해요!" },
            IF: { t: "신비로운 예술가 남주 🎨", s: "잔잔한 멜로 영화의 주인공", d: "조용하고 진중한 매력의 당신. 말보다는 행동으로, 화려함보다는 깊이 있는 눈빛으로 진심을 전하는 스타일이군요. 당신의 진정성에 그녀는 깊은 안도감을 느낍니다.", tip: "가끔은 당신의 생각과 감정을 말로 표현해주는 것이 그녀를 더 행복하게 해요!" },
            IT: { t: "츤데레 본부장님 남주 🎩", s: "오피스 로맨스의 주인공", d: "무뚝뚝해 보이지만 알고 보면 누구보다 그녀를 아끼는 '겉바속촉' 스타일! 챙겨주지 않는 척하면서 뒤에서 다 해결해주는 당신의 매력에 헤어나올 수 없습니다.", tip: "가끔은 솔직하게 칭찬 한마디를 건네보세요. 그녀의 마음이 사르르 녹을 거예요!" }
        }
    };

    // Functions
    window.startQuiz = (gender) => {
        currentGender = gender;
        currentQuestionIdx = 0;
        score = { E: 0, I: 0, T: 0, F: 0 };
        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        showQuestion();
    };

    function showQuestion() {
        const qData = questions[currentGender][currentQuestionIdx];
        questionText.innerText = qData.q;
        answersContainer.innerHTML = '';

        // Progress
        const prog = ((currentQuestionIdx + 1) / questions[currentGender].length) * 100;
        progressFill.style.width = `${prog}%`;
        progressText.innerText = `${currentQuestionIdx + 1} / ${questions[currentGender].length}`;

        qData.a.forEach(ans => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerText = ans.t;
            btn.onclick = () => handleAnswer(ans.v);
            answersContainer.appendChild(btn);
        });
    }

    function handleAnswer(val) {
        score[val]++;
        currentQuestionIdx++;
        if (currentQuestionIdx < questions[currentGender].length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        questionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        const e_i = score.E >= score.I ? 'E' : 'I';
        const t_f = score.T >= score.F ? 'T' : 'F';
        const resKey = e_i + t_f;
        const resData = results[currentGender][resKey];

        document.getElementById('result-title').innerText = resData.t;
        document.getElementById('result-subtitle').innerText = resData.s;
        document.getElementById('result-desc').innerText = resData.d;
        document.getElementById('result-tip-text').innerText = resData.tip;
        
        resultScreen.scrollIntoView({ behavior: 'smooth' });
    }

    // Daily Lucky Logic
    const luckyItems = [
        { i: "달콤한 마카롱 🍡", r: "당신의 기분뿐만 아니라 인기도 달콤해질 거예요!" },
        { i: "파스텔톤 수첩 📒", r: "오늘 떠오르는 아이디어가 행운의 열쇠가 됩니다." },
        { i: "하늘하늘한 스카프 🧣", r: "부드러운 분위기가 사람들을 당신 곁으로 모이게 해요." },
        { i: "좋아하는 노래 🎧", r: "귓가에 맴도는 멜로디가 기분 좋은 소식을 가져옵니다." },
        { i: "따뜻한 차 한 잔 🍵", r: "차분한 마음이 당신의 매력을 더 깊게 만들어요." }
    ];
    const rand = luckyItems[Math.floor(Math.random() * luckyItems.length)];
    const luckyBox = document.getElementById('daily-lucky-item');
    if(luckyBox) {
        luckyBox.innerHTML = `<strong>${rand.i}</strong><p>${rand.r}</p>`;
    }

    // Modal
    const modal = document.getElementById('contact-modal');
    const openContact = document.getElementById('open-contact');
    const closeBtn = document.querySelector('.close-modal');

    if(openContact) openContact.onclick = (e) => { e.preventDefault(); modal.style.display = 'flex'; };
    if(closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
});
