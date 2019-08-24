var f1;
var f2;

console.log("load inject .js ");
var height = window.document.body.offsetHeight;

window.postMessage({"cmd": 'cross-req-inject-send', "url": "http://localhost:19998/plugin"}, '*');

window.addEventListener("message", function (e) {
    console.log(e.data);
    //cmd: "bar", left: "14%", right: "86%"}
    if (e.data.cmd != undefined && e.data.cmd == 'bar') {
        f1.width = e.data.left;
        f2.width = e.data.right;
    } else if (e.data.cmd != undefined && e.data.cmd == 'cross-req-content-send') {
        var text = e.data.html;
        text = text.replace('jquery.min.js', 'chrome-extension://ihlbcfaggkkjlgpljlkinboegcnegbaj/js/jquery.min.js');
        text = text.replace('bootstrap.min.css', 'chrome-extension://ihlbcfaggkkjlgpljlkinboegcnegbaj/js/bootstrap.min.css');
        text = text.replace('bootstrap.min.js', 'chrome-extension://ihlbcfaggkkjlgpljlkinboegcnegbaj/js/bootstrap.min.js');
        text = text.replace('bg.js', 'chrome-extension://ihlbcfaggkkjlgpljlkinboegcnegbaj/js/bg.js');
        text = text.replace(new RegExp('"', 'g'), "'");
        text = text.replace(new RegExp('\r\n', 'g'), ' ');


        document.body.innerHTML =
            '<iframe id="frame1" frameborder="1" src="' + window.location.href + '" width="80%"  height="' + height + '" ></iframe>' +
            '<iframe  frameborder="0" id="frame2" srcdoc="' + text + '" width="19%"  height="' + height + '"></iframe>';
        f1 = document.getElementById("frame1");
        f2 = document.getElementById("frame2");

    }
}, false);




