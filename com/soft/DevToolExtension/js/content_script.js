function injectJs(jsPath) {
    var inject = document.createElement('script');
    inject.setAttribute('type', 'text/javascript');
    inject.src = chrome.extension.getURL(jsPath);
    inject.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(inject);
}


injectJs("js/3rd/jquery.min.js");
injectJs("js/inject.js");


window.onbeforeunload(function () {
    /*  var cs = $("#data").children();
      if (cs && cs.length > 1) {
          for (let i = cs.length - 1; i >= 0; i--) {
              var mark = $(cs[i]).attr("id");
              if (mark != "thead") {
                  $(cs[i]).remove();
              }
          }
      }*/
    console.log("页面刷新!!!");
});