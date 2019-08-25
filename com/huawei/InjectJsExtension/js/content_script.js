function injectJs(jsPath) {
    var inject = document.createElement('script');
    inject.setAttribute('type', 'text/javascript');
    inject.src = chrome.extension.getURL(jsPath);
    inject.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(inject);
}

// 向dom 注入js
document.addEventListener('DOMContentLoaded', function () {
    console.info('content_script.js 我开始执行了！');
    injectJs("js/3rd/jquery.min.js");
    injectJs("js/inject.js");
    console.info('content_script.js 我执行完毕了！');
});

// content-script 接收到 popup/background 的信息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd != undefined && request.cmd == 'speek') {
        //let msg = new SpeechSynthesisUtterance(request.msg);
        //speechSynthesis.speak(msg);
    }

    sendResponse('我收到了你的消息！');
});

// content_scripts向popup主动发消息的前提是popup必须打开！否则需要利用background作中转；
// 如果background和popup同时监听，那么它们都可以同时收到消息，但是只有一个可以sendResponse，一个先发送了，那么另外一个再发送就无效
//  content-script 向 popup/background 发送数据
window.addEventListener("message", function (e) {
    if (e.data.cmd == 'inject_log') {
        console.log("接收到来自inject的数据" + JSON.stringify(e.data));
    }
}, false);


setInterval(function () {
    //  content-script 向 popup/background 发送数据
    chrome.runtime.sendMessage({"send": "content-script", "cmd": "log", "msg": 'xxx'}, function (response) {
        console.log('收到来自后台的回复：' + response);
    });
    //
    window.postMessage({"send": "content-srcipt", "cmd": "content_log", "msg": "我是content-script,发送数据给inject脚本"}, "*");

}, 10000);



