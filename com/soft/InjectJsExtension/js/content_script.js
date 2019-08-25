var contentText = '';

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

    var scripts = document.scripts;
    var isContainJquery = false;
    if (scripts) {
        var len = scripts.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                var src1 = scripts[i].src;
                if (src1.indexOf("jquery") != -1) {
                    isContainJquery = true;
                    break;
                }
            }
        }
    }
    if (!isContainJquery) {
        injectJs("js/3rd/jquery.min.js");
    }
    injectJs("js/inject.js");

    if (window.location.href == 'https://support.soft.com/carrierindex/zh/hwe/index.html') {
        document.getElementById("PBI1-7899438").setAttribute("class", "btn btn-danger");
        document.getElementById("PBI1-7275733").setAttribute("class", "btn btn-success");

        document.getElementById("PBI1-7899438").onclick = function () {
            if (contentText == '') {
                contentText = this.text;
                this.text = "content-script js 事件绑定";
            } else {
                this.text = contentText;
                contentText = '';
            }
            console.log('content-script访问dom中js数据:' + path);
        }

    }
    console.info('content_script.js 我执行完毕了！');
});
// 1.当 onload 事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了。

// 2.当 DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash。


// content-script 接收到 popup/background 的信息

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd != undefined && request.cmd == 'speek') {
        let msg = new SpeechSynthesisUtterance(request.msg);
        speechSynthesis.speak(msg);
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

//  content-script 向 popup/background 发送数据

setInterval(function () {

    chrome.runtime.sendMessage({"send": "content-script", "cmd": "log", "msg": 'xxx'}, function (response) {
        console.log('收到来自后台的回复：' + response);
    });

    window.postMessage({
        "send": "content-srcipt",
        "cmd": "content_log",
        "msg": "我是content-script,发送数据给inject脚本"
    }, "*");

}, 10000);



