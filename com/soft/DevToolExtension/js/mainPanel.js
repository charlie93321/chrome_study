$(function () {


    function RequetEntity(id, url, method, requestType, Request, reqHeaders, respHeaders, reqData, respData) {
        this.id = id;
        this.url = url;
        this.method = method;
        this.requestType = requestType;
        this.Request = Request;
        this.reqHeaders = reqHeaders;
        this.respHeaders = respHeaders;
        this.reqData = reqData;
        this.respData = respData;
    }

    var id = 0;
    requestList = [];


    chrome.devtools.network.onRequestFinished.addListener(
        function (data) {
            /*  $("#data").append($("<tr style=\"text-align: center\">\n" +
                  "       <th width=\"25%\">url</th>\n" +
                  "       <th width=\"5%\">请求方式</th>\n" +
                  "       <th width=\"5%\">请求类型</th>\n" +
                  "       <th width=\"15%\">请求头</th>\n" +
                  "       <th width=\"20%\">请求体</th>\n" +
                  "       <th width=\"15%\">响应头</th>\n" +
                  "       <th width=\"20%\">响应体</th>\n" +
                  "    </tr>"));


                  postData:
mimeType: "application/x-www-form-urlencoded; charset=UTF-8"
params: Array(2)
0: {name: "path", value: "CONTOOL-29-11"}
1: {name: "col", value: "tool%2F3rdtool"}


                  */


            // X-Requested-With
            //x-requested-with
            var request = data.request;
            var requestHeaders = request.headers;
            var isAjaxRequest = false;
            var requestType = data.response.content.mimeType;
            if (requestHeaders && requestHeaders.length > 0) {
                $.each(requestHeaders, function () {
                    var key = this.name;
                    var value = this.value;
                    if (key && key.toLocaleLowerCase() == 'x-requested-with' && value) {
                        isAjaxRequest = value.toLocaleLowerCase() == 'XMLHttpRequest'.toLocaleLowerCase();
                        return false;
                    }
                });
            }
            if (isAjaxRequest) {
                var response = data.response;
                var responseHeaders = JSON.stringify(response.headers);
                var headers = JSON.stringify(requestHeaders);
                var requestType = data.response.content.mimeType;  // "application/javascript"  "image/png"
                var method = request.method;
                var requestData = request.postData; // requestData  postData

                if (requestData) {
                    requestData = requestData.params;
                } else {
                    requestData = request.queryString;
                }

                requestData = JSON.stringify(requestData);
                if (requestData.startsWith("[")) {
                    requestData = requestData.substring(1, requestData.length - 1);
                }

                var tr = $("<tr id='tr_" + id + "' style='text-align: center'></tr>");
                tr.append($("<td>" + request.url + "</td>"));
                tr.append($("<td>" + method + "</td>"));
                tr.append($("<td>" + requestType + "</td>"));
                tr.append($("<td>" + requestData + "</td>"));
                $("#data").append(tr);

                var entity = new RequetEntity(id, request.url, method, requestType, data, headers, responseHeaders, requestData, '');
                requestList.push(entity);
                id += 1;
                data.getContent(function (content, encoding) {
                    //console.log(content);
                    entity.respData = content;
                    if (entity.requestType != "application/javascript" && entity.requestType != 'text/html') {
                        $("#tr_" + entity.id).append($("<td>" + content + "</td>"));
                    } else {
                        $("#tr_" + entity.id).append($("<td><a id='a_" + id + "' class='btn btn-block btn-info'>查看详情</a></td>"));
                    }
                });
            }
        });


    // Create a connection to the background page
    var backgroundPageConnection = chrome.runtime.connect({
        name: "devtools-page"
    });

    backgroundPageConnection.onMessage.addListener(function (message) {
        // Handle responses from the background page, if any
        console.log("接收到背景页的数据!!!");
        console.log(message);
        // {send: "content-script_second", cmd: "send_to_dev", msg: "page_refresh_load"}
        if (message.cmd != undefined && message.cmd == 'send_to_dev' && message.msg == 'page_refresh_load') {
            requestList = [];
            var cs = $($("#data").children()[0]).children();
            if (cs && cs.length > 1) {
                for (let i = cs.length - 1; i >= 0; i--) {
                    if ($(cs[i]).attr("id") != "thead") {
                        $(cs[i]).remove();
                    }
                }
            }
        }
    });


    $("#clearBtn").bind("click", function () {
        requestList = [];
        var cs = $($("#data").children()[0]).children();
        if (cs && cs.length > 1) {
            for (let i = cs.length - 1; i >= 0; i--) {
                if ($(cs[i]).attr("id") != "thead") {
                    $(cs[i]).remove();
                }
            }
        }
    });

    console.log("---------------------------------");
    // Relay the tab ID to the background page
    backgroundPageConnection.postMessage({
        "tabId": chrome.devtools.inspectedWindow.tabId,
        "scriptToInject": "content_script.js"
    });


});