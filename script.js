// ========================================
// Face ID (WebAuthn)
// ========================================
const FACEID_KEY = 'faceIdCredentialId';
const RP_ID = location.hostname;

function hasFaceIdRegistered() {
    return !!localStorage.getItem(FACEID_KEY);
}

function isBiometricSupported() {
    return window.PublicKeyCredential !== undefined;
}

async function registerFaceId() {
    if (!window.PublicKeyCredential) {
        alert('이 브라우저는 Face ID를 지원하지 않아요.');
        return;
    }
    const user = (typeof auth !== 'undefined' && auth.currentUser) || currentUser;
    if (!user) {
        alert('로그인 정보를 찾을 수 없어요. 다시 로그인해 주세요.');
        return;
    }
    try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const userIdBytes = new TextEncoder().encode(user.uid);
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: '쓰연이 케어 센터' },
                user: {
                    id: userIdBytes,
                    name: user.email || '쓰연이',
                    displayName: user.displayName || '쓰연이'
                },
                pubKeyCredParams: [
                    { alg: -7, type: 'public-key' }
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'preferred'
                },
                timeout: 60000
            }
        });
        if (!credential) { alert('인증 객체를 받지 못했어요.'); return; }
        const rawIdArr = new Uint8Array(credential.rawId);
        const credId = btoa(rawIdArr.reduce((s, b) => s + String.fromCharCode(b), ''));
        localStorage.setItem(FACEID_KEY, credId);
        const promptModal = document.getElementById('faceIdPromptModal');
        if (promptModal) promptModal.style.display = 'none';
        const faceBtn = document.getElementById('faceIdRegisterBtn');
        if (faceBtn) { faceBtn.textContent = '✅ Face ID 등록됨'; faceBtn.disabled = true; }
        alert('Face ID 등록 완료! 다음부터 Face ID로 빠르게 접속할 수 있어요!');    } catch (e) {
        alert('Face ID 오류: ' + e.name + '\n' + e.message);
    }
}

async function authenticateWithFaceId() {
    const storedId = localStorage.getItem(FACEID_KEY);
    if (!storedId) return false;
    try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const credIdBytes = Uint8Array.from(atob(storedId), c => c.charCodeAt(0));
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge,
                rpId: RP_ID,
                allowCredentials: [{ id: credIdBytes, type: 'public-key', transports: ['internal'] }],
                userVerification: 'required',
                timeout: 60000
            }
        });
        if (assertion) {
            document.getElementById('faceIdLock').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
        }
    } catch (e) {
        if (e.name !== 'NotAllowedError') alert('Face ID 인증 실패: ' + e.message);
    }
}

function fallbackToGoogleLogin() {
    localStorage.removeItem(FACEID_KEY);
    document.getElementById('faceIdLock').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

function showFaceIdPrompt() {
    const modal = document.getElementById('faceIdPromptModal');
    modal.style.display = 'flex';
}

function closeFaceIdPrompt(doRegister) {
    const modal = document.getElementById('faceIdPromptModal');
    modal.style.display = 'none';
    if (doRegister) registerFaceId();
}

function checkFaceIdOnLoad() {
    if (hasFaceIdRegistered() && isBiometricSupported()) {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('faceIdLock').style.display = 'flex';
        auth.onAuthStateChanged(user => {
            if (user) authenticateWithFaceId();
        });
    }
}

// ========================================
// 0. Firebase 초기화
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyCZYRDqIbmHJjprrUOe8YHtO39lLTvaeAg",
    authDomain: "soyeon-present.firebaseapp.com",
    projectId: "soyeon-present",
    storageBucket: "soyeon-present.firebasestorage.app",
    messagingSenderId: "842008448776",
    appId: "1:842008448776:web:b5579525f8ebc93a28e6bd"
};
let ledgerCalendarDate = new Date();
let salaryCalendarDate = new Date();
let calendarMode = 'ledger';
function getActiveCalendarDate() { return calendarMode === 'salary' ? salaryCalendarDate : ledgerCalendarDate; }
function setActiveCalendarDate(d) { if (calendarMode === 'salary') { salaryCalendarDate = d; } else { ledgerCalendarDate = d; } }

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

checkFaceIdOnLoad();

// ========================================
// 1. 응원 문구 리스트 (기존 유지)
// ========================================
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

// 2. 루틴 메시지 리스트 (기존 유지)
const foodDb = [
    // --- [튀김 및 치킨류] ---
    { name: "치킨", status: "bad", msg: "튀긴 기름은 피부 염증에 정말 안 좋아 🍗" },
    { name: "후라이드치킨", status: "bad", msg: "기름기가 너무 많아서 참아야 해 🚫" },
    { name: "양념치킨", status: "bad", msg: "튀김+매운 설탕 양념은 최악이야 🌶️" },
    { name: "뿌링클", status: "bad", msg: "자극적인 시즈닝과 튀김은 피하자 🧀" },
    { name: "허니콤보", status: "bad", msg: "달고 짠 기름진 치킨은 안 돼 🍯" },
    { name: "고추바사삭", status: "bad", msg: "매운맛과 튀김옷 모두 자극적이야 🌶️" },
    { name: "간장치킨", status: "bad", msg: "나트륨과 기름기가 너무 많아 🙅‍♀️" },
    { name: "순살치킨", status: "bad", msg: "튀김 옷은 밀가루라 피해야 해 🍗" },
    { name: "닭강정", status: "bad", msg: "달고 맵고 튀긴 건 피부 독이야 ❌" },
    { name: "탕수육", status: "bad", msg: "돼지기름 튀김에 달달 소스는 위험! 🥟" },
    { name: "꿔바로우", status: "bad", msg: "전분 튀김옷도 밀가루만큼 안 좋아 ❌" },
    { name: "돈가스", status: "bad", msg: "빵가루 튀김은 피부에 독이야 🍱" },
    { name: "치즈돈가스", status: "bad", msg: "기름+유제품은 염증을 키워요 🧀" },
    { name: "돈카츠", status: "bad", msg: "튀긴 고기와 빵가루는 피하는 게 좋아 ❌" },
    { name: "멘보샤", status: "bad", msg: "기름 머금은 빵은 절대 안 돼 🚫" },
    { name: "오징어튀김", status: "bad", msg: "분식 튀김은 밀가루라 피하자 🚫" },
    { name: "새우튀김", status: "bad", msg: "기름진 튀김은 무조건 패스! 🍤" },
    { name: "고구마튀김", status: "bad", msg: "구워 먹는 건 좋지만 튀긴 건 안 돼 🍠" },
    { name: "김말이", status: "bad", msg: "기름을 가득 머금은 튀김이야 🚫" },
    { name: "텐동", status: "bad", msg: "튀김이 가득한 덮밥은 절대 금지! 🚫" },

    // --- [면 요리 (밀가루)] ---
    { name: "라면", status: "bad", msg: "인스턴트 밀가루는 피부 회복을 방해해 🍜" },
    { name: "신라면", status: "bad", msg: "매운 국물 라면은 절대 금지! 🚫" },
    { name: "진라면", status: "bad", msg: "인스턴트 밀가루 면은 피하자 🍜" },
    { name: "불닭볶음면", status: "bad", msg: "너무 맵고 자극적이라 피부가 울어 🥵" },
    { name: "짜장면", status: "bad", msg: "밀가루 면에 기름진 소스는 금지 🐼" },
    { name: "짬뽕", status: "bad", msg: "맵고 짜고 밀가루... 3박자 나쁜 음식 🌶️" },
    { name: "간짜장", status: "bad", msg: "볶은 기름이 많아서 피부에 안 좋아 🙅‍♀️" },
    { name: "우동", status: "bad", msg: "두꺼운 밀가루 면은 소화도 안 돼 🍥" },
    { name: "칼국수", status: "bad", msg: "밀가루 반죽 요리는 피해야 해 🍲" },
    { name: "수제비", status: "bad", msg: "쫀득해도 밀가루 덩어리라 참자 🍲" },
    { name: "비빔국수", status: "bad", msg: "매운 양념에 밀가루 소면은 안 돼 🌶️" },
    { name: "잔치국수", status: "bad", msg: "소면도 밀가루니까 밥을 먹자 🥢" },
    { name: "냉면", status: "bad", msg: "차갑고 질긴 면은 자극적이야 ❄️" },
    { name: "쫄면", status: "bad", msg: "매운 양념과 밀가루 면의 조합 🚫" },
    { name: "라멘", status: "bad", msg: "짠 국물과 밀가루 면, 기름기가 너무 많아 🍜" },

    // --- [면 요리 (건강한 대체)] ---
    { name: "쌀국수", status: "good", msg: "밀가루 대신 쌀면은 훨씬 안전해! 🍜" },
    { name: "베트남쌀국수", status: "good", msg: "맑은 국물에 쌀면은 아주 좋아 🌿" },
    { name: "메밀면", status: "good", msg: "순메밀 국수라면 밀가루보다 훨씬 좋아 ✨" },
    { name: "막국수", status: "check", msg: "메밀 함량이 높은 건 조금 괜찮아 🥢" },
    { name: "냉모밀", status: "good", msg: "메밀면은 밀가루보다 훨씬 착해 ✨" },
    { name: "두부면", status: "good", msg: "단백질 듬뿍! 밀가루 대체로 최고야 👍" },
    { name: "곤약면", status: "good", msg: "피부 자극 없는 아주 착한 면 😋" },
    { name: "천사채", status: "good", msg: "가볍고 건강하게 먹기 좋아 🤍" },

    // --- [떡볶이 및 분식] ---
    { name: "떡볶이", status: "bad", msg: "밀가루 떡과 매운 양념은 최악이야 🌶️" },
    { name: "엽떡", status: "bad", msg: "너무 맵고 자극적이라 피부가 울어 🥵" },
    { name: "신전떡볶이", status: "bad", msg: "후추 매운맛은 피부 자극이 심해 🌶️" },
    { name: "로제떡볶이", status: "bad", msg: "유제품+매운맛+밀가루... 종합 나쁜 선물 세트 ❌" },
    { name: "배떡", status: "bad", msg: "크림과 매운 소스는 피해야 해 ❌" },
    { name: "응급실떡볶이", status: "bad", msg: "이름만큼 피부에도 응급 상황! 🚫" },
    { name: "순대", status: "good", msg: "내장이나 고기 순대는 담백해 오케이! 🍢" },
    { name: "김밥", status: "good", msg: "야채 가득한 김밥은 훌륭한 한 끼 🍙" },
    { name: "참치김밥", status: "check", msg: "마요네즈는 적게 들어간 게 좋아 🐟" },

    // --- [고기 요리] ---
    { name: "삼겹살", status: "bad", msg: "돼지 기름이 너무 많아 염증에 안 좋아 🥓" },
    { name: "대패삼겹살", status: "bad", msg: "얇아도 기름이 너무 많아서 안 돼 🥓" },
    { name: "항정살", status: "bad", msg: "돼지 부위 중 기름기가 가장 많아 🙅‍♀️" },
    { name: "돼지갈비", status: "bad", msg: "달고 짠 양념은 피부에 무거워 🍖" },
    { name: "제육볶음", status: "bad", msg: "기름과 매운 양념 조합은 비추천 🌶️" },
    { name: "수육", status: "good", msg: "기름기 뺀 삶은 고기는 최고의 선택 👍" },
    { name: "보쌈", status: "good", msg: "살코기 위주로 쌈 싸먹으면 완벽해 🥗" },
    { name: "족발", status: "check", msg: "콜라겐은 좋지만 너무 기름진 부위는 조심 🐷" },
    { name: "불고기", status: "check", msg: "자극적이지 않게 볶으면 소량 가능 🍛" },
    { name: "샤브샤브", status: "good", msg: "데친 야채와 고기는 피부 보약! 🍲" },
    { name: "스테이크", status: "good", msg: "살코기 위주로 담백하게 구우면 좋아 🥩" },
    { name: "곱창", status: "bad", msg: "동물성 포화지방은 염증의 주범! 🙅‍♀️" },
    { name: "대창", status: "bad", msg: "기름기가 너무 과해서 절대 금지 😱" },
    { name: "막창", status: "bad", msg: "기름지고 자극적이라 안 좋아 🚫" },
    { name: "야채곱창", status: "bad", msg: "당면과 곱창 기름은 피부 회복을 방해해 🙅‍♀️" },
    { name: "닭갈비", status: "bad", msg: "기름에 볶고 매운 양념이라 자극이 심해! 🐔" },
    { name: "훈제오리", status: "check", msg: "기름을 쫙 빼서 먹으면 괜찮아 🦆" },
    { name: "지코바", status: "check", msg: "튀기지 않았지만 양념이 매우니 조심 🍗" },

    // --- [한식 국/찌개 및 반찬] ---
    { name: "백반", status: "good", msg: "나물과 밥 위주의 식사는 완벽해 🍚" },
    { name: "된장찌개", status: "good", msg: "구수하고 맑은 된장찌개는 좋아 ✨" },
    { name: "청국장", status: "good", msg: "발효 음식은 피부 면역에 최고 👍" },
    { name: "미역국", status: "good", msg: "피부 정화와 회복에 미역이 최고야 🥣" },
    { name: "콩나물국", status: "good", msg: "맑고 시원하게 먹으면 아주 좋아 🌱" },
    { name: "소고기무국", status: "good", msg: "담백해서 소화도 잘되고 착한 국 ✨" },
    { name: "비빔밥", status: "good", msg: "나물 가득! 고추장은 조금만 넣자 🥗" },
    { name: "두부", status: "good", msg: "보들보들 피부에도 보들보들 🤍" },
    { name: "계란찜", status: "good", msg: "부드럽고 자극 없어 최고야 👍" },
    { name: "나물무침", status: "good", msg: "각종 나물은 많이 먹어도 좋아 🌿" },
    { name: "생선구이", status: "good", msg: "담백하게 구운 생선은 추천! 🐟" },
    { name: "김치찌개", status: "check", msg: "너무 짜고 맵지 않게 조절해서 먹자 🥘" },
    { name: "부대찌개", status: "bad", msg: "햄, 소시지, 라면 사리... 피부 독이야 🚫" },
    { name: "순두부찌개", status: "check", msg: "하얗게 먹으면 좋지만 빨간 건 조심 🤍" },
    { name: "콩비지찌개", status: "good", msg: "고고하고 자극 없어 아주 좋아 ✨" },
    { name: "토마토달걀볶음", status: "good", msg: "피부에 좋은 토마토와 계란의 꿀조합! ✨" },

    // --- [해산물] ---
    { name: "회", status: "good", msg: "신선한 회는 단백질 보충에 좋아! ✨" },
    { name: "광어", status: "good", msg: "담백한 흰살 생선은 피부에 착해 🐟" },
    { name: "연어", status: "good", msg: "오메가3가 많아 피부 건강에 좋아 🧡" },
    { name: "초밥", status: "good", msg: "신선한 생선 초밥은 아주 좋은 선택! 🍣" },
    { name: "회덮밥", status: "good", msg: "야채가 많아서 피부가 좋아해! 초장은 적당히 🥗" },
    { name: "해물찜", status: "bad", msg: "빨간 양념 찜 요리는 당분간 금지 🚫" },
    { name: "아구찜", status: "bad", msg: "매운 양념과 전분은 피하자 🐡" },
    { name: "낙지볶음", status: "bad", msg: "너무 매운 건 피부 열감을 올려 🌶️" },
    { name: "간장게장", status: "bad", msg: "나트륨이 너무 많고 날것은 조심 🦀" },
    { name: "양념게장", status: "bad", msg: "맵고 짠 자극의 끝판왕 ❌" },

    // --- [전 / 부침개] ---
    { name: "김치전", status: "bad", msg: "밀가루와 기름이 많아서 지금은 안 돼! 😥" },
    { name: "해물파전", status: "bad", msg: "부침개는 기름기가 많아서 참아주자! 🚫" },
    { name: "감자전", status: "bad", msg: "기름에 부친 전 종류는 피하는 게 좋아! 🥔" },
    { name: "부추전", status: "bad", msg: "밀가루 반죽에 기름... 피부가 힘들어해 ❌" },
    { name: "애호박전", status: "bad", msg: "호박이라도 기름에 부치면 피해야 해 🙅‍♀️" },
    { name: "굴전", status: "bad", msg: "계란물과 기름기가 피부에 자극적이야 🦪" },
    { name: "동태전", status: "bad", msg: "명절 음식 같은 전 종류는 당분간 금지! 🚫" },
    { name: "육전", status: "bad", msg: "소고기라도 기름에 부친 건 지금은 안 돼 🥩" },
    { name: "녹두빈대떡", status: "bad", msg: "기름을 많이 먹는 빈대떡은 위험해 ❌" },
    { name: "배추전", status: "bad", msg: "담백해 보여도 기름진 반죽이 문제야 🥬" },

    // --- [마라탕 & 중식] ---
    { name: "마라탕", status: "bad", msg: "기름진 국물과 자극적인 향신료는 피부 독이야 🍲" },
    { name: "마라샹궈", status: "bad", msg: "볶은 기름과 강한 양념이 염증을 유발해 🥵" },
    { name: "분모자", status: "bad", msg: "전분 덩어리라 피부 회복에 좋지 않아 ❌" },
    { name: "중국당면", status: "bad", msg: "쫀득해도 결국 고탄수화물 전분이야 🙅‍♀️" },
    { name: "옥수수면", status: "check", msg: "밀가루보단 낫지만 국물이 자극적이면 안 돼 🌽" },
    { name: "푸주", status: "good", msg: "두부 단백질이라 건더기 위주로 먹으면 좋아 ✨" },
    { name: "건두부", status: "good", msg: "단백질 보충에 좋은 마라탕 토핑! 👍" },
    { name: "포두부", status: "good", msg: "마라탕 먹을 땐 야채와 두부 위주로! 🤍" },

    // --- [양식 & 이탈리안] ---
    { name: "파스타", status: "bad", msg: "밀가루 면은 피부 회복을 방해해 🍝" },
    { name: "알리오올리오", status: "check", msg: "오일 베이스지만 면이 밀가루라 조심 🍝" },
    { name: "토마토파스타", status: "check", msg: "소스는 괜찮지만 면 양을 조절해줘 🍅" },
    { name: "크림파스타", status: "bad", msg: "우유 생크림과 밀가루 면은 피부에 무거워 ❌" },
    { name: "로제파스타", status: "bad", msg: "크림이 들어간 소스는 당분간 피하자 🙅‍♀️" },
    { name: "피자", status: "bad", msg: "밀가루 도우와 치즈, 기름진 토핑은 안 돼 🍕" },
    { name: "햄버거", status: "bad", msg: "인스턴트 패스트푸드는 피하자 🍔" },
    { name: "서브웨이", status: "good", msg: "빵은 허니오트나 위트, 소스는 가볍게! 🥗" },

    // --- [디저트 및 음료] ---
    { name: "탕후루", status: "bad", msg: "과도한 설탕 코팅은 피부 염증 폭발의 원인 🍓" },
    { name: "요아정", status: "check", msg: "요거트 아이스크림은 좋지만 토핑 조심 🍦" },
    { name: "크로플", status: "bad", msg: "버터 가득 밀가루 반죽은 금지 🥐" },
    { name: "커피", status: "bad", msg: "카페인은 피부 자극을 줘 ☕" },
    { name: "아메리카노", status: "check", msg: "연하게 마시거나 가급적 물을 마시자 ☕" },
    { name: "술", status: "bad", msg: "알코올은 염증 수치를 폭발시켜! 절대 금지 🚫" },
    { name: "물", status: "good", msg: "피부 미인이 되는 가장 쉬운 방법 💧" },
    { name: "과일", status: "good", msg: "비타민 충전하고 피부 광 내자 🍎" }
];

// ========================================
// 기존 기능: 탭 전환 로직
// ========================================
function openTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (button) button.classList.add('active');

    if (tabId === 'ledgerTab') {
        setTimeout(() => renderCalendar(), 100);
    }
}

// 음식 검색 로직
document.getElementById('foodSearch').addEventListener('input', function (e) {
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
document.getElementById("calculateBtn").addEventListener("click", function () {
    const goTime = document.getElementById('goTime').value;
    if (!goTime) {
        alert("나가야 할 시간을 입력해주세요!");
        return;
    }
    let [hour, min] = goTime.split(':').map(Number);

    // 알람 1: 2시간 10분 전
    let hour1 = hour; let min1 = min - 130; // 2시간 10분 = 130분
    while (min1 < 0) { min1 += 60; hour1 -= 1; }
    while (hour1 < 0) hour1 += 24;

    // 알람 2: 40분 전
    let hour2 = hour; let min2 = min - 40;
    while (min2 < 0) { min2 += 60; hour2 -= 1; }
    while (hour2 < 0) hour2 += 24;

    const randomRoutine = routineList[Math.floor(Math.random() * routineList.length)];
    const randomCheer = cheerList[Math.floor(Math.random() * cheerList.length)];

    // 결과 텍스트 업데이트
    document.getElementById('wakeUpTime').innerText = `💕 알람 시간 💕\n${hour1}시 ${min1.toString().padStart(2, '0')}분\n${hour2}시 ${min2.toString().padStart(2, '0')}분`;

    // 루틴 메시지 처리 (안전한 방식)
    let routineElem = document.getElementById('morningRoutine');
    if (!routineElem) {
        routineElem = document.createElement('div');
        routineElem.id = 'morningRoutine';
        routineElem.style.marginTop = "10px";
        routineElem.style.color = "#ff7eae";
        // cheerMsg 위에 삽입
        const cheerMsgElem = document.getElementById('cheerMsg');
        cheerMsgElem.parentNode.insertBefore(routineElem, cheerMsgElem);
    }
    routineElem.innerText = `아침 미션 : ${randomRoutine}`;
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
                    const isRain = analyzeRain(tomorrowData.map(d => d.code));
                    let rainMsg = isRain ? "비 소식 있어요 우산 챙겨 !! ☔" : "비 소식 없음 !! ☀️";

                    infoElem.innerHTML = `<span style="font-size:0.85em; color:#ff7eae; font-weight:bold;">내일 날씨</span><br>` +
                        `<span style="color:#4a90e2; font-weight:bold;">${rainMsg}</span><br>` +
                        `<span style="font-size:0.9em; color:#ffb6c1;">(기온 ${dayTemp}°C)</span>`;
                }
            }).catch(() => { infoElem.innerText = '날씨 정보를 불러올 수 없어요.'; });
    }
    function error() { infoElem.innerText = '위치 권한을 허용해줘! 날씨 알려줄게!'; }
}
fetchWeather();

function formatDateForInput(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getCurrentPeriodRange() {
    const startDay = getActivePeriod().startDay;
    const startDate = new Date(getActiveCalendarDate().getFullYear(), getActiveCalendarDate().getMonth(), startDay);
    const endDate = new Date(getActiveCalendarDate().getFullYear(), getActiveCalendarDate().getMonth() + 1, startDay - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
}

function setDefaultAccountingPeriod() {
    const savedLedger = parseInt(localStorage.getItem('ledgerStartDay'), 10);
    const savedSalary = parseInt(localStorage.getItem('salaryStartDay'), 10);
    const lDay = (!isNaN(savedLedger) && savedLedger >= 1 && savedLedger <= 31) ? savedLedger : 25;
    const sDay = (!isNaN(savedSalary) && savedSalary >= 1 && savedSalary <= 31) ? savedSalary : 25;
    ledgerPeriod.startDay = lDay; ledgerPeriod.endDay = lDay === 1 ? 31 : lDay - 1;
    salaryPeriod.startDay = sDay; salaryPeriod.endDay = sDay === 1 ? 31 : sDay - 1;
    initCurrentPeriodDate();
}

function updatePeriodInfoDisplay() {
    const info = document.getElementById('periodInfo');
    const displayArea = document.querySelector('.period-display'); // 달력 상단 표시용

    const start = getActivePeriod().startDay;
    // 1일이면 말일(31 or 30), 그 외에는 (시작일 - 1)
    const end = start === 1 ? '말' : start - 1;

    const text = `${start}일 ~ ${end}일`;

    if (info) info.textContent = text;
    if (displayArea) displayArea.textContent = `기준: ${text}`;
}

function showPeriodModal() {
    const modal = document.getElementById('periodModal');
    if (!modal) return;
    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = calendarMode === 'salary' ? '월급 달력 기간 설정' : '가계부 기간 설정';
    modal.style.display = 'flex';
    const startInput = document.getElementById('configStartDay');
    const endInput = document.getElementById('configEndDay');
    if (startInput && endInput) {
        startInput.value = getActivePeriod().startDay;
        endInput.value = getActivePeriod().endDay;
    }
}

function closePeriodModal() {
    const modal = document.getElementById('periodModal');
    if (!modal) return;
    modal.style.display = 'none';
}

function savePeriodSetting() {
    const start = parseInt(document.getElementById('configStartDay').value, 10);
    if (isNaN(start) || start < 1 || start > 31) {
        alert("1에서 31 사이의 숫자를 입력해줘!");
        return;
    }

    getActivePeriod().startDay = start;
    getActivePeriod().endDay = start === 1 ? 31 : start - 1;
    const key = calendarMode === 'salary' ? 'salaryStartDay' : 'ledgerStartDay';
    localStorage.setItem(key, start);
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).collection('settings').doc('period')
            .set({ [key]: start }, { merge: true })
            .catch(e => console.warn('기간 저장 실패:', e));
    }

    const today = new Date();
    const ap = getActivePeriod();
    setActiveCalendarDate(today.getDate() >= ap.startDay
        ? new Date(today.getFullYear(), today.getMonth(), ap.startDay)
        : new Date(today.getFullYear(), today.getMonth() - 1, ap.startDay));
    closePeriodModal();
    renderCalendar();
}

// ========================================
// 가계부 기능 (Firebase 연동)
// ========================================

let currentUser = null;
let ledgerPeriod = { startDay: null, endDay: null };
let salaryPeriod = { startDay: null, endDay: null };
function getActivePeriod() { return calendarMode === 'salary' ? salaryPeriod : ledgerPeriod; }
let currentSelectedDate = null;
let currentSalaryDate = null;
let currentEditingExpenseId = null;

setDefaultAccountingPeriod();

// 인증 상태 모니터링
auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        db.collection('users').doc(user.uid).collection('settings').doc('period').get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const applyDay = (period, key) => {
                        const d = parseInt(data[key], 10);
                        if (!isNaN(d) && d >= 1 && d <= 31) {
                            period.startDay = d;
                            period.endDay = d === 1 ? 31 : d - 1;
                            localStorage.setItem(key, d);
                        }
                    };
                    applyDay(ledgerPeriod, 'ledgerStartDay');
                    applyDay(salaryPeriod, 'salaryStartDay');
                    initCurrentPeriodDate();
                }
                updateAuthUI();
            })
            .catch(() => updateAuthUI());
    } else {
        updateAuthUI();
    }
});

// UI 업데이트 함수
function updateAuthUI() {
    const authStatus = document.getElementById('authStatus');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const expenseForm = document.querySelector('.expense-form');

    if (currentUser) {
        authStatus.style.display = 'none';
        if (expenseForm) expenseForm.style.display = 'block';
        loadExpenses();
    } else {
        authStatus.style.display = 'flex';
        loginBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
        userInfo.style.display = 'none';
        if (expenseForm) expenseForm.style.display = 'none';
        document.getElementById('summary1Amount').textContent = '0';
        const pb = document.getElementById('summary2Breakdown'); if (pb) pb.innerHTML = '';
    }
}

function showDayModal(dateStr) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    currentSelectedDate = dateStr;
    currentEditingExpenseId = null;
    document.getElementById('selectedDayLabel').innerText = `${dateStr} 지출 내역`;
    document.getElementById('dayExpenseCategory').value = '';
    document.getElementById('dayExpenseAmount').value = '';
    document.getElementById('dayExpenseMemo').value = '';
    document.getElementById('dayExpensePayment').value = '';
    document.getElementById('saveExpenseBtn').textContent = '저장하기 !!';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('installmentRow').style.display = 'none';
    document.getElementById('dayExpenseInstallment').value = '1';
    loadDayExpenses(dateStr);
    document.getElementById('dayModal').style.display = 'flex';
}

async function loadDayExpenses(dateStr) {
    const listContainer = document.getElementById('dayExpenseList');
    if (!listContainer) return;
    listContainer.innerHTML = '<p>로딩 중...</p>';

    try {
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('expenses')
            .where('date', '==', dateStr)
            .get();

        if (snapshot.empty) {
            document.getElementById('dayExpenseTotal').textContent = '총 지출: 0';
            listContainer.innerHTML = '<p>이 날짜에 등록된 지출이 없습니다.</p>';
            return;
        }

        const dayExpenses = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            dayExpenses.push({ id: doc.id, ...data });
        });

        dayExpenses.sort((a, b) => new Date(b.timestamp?.toDate ? b.timestamp.toDate() : b.timestamp) - new Date(a.timestamp?.toDate ? a.timestamp.toDate() : a.timestamp));

        const totalForDay = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        document.getElementById('dayExpenseTotal').textContent = `총 지출: -${totalForDay.toLocaleString()}`;

        listContainer.innerHTML = dayExpenses.map(exp => `
            <div class="day-expense-item">
              <div class="expense-left">
                <div class="expense-category">${exp.category}${exp.payment ? ` <span class="expense-payment">${exp.payment}</span>` : ''}</div>
                ${exp.memo ? `<div class="expense-memo">${exp.memo}</div>` : ''}
              </div>
              <div class="day-expense-right">
                <div class="expense-amount">-${exp.amount.toLocaleString()}</div>
                <button onclick="startEditExpense('${exp.id}','${exp.category.replace(/'/g,"\\'")}',${
                  exp.amount},'${(exp.memo||'').replace(/'/g,"\\'")}','${(exp.payment||'').replace(/'/g,"\\'")}','${exp.date}')"
                  class="small-edit-btn"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button onclick="deleteExpense('${exp.id}')" class="small-delete-btn"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            </div>
        `).join('');
    } catch (error) {
        listContainer.innerHTML = `<p>불러오기 실패: ${error.message}</p>`;
    }
}

function closeDayModal() {
    document.getElementById('dayModal').style.display = 'none';
}

function addExpenseForSelectedDay() {
    if (!currentUser) { alert('로그인이 필요합니다.'); return; }

    const category = document.getElementById('dayExpenseCategory').value.trim();
    const amount = parseInt(document.getElementById('dayExpenseAmount').value, 10);
    const memo = document.getElementById('dayExpenseMemo').value.trim();
    const payment = document.getElementById('dayExpensePayment').value;

    if (!category || !amount || amount <= 0) {
        alert('카테고리와 금액을 모두 입력하세요.');
        return;
    }
    if (!payment) {
        alert('지출수단 선택해조 !!');
        return;
    }

    if (currentEditingExpenseId) {
        // 수정 모드
        const newDate = document.getElementById('editDateInput').value || currentSelectedDate;
        db.collection('users').doc(currentUser.uid).collection('expenses')
            .doc(currentEditingExpenseId)
            .set({ category, amount, memo, payment, date: newDate }, { merge: true })
            .then(() => {
                cancelEdit();
                loadDayExpenses(currentSelectedDate);
                loadExpenses();
            })
            .catch(e => alert(`수정 실패: ${e.message}`));
    } else {
        // 신규 추가 모드
        if (!currentSelectedDate) { alert('날짜를 선택해주세요.'); return; }
        const installment = parseInt(document.getElementById('dayExpenseInstallment')?.value || '1', 10);
        if (installment > 1) {
            const perMonth = Math.round(amount / installment);
            const [iy, im, id] = currentSelectedDate.split('-').map(Number);
            const installmentGroup = `${currentSelectedDate}-${category}-${installment}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
            const promises = [];
            for (let i = 0; i < installment; i++) {
                const d = new Date(iy, im - 1 + i, id);
                const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                promises.push(db.collection('users').doc(currentUser.uid).collection('expenses').add({
                    date: ds,
                    category: `${category} (${i+1}/${installment})`,
                    amount: perMonth,
                    memo, payment,
                    installmentGroup,
                    timestamp: new Date()
                }));
            }
            Promise.all(promises)
                .then(() => { cancelEdit(); loadDayExpenses(currentSelectedDate); loadExpenses(); })
                .catch(e => alert(`저장 실패: ${e.message}`));
        } else {
            db.collection('users').doc(currentUser.uid).collection('expenses').add({
                date: currentSelectedDate,
                category, amount, memo, payment,
                timestamp: new Date()
            })
            .then(() => { cancelEdit(); loadDayExpenses(currentSelectedDate); loadExpenses(); })
            .catch(e => alert(`저장 실패: ${e.message}`));
        }
    }
}

function startEditExpense(id, category, amount, memo, payment, date) {
    currentEditingExpenseId = id;
    document.getElementById('dayExpenseCategory').value = category;
    document.getElementById('dayExpenseAmount').value = amount;
    document.getElementById('dayExpenseMemo').value = memo;
    document.getElementById('dayExpensePayment').value = payment || '현금';
    document.getElementById('dayExpensePayment').options[0].style.display = 'none';
    document.getElementById('editDateInput').value = date || currentSelectedDate;
    document.getElementById('editDateRow').style.display = 'block';
    document.getElementById('saveExpenseBtn').textContent = '수정 후 저장 !!';
    document.getElementById('cancelEditBtn').style.display = 'block';
    document.getElementById('dayExpenseCategory').focus();
    document.getElementById('dayExpenseCategory').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelEdit() {
    currentEditingExpenseId = null;
    document.getElementById('dayExpenseCategory').value = '';
    document.getElementById('dayExpenseAmount').value = '';
    document.getElementById('dayExpenseMemo').value = '';
    document.getElementById('dayExpensePayment').value = '';
    document.getElementById('dayExpensePayment').options[0].style.display = '';
    document.getElementById('editDateInput').value = '';
    document.getElementById('editDateRow').style.display = 'none';
    document.getElementById('installmentRow').style.display = 'none';
    document.getElementById('dayExpenseInstallment').value = '1';
    document.getElementById('saveExpenseBtn').textContent = '저장';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function switchCalendarMode(mode) {
    calendarMode = mode;
    document.getElementById('modeLedgerBtn').classList.toggle('active', mode === 'ledger');
    document.getElementById('modeSalaryBtn').classList.toggle('active', mode === 'salary');
    document.getElementById('salaryTableBtn').style.display = mode === 'salary' ? 'block' : 'none';
    renderCalendar();
}

// 소수점 표기: 120000 → 12.2, 10500 → 10.5
function formatAmount(value) {
    const num = value || 0;
    return (num / 10000).toFixed(1).replace(/\.0$/, '');
}

function showSalaryTableModal() {
    const modal = document.getElementById('salaryTableModal');
    if (!modal) return;
    buildSalaryTableContent();
    modal.style.display = 'flex';
}

function closeSalaryTableModal() {
    const modal = document.getElementById('salaryTableModal');
    if (modal) modal.style.display = 'none';
}

async function buildSalaryTableContent() {
    if (!currentUser) return;
    const container = document.getElementById('salaryTableContent');
    if (!container) return;

    try {
        // 기간 설정 (renderCalendar와 동일한 로직)
        const startDay = getActivePeriod().startDay;
        const periodStart = new Date(getActiveCalendarDate().getFullYear(), getActiveCalendarDate().getMonth(), startDay);
        const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, startDay - 1);

        const snapshot = await db.collection('users').doc(currentUser.uid).collection('salaryEntries').get();
        const entries = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const [exY, exM, exD] = data.date.split('-').map(Number);
            const expDate = new Date(exY, exM - 1, exD);
            // 기간 내의 데이터만 수집
            if (expDate >= periodStart && expDate <= periodEnd) {
                entries.push({ id: doc.id, ...data });
            }
        });
        entries.sort((a, b) => {
            const [aY, aM, aD] = a.date.split('-').map(Number);
            const [bY, bM, bD] = b.date.split('-').map(Number);
            return new Date(aY, aM - 1, aD) - new Date(bY, bM - 1, bD);
        });

        // 기간 텍스트
        const psM = periodStart.getMonth() + 1;
        const psD = periodStart.getDate();
        const peM = periodEnd.getMonth() + 1;
        const peD = periodEnd.getDate();
        const periodText = periodStart.getFullYear() === periodEnd.getFullYear()
            ? `${periodStart.getFullYear()}년 ${psM}월 ${psD}일 ~ ${peM}월 ${peD}일`
            : `${periodStart.getFullYear()}년 ${psM}월 ${psD}일 ~ ${periodEnd.getFullYear()}년 ${peM}월 ${peD}일`;

        // 날짜별로 그룹화
        const byDate = {};
        entries.forEach(e => {
            if (!byDate[e.date]) byDate[e.date] = [];
            byDate[e.date].push(e);
        });

        // 테이블 생성
        let tableHTML = `
            <div style="font-size: 10px; color: #7c5cbf; margin-bottom: 12px; text-align: center; font-weight: 600;">${periodText}</div>
            <table class="salary-table">
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>M만</th>
                        <th>H만</th>
                        <th>H만 진행</th>
                        <th>헤어메이크업 (M만)</th>
                        <th>헤어메이크업</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalCard = 0, totalCash = 0, totalRaw = 0, totalGross = 0;
        let totalCatAmounts = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };
        let totalCatGross = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };
        let totalCatCard = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };
        let totalCatCash = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };

        Object.keys(byDate).sort().forEach(dateStr => {
            const dayEntries = byDate[dateStr];
            let dayCard = 0, dayCash = 0, dayRaw = 0, dayGross = 0;
            let catsAmount = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };
            let dayCardByCat = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };
            let dayCashByCat = { 'M만': 0, 'H만': 0, 'H만 진행': 0, '헤어메이크업': 0, '헤어메이크업 (M만)': 0 };

            dayEntries.forEach(e => {
                const cat = e.category || '기타';
                const raw = e.totalAmount || 0;
                const gross = salaryGrossAmt(cat, raw);
                const card = e.cardAmount || 0;
                const cash = e.cashAmount || 0;

                dayRaw += raw;
                dayGross += gross;
                dayCard += card;
                dayCash += cash;

                if (catsAmount.hasOwnProperty(cat)) {
                    catsAmount[cat] += raw;
                    totalCatAmounts[cat] += raw;
                    totalCatGross[cat] += gross;
                    totalCatCard[cat] += card;
                    totalCatCash[cat] += cash;
                    dayCardByCat[cat] += card;
                    dayCashByCat[cat] += cash;
                }
            });

            totalRaw += dayRaw;
            totalGross += dayGross;
            totalCard += dayCard;
            totalCash += dayCash;

            const dayDateFormatted = dateStr.split('-').slice(1).join('/');
            const formatPayment = (card, cash) => {
                const cardStr = card > 0 ? `카:${formatAmount(card)}` : '';
                const cashStr = cash > 0 ? `현:${formatAmount(cash)}` : '';
                const both = [cardStr, cashStr].filter(s => s).join(' ');
                return both ? `<span style="color:#5a3fa0;">${both}</span>` : '-';
            };
            tableHTML += `<tr>
                <td>${dayDateFormatted}</td>
                <td>${catsAmount['M만'] > 0 ? formatPayment(dayCardByCat['M만'], dayCashByCat['M만']) : '-'}</td>
                <td>${catsAmount['H만'] > 0 ? formatPayment(dayCardByCat['H만'], dayCashByCat['H만']) : '-'}</td>
                <td>${catsAmount['H만 진행'] > 0 ? formatPayment(dayCardByCat['H만 진행'], dayCashByCat['H만 진행']) : '-'}</td>
                <td>${catsAmount['헤어메이크업 (M만)'] > 0 ? formatPayment(dayCardByCat['헤어메이크업 (M만)'], dayCashByCat['헤어메이크업 (M만)']) : '-'}</td>
                <td>${catsAmount['헤어메이크업'] > 0 ? formatPayment(dayCardByCat['헤어메이크업'], dayCashByCat['헤어메이크업']) : '-'}</td>
            </tr>`;
        });

        tableHTML += `<tr class="total-row">
            <td>카드</td>
            <td>${totalCatCard['M만'] > 0 ? formatAmount(totalCatCard['M만']) : '-'}</td>
            <td>${totalCatCard['H만'] > 0 ? formatAmount(totalCatCard['H만']) : '-'}</td>
            <td>${totalCatCard['H만 진행'] > 0 ? formatAmount(totalCatCard['H만 진행']) + '(' + formatAmount(Math.round(totalCatCard['H만 진행'] * 0.4)) + ')' : '-'}</td>
            <td>${totalCatCard['헤어메이크업 (M만)'] > 0 ? formatAmount(totalCatCard['헤어메이크업 (M만)']) + '(' + formatAmount(Math.round(totalCatCard['헤어메이크업 (M만)'] * 0.6)) + ')' : '-'}</td>
            <td>${totalCatCard['헤어메이크업'] > 0 ? formatAmount(totalCatCard['헤어메이크업']) : '-'}</td>
        </tr>
        <tr class="total-row">
            <td>현금</td>
            <td>${totalCatCash['M만'] > 0 ? formatAmount(totalCatCash['M만']) : '-'}</td>
            <td>${totalCatCash['H만'] > 0 ? formatAmount(totalCatCash['H만']) : '-'}</td>
            <td>${totalCatCash['H만 진행'] > 0 ? formatAmount(totalCatCash['H만 진행']) + '(' + formatAmount(Math.round(totalCatCash['H만 진행'] * 0.4)) + ')' : '-'}</td>
            <td>${totalCatCash['헤어메이크업 (M만)'] > 0 ? formatAmount(totalCatCash['헤어메이크업 (M만)']) + '(' + formatAmount(Math.round(totalCatCash['헤어메이크업 (M만)'] * 0.6)) + ')' : '-'}</td>
            <td>${totalCatCash['헤어메이크업'] > 0 ? formatAmount(totalCatCash['헤어메이크업']) : '-'}</td>
        </tr>
        <tr class="total-row">
            <td>합계</td>
            <td></td>
            <td></td>
            <td></td>
            <td>카드: ${formatAmount(totalCatCard['M만'] + totalCatCard['H만'] + totalCatCard['H만 진행'] + totalCatCard['헤어메이크업 (M만)'])}(${formatAmount(Math.round(totalCatCard['M만'] + totalCatCard['H만'] + totalCatCard['H만 진행'] * 0.4 + totalCatCard['헤어메이크업 (M만)'] * 0.6))})<br/>현금: ${formatAmount(totalCatCash['M만'] + totalCatCash['H만'] + totalCatCash['H만 진행'] + totalCatCash['헤어메이크업 (M만)'])}(${formatAmount(Math.round(totalCatCash['M만'] + totalCatCash['H만'] + totalCatCash['H만 진행'] * 0.4 + totalCatCash['헤어메이크업 (M만)'] * 0.6))})</td>
            <td></td>
        </tr></tbody></table>`;

        container.innerHTML = tableHTML;
    } catch (e) {
        container.innerHTML = `<p style="color: #a090c8; text-align: center;">데이터를 불러오지 못했습니다.</p>`;
    }
}

// ========================================
// 월급 달력 기능
// ========================================
function salaryGrossAmt(category, amount) {
    if (category === 'H만 진행') return Math.round(amount * 0.4);
    if (category === '헤어메이크업 (M만)') return Math.round(amount * 0.6);
    return amount;
}

function calcSalaryNet(category, paymentType, totalAmount, cashAmt) {
    // 중간 시술자 분배비율
    let splitRatio;
    if (category === 'H만 진행') splitRatio = 0.4;
    else if (category === '헤어메이크업 (M만)') splitRatio = 0.6;
    else splitRatio = 1.0;

    // 샵 공식: (총액 × 10/11 - 카드금액 × 0.03) × 0.4 × 0.967
    // VAT: 부가세 포함가 역산 (÷11), 카드수수료: 총액 기준 차감, 소득세3%+지방세0.3%=3.3%
    const SHOP = 0.4;
    const TAX = 0.967;
    function cNet(amt) { return amt * (10 / 11) * SHOP * TAX; }           // 현금
    function kNet(amt) { return amt * (10 / 11 - 0.03) * SHOP * TAX; }    // 카드

    if (paymentType === '현금') {
        return Math.round(cNet(totalAmount * splitRatio));
    } else if (paymentType === '카드') {
        return Math.round(kNet(totalAmount * splitRatio));
    } else {
        // 분할: 현금부분만 입력받고, 카드 = 총액 - 현금
        const cash = cashAmt || 0;
        const card = totalAmount - cash;
        return Math.round(cNet(cash * splitRatio) + kNet(card * splitRatio));
    }
}

function toggleSalaryPayment(type) {
    const row = document.getElementById('salarySplitRow');
    row.style.display = type === '분할' ? 'block' : 'none';
    if (type !== '분할') {
        document.getElementById('salaryCashAmt').value = '';
    }
}

function showSalaryDayModal(dateStr) {
    if (!currentUser) { showLoginModal(); return; }
    currentSalaryDate = dateStr;
    document.getElementById('salaryDayLabel').textContent = `${dateStr} 매출 내역`;
    cancelSalaryEdit();
    loadSalaryDayEntries(dateStr);
    document.getElementById('salaryDayModal').style.display = 'flex';
}

function closeSalaryModal() {
    document.getElementById('salaryDayModal').style.display = 'none';
}

async function loadSalaryDayEntries(dateStr) {
    const listContainer = document.getElementById('salaryDayList');
    if (!listContainer) return;
    listContainer.innerHTML = '<p>로딩 중...</p>';
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('salaryEntries')
            .where('date', '==', dateStr).get();
        if (snapshot.empty) {
            document.getElementById('salaryDayGross').textContent = '총 매출: 0원';
            listContainer.innerHTML = '<p>이 날짜에 등록된 내역이 없어요.</p>';
            return;
        }
        const entries = [];
        snapshot.forEach(doc => entries.push({ id: doc.id, ...doc.data() }));
        entries.sort((a, b) => new Date(b.timestamp?.toDate?.() || b.timestamp) - new Date(a.timestamp?.toDate?.() || a.timestamp));
        const grossTotal = entries.reduce((s, e) => s + (e.totalAmount || 0), 0);
        document.getElementById('salaryDayGross').textContent = `총 매출: ${grossTotal.toLocaleString()}원`;
        listContainer.innerHTML = entries.map(e => {
            const cardAmt = (e.totalAmount || 0) - (e.cashAmount || 0);
            const payBadge = e.paymentType === '분할'
                ? `<span class="expense-payment">분할</span><div class="expense-split-detail">현금 ${(e.cashAmount||0).toLocaleString()}원 + 카드 ${cardAmt.toLocaleString()}원</div>`
                : `<span class="expense-payment">${e.paymentType}</span>`;
            return `
            <div class="day-expense-item">
              <div class="expense-left">
                <div class="expense-category">${e.category}${e.paymentType !== '분할' ? ` <span class="expense-payment">${e.paymentType}</span>` : ''}</div>
                ${e.paymentType === '분할' ? `<div class="expense-split-detail">현금 ${(e.cashAmount||0).toLocaleString()}원 + 카드 ${cardAmt.toLocaleString()}원</div>` : ''}
              </div>
              <div class="day-expense-right">
                <div class="expense-amount">${e.totalAmount.toLocaleString()}</div>
                <button onclick="startEditSalaryEntry('${e.id}', '${e.category.replace(/'/g, "\\'")}'  , ${e.cashAmount||0}, ${e.cardAmount||0})" class="small-edit-btn"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button onclick="deleteSalaryEntry('${e.id}')" class="small-delete-btn"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            </div>`;
        }).join('');
    } catch (err) {
        listContainer.innerHTML = `<p>불러오기 실패: ${err.message}</p>`;
    }
}

function addSalaryEntry() {
    if (!currentUser) { alert('로그인이 필요합니다.'); return; }
    const category = document.getElementById('salaryCategory').value;
    const cashAmt = parseInt(document.getElementById('salaryAmount').value, 10) || 0;
    const cardAmt = parseInt(document.getElementById('salaryCardAmt').value, 10) || 0;
    if (!category) { alert('시술을 선택해주세요.'); return; }
    if (cashAmt <= 0 && cardAmt <= 0) { alert('현금 또는 카드 금액을 입력해주세요.'); return; }
    const totalAmount = cashAmt + cardAmt;
    const paymentType = cashAmt > 0 && cardAmt > 0 ? '분할' : cashAmt > 0 ? '현금' : '카드';
    const netAmount = calcSalaryNet(category, paymentType, totalAmount, cashAmt);

    const editingId = document.getElementById('saveSalaryBtn').dataset.editId || null;
    const ref = db.collection('users').doc(currentUser.uid).collection('salaryEntries');
    const op = editingId
        ? ref.doc(editingId).set({ category, totalAmount, paymentType, cashAmount: cashAmt, cardAmount: cardAmt, netAmount }, { merge: true })
        : ref.add({ date: currentSalaryDate, category, totalAmount, paymentType, cashAmount: cashAmt, cardAmount: cardAmt, netAmount, timestamp: new Date() });
    op.then(() => {
        cancelSalaryEdit();
        loadSalaryDayEntries(currentSalaryDate);
        renderCalendar();
    }).catch(e => alert(`저장 실패: ${e.message}`));
}

function deleteSalaryEntry(id) {
    if (!currentUser) return;
    if (!confirm('정말 삭제할거야??!!')) return;
    db.collection('users').doc(currentUser.uid).collection('salaryEntries').doc(id).delete()
        .then(() => { loadSalaryDayEntries(currentSalaryDate); renderCalendar(); })
        .catch(e => alert(`삭제 실패: ${e.message}`));
}

function startEditSalaryEntry(id, category, cashAmount, cardAmount) {
    document.getElementById('salaryCategory').value = category;
    document.getElementById('salaryAmount').value = cashAmount || 0;
    document.getElementById('salaryCardAmt').value = cardAmount || 0;
    const btn = document.getElementById('saveSalaryBtn');
    btn.dataset.editId = id;
    btn.textContent = '수정 후 저장 !!';
    document.getElementById('cancelSalaryEditBtn').style.display = '';
    document.getElementById('salaryEditRow').style.display = '';
    document.getElementById('salaryCategory').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelSalaryEdit() {
    document.getElementById('salaryCategory').value = '';
    document.getElementById('salaryAmount').value = '';
    document.getElementById('salaryCardAmt').value = '';
    const btn = document.getElementById('saveSalaryBtn');
    btn.dataset.editId = '';
    btn.textContent = '저장하기 !!';
    document.getElementById('cancelSalaryEditBtn').style.display = 'none';
    document.getElementById('salaryEditRow').style.display = 'none';
}

function toggleInstallmentRow(paymentValue) {
    const row = document.getElementById('installmentRow');
    if (!row) return;
    row.style.display = paymentValue === '신용카드' ? 'block' : 'none';
    if (paymentValue !== '신용카드') {
        document.getElementById('dayExpenseInstallment').value = '1';
    }
}

function autoFillEndDay(startVal) {
    const start = parseInt(startVal, 10);
    if (!isNaN(start) && start >= 1 && start <= 31) {
        document.getElementById('configEndDay').value = start === 1 ? 31 : start - 1;
    }
}

function calcSalary() {
    const base  = parseInt(document.getElementById('salaryBase').value)  || 0;
    const meal  = parseInt(document.getElementById('salaryMeal').value)  || 0;
    const extra = parseInt(document.getElementById('salaryExtra').value) || 0;
    if (base <= 0) { alert('기본급을 입력해줘!'); return; }
    const total = base + meal + extra;
    const mealExempt = Math.min(meal, 200000);
    const taxable = total - mealExempt;
    const pension  = Math.round(taxable * 0.045);
    const health   = Math.round(taxable * 0.03545);
    const longterm = Math.round(health * 0.1295);
    const employ   = Math.round(taxable * 0.009);
    let incomeTax = 0;
    if (taxable > 1060000) {
        if      (taxable <= 1500000) incomeTax = Math.round((taxable - 1060000) * 0.06);
        else if (taxable <= 3000000) incomeTax = Math.round(26400 + (taxable - 1500000) * 0.15);
        else if (taxable <= 4500000) incomeTax = Math.round(251400 + (taxable - 3000000) * 0.24);
        else                          incomeTax = Math.round(611400 + (taxable - 4500000) * 0.35);
    }
    const localTax = Math.round(incomeTax * 0.1);
    const totalDeduct = pension + health + longterm + employ + incomeTax + localTax;
    const net = total - totalDeduct;
    document.getElementById('salaryGross').textContent = total.toLocaleString() + '원';
    document.getElementById('salaryNet').textContent   = net.toLocaleString() + '원';
    document.getElementById('salaryDeductBreakdown').innerHTML = [
        ['국민연금 (4.5%)',    pension],
        ['건강보험 (3.545%)', health],
        ['장기요양보험',       longterm],
        ['고용보험 (0.9%)',   employ],
        ['소득세',             incomeTax],
        ['지방소득세',         localTax],
        ['── 총 공제',        totalDeduct],
    ].map(([name, amt]) => `
        <div class="category-row">
            <span class="category-row-name">${name}</span>
            <span class="category-row-amount">-${amt.toLocaleString()}</span>
        </div>`).join('');
    document.getElementById('salaryResult').style.display = 'block';
}

// 로그인 모달
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.style.display = 'none';
}

// Google 로그인
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            closeLoginModal();
        })
        .catch(error => {
            closeLoginModal();
            alert(`로그인 실패: ${error.message}`);
        });
}

// 이메일 로그인
function loginWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('이메일과 비밀번호를 입력하세요.');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeLoginModal();
            alert('로그인 성공!');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        })
        .catch(error => {
            alert(`로그인 실패: ${error.message}`);
        });
}

// 회원가입
function signupWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('이메일과 비밀번호를 입력하세요.');
        return;
    }

    if (password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('회원가입 성공! 로그인되었습니다.');
            closeLoginModal();
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        })
        .catch(error => {
            alert(`회원가입 실패: ${error.message}`);
        });
}

// 로그아웃
function logout() {
    auth.signOut()
        .then(() => {
            alert('로그아웃되었습니다.');
        })
        .catch(error => {
            alert(`로그아웃 실패: ${error.message}`);
        });
}

// 회계 기간 설정
function updatePeriod() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('시작일과 종료일을 모두 입력하세요.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('시작일은 종료일보다 빠른 날짜여야 합니다.');
        return;
    }

    accountingPeriod.start = startDate;
    accountingPeriod.end = endDate;
    alert(`회계 기간이 설정되었습니다: ${startDate} ~ ${endDate}`);
    loadExpenses();
}

// 지출 삭제
function deleteExpense(expenseId) {
    if (!currentUser) return;

    // ✅ 삭제 전 확인 alert
    const isConfirmed = confirm("정말 삭제할거야??!!");

    if (!isConfirmed) return; // 취소 누르면 종료

    const expensesRef = db.collection('users').doc(currentUser.uid).collection('expenses');
    const expenseDoc = expensesRef.doc(expenseId);

    expenseDoc.get()
        .then(doc => {
            if (!doc.exists) throw new Error('삭제할 지출을 찾을 수 없습니다.');
            const data = doc.data();
            if (data?.installmentGroup) {
                return expensesRef.where('installmentGroup', '==', data.installmentGroup).get()
                    .then(snapshot => Promise.all(snapshot.docs.map(d => d.ref.delete())));
            }

            const match = typeof data?.category === 'string' && data.category.match(/^(.+?) \((\d+)\/(\d+)\)$/);
            if (match) {
                const baseCategory = match[1];
                const totalParts = match[3];
                return expensesRef.get().then(snapshot => {
                    const toDelete = snapshot.docs.filter(d => {
                        const cat = d.data().category;
                        return typeof cat === 'string'
                            && cat.startsWith(`${baseCategory} (`)
                            && cat.endsWith(`/${totalParts})`);
                    });
                    return Promise.all(toDelete.map(d => d.ref.delete()));
                });
            }

            return expenseDoc.delete();
        })
        .then(() => {
            loadDayExpenses(currentSelectedDate);
            loadExpenses();
        })
        .catch(error => {
            alert(`삭제 실패ㅠ.ㅠ: ${error.message}`);
        });
}

// 지출 목록 로드
async function loadExpenses() {
    if (!currentUser) return;
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('expenses').get();
        let totalForPeriod = 0; // 현재 주기의 총 합계
        const { startDate, endDate } = getCurrentPeriodRange();

        snapshot.forEach(doc => {
            const data = doc.data();
            const [y, m, d] = data.date.split('-').map(Number);
            const expDate = new Date(y, m - 1, d);

            // [핵심] 총 지출 집계만 기간 내(3/25 ~ 4/24) 데이터로 제한
            if (expDate >= startDate && expDate <= endDate) {
                totalForPeriod += data.amount;
            }
        });

        // 화면 상단 '총 지출' 텍스트 업데이트
        document.getElementById('summary1Amount').textContent = `-${totalForPeriod.toLocaleString()}`;

        // 달력은 모든 데이터를 다 그리도록 호출
        renderCalendar();
    } catch (e) { console.error(e); }
}

// 회계 기간으로 필터링
function filterByPeriod(expenses) {
    const { startDate, endDate } = getCurrentPeriodRange();
    return expenses.filter(exp => {
        const [year, month, day] = exp.date.split('-').map(Number);
        const expDate = new Date(year, month - 1, day);
        return expDate >= startDate && expDate <= endDate;
    });
}

// 금액을 달력 셀에 맞게 압축 포맷 (만 단위)
// 각 모드별 기간 시작일로 날짜 초기화
function initCurrentPeriodDate() {
    const today = new Date();
    [['ledger', ledgerPeriod], ['salary', salaryPeriod]].forEach(([mode, p]) => {
        const startDay = p.startDay;
        const d = today.getDate() >= startDay
            ? new Date(today.getFullYear(), today.getMonth(), startDay)
            : new Date(today.getFullYear(), today.getMonth() - 1, startDay);
        if (mode === 'salary') { salaryCalendarDate = d; } else { ledgerCalendarDate = d; }
    });
}

// 기간 이동 함수 (< > 버튼)
function changePeriod(offset) {
    setActiveCalendarDate(new Date(
        getActiveCalendarDate().getFullYear(),
        getActiveCalendarDate().getMonth() + offset,
        getActivePeriod().startDay
    ));
    renderCalendar();
}

// 달력 렌더링
async function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;

    const startDay = getActivePeriod().startDay;
    const periodStart = new Date(getActiveCalendarDate().getFullYear(), getActiveCalendarDate().getMonth(), startDay);
    const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, startDay - 1);

    // 헤더 기간 텍스트
    const psM = periodStart.getMonth() + 1;
    const psD = periodStart.getDate();
    const peM = periodEnd.getMonth() + 1;
    const peD = periodEnd.getDate();
    const headerText = periodStart.getFullYear() === periodEnd.getFullYear()
        ? `${periodStart.getFullYear()}년 ${psM}월 ${psD}일 ~ ${peM}월 ${peD}일`
        : `${periodStart.getFullYear()}년 ${psM}월 ${psD}일 ~ ${periodEnd.getFullYear()}년 ${peM}월 ${peD}일`;

    let amountsByDate = {};
    let periodTotal = 0;
    let categoryTotals = {};
    let paymentTotals = {};
    let netByPayment = {};

    if (currentUser) {
        const collName = calendarMode === 'salary' ? 'salaryEntries' : 'expenses';
        const snapshot = await db.collection('users').doc(currentUser.uid).collection(collName).get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const [exY, exM, exD] = data.date.split('-').map(Number);
            const expDate = new Date(exY, exM - 1, exD);
            const val = calendarMode === 'salary' ? (data.netAmount || 0) : (data.amount || 0);
            const cellVal = calendarMode === 'salary' ? salaryGrossAmt(data.category, data.totalAmount || 0) : (data.amount || 0);
            if (!amountsByDate[data.date]) amountsByDate[data.date] = 0;
            amountsByDate[data.date] += cellVal;
            if (expDate >= periodStart && expDate <= periodEnd) {
                periodTotal += val;
                const cat = data.category || '기타';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
                const pay = (calendarMode === 'salary' ? data.paymentType : data.payment) || '기타';
                const grossAmt = calendarMode === 'salary' ? salaryGrossAmt(data.category, data.totalAmount || 0) : val;
                const payAmt = grossAmt;
                if (calendarMode === 'salary' && pay === '분할') {
                    const rawTotal = data.totalAmount || 0;
                    const rawCash = data.cashAmount || 0;
                    const cashFrac = rawTotal > 0 ? rawCash / rawTotal : 0;
                    const cash = Math.round(grossAmt * cashFrac);
                    const card = grossAmt - cash;
                    paymentTotals['현금'] = (paymentTotals['현금'] || 0) + cash;
                    paymentTotals['카드'] = (paymentTotals['카드'] || 0) + card;
                    const total = rawTotal;
                    netByPayment['현금'] = (netByPayment['현금'] || 0) + Math.round(val * cashFrac);
                    netByPayment['카드'] = (netByPayment['카드'] || 0) + Math.round(val * (1 - cashFrac));
                } else {
                    paymentTotals[pay] = (paymentTotals[pay] || 0) + payAmt;
                    if (calendarMode === 'salary') {
                        const payKey = (pay === '현금') ? '현금' : '카드';
                        netByPayment[payKey] = (netByPayment[payKey] || 0) + val;
                    }
                }
            }
        });
    }

    const s1Label  = document.getElementById('summary1Label');
    const s1Amount = document.getElementById('summary1Amount');
    const s1Break  = document.getElementById('summary1Breakdown');
    const s2Label  = document.getElementById('summary2Label');
    const s2Amount = document.getElementById('summary2Amount');
    const s2Break  = document.getElementById('summary2Breakdown');
    const s3Box    = document.getElementById('summary3Box');
    const s3Break  = document.getElementById('summary3Breakdown');

    const grossTotal = Object.values(paymentTotals).reduce((s, v) => s + v, 0);

    // 헬퍼 함수
    function makeCatHTML(totals, sign) {
        if (Object.keys(totals).length === 0) return '';
        return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
            `<div class="category-row"><span class="category-row-name">${k}</span><span class="category-row-amount">${sign}${v.toLocaleString()}</span></div>`
        ).join('');
    }
    function makePayHTML(totals, sign) {
        if (Object.keys(totals).length === 0) return '';
        const order = ['현금', '체크카드', '신용카드', '카드', '기타'];
        return Object.entries(totals).sort((a, b) => {
            return (order.indexOf(a[0]) + 1 || 99) - (order.indexOf(b[0]) + 1 || 99);
        }).map(([k, v]) =>
            `<div class="category-row payment-row"><span class="category-row-name">${k}</span><span class="category-row-amount">${sign}${v.toLocaleString()}</span></div>`
        ).join('');
    }

    if (calendarMode === 'salary') {
        // Box1 = 총 매출 (grossTotal + 결제수단 breakdown)
        if (s1Label)  s1Label.textContent  = '총 매출';
        if (s1Amount) { s1Amount.textContent = (grossTotal > 0 ? `+${grossTotal.toLocaleString()}` : '0') + ' / 13,900,000' + (grossTotal >= 13900000 ? ' 달성 !!' : ''); s1Amount.style.display = ''; }
        if (s1Break)  s1Break.innerHTML = makePayHTML(paymentTotals, '+');
        // Box2 = 총 실수령액 (netTotal + 카테고리 breakdown)
        if (s2Label)  s2Label.textContent  = '총 실수령액';
        if (s2Amount) { s2Amount.textContent = (periodTotal > 0 ? `+${periodTotal.toLocaleString()}` : '0') + ' / 5,000,000' + (periodTotal >= 5000000 ? ' 달성 !!' : ''); s2Amount.style.display = ''; }
        if (s2Break)  s2Break.innerHTML = makeCatHTML(categoryTotals, '+');
        // Box3 = 결제수단별 실수령액
        if (s3Box) s3Box.style.display = '';
        if (s3Break) s3Break.innerHTML = makePayHTML(netByPayment, '+');
    } else {
        if (s3Box) s3Box.style.display = 'none';
        // Box1 = 총 지출액 (expenses + 카테고리 breakdown)
        if (s1Label)  s1Label.textContent  = '총 지출액';
        if (s1Amount) { s1Amount.textContent = periodTotal > 0 ? `-${periodTotal.toLocaleString()}` : '0'; s1Amount.style.display = ''; }
        if (s1Break)  s1Break.innerHTML = makeCatHTML(categoryTotals, '-');
        // Box2 = 지출수단별 지출액
        if (s2Label)  s2Label.textContent  = '지출수단별 지출액';
        if (s2Amount) s2Amount.style.display = 'none';
        if (s2Break)  s2Break.innerHTML = makePayHTML(paymentTotals, '-');
    }

    const startDayOfWeek = periodStart.getDay();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    let calendarHTML = `
        <div class="calendar">
            <div class="calendar-header-top">
                <div class="header-period-nav">
                    <button class="month-btn" onclick="changePeriod(-1)">‹</button>
                    <span class="period-title">${headerText}</span>
                    <button class="month-btn" onclick="changePeriod(1)">›</button>
                </div>
                <button class="calendar-settings-btn" onclick="showPeriodModal()"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
            </div>
            <div class="calendar-grid-header">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div class="calendar-body">`;

    for (let i = 0; i < startDayOfWeek; i++) calendarHTML += '<div class="calendar-empty"></div>';

    let d = new Date(periodStart);
    while (d <= periodEnd) {
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const amount = amountsByDate[dateStr] || 0;
        const dayOfWeek = d.getDay();
        const weekClass = dayOfWeek === 0 ? 'sunday' : dayOfWeek === 6 ? 'saturday' : '';
        const isToday = dateStr === todayStr ? 'today' : '';
        const classes = ['calendar-day', isToday, weekClass].filter(Boolean).join(' ');
        const dayNum = d.getDate();
        const amountStr = amount > 0 ? (calendarMode === 'salary' ? `+${amount.toLocaleString()}` : `-${amount.toLocaleString()}`) : '';
        const len = amountStr.length;
        const amountFS = len <= 7 ? '8.5px' : len <= 9 ? '7.5px' : len <= 11 ? '6.5px' : len <= 13 ? '5.5px' : '4.5px';

        calendarHTML += `
            <div class="${classes}" data-date="${dateStr}">
                ${dayNum === 1 ? `<div class="month-mini">${d.getMonth() + 1}월</div>` : ''}
                <div class="date-label">${dayNum}</div>
                ${amount > 0 ? `<div class="calendar-amount" style="font-size:${amountFS}">${amountStr}</div>` : ''}
            </div>`;
        d.setDate(d.getDate() + 1);
    }

    calendarHTML += '</div></div>';
    container.innerHTML = calendarHTML;

    container.querySelectorAll('.calendar-day').forEach(dayElem => {
        dayElem.addEventListener('click', () => {
            if (calendarMode === 'salary') showSalaryDayModal(dayElem.getAttribute('data-date'));
            else showDayModal(dayElem.getAttribute('data-date'));
        });
    });
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const periodModal = document.getElementById('periodModal');
    const dayModal = document.getElementById('dayModal');

    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === periodModal) {
        closePeriodModal();
    }
    if (event.target === dayModal) {
        closeDayModal();
    }
    const salaryDayModal = document.getElementById('salaryDayModal');
    if (event.target === salaryDayModal) closeSalaryModal();
    const salaryTableModal = document.getElementById('salaryTableModal');
    if (event.target === salaryTableModal) closeSalaryTableModal();
};

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});