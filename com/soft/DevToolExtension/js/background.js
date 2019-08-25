var fun1 = function () {
};
$(function () {
    chrome.runtime.onConnect.addListener(function (devToolsConnection) {
        connect = devToolsConnection;
        console.log("建立同dev pages的连接");
        // assign the listener function to a variable so we can remove it later
        var devToolsListener = function (message, sender, sendResponse) {
            // Inject a content script into the identified tab
            console.log("添加bg-dev监听器");
            if (message.scriptToInject) {
                chrome.tabs.executeScript(message.tabId,
                    {file: message.scriptToInject});
            }
        };
        // add the listener
        devToolsConnection.onMessage.addListener(devToolsListener);

        devToolsConnection.onDisconnect.addListener(function () {
            console.log("移除bg-dev监听器");
            devToolsConnection.onMessage.removeListener(devToolsListener);
        });

        fun1 = function sendData(data) {
            devToolsConnection.postMessage(data);
        }
    });


    // 监听来自content-script的消息
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('收到来自content-script的消息：');
        fun1(request);
        sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
    });
});