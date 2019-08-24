chrome.devtools.panels.create("main pannel",
    "draw.png",
    "mypanel.html",
    function (panel) {
        debugger;
        console.log("我的主窗口创建成功了!!!");
        console.log(panel);
    });