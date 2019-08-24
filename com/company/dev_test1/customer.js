document.getElementById("btn").onclick = function () {
    console.log(this.value);

    if (this.value != '我被点击了') {
        this.value = '我被点击了';
        $("#btn").css("background-color", "red");
    } else {
        this.value = "按钮";
        $("#btn").css("background-color", "green");
    }
};