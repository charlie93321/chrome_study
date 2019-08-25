chrome.runtime.sendMessage({
    "send": "content-script_second",
    "cmd": "send_to_dev",
    "msg": 'page_refresh_load'
}, function (response) {
    console.log('收到来自后台的回复：' + response);
});