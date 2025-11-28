// Injected Script - 페이지 컨텍스트에서 실행
// 역할: Alert/Confirm 팝업 차단

window.alert = function(msg) {
    console.log("⚠️ Alert 차단됨:", msg);
    return true;
};

window.confirm = function(msg) {
    console.log("⚠️ Confirm 차단됨:", msg);
    return true;
};
