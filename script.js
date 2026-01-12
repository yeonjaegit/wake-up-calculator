// 1. 응원 문구 리스트
const cheerList = [
    "때지 오늘도 예쁘게 시작하자!! 💖", "쏘연이는 오늘도 잘 할 수 있어! 🌈", "사랑해, 힘내자! 🥰",
    "오늘도 빛나는 하루 보내! ✨", "내가 항상 응원해! 💕", "기상 성공하면 맛있는 거 먹자! 🍰",
    "쏘연이 최고! 👍", "오늘도 행복하자! 🌸", "연재 보는 날까지 화이팅! 🌟",
    "잘 일어나서 멋진 하루 보내자! 🐣", "쏘연이의 미소는 나의 힘! 😊", "오늘도 귀엽고 사랑스러운 연재! 🧸",
    "쏘연이 덕분에 내 하루도 반짝반짝! ✨", "힘들면 언제든 기대도 돼! 🤗", "오늘도 나랑 같이 화이팅! 💪",
    "쏘연이의 내일 하루도 행복 듬뿍! 🍀", "사랑 듬뿍 담아 응원해! 💌", "오늘도 예쁜 꿈만 꾸자! 🌙",
    "내일도 햇살 가득한 하루 보내! ☀️", "오늘도 사랑해! 💗", "오늘도 자신감 뿜뿜! 💪",
    "예쁜 일만 가득하길! 🌸", "내일도 웃는 하루 보내! 😄", "오늘도 고생 많았어! 🌟",
    "행복 바이러스 뿜뿜! 🦄", "오늘도 내 마음속 1등! 🏆", "사랑 듬뿍! 꼬꼬마 💖"
];

// 2. 루틴 메시지 리스트
const routineList = [
    "쏘연이 일어나면 물 한 잔 꼭 마셔! 💧", "아침에 스트레칭 살짝만 해주면 몸이 훨씬 가벼워질 거야 🧘‍♀️",
    "햇살 들어오면 커튼 살짝 열고 기지개 쭉~ ☀️", "거울 보면서 오늘도 예쁜 미소 한 번! 오늘도 예쁘다 😘",
    "좋아하는 노래 틀고 기분 좋게 준비해봐 🎶", "아침에 창문 열고 바람 한 번 쐬면 기분이 달라져 🍃",
    "오늘 할 일 중 제일 쉬운 것부터 생각해보기! ✏️", "아침 햇살 받으면서 잠 깨기! 🌞",
    "쏘연이 오늘도 행복한 하루 보내자! 🥰", "손목, 어깨 돌리면서 몸 풀어주기! 🌀",
    "따뜻한 물로 얼굴 씻고 개운하게 시작! 🚿", "좋아하는 향수 한 번 뿌리고 기분 업! 🌸",
    "예쁜 옷 골라 입고 오늘도 예쁘게! 👗", "아침에 나한테 칭찬 한 마디! 오늘도 잘할 거야 👍"
];

// 3. 음식 데이터 및 자동 판정 시스템
const foodDb = {
    // 수동 등록 데이터 (예외적이거나 중요한 음식들)
    special: [
        { name: "닭갈비", status: "bad", msg: "기름에 볶고 매운 양념이라 피부 자극이 심해! 🐔" },
        { name: "찜닭", status: "bad", msg: "당면과 짠 간장 양념이 피부 회복을 방해해 🍗" },
        { name: "쭈꾸미", status: "bad", msg: "너무 맵고 자극적이라 피부가 아파해요 🐙" },
        { name: "낙지볶음", status: "bad", msg: "매운 양념은 피부 열감을 올려서 안 좋아 🌶️" },
        { name: "마라탕", status: "bad", msg: "자극적인 향신료와 기름기는 절대 금지! 🍲" },
        { name: "수육", status: "good", msg: "기름기 뺀 살코기는 최고의 단백질원! 👍" },
        { name: "보쌈", status: "good", msg: "비계보다는 살코기 위주로 맛있게 먹자 🐷" },
        { name: "쌀국수", status: "good", msg: "밀가루 대신 쌀면은 훨씬 안전해! 국물은 맑게 🍜" },
        { name: "초밥", status: "good", msg: "신선한 회와 밥은 좋지만 와사비는 적게! 🍣" },
        { name: "회", status: "good", msg: "기름지지 않은 생선회는 피부에도 좋아 🐟" },
        { name: "아구찜", status: "bad", msg: "맵고 전분이 많이 들어가서 좋지 않아 🐡" },
        { name: "곱창", status: "bad", msg: "기름기가 너무 많아서 피부 염증에 안 좋아 🙅‍♀️" },
        { name: "막창", status: "bad", msg: "기름진 부위는 당분간만 참아주자 🚫" }
    ],

    // 키워드 기반 자동 판정 알고리즘
    analyze: function(name) {
        // 1. 수동 등록 메뉴 우선 확인
        const specialItem = this.special.find(item => name.includes(item.name));
        if (specialItem) return specialItem;

        // 2. 키워드 필터링 (밀가루, 튀김, 매운것, 차가운것)
        if (/(라면|국수|우동|파스타|스파게티|수제비|칼국수|냉면|쫄면|면)/.test(name)) {
            return { name, status: "bad", msg: "밀가루 면 종류는 피부 회복을 늦춰요 🍜" };
        }
        if (/(치킨|튀김|돈가스|가츠|전|부침개|너겟|탕수육|호떡)/.test(name)) {
            return { name, status: "bad", msg: "기름에 튀기거나 부친 음식은 피부 독이야 🍗" };
        }
        if (/(빵|케이크|쿠키|파이|도넛|샌드위치|버거|피자)/.test(name)) {
            return { name, status: "bad", msg: "밀가루와 설탕은 피부 염증을 유발해 🍕" };
        }
        if (/(떡볶이|불닭|매운|짬뽕|마라)/.test(name)) {
            return { name, status: "bad", msg: "자극적이고 매운 양념은 피해야 해 🌶️" };
        }
        if (/(아이스크림|빙수|슬러시|콜라|사이다|음료)/.test(name)) {
            return { name, status: "bad", msg: "찬 음식이나 단 음료는 건강에 안 좋아 🥤" };
        }
        if (/(술|맥주|소주|와인|칵테일|하이볼)/.test(name)) {
            return { name, status: "bad", msg: "알코올은 피부의 최대 적! 절대 안 돼 🍺" };
        }
        
        // 3. 긍정 키워드 (한식 위주)
        if (/(밥|국|찌개|나물|구이|찜|조림|두부|콩|채소|샐러드)/.test(name)) {
            return { name, status: "good", msg: "자극적이지 않은 한식과 채소는 너무 좋아! 🥗" };
        }

        // 4. 기본 응답
        return { name, status: "check", msg: "정보가 부족해! 튀김, 밀가루, 매운 게 아니라면 괜찮을 거야 🧐" };
    }
};

// 탭 전환 로직
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 음식 검색 로직
document.getElementById('foodSearch').addEventListener('input', function(e) {
    const query = e.target.value.trim();
    const resultDiv = document.getElementById('searchResult');
    
    if (!query) { resultDiv.innerHTML = ""; return; }

    const result = foodDb.analyze(query);
    
    resultDiv.innerHTML = `
        <div class="result-item ${result.status}">
            <strong>${result.name}</strong>: ${result.msg}
        </div>
    `;
});

// 기상 계산 및 날씨 로직 (기존과 동일하므로 생략 없이 전체 포함)
document.getElementById("calculateBtn").addEventListener("click", function() {
    const goTime = document.getElementById('goTime').value;
    if (!goTime) { alert("나가야 할 시간을 입력해주세요!"); return; }
    let [hour, min] = goTime.split(':').map(Number);
    let hour1 = hour - 2; let min1 = min - 30;
    if (min1 < 0) { min1 += 60; hour1 -= 1; }
    if (hour1 < 0) hour1 += 24;
    let hour2 = hour; let min2 = min - 40;
    if (min2 < 0) { min2 += 60; hour2 -= 1; }
    if (hour2 < 0) hour2 += 24;
    const randomRoutine = routineList[Math.floor(Math.random() * routineList.length)];
    const randomCheer = cheerList[Math.floor(Math.random() * cheerList.length)];
    document.getElementById('wakeUpTime').innerText = `💕 알람 시간 💕\n${hour1} : ${min1.toString().padStart(2,'0')}\n${hour2} : ${min2.toString().padStart(2,'0')} \n`;
    let routineElem = document.getElementById('morningRoutine');
    if (!routineElem) {
        routineElem = document.createElement('div');
        routineElem.id = 'morningRoutine';
        routineElem.className = 'morning-routine';
        document.getElementById('cheerMsg').parentNode.insertBefore(routineElem, document.getElementById('cheerMsg'));
    }
    routineElem.innerText = `💕 ${randomRoutine}`;
    document.getElementById('cheerMsg').innerText = randomCheer;
});

function analyzeRain(codes) { return codes.some(code => code >= 51); }
function fetchWeather() {
    const infoElem = document.getElementById('weatherInfo');
    if (!navigator.geolocation) { infoElem.innerText = '위치 정보를 사용할 수 없어요.'; return; }
    navigator.geolocation.getCurrentPosition(success, error);
    function success(pos) {
        const lat = pos.coords.latitude; const lon = pos.coords.longitude;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=auto`)
            .then(res => res.json())
            .then(data => {
                const now = new Date();
                const tomorrowStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${(now.getDate() + 1).toString().padStart(2, '0')}`;
                const tomorrowData = data.hourly.time.map((t, i) => ({
                    time: t, temp: data.hourly.temperature_2m[i], code: data.hourly.weathercode[i]
                })).filter(item => item.time.startsWith(tomorrowStr));
                if (tomorrowData.length > 0) {
                    const dayTemp = Math.round(tomorrowData[14].temp);
                    const isRain = analyzeRain(tomorrowData.map(d => d.code));
                    let rainMsg = isRain ? "내일 비 소식 있어요 우산! ☔" : "내일 비 소식 없음 !! ☀️";
                    infoElem.innerHTML = `<span style="font-size:0.85em; color:#ff7eae; font-weight:bold;">내일 날씨</span><br>` +
                        `<span style="color:#4a90e2; font-weight:bold;">${rainMsg}</span><br>` +
                        `<span style="font-size:0.9em; color:#ffb6c1;">(기온 ${dayTemp}°C)</span>`;
                }
            }).catch(() => { infoElem.innerText = '날씨 정보를 불러올 수 없어요.'; });
    }
    function error() { infoElem.innerText = '위치 권한을 허용해줘!'; }
}
fetchWeather();