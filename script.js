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

  // 결과 표시
  const wakeUpStr = `${hour1} : ${min1.toString().padStart(2,'0')}, ${hour2} : ${min2.toString().padStart(2,'0')}`;
  document.getElementById('wakeUpTime').innerText = `💖 일어날 시간:\n${hour1} : ${min1.toString().padStart(2,'0')}\n${hour2} : ${min2.toString().padStart(2,'0')} \n💤`;
});
