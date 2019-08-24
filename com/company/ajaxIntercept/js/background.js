var left = 80;


var urlMap = {};


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.indexOf('http://localhost:19998/sendData') == -1) {
            var method = details.method;
            var data = '';
            if (method == 'POST') {
                if (details.requestBody) {
                    if (details.requestBody.raw) {
                        data = JSON.stringify(details.requestBody.raw);
                    } else if (details.requestBody.formData) {
                        data = JSON.stringify(details.requestBody.formData);
                    }
                }
            }
            $.post('http://localhost:19998/sendData', {
                'url': details.url,
                'data': data,
                'type': details.type,
                'method': method
            }, function (data) {
                console.log(data);
            });
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]);


// onHeadersReceived
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (details.url.indexOf('localhost:19998') != -1) {

        // Access-Control-Allow-Origin
        details.responseHeaders.push({"name": "Access-Control-Allow-Origin", "value": "*"});
        details.responseHeaders.push({
            "name": "Access-Control-Allow-Methods",
            "value": "GET, PUT, POST, DELETE, HEAD, OPTIONS"
        });
        details.responseHeaders.find(function (rh, index) {
            if (rh.name === 'x-frame-options') {
                details.responseHeaders[index]['value'] = 'allow-from ' + details.url;
            }
        });
        console.log('跨域请求!');
        return {responseHeaders: details.responseHeaders};
    }
}, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd != undefined && request.cmd == 'cross-req-content-send') {
        var url = request.url;
        var dd = new Date();
        $.get(url + '?_t=' + dd.getTime(), function (data) {
            sendResponse(data);
        });
        return true;
    } else {
        sendResponse('success');
    }
});


/* var views = chrome.extension.getViews({type: 'popup'});
           if (views && views.length > 0) {
               var popWin = views[0];
               var popDoc = popWin.document;
               var data = popDoc.getElementById("data");
               data.innerHTML = "<div>hello></div>";
           }*/
/*chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (ajax) {
            console.log(details);
            var headers = modifyHeader(details.requestHeaders, details.url);
            console.log(headers);
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);*/


