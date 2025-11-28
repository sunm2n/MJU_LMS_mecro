// Content Script - MJU LMS Auto Player
// 역할: iframe 내 비디오 제어 + 메인 프레임 버튼 클릭

// 페이지 로드 후 실행 (2초 대기)
setTimeout(() => {
    initMJUAutoPlayer();
}, 2000);

function initMJUAutoPlayer() {
    console.log("[MJU Auto Player] 초기화 시작");

    // 설정 확인
    chrome.storage.sync.get(['autoPlayEnabled'], (result) => {
        const isEnabled = result.autoPlayEnabled !== false; // 기본값: true

        if (!isEnabled) {
            console.log("[MJU Auto Player] 자동 재생이 비활성화되어 있습니다.");
            return;
        }

        console.log("[MJU Auto Player] 자동 재생 활성화됨");

        // 1. [공통] 학습 체크 팝업(노란색 경고창) 감시 - 3초마다 체크
        setInterval(() => {
            const warningPopup = document.querySelector('#checkLearning');
            if (warningPopup && warningPopup.style.display !== 'none') {
                console.log("⚠️ 학습 체크 팝업 감지! 클릭합니다.");
                warningPopup.click();
            }
        }, 3000);

        // 2. [Role: Player] iframe 내부에서 비디오 제어
        const video = document.querySelector('video');
        if (video) {
            console.log("🎬 Video Frame 감지됨");
            handleVideoLogic(video);
        }

        // 3. [Role: Manager] 메인 프레임에서 버튼 제어 메시지 수신 대기
        chrome.runtime.onMessage.addListener((request) => {
            if (request.action === "TRIGGER_ATTENDANCE") {
                handleMainFrameLogic();
            }
        });
    });
}

// 비디오 제어 로직
function handleVideoLogic(video) {
    video.muted = true; // 자동 재생 정책 우회

    video.play().then(() => {
        console.log("▶️ 영상 재생 시작");
    }).catch(e => {
        console.log("❌ 자동 재생 실패 (사용자 클릭 필요):", e);
    });

    // 영상 종료 감지 -> 백그라운드로 메시지 전송
    video.addEventListener('ended', () => {
        console.log("✅ 영상 종료. 출석 신호를 보냅니다.");
        chrome.runtime.sendMessage({ action: "VIDEO_ENDED" });
    });
}

// 버튼 클릭 로직 (메인 프레임)
function handleMainFrameLogic() {
    // 이미 클릭했거나, 비디오 프레임이면 무시
    if (document.querySelector('video')) return;

    console.log("📩 출석 처리 요청 받음. 버튼을 탐색합니다.");

    // 우선순위 1: '다음' 버튼 먼저 클릭 시도
    const nextBtn = document.querySelector('#next_');

    if (nextBtn && nextBtn.style.display !== 'none') {
        console.log("⏭️ '다음' 버튼 클릭");
        nextBtn.click();

        // 다음 영상이 없으면 alert가 뜨지만 이미 차단됨
        // 잠시 후 출석(종료) 버튼 클릭
        setTimeout(() => {
            const closeBtn = document.querySelector('#close_');
            if (closeBtn) {
                console.log("🚪 '출석(종료)' 버튼 클릭");
                closeBtn.click();
            }
        }, 800);
        return;
    }

    // 우선순위 2: '다음' 버튼이 없으면 바로 '출석(종료)' 버튼 클릭
    const closeBtn = document.querySelector('#close_');
    if (closeBtn) {
        console.log("🚪 '출석(종료)' 버튼 클릭");
        closeBtn.click();
    } else {
        console.log("ℹ️ 클릭할 버튼을 찾지 못했습니다.");
    }
}
