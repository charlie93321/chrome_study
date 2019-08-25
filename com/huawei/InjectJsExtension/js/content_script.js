// content-script 接收到 popup/background 的信息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    debugger;
    console.log(request);
    if (request.cmd != undefined && request.cmd == 'speek') {
        let msg = new SpeechSynthesisUtterance(request.msg);
        speechSynthesis.speak(msg);
    }

    sendResponse('我收到了你的消息！');
});


// 向dom 注入js
document.addEventListener('DOMContentLoaded', function () {
    console.info('content_script.js 我开始执行了！');
    injectJs("js/3rd/jquery.min.js");
    injectJs("js/inject.js");
    console.info('content_script.js 我执行完毕了！');
});


