var canvasWidth=Math.min(800,$(window).width()-20);//根据屏幕大小选择字框大小
var canvasHeight=canvasWidth;

var strokeColor = "black";
var isMouseDown = false;
var lastLoc={x:0,y:0};//注意：关键点，记录上一次绘制的点
var lastTimestamp = 0;//上次时间点
var lastLineWidth = -1;//上次画笔宽

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width",canvasWidth+"px");
drawGrid();

$("#clear_btn").click(function(e){
  context.clearRect(0,0,canvasWidth,canvasHeight);
  drawGrid();
})
$(".color_btn").click(function(e){
  $(".color_btn").removeClass("color_btn_selected");
  $(this).addClass("color_btn_selected");
  strokeColor=$(this).css("background-color");
});
//在移动端上实现效果
//touch事件:touchstart、touchmove、touchend、touchcancel
//当用户点击移动设备，系统会触发touch事件和click事件,但touch事件优先处理,再处理click事件。
//不想触发click事件怎么办？
//e.preventDefault()就可以了
//使用addEventListener添加事件touchstart、touchmove、touchend、touchcancel
canvas.addEventListener("touchstart",function(e){
  e.preventDefault();//阻止了click事件以及默认事件
  touch = e.touches[0];//e.touchs表示储存点击源的数组，因为有可能是几根手指同时点击了，都会储存在e.touchs里
  beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
  e.preventDefault();//阻止了click事件以及默认事件
  if(isMouseDown){
    touch = e.touches[0];
    moveStroke({x:touch.pageX,y:touch.pageY});
  }
});
canvas.addEventListener("touchend",function(e){
  e.preventDefault();//阻止了click事件以及默认事件
  endStroke();
});

function beginStroke(point){
  isMouseDown = true;
  lastLoc=WindowToCanvas(point.x,point.y);
  lastTimestamp = new Date().getTime();
}
function endStroke(){
  isMouseDown = false;
}
function moveStroke(point){
  var curLoc=WindowToCanvas(point.x,point.y);//获取当前的(x,y)
  var curTimestamp = new Date().getTime();//当前的时间
  var s = calcDistance(curLoc,lastLoc);//距离s
  var t = curTimestamp - lastTimestamp;//时间t

  var lineWidth = calcLineWidth(t,s);

  //draw
  context.save();

  context.strokeStyle=strokeColor;

  context.beginPath();
  context.moveTo(lastLoc.x,lastLoc.y);
  context.lineTo(curLoc.x,curLoc.y);
  context.lineWidth=lineWidth;//注意：只加lineWidth属性，会出现毛边的字体
  context.lineCap="round";//解决了字体出现毛边的问题
  context.lineJoin="round";//更加顺畅了字体的形体

  context.stroke();

  lastLoc = curLoc;
  lastTimestamp = curTimestamp;

  context.restore();
}

canvas.onmousedown=function(e){
  e.preventDefault();//在PC端可以阻止鼠标默认事件，特别在移动端作用更大
  beginStroke({x:e.clientX,y:e.clientY});
};

canvas.onmousemove=function(e){
  e.preventDefault();
  if(isMouseDown){
    moveStroke({x:e.clientX,y:e.clientY});
  }
};

canvas.onmouseup=function(e){
  e.preventDefault();
  endStroke();
};

canvas.onmouseout=function(e){
  e.preventDefault();
  endStroke();
};

//根据速度计算画笔的宽
var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth(t,s){

  var v=s/t;

  var resultLineWidth;
  if(v<=minStrokeV)
    resultLineWidth = maxLineWidth;
  else if(v>=maxStrokeV)
    resultLineWidth = minLineWidth;
  else{
    resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
  }

  if(lastLineWidth == -1)
    return resultLineWidth;

  return resultLineWidth*1/3 + lastLineWidth*2/3;
}
//计算上个时间点和下个时间点画笔走的距离s
function calcDistance(loc1,loc2){
  return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x) + (loc1.y-loc2.y)*(loc1.y-loc2.y));
}
//计算笔尖在画布上的(x,y)
function WindowToCanvas(x,y){
  var bbox=canvas.getBoundingClientRect();
  return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}
//画字框
function drawGrid(){
  context.save();

  context.strokeStyle="rgb(230,11,9)";

  context.beginPath();
  context.moveTo(3,3);
  context.lineTo(canvas.width-3,3);
  context.lineTo(canvas.width-3,canvas.width-3);
  context.lineTo(3,canvas.width-3);
  context.closePath();

  context.lineWidth=6;

  context.stroke();

  context.beginPath();
  context.setLineDash([10]);
  context.moveTo(0,0);
  context.lineTo(canvas.width,canvas.height);

  context.moveTo(canvas.width,0);
  context.lineTo(0,canvas.height);

  context.lineWidth=1;

  context.stroke();

  context.beginPath();
  context.setLineDash([]);
  context.moveTo(canvas.width/2,0);
  context.lineTo(canvas.width/2,canvas.height);

  context.moveTo(0,canvas.height/2+3);
  context.lineTo(canvas.width,canvas.height/2);

  context.lineWidth=1;

  context.stroke();

  context.restore();
}