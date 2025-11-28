// Popup Script - 설정 UI 제어

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('autoPlayToggle');
    const statusText = document.getElementById('statusText');

    // 저장된 설정 불러오기
    chrome.storage.sync.get(['autoPlayEnabled'], (result) => {
        const isEnabled = result.autoPlayEnabled !== false; // 기본값: true
        toggle.checked = isEnabled;
        updateStatus(isEnabled);
    });

    // 토글 변경 이벤트
    toggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;

        // 설정 저장
        chrome.storage.sync.set({ autoPlayEnabled: isEnabled }, () => {
            console.log('자동 재생 설정:', isEnabled ? '활성화' : '비활성화');
            updateStatus(isEnabled);
        });
    });

    // 상태 텍스트 업데이트
    function updateStatus(isEnabled) {
        if (isEnabled) {
            statusText.textContent = '상태: 활성화됨';
            statusText.className = 'status active';
        } else {
            statusText.textContent = '상태: 비활성화됨';
            statusText.className = 'status inactive';
        }
    }
});
