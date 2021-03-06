// 背景页 接收来自 popup的数据
function receivePopData(obj) {
    console.log("接收到pop页的数据" + JSON.stringify(obj));
    if (obj && obj.send != undefined && obj.cmd != undefined) {
        if (obj.cmd == 'speek') {
            let msg = new SpeechSynthesisUtterance(obj.msg);
            speechSynthesis.speak(msg);
        }
    }
}

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

function sendData(msg) {
    if (msg != undefined && msg != null && msg != '') {
        // 背景页向popup页面发送数据
        if (msg == '背景页向popup发送数据') {
            let msg2 = new SpeechSynthesisUtterance(msg);
            speechSynthesis.speak(msg2);
            var views = chrome.extension.getViews({type: 'popup'});
            if (views != null && views.length > 0) {
                var pop = views[0];

                var customEvent = pop.document.createEvent('Event');
                customEvent.initEvent('myCustomEvent', true, true);

                function fireCustomEvent(data) {
                    var hiddenDiv = pop.document.getElementById('bgMsg');
                    $(hiddenDiv).val(data);
                    hiddenDiv.dispatchEvent(customEvent);
                }

                fireCustomEvent("{'send':'background','cmd':'speek','msg':'我是popup页,我已接收到来自背景面的数据'}");


            }

        } else {
            // 背景页向content-script发送数据
            let msg2 = new SpeechSynthesisUtterance(msg);
            speechSynthesis.speak(msg2);
            sendMessageToContentScript({
                'send': 'background',
                'cmd': 'speek',
                'msg': '我是content-script,我已接收到来自背景页的数据'
            }, function (response) {
                console.log('来自content的回复：' + response);
            });
        }
    }
}


// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});