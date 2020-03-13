
if (window.wx) {
    console.log('微信环境')

    wx.ready(function () {
        //分享到朋友圈接口
        wx.onMenuShareTimeline({
            title: '抽奖活动', // 分享时的标题
            link: 'http://huihui.mynatapp.cc/gift.html', // 分享时的链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://www.wolfcode.cn/img/wolfcode/logo.png', // 分享时显示的图标
            success: function () {
                //给用户添加1次抽奖机会
                // alert("分享成功");
            },
            //用户取消分享后执行的回调函数
            cancel: function () {
                // alert("取消分享");
            }
        });

        wx.onMenuShareAppMessage({
            success() {
                console.log('分享给朋友')
            }
        });

    });

} else {
    console.log('非微信环境')
}