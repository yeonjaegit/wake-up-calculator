// 랜덤 응원/사랑 문구 리스트
const cheerList = [
  "오늘도 예쁘게 시작하자! 💖",
  "쏘연아 넌 할 수 있어! 🌈",
  "사랑해, 힘내자! 🥰",
  "오늘도 빛나는 하루 보내! ✨",
  "내가 항상 응원해! 💕",
  "기상 성공하면 맛있는 거 먹자! 🍰",
  "쏘연이 최고! 👍",
  "오늘도 행복하자! 🌸",
  "너의 하루가 반짝이길! 🌟",
  "잘 일어나서 멋진 하루 보내자! 🐣",
  "쏘연이의 미소는 나의 힘! 😊",
  "오늘도 귀엽고 사랑스럽게! 🧸",
  "쏘연이 덕분에 내 하루도 반짝여! ✨",
  "힘들면 언제든 기대도 돼! 🤗",
  "오늘도 나랑 같이 화이팅! 💪",
  "쏘연이의 하루가 행복으로 가득하길! 🍀",
  "사랑 듬뿍 담아 응원해! 💌",
  "내 마음은 항상 곁에! 🫶",
  "오늘도 예쁜 꿈만 꾸자! 🌙",
  "햇살 가득한 하루 보내! ☀️",
  "오늘도 사랑해! 💗",
  "오늘도 자신감 뿜뿜! 💪",
  "예쁜 일만 가득하길! 🌸",
  "웃는 하루 보내! 😄",
  "행복 바이러스 뿜뿜! 🦄",
  "오늘도 내 마음속 1등! 🏆",
  "반짝이는 별처럼! ⭐",
  "사랑 듬뿍! 💖"
];

// 귀엽고 사랑스러운 기상 후 루틴 메시지 리스트
const routineList = [
  "바빠도 간단하게라도 아침 먹고 다녀 사랑해 💕",
  "기상 후 스트레칭 3분! 쏘연이 몸도 쭉쭉~ 🧘‍♀️",
  "물 한 잔 마시고 오늘도 촉촉하게 시작! 💧",
  "햇살 쬐면서 기지개 쭉~ 오늘도 반짝이자 ☀️",
  "거울 보고 예쁜 미소 한 번! 오늘도 예쁘다 😘",
  "좋아하는 노래 한 곡 듣고 힘내자 🎶",
  "창문 열고 상쾌한 공기 마시기! 🍃",
  "아침엔 가벼운 산책도 좋아! 🚶‍♀️",
  "오늘 할 일 한 가지만 생각해보기! ✏️",
  "귀여운 쏘연이 오늘도 화이팅! 🐰",
  "아침에 손등에 하트 그리고 시작! 💖",
  "아침 햇살처럼 환하게 웃어줘! 🌞",
  "오늘도 나랑 행복한 하루 보내자! 🥰",
  "아침에 손목 돌리기, 어깨 돌리기! 🌀",
  "따뜻한 물로 세수하고 상쾌하게! 🚿",
  "아침에 좋아하는 향수 한 번 뿌리기! 🌸",
  "오늘도 예쁜 옷 입고 기분 좋게! 👗",
  "아침에 나에게 칭찬 한 마디! 잘하고 있어! 👍",
  "아침에 하늘 한 번 올려다보기! 구름도 예뻐 ☁️",
  "오늘도 사랑 듬뿍 담아 출발! 💌",
  "아침에 나랑 약속! 무리하지 않기! 🤙",
  "아침에 손가락 하트! 사랑해! 🫶"
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


