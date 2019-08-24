$(function () {


    chrome.runtime.onConnect.addListener(function (devToolsConnection) {
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
    });

});