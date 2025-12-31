// 1. 응원 문구 리스트
const cheerList = [
  "때지 오늘도 예쁘게 시작하자!! 💖",
  "쏘연이는 오늘도 잘 할 수 있어! 🌈",
  "사랑해, 힘내자! 🥰",
  "오늘도 빛나는 하루 보내! ✨",
  "내가 항상 응원해! 💕",
  "기상 성공하면 맛있는 거 먹자! 🍰",
  "쏘연이 최고! 👍",
  "오늘도 행복하자! 🌸",
  "연재 보는 날까지 화이팅! 🌟",
  "잘 일어나서 멋진 하루 보내자! 🐣",
  "쏘연이의 미소는 나의 힘! 😊",
  "오늘도 귀엽고 사랑스러운 연재! 🧸",
  "쏘연이 덕분에 내 하루도 반짝반짝! ✨",
  "힘들면 언제든 기대도 돼! 🤗",
  "오늘도 나랑 같이 화이팅! 💪",
  "쏘연이의 내일 하루도 행복 듬뿍! 🍀",
  "사랑 듬뿍 담아 응원해! 💌",
  "오늘도 예쁜 꿈만 꾸자! 🌙",
  "내일도 햇살 가득한 하루 보내! ☀️",
  "오늘도 사랑해! 💗",
  "오늘도 자신감 뿜뿜! 💪",
  "예쁜 일만 가득하길! 🌸",
  "내일도 웃는 하루 보내! 😄",
  "오늘도 고생 많았어! 🌟",
  "행복 바이러스 뿜뿜! 🦄",
  "오늘도 내 마음속 1등! 🏆",
  "사랑 듬뿍! 꼬꼬마 💖",
];

// 2. 루틴 메시지 리스트
const routineList = [
  "쏘연이 일어나면 물 한 잔 꼭 마셔! 💧",
  "아침에 스트레칭 살짝만 해주면 몸이 훨씬 가벼워질 거야 🧘‍♀️",
  "햇살 들어오면 커튼 살짝 열고 기지개 쭉~ ☀️",
  "거울 보면서 오늘도 예쁜 미소 한 번! 오늘도 예쁘다 😘",
  "좋아하는 노래 틀고 기분 좋게 준비해봐 🎶",
  "아침에 창문 열고 바람 한 번 쐬면 기분이 달라져 🍃",
  "오늘 할 일 중 제일 쉬운 것부터 생각해보기! ✏️",
  "아침 햇살 받으면서 잠 깨기! 🌞",
  "쏘연이 오늘도 행복한 하루 보내자! 🥰",
  "손목, 어깨 돌리면서 몸 풀어주기! 🌀",
  "따뜻한 물로 얼굴 씻고 개운하게 시작! 🚿",
  "좋아하는 향수 한 번 뿌리고 기분 업! 🌸",
  "예쁜 옷 골라 입고 오늘도 예쁘게! 👗",
  "아침에 나한테 칭찬 한 마디! 오늘도 잘할 거야 👍",
  "창밖 하늘 한 번 올려다보고, 오늘 날씨도 확인! ☁️",
  "내일도 사랑 듬뿍 담아서 출발! 💌",
  "쏘연이 내일은 무리하지 않기로 약속! 🤙",
  "아침에 창문 열고 환기! 겨울엔 살짝만! 🍃",
  "아침에 좋아하는 음악 한 곡 듣고 힘내기! 🎵",
  "아침에 내일도 행복하자고 다짐! 🌸",
  "아침에 물 한 잔 마시고, 오늘도 힘내자! 💧",
  "아침에 가볍게 스트레칭 하고 나가기! 🧘‍♂️",
  "쏘연이 내일도 예쁜 하루 보내! 🌷",
  "아침에 손가락 하트! 오늘도 사랑해! 🫶",
  "아침에 창밖 풍경 한 번 보기! 🌳",
  "아침에 예쁜 옷 입고 기분 좋게 출발! 👗",
  "아침에 내일 할 일 한 가지만 생각해보기! 📝",
  "아침에 거울 보며 오늘도 예쁘다! 😊",
  "아침에 손등에 하트 그리고 시작! 💖",
  "아침에 하늘 한 번 올려다보고, 오늘도 파이팅! ☁️",
  "아침에 연재 생각하면서 미소 짓기! 💌",
  "아침에 손목, 발목 돌리기! 오늘도 건강하게! 🌀"
];

// 3. 비 여부 판단 함수
function analyzeRain(codes) {
  return codes.some(code => code >= 51);
}

// 4. 계산 버튼 이벤트
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

// 5. 날씨 정보 불러오기
function fetchWeather() {
  const infoElem = document.getElementById('weatherInfo');
  if (!navigator.geolocation) {
    infoElem.innerText = '위치 정보를 사용할 수 없어요.';
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error);

  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    
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

          let rainMsg = "";

          // 멘트 뒤에만 이모지를 넣었습니다.
          if (isMorningRain && isAfternoonRain) { 
            rainMsg = "하루종일 비온대 우산 챙겨 !! ☔"; 
          } else if (isMorningRain) { 
            rainMsg = "오전에 비온대 우산 챙겨 !! ☂️";
          } else if (isAfternoonRain) { 
            rainMsg = "오후에 비온대 우산 챙겨 !! 🌦️";
          } else { 
            rainMsg = "비 소식 없음 !! ☀️";
          }

          // innerHTML에서 중복되던 ${icon}을 제거했습니다.
          infoElem.innerHTML = 
            `<span style="font-size:0.85em; color:#ff7eae; font-weight:bold;">내일 날씨</span><br>` +
            `<span style="color:#4a90e2; font-weight:bold;">${rainMsg}</span><br>` +
            `<span style="font-size:0.9em; color:#ffb6c1;">(기온 ${dayTemp}°C)</span>`;
        }
      })
      .catch(() => { infoElem.innerText = '날씨 정보를 불러올 수 없어요.'; });
  }

  function error() { infoElem.innerText = '위치 권한을 허용해줘! 날씨 알려줄게!'; }
}

fetchWeather();