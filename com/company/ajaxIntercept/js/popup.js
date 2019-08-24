$(function () {
    var scroll = document.getElementById('scroll');
    var bar = document.getElementById('bar');
    var mask = document.getElementById('mask');
    var bg = chrome.extension.getBackgroundPage();
    var barleft = bg.left * 2;
    var barTxt = document.getElementById("barText");

    mask.style.width = barleft + 'px';
    bar.style.left = barleft + "px";


    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    };
    bar.onmousedown = function (event) {
        var event = event || window.event;
        var leftVal = event.clientX - this.offsetLeft;
        var that = this;
        // 拖动一定写到 down 里面才可以
        document.onmousemove = function (event) {
            var event = event || window.event;
            barleft = event.clientX - leftVal;
            if (barleft < 0)
                barleft = 0;
            else if (barleft > scroll.offsetWidth - bar.offsetWidth)
                barleft = scroll.offsetWidth - bar.offsetWidth;
            mask.style.width = barleft + 'px';
            that.style.left = barleft + "px";
            bg.left = parseInt(barleft / (scroll.offsetWidth - bar.offsetWidth) * 100);
            var len = bg.left + "%";
            barTxt.textContent = '**' + len + '**';


            sendMessageToContentScript({cmd: 'bar', value: len}, function (response) {
                console.log('来自content的回复：' + response);
            });

            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }

    };
    document.onmouseup = function () {
        document.onmousemove = null; //弹起鼠标不做任何操作
    }
});