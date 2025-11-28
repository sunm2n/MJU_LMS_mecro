// Background Script (Service Worker)
// 역할: iframe의 Video Frame과 Main Frame 간 메시지 중계

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "VIDEO_ENDED") {
    console.log("[Background] 영상 종료 신호 수신. 메인 탭으로 전달합니다.");

    // 메시지를 보낸 탭(Tab)의 모든 프레임에 종료 신호를 전파
    if (sender.tab && sender.tab.id) {
      chrome.tabs.sendMessage(sender.tab.id, { action: "TRIGGER_ATTENDANCE" });
    }
  }

  // 응답 불필요 (sendResponse 미사용)
  return false;
});

console.log("[Background] MJU LMS Auto Player 백그라운드 스크립트 실행됨");
