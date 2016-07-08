function loading(infos, callback) {

    // 图片总个数
    var allCount = 0;
    for (key in infos) {
        allCount++;
    }

    // 保存已经加载完的图片
    var loadedImgs = {};

    // 已经加载完成的图片张数
    var doneCount = 0;

    for (key in infos) {
        var obj = new Image();
        obj.src = infos[key];

        obj.onload = (function (key2) {
            return function () {
                doneCount++;
                loadedImgs[key2] = this;

                // 进度
                var scale = (doneCount / allCount).toFixed(2) * 100;
                if (callback.progress) {
                    callback.progress(scale);
                }

                // 全部加载完成
                if (doneCount == allCount) {
                    if (callback.done) {
                        callback.done(loadedImgs);
                    }
                }
            };
        })(key);
    }
}
