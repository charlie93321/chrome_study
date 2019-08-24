alert("注入 content_script.js1");

/*
var eles = document.getElementsByClassName("relatedinfo1");

var ele = eles[0];


var flag = ele.getElementsByTagName("a")[0];

flag.style.color = "red";
flag.style = "background-color:green";
*/


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


injectJs("jquery.min.js");

injectJs("customer.js");

document.getElementById("btn2").onclick = function () {
    console.log(this.value);

    if (this.value != '我被点击了2') {
        this.value = '我被点击了2';
    } else {
        this.value = "按钮2";
    }

    console.log(addDemo(1, 5));

};
/*
$(function () {
    document.getElementById("btn2").onclick = function () {
        console.log(this.value);

        if (this.value != '我被点击了2') {
            this.value = '我被点击了2';
        } else {
            this.value = "按钮2";
        }

    };
});*/
