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
    if (e.data.cmd != undefined && e.data.cmd == 'cross-req-inject-send') {
        var url = e.data.url;
        chrome.runtime.sendMessage({'cmd': 'cross-req-content-send', 'url': url}, function (data) {
            window.postMessage({
                "cmd": 'cross-req-content-send',
                "html": data
            }, '*');
        });
        console.log(url);

    }
}, false);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    console.log(request);
    if (request.cmd != undefined && request.cmd == 'bar') {
        var len = request.value;
        var left = parseInt(len.replace('%', ''));
        var right = 100 - left - 1;
        console.log('left is ' + left);

        window.postMessage({"cmd": 'bar', "left": left + "%", "right": right + "%"}, '*');
    }
    sendResponse('content_script success ' + request.value);


});