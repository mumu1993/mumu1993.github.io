<?php 
    include_once( __DIR__.'/init.php' );
?>
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
<title>口袋男神 GO！</title>
<link rel="stylesheet" type="text/css" href="css/main82.min.css" media="all" />
<link rel="stylesheet" type="text/css" href="css/main83.min.css" media="all" />
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
<div class="page-280 page"><div class="res-3198"></div><div class="res-3199"></div><div class="res-3200 fontpage-ball"></div><div class="res-3201"></div><div class="res-3280 music-pause"></div><div class="res-3281 music-play"></div></div><div class="page-281 page"><div class="res-3205 text-container"></div><div class="res-3282 music-pause"></div><div class="res-3283 music-play"></div></div>
<?=$js?>
<script src="js/jQuery.min.js"></script>
<script src="js/three.min.js"></script>
<script src="js/3dhelper.js"></script>
<script src="js/css3d.js"></script>
<script src="js/main.js"></script>

</body>
</html>
