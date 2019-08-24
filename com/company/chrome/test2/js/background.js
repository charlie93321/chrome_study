var i = 0;
var j = 0;
setInterval(function () {
    console.debug("我是后台js,我被执行了" + i + "次.");
    i = i + 1;
}, 1000);
/***
 *
 *
 * webRequest.RequestFilter 类型的 filter 参数允许通过不同的方式限制为哪些请求产生事件：
 * url 匹配
 * 类型 图片 文本 请求类型，例如 "main_frame"（为顶层框架加载的文档）、"sub_frame"（为内嵌框架加载的文档）和 "image"（网站上的图片）
 *
 * 如果可选的 opt_extraInfoSpec 数组包含 'blocking' 字符串（仅允许用于特定事件），回调函数将以同步方式处理。这意味着请求将阻塞，直到回调函数返回

 chrome.webRequest.onBeforeRequest.addListener(
 function (details) {

        if (details.url.indexOf("https://www.zhihu.com/api/v3/feed/topstory/recommend") != -1) {
            chrome.tabs.sendMessage(details.tabId,"re");

        }
        return true;
    },
 {urls: ["<all_urls>"]},
 ["blocking"]);*/

chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (details.url.indexOf("https://www.zhihu.com/api/v3/feed/topstory/recommend") != -1) {
            j = j + 1;
            console.log("页面刷新...." + j);
            chrome.tabs.sendMessage(details.tabId, "refresh" + j, function (data) {
                console.log("返回的数据为:" + data);
            });
        }
        return true;
    }, {urls: ["<all_urls>"]}, ["responseHeaders"]);