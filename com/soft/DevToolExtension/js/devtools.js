chrome.devtools.panels.create("DEV-TOOL",
    "imgs/dev.png",
    "mainPanel.html",
    function (panel) {
        console.log("我的主窗口创建成功了!!!");
        console.log(panel);
    });