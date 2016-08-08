<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="imagetoolbar" content="no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no">
<title>pocket-man</title>
<link rel="stylesheet" type="text/css" href="http://projectx.dev.izhida.cn/api/css/rem/1/id/79" media="all" />
<link rel="stylesheet" href="css/main.css">

<script>
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            window.clientWidth = docEl.clientWidth;
            if (!window.clientWidth) return;
            docEl.style.fontSize = 20 * (window.clientWidth / 640) + 'px';
            window.base = 20 * (window.clientWidth / 640);
        };
        recalc();
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
</script>

</head>


<body class="">
<?php
    echo file_get_contents('http://projectx.dev.izhida.cn/api/html/id/79');
?>

<script src="http://cdn.bootcss.com/jquery/3.1.0/jquery.slim.min.js"></script>
<script src="js/three.min.js"></script>
<script src="js/core.js"></script>
<script src="js/main.js"></script>

</body>
</html>
