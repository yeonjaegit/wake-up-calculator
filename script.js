document.getElementById("calculateBtn").addEventListener("click", function() {
  const goTime = document.getElementById('goTime').value;

  if (!goTime) {
    alert("나가야 할 시간을 입력해주세요!");
    return;
  }

  let [hour, min] = goTime.split(':').map(Number);

  // 1시간 50분 빼기
  min -= 50;
  if (min < 0) {
    min += 60;
    hour -= 1;
  }
  hour -= 1;
  if (hour < 0) hour += 24;

  const wakeUpStr = `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
  document.getElementById('wakeUpTime').innerText = `일어날 시간: ${wakeUpStr}`;
});
