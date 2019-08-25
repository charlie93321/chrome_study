window.addEventListener("message", function (e) {
    if (e.data.cmd == 'content_log') {
        console.log("接收到来自content的数据" + JSON.stringify(e.data));
    }
}, false);

setInterval(function () {
    window.postMessage({"send": "inject", "cmd": "inject_log", "msg": "我是inject脚本,发送数据给content-script"}, '*');
}, 2000);