// 随机数
function random(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}

// 随机颜色
function randomColor(haveAlpla) {
    if (haveAlpla == undefined) {
        return "rgb("+ random(0, 255) +", "+ random(0, 255) +", "+ random(0, 255) +")";
    } else {
        return "rgba("+ random(0, 255) +", "+ random(0, 255) +", "+ random(0, 255) +", "+ (Math.random() + 0.1) +")";
    }
}
