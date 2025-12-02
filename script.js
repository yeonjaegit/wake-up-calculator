// 랜덤 응원/사랑 문구 리스트
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

// 귀엽고 사랑스러운 기상 후 루틴 메시지 리스트
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


document.getElementById("calculateBtn").addEventListener("click", function() {
  const goTime = document.getElementById('goTime').value;
  if (!goTime) {
    alert("나가야 할 시간을 입력해주세요!");
    return;
  }
  let [hour, min] = goTime.split(':').map(Number);
  // 첫 번째 시간: 2시간 30분 전
  let hour1 = hour - 2;
  let min1 = min - 30;
  if (min1 < 0) {
    min1 += 60;
    hour1 -= 1;
  }
  if (hour1 < 0) hour1 += 24;
  // 두 번째 시간: 40분 전
  let hour2 = hour;
  let min2 = min - 40;
  if (min2 < 0) {
    min2 += 60;
    hour2 -= 1;
  }
  if (hour2 < 0) hour2 += 24;

  // 랜덤 기상 후 루틴 메시지
  const randomRoutine = routineList[Math.floor(Math.random() * routineList.length)];
  // 랜덤 응원/사랑 문구 출력
  const randomCheer = cheerList[Math.floor(Math.random() * cheerList.length)];

  // 결과 표시
  document.getElementById('wakeUpTime').innerText = `💕 알람 시간 💕\n${hour1} : ${min1.toString().padStart(2,'0')}\n${hour2} : ${min2.toString().padStart(2,'0')} \n`;

  // cheerMsg 위에 루틴 메시지 동적 생성/갱신
  let routineElem = document.getElementById('morningRoutine');
  if (!routineElem) {
    routineElem = document.createElement('div');
    routineElem.id = 'morningRoutine';
    routineElem.className = 'morning-routine';
    const cheerMsgElem = document.getElementById('cheerMsg');
    cheerMsgElem.parentNode.insertBefore(routineElem, cheerMsgElem);
  }
  routineElem.innerText = `💕 ${randomRoutine}`;

  // 응원 메시지 갱신
  document.getElementById('cheerMsg').innerText = randomCheer;
});

// ---- 날씨 정보 표시 ----
// Open-Meteo 무료 API 사용 (API키 불필요, 실시간/위치 기반)
function fetchWeather() {
  if (!navigator.geolocation) {
    document.getElementById('weatherInfo').innerText = '위치 정보를 사용할 수 없어요.';
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error);
  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=weathercode&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          const temp = data.current_weather.temperature;
          const code = data.current_weather.weathercode;
          const desc = weatherCodeToKorean(code);
          document.getElementById('weatherInfo').innerHTML = `${desc}, ${temp}°C`;
        } else {
          document.getElementById('weatherInfo').innerText = '날씨 정보를 불러올 수 없어요.';
        }
      })
      .catch(() => {
        document.getElementById('weatherInfo').innerText = '날씨 정보를 불러올 수 없어요.';
      });
  }
  function error() {
    document.getElementById('weatherInfo').innerText = '위치 권한이 필요해요!';
  }
}
// 날씨 코드 한글 변환
function weatherCodeToKorean(code) {
  const map = {
    0: '맑음', 1: '대체로 맑음', 2: '부분 흐림', 3: '흐림',
    45: '안개', 48: '서리 안개',
    51: '이슬비', 53: '이슬비', 55: '이슬비',
    56: '서리 이슬비', 57: '서리 이슬비',
    61: '약한 비', 63: '비', 65: '강한 비',
    66: '서리 비', 67: '강한 서리 비',
    71: '약한 눈', 73: '눈', 75: '강한 눈',
    77: '진눈깨비',
    80: '소나기', 81: '강한 소나기', 82: '매우 강한 소나기',
    85: '약한 눈 소나기', 86: '강한 눈 소나기',
    95: '천둥', 96: '천둥+우박', 99: '강한 천둥+우박'
  };
  return map[code] || '날씨 정보';
}
fetchWeather();


