$(function () {
    var cards = $(".TopstoryItem");
    if (undefined != cards && null != cards) {
        $.each(cards, function () {
            var aLine = $(this).find("h2").find("div").find("a");
            var url = $($(this).find("h2").find("div").find("meta")[0]).attr('content');
            var title = $($(this).find("h2").find("div").find("meta")[1]).attr('content');
            console.info("标题:" + title + "ulr===>" + url);
            aLine.bind('click', function () {
                console.log("我被点击了:" + $(this).text());
                window.postMessage({"test": '你好！' + $(this).text()}, '*');
            });
            aLine.hover(function () {
                $(this).css("background-color", "red");
                $(this).attr("title", $(this).text());
                $(this).text("hello world");
            }, function () {
                $(this).css("background-color", "green");
                $(this).text($(this).attr("title"));
            });
        });

    } else {
        console.log("未查询到标题");
    }


    window.addEventListener("message", function (e) {
        console.log("注入js 接收到消息:" + e.data);

        if (undefined != cards && null != cards) {
            $.each(cards, function () {
                var aLine = $(this).find("h2").find("div").find("a");
                var url = $($(this).find("h2").find("div").find("meta")[0]).attr('content');
                var title = $($(this).find("h2").find("div").find("meta")[1]).attr('content');
                console.info("标题:" + title + "ulr===>" + url);
                aLine.bind('click', function () {
                    console.log("我被点击了:" + $(this).text());
                    window.postMessage({"test": '你好！' + $(this).text()}, '*');
                });
                aLine.hover(function () {
                    $(this).css("background-color", "yellow");
                    $(this).attr("title", $(this).text());
                    $(this).text("hello you are a man");
                }, function () {
                    $(this).css("background-color", "gray");
                    $(this).text($(this).attr("title"));
                });
            });
        }

    }, false);


});


document.body.innerHTML = '<iframe src8%86%E9%A1%B5%E9%9D%A2&oq=%25E7%25A6%258F%25E9%25BC%258E%25E5%2588%25B0%25E7%25A6%258F%25E5%25B7%259E%25E5%258A%25A8%25E8%25BD%25A6%25E6%2597%25B6%25E5%2588%25BB%25E8%25A1%25A8&rsv_pq=e58cb2f60004d91a&rsv_t=3067eIeXXopx6fiVZimtfMDA6h4UOvgIk6piSURIyhZgnX498SpbrAJCu9U&rqlang=cn&rsv_enter=1&rsv_dl=tb&inputT=14961&rsv_sug3=31&rsv_sug1=31&rsv_sug7=101&rsv_sug2=0&rsv_sug4=14961" width="90%" height="100%" ></iframe>'























