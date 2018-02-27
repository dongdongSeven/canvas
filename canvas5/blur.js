var canvasWidth=/Windows/.test(navigator.userAgent)?600:window.innerWidth;
var canvasHeight=/Windows/.test(navigator.userAgent)?900:window.innerHeight;

var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");

canvas.width=canvasWidth;
canvas.height=canvasHeight;

var curLine={};//当前路径的(x,y)
var isMoving=false;
var image = new Image();
var radius = 50;
var rot = 10;
var clippingRegion = {x:-1,y:-1,r:radius,rot:rot};
var leftMargin=0,topMargin=0;

image.src="bg.jpg";
image.onload=function(e){

  $("#blur-div").css("width",canvasWidth+"px");
  $("#blur-div").css("height",canvasHeight+"px");

  $("#blur-image").css("width",image.width+"px");
  $("#blur-image").css("height",image.height+"px");

  leftMargin=(image.width - canvas.width)/2;
  topMargin=(image.height - canvas.height)/2;

  $("#blur-image").css("top",String(-topMargin)+"px");
  $("#blur-image").css("left",String(-leftMargin)+"px");

  // initCanvas()
  draw(image);
}
//初始化移动端事件
canvas.addEventListener("touchstart",function(e){
  e.preventDefault();//阻止默认事件,ipad有时触摸要滑动
  var touch=e.touches[0];
  isMoving = true;
  lastLine=WindowToCanvas({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
  e.preventDefault();
  var touch=e.touches[0];
  if(isMoving){
    curLine=WindowToCanvas({x:touch.pageX,y:touch.pageY});
    draw(image);
  }
});
canvas.addEventListener("touchend",function(e){
  e.preventDefault();
  isMoving = false;
});
//初始化PC端事件
canvas.onmousedown=function(e){
  e.preventDefault();
  isMoving = true;
  lastLine=WindowToCanvas({x:e.clientX,y:e.clientY});
}
canvas.onmousemove=function(e){
  e.preventDefault();
  if(isMoving){
    curLine=WindowToCanvas({x:e.clientX,y:e.clientY});
    draw(image);
  }
}
canvas.onmouseout=function(e){
  e.preventDefault();
  isMoving = false;
}
canvas.onmouseup=function(e){
  e.preventDefault();
  isMoving = false;
}
//canvas画布上的(x,y)
function WindowToCanvas(point){
  var canvasL=canvas.getBoundingClientRect().left;
  var canvasT=canvas.getBoundingClientRect().top;
  return {x:point.x-canvasL,y:point.y-canvasT};
}

//初始化画布
function initCanvas(){
  var theLeft=leftMargin<0?-leftMargin:0;
  var theTop=topMargin<0?-topMargin:0;
  clippingRegion = { x: Math.random()*(canvasWidth-2*radius-2*theLeft)+radius+theLeft,
                     y:Math.random()*(canvasHeight-2*radius-2*theTop)+radius+theTop,r:radius,rot:rot};
  var tmpRadius = radius;
  clippingRegion.r = 0;
  var animations=setInterval(function(){
    clippingRegion.r +=1;
    draw(image,clippingRegion);
    if(clippingRegion.r>=tmpRadius) clearInterval(animations);
  },10);
}
//圆圈样式
function setClippingRegion(clippingRegion){

  context.beginPath();
  context.arc(clippingRegion.x,clippingRegion.y,clippingRegion.r,0,2*Math.PI,false);
  context.clip();
}
//五角星样式
function star(cxt,clippingRegion){
  cxt.beginPath();
    for(var i=0;i<5;i++){
      cxt.lineTo(Math.cos((18+i*72 - clippingRegion.rot)/180*Math.PI)*clippingRegion.r+clippingRegion.x,-Math.sin((18+i*72 - clippingRegion.rot)/180*Math.PI)*clippingRegion.r+clippingRegion.y);
      cxt.lineTo(Math.cos((54+i*72 - clippingRegion.rot)/180*Math.PI)*clippingRegion.r/2+clippingRegion.x,-Math.sin((54+i*72 - clippingRegion.rot)/180*Math.PI)*clippingRegion.r/2+clippingRegion.y);
    }
  cxt.closePath();
  context.clip();
}
//刮刮样式
function lines(){
  context.beginPath();
  context.arc(curLine.x,curLine.y,20,0,2*Math.PI);
  context.clip();
}
//绘制图案
function draw(image,clippingRegion){

  // context.clearRect(0,0,canvasWidth,canvasHeight);

  context.save();
  // star(context,clippingRegion) 星星效果
  // setClippingRegion(clippingRegion) 圆圈效果
  lines(); //刮刮效果

  // context.drawImage(image,
  //   Math.max(leftMargin,0),Math.max(topMargin,0),
  //   Math.min(canvas.width,image.width),Math.min(canvas.height,image.height),
  //   leftMargin<0?-leftMargin:0,topMargin<0?-topMargin:0,
  //   Math.min(canvas.width,image.width),Math.min(canvas.height,image.height));
  
  context.drawImage(image,0,0);
  context.restore();
}
//重置画布
function reset(){
  initCanvas();
}
//展示全图
function show(){
  var timer = setInterval(function(){
      clippingRegion.r += 20;
      clippingRegion.rot += 3;
      if(clippingRegion.r>2*Math.max(canvas.width,canvas.height)){
        clearInterval(timer);
      };
      draw(image,clippingRegion);
  },30);
}
