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

document.addEventListener('DOMContentLoaded', function () {
    console.info('content_script.js 我开始执行了！');
    injectJs("js/jquery.min.js");
    injectJs("js/inject.js");
    console.info('content_script.js 我执行完毕了！');
});

window.addEventListener("message", function (e) {
    console.log("content_script.js 接收到消息:" + e.data);
}, false);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("我接受到了消息" + request);
    if (undefined != request && request != null && request.indexOf("refresh") != -1) {
        window.postMessage({"event": "refresh"}, "https://www.zhihu.com/");
    }
    sendResponse({"result": "content_script success response"});
});