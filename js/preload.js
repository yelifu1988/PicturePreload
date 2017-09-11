//图片预加载 yangyong 2017/09/11
(function ($) {

    function PreLoad(imgs,options) {
        //如果传进来的参数是字符串则包装成数组
        this.imgs = (typeof imgs === 'string')?[imgs]:imgs;
        //options和PreLoad.DEFAULTS融合 返回新对象{}，其实就是options覆盖PreLoad.DEFAULTS
        this.opts = $.extend({},PreLoad.DEFAULTS,options);

        //无序加载方法 注：加下划线表明这个方法只在这个内部使用，二不提供外部调用
        this._unoredered();
    };

    PreLoad.DEFAULTS = {
        each: null, //每一张图片加载完毕后执行
        all: null  //所有图片加载完毕后执行
    };

    //在构造函数原型上添加方法  无序加载
    PreLoad.prototype._unoredered = function () {
        var imgs = this.imgs;
        var opts = this.opts;
        var count = 0,
            len = imgs.length;

        $.each(imgs,function (i,src) {
            //判断src是否是字符串
            if(typeof src != 'string'){return};

            //new一个img对象也就是实例化，img对象有两个事件
            //load和error 这是实现预加载的核心
            var imgObj = new Image();
            //变成jq对象 然后添加事件
            //注意：一定要把error事件也绑定上 否则一旦有其他原因导致有的img加载不出来 load事件就执行不了 下面的代码就会不执行所以不管加载成功否都继续执行
            $(imgObj).on('load error',function () {
                //先判断是否传了参数
                opts.each && opts.each(count)

                //加载完成 隐藏
                if (count>=len-1){
                    opts.all && opts.all()
                }
                count++
            });
            //imgObj对象上的src赋值给src
            imgObj.src = src;
        })
    };

    //一下是两种jq插件的调用方式 第一种是方法调用  第二种是工具函数
    // $.fn.extend() -> $('#img').preload();
    // $.extend() -> $.preload()

    //我们用第二种工具方法

    $.extend({
        preload: function (imgs,opts) {
            new PreLoad(imgs,opts);
        }
    });

})(jQuery)