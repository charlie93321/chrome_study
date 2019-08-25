$(function () {
    audiojs.events.ready(function () {
        var as = audiojs.createAll();
    });

    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }


    /*
    *
    *  let msg = new SpeechSynthesisUtterance("你好");
      console.log(msg)
     //msg.rate = 4 播放语速
     //msg.pitch = 10 音调高低
     //msg.text = "播放文本"
     //msg.volume = 0.5 播放音量
      speechSynthesis.speak(msg);
    * */

    $(".sendData").bind("click", function () {
        let msg = new SpeechSynthesisUtterance($(this).text());
        speechSynthesis.speak(msg);
        if (msg.text == '向背景页发送数据') {
            // popup 向 backgroud 发送数据
            var bg = chrome.extension.getBackgroundPage();
            bg.receivePopData({'send': 'popup', 'cmd': 'speek', 'msg': '我是背景页,我已接收到来自popup页面的数据'});
        } else {
            // popup 向 content-script 发送数据
            sendMessageToContentScript({
                'send': 'popup',
                'cmd': 'speek',
                'msg': '我是content-script,我已接收到来自popup页面的数据'
            }, function (response) {
                console.log('来自content的回复：' + response);
            });
        }
    });

    // ---------------------
    $(".bgsendData").bind("click", function () {
        var bg = chrome.extension.getBackgroundPage();
        bg.sendData($(this).text());
    });

    //  监听来自背景页的数据
    var hiddenEvent = document.getElementById('bgMsg');
    hiddenEvent.addEventListener('myCustomEvent', function () {
        var data = $('#bgMsg').val();
        data = data.replace(new RegExp("'", 'g'), '\"');
        var obj = $.parseJSON(data);
        if (obj.cmd != undefined && obj.cmd == 'speek') {
            let msg = new SpeechSynthesisUtterance(obj.msg);
            speechSynthesis.speak(msg);
            $('#bgMsg').val('');
        }
    });

    // 监听来自content-script的消息
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('收到来自content-script的消息：');
        console.log(request, sender, sendResponse);
        sendResponse('我是pop页面，我已收到你的消息：' + JSON.stringify(request));
    });

});