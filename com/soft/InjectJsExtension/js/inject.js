window.addEventListener("message", function (e) {
    if (e.data.cmd == 'content_log') {
        console.log("接收到来自content的数据" + JSON.stringify(e.data));
    }
}, false);

setInterval(function () {
    window.postMessage({"send": "inject", "cmd": "inject_log", "msg": "我是inject脚本,发送数据给content-script"}, '*');
}, 2000);
var beforeText = '';
if (window.location.href == 'https://support.soft.com/carrierindex/zh/hwe/index.html') {
    $("#PBI1-7899438").attr("href", "javascript:;");
    $("#PBI1-7275733").attr("href", "javascript:;");

    $("#PBI1-7275733").bind('click', function () {
        if (beforeText == '') {
            beforeText = $(this).text();
            $(this).text("inject js 事件绑定");
        } else {
            $(this).text(beforeText);
            beforeText = '';
        }
        console.log('inject访问dom中js数据:' + path);
    });
}
