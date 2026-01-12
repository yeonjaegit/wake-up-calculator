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

// 3. 음식 데이터베이스 (병원 안내문 기반)
const foodDb = [
    { name: "김치전", status: "bad", msg: "밀가루랑 기름이 많아서 지금은 안 돼! 😥" },
    { name: "해물파전", status: "bad", msg: "부침개는 기름기가 많아서 참아주자! 🚫" },
    { name: "감자전", status: "bad", msg: "기름에 부친 전 종류는 피하는 게 좋아! 🥔" },
    { name: "수육", status: "good", msg: "기름기 뺀 수육은 단백질 보충에 최고! 👍" },
    { name: "백반", status: "good", msg: "나물 위주의 한식은 피부에 정말 좋아! 🍚" },
    { name: "된장찌개", status: "good", msg: "맵지 않고 구수한 된장찌개는 오케이! ✨" },
    { name: "라면", status: "bad", msg: "인스턴트+밀가루+매운맛 조합은 절대 금지! 🙅‍♀️" },
    { name: "떡볶이", status: "bad", msg: "밀가루 떡이랑 매운 양념은 피부가 아파해 🌶️" },
    { name: "빵", status: "bad", msg: "밀가루는 당분간만 멀리하자... 🍞" },
    { name: "치킨", status: "bad", msg: "튀긴 음식은 피부 염증을 일으킬 수 있어 🍗" },
    { name: "삼겹살", status: "bad", msg: "기름진 삼겹살보다는 살코기 위주 찜 요리로! 🥓" },
    { name: "두부", status: "good", msg: "두부 요리는 속도 편하고 피부에도 좋아! 🤍" },
    { name: "나물", status: "good", msg: "각종 나물 반찬은 많이 먹어도 돼! 🌿" },
    { name: "커피", status: "bad", msg: "단 커피(마끼아또 등)는 안 돼! 차 마시자 ☕" },
    { name: "술", status: "bad", msg: "술은 피부 회복을 방해해! 절대 금주! 🍺" }
];

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

    const filtered = foodDb.filter(f => f.name.includes(query));
    
    if (filtered.length > 0) {
        resultDiv.innerHTML = filtered.map(f => `
            <div class="result-item ${f.status}">
                <strong>${f.name}</strong>: ${f.msg}
            </div>
        `).join('');
    } else {
        resultDiv.innerHTML = `<div class="result-item">아직 정보가 없지만, 튀김/밀가루면 안 돼! 🧐</div>`;
    }
});

// 기존 기상 계산 로직
document.getElementById("calculateBtn").addEventListener("click", function() {
    const goTime = document.getElementById('goTime').value;
    if (!goTime) {
        alert("나가야 할 시간을 입력해주세요!");
        return;
    }
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
        const cheerMsgElem = document.getElementById('cheerMsg');
        cheerMsgElem.parentNode.insertBefore(routineElem, cheerMsgElem);
    }
    routineElem.innerText = `💕 ${randomRoutine}`;
    document.getElementById('cheerMsg').innerText = randomCheer;
});

// 날씨 관련 함수 (기존 유지)
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
                const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                const tomorrowStr = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;
                const tomorrowData = data.hourly.time.map((t, i) => ({
                    time: t, temp: data.hourly.temperature_2m[i], code: data.hourly.weathercode[i]
                })).filter(item => item.time.startsWith(tomorrowStr));

                if (tomorrowData.length > 0) {
                    const morningCodes = tomorrowData.slice(6, 12).map(d => d.code);
                    const afternoonCodes = tomorrowData.slice(12, 21).map(d => d.code);
                    const dayTemp = Math.round(tomorrowData[14].temp);
                    const isMorningRain = analyzeRain(morningCodes);
                    const isAfternoonRain = analyzeRain(afternoonCodes);
                    let rainMsg = isMorningRain && isAfternoonRain ? "하루종일 비온대 우산 챙겨 !! ☔" : 
                                 isMorningRain ? "오전에 비온대 우산 챙겨 !! ☂️" : 
                                 isAfternoonRain ? "오후에 비온대 우산 챙겨 !! 🌦️" : "비 소식 없음 !! ☀️";
                    infoElem.innerHTML = `<span style="font-size:0.85em; color:#ff7eae; font-weight:bold;">내일 날씨</span><br>` +
                        `<span style="color:#4a90e2; font-weight:bold;">${rainMsg}</span><br>` +
                        `<span style="font-size:0.9em; color:#ffb6c1;">(기온 ${dayTemp}°C)</span>`;
                }
            }).catch(() => { infoElem.innerText = '날씨 정보를 불러올 수 없어요.'; });
    }
    function error() { infoElem.innerText = '위치 권한을 허용해줘! 날씨 알려줄게!'; }
}
fetchWeather();