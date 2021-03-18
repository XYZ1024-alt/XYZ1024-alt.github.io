Prism.highlightAll()


//拿到预览框架，也就是上面的html代码
var pswpElement = document.querySelectorAll('.pswp')[0];
//定义图片数组变量
var imgitems;
/**
* 用于显示预览界面
* @param index 图片数组下标
*/
function viewImg(index) {
  //其它选项这里不做过多阐述，详情见官网
  var pswpoptions = {
    index: parseInt(index, 10), // 开始幻灯片索引。0是第一张幻灯片。必须是整数，而不是字符串。
    bgOpacity: 0.7, // 背景透明度，0-1
    maxSpreadZoom: 3, // 缩放级别，不要太大
  };
  //初始化并打开PhotoSwipe，pswpElement对应上面预览框架，PhotoSwipeUI_Default为皮肤，imgitems为图片数组，pswpoptions为选项
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, imgitems, pswpoptions);
  gallery.init()
}
/**
* 用于添加图片点击事件
* @param img 图片元素
* @param index 所属下标（在imgitems中的位置）
*/
function addImgClick(img, index) {
  img.onclick = function() {
    viewImg(index)
  }
}
/**
* 轮询所有图片，获取src、width、height等数据，加入imgitems，并给图片元素添加事件
* 最好在onload中执行该方法，本站因放在最底部，所以直接初始化
* 异步加载图片可在图片元素创建完成后调用此方法
*/
function initImg() {
  //重置图片数组
  imgitems = [];
  //查找class:markdown 下的所有img元素并遍历
  var imgs = document.querySelectorAll('.markdown img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    //本站相册初始为loading图片，真实图片放在data-src
    var ds = img.getAttribute("data-src");
    //创建image对象，用于获取图片宽高
    var imgtemp = new Image();
    //判断是否存在data-src
    if (ds != null && ds.length > 0) {
      imgtemp.src = ds
    } else {
      imgtemp.src = img.src
    }
    //判断是否存在缓存
    if (imgtemp.complete) {
      var imgobj = {
        "src": imgtemp.src,
        "w": imgtemp.width,
        "h": imgtemp.height,
      };
      imgitems[i] = imgobj;
      addImgClick(img, i);
    } else {
      console.log('进来了2')
      imgtemp.index = i;
      imgtemp.img = img;
      imgtemp.onload = function() {
        var imgobj = {
          "src": this.src,
          "w": this.width,
          "h": this.height,
        };
        //不要使用push，因为onload前后顺序会不同
        imgitems[this.index] = imgobj
        //添加点击事件
        addImgClick(this.img, this.index);
      }
    }
  }
}
//初始化
initImg();