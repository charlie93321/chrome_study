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
    var requestList = [];


    chrome.devtools.network.onRequestFinished.addListener(
        function (data) {
            var request = data.request;
            var requestHeaders = request.headers;
            var isAjaxRequest = false;
            var requestType = data.response.content.mimeType;
            if (requestType == "application/json") {

                var response = data.response;
                var responseHeaders = JSON.stringify(response.headers);
                var headers = JSON.stringify(requestHeaders);
                var requestType = data.response.content.mimeType;  // "application/javascript"  "image/png"
                var method = request.method;
                var requestData = request.postData; // requestData  postData
                debugger;
                if (requestData) {
                    if (requestData.params) {
                        requestData = requestData.params;
                    } else {
                        requestData = requestData.text;
                    }
                } else {
                    requestData = request.queryString;
                }

                requestData = JSON.stringify(requestData);
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

    $("#searchBtn").bind("click", function () {
        var key = $("#keysearch").val();

        if (requestList && requestList.length > 0) {
            var cs = $($("#data").children()[0]).children();
            if (cs && cs.length > 1) {
                for (let i = cs.length - 1; i >= 0; i--) {
                    if ($(cs[i]).attr("id") != "thead") {
                        $(cs[i]).remove();
                    }
                }

            }
            for (var i = 0; i < requestList.length; i++) {
                var entity = requestList[i];
                $("#data tr#tr_" + entity.id).empty();
                var str1 = JSON.stringify(entity);
                if (key) {
                    if (str1.indexOf(key) != -1) {
                        fill(entity);
                    }
                } else {
                    fill(entity);
                }
            }
        }
    });

    function fill(entity) {

        var tr = $("<tr id='tr_" + id + "' style='text-align: center'></tr>");
        tr.append($("<td>" + entity.url + "</td>"));
        tr.append($("<td>" + entity.method + "</td>"));
        tr.append($("<td>" + entity.requestType + "</td>"));
        tr.append($("<td>" + entity.reqData + "</td>"));
        tr.append($("<td>" + entity.respData + "</td>"));
        $("#data").append(tr);
        debugger;

    }
});