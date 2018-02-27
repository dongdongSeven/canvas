var WINDOW_WIDTH=300;
var WINDOW_HEIGHT=100;
var RADIUS=8;
var MARIN_TOP=60;
var MARGIN_LEFT=30;

// const endTime=new Date();//可以这样设置时间
var curShowTimeSeconds=0;//当前距离设定时间的秒数

var balls=[];
const colors=['#33B3E5','#0099CC','#AA66CC','#9933CC','#99CC00','#669900','#FFBB33','#FF8800','#FF4444','#CC0000'];

window.onload=function(){
  //自适应屏幕
  // WINDOW_WIDTH=document.body.clientWidth||document.documentElement.clientWidth;
  // WINDOW_HEIGHT=document.documentElement.clientHeight||document.body.clientHeight;

  MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
  RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;

  MARIN_TOP=Math.round(WINDOW_HEIGHT/5);

  var canvas=document.getElementById("canvas");
  var context=canvas.getContext("2d");
  canvas.width=WINDOW_WIDTH;
  canvas.height=WINDOW_HEIGHT;

  curShowTimeSeconds=getCurrentShowTimeSeconds();
  setInterval(function(){
    render(context);//负责画
    update();//负责数据的改变
  },50);
}
/**
 * [update 下次时间距离设定时间的秒数与当前时间距离设定时间的秒数是否一致，来改变时间]
 * @return {[type]} [description]
 */
function update(){
  var nextShowTimeSeconds=getCurrentShowTimeSeconds();

  var nextHours=parseInt(nextShowTimeSeconds/3600);
  var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
  var nextSeconds=nextShowTimeSeconds%60; 

  var curHours=parseInt(curShowTimeSeconds/3600);
  var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
  var curSeconds=curShowTimeSeconds%60; 

  if(nextSeconds != curSeconds){
    if(parseInt(curHours/10)!=parseInt(nextHours/10)){
      addBalls(MARGIN_LEFT+0,MARIN_TOP,parseInt(curHours/10));
    }
    if(parseInt(curHours%10)!=parseInt(nextHours%10)){
      addBalls(MARGIN_LEFT+15*(RADIUS+1),MARIN_TOP,parseInt(curHours/10));
    }
    if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
      addBalls(MARGIN_LEFT+39*(RADIUS+1),MARIN_TOP,parseInt(curHours/10));
    }
    if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
      addBalls(MARGIN_LEFT+54*(RADIUS+1),MARIN_TOP,parseInt(curMinutes%10));
    }
    if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
      addBalls(MARGIN_LEFT+78*(RADIUS+1),MARIN_TOP,parseInt(curSeconds/10));
    }
    if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
      addBalls(MARGIN_LEFT+93*(RADIUS+1),MARIN_TOP,parseInt(nextSeconds%10));
    }
    curShowTimeSeconds=nextShowTimeSeconds;
  }
  updateBalls();
}
/**
 * [updateBalls 小球运动]
 * @return {[type]} [description]
 */
function updateBalls(){
  for(var i=0;i<balls.length;i++){
    balls[i].x+=balls[i].vx/5;
    balls[i].y+=balls[i].vy;
    balls[i].vy+=balls[i].g;

    if(balls[i].y>=WINDOW_HEIGHT - RADIUS){
      balls[i].y=WINDOW_HEIGHT - RADIUS;
      balls[i].vy=-balls[i].vy*0.6;
    }
  }
  //优化性能，删除多的彩球
  var cnt=0;
  for(var i=0;i<balls.length;i++)
    if(balls[i].x+RADIUS>0&&balls[i].x - RADIUS< WINDOW_WIDTH)
      balls[cnt++]=balls[i];

  while(balls.length>Math.min(300,cnt)){//Math.min()取小的数
    balls.pop();
  }
}
/**
 * [addBalls 增加小球]
 * @param {[type]} x   [margin-left]
 * @param {[type]} y   [margin-top]
 * @param {[type]} num [0-9数字模型]
 */
function addBalls(x,y,num){
  for(var i=0;i<digit[num].length;i++){
    for(var j=0;j<digit[num][i].length;j++){
      if(digit[num][i][j]==1){
        var aBall={
          x:x+j*2*(RADIUS+1)+(RADIUS+1),
          y:y+i*2*(RADIUS+1)+(RADIUS+1),
          g:1.5+Math.random(),
          vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//-1的随机次方，均分正负
          vy:-5,
          color:colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(aBall);
      }
    }
  }
}
/**
 * [getCurrentShowTimeSeconds 获取距离设定时间的秒数]
 * @return {[type]} [description]
 */
function getCurrentShowTimeSeconds(){
  //倒计时
  var curTime=new Date();
  // var ret=endTime.getTime()-curTime.getTime();
  // ret=Math.round(ret/1000);
  //当前时间
  var curHours=curTime.getHours()*60*60;
  var curMinutes=curTime.getMinutes()*60;
  var curSeconds=curTime.getSeconds();
  var ret=curHours+curMinutes+curSeconds;

  return ret>=0?ret:0;
}
/**
 * [render 绘制时钟和彩色小球]
 * @param  {[type]} cxt [绘制上下文]
 * @return {[type]}     [description]
 */
function render(cxt){
  cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

  var hours=parseInt(curShowTimeSeconds/3600);
  var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
  var seconds=curShowTimeSeconds%60;

  renderDigit(MARGIN_LEFT,MARIN_TOP,parseInt(hours/10),cxt);
  renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARIN_TOP,parseInt(hours%10),cxt);
  renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARIN_TOP,10,cxt);
  renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARIN_TOP,parseInt(minutes/10),cxt);
  renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARIN_TOP,parseInt(minutes%10),cxt);
  renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARIN_TOP,10,cxt);
  renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARIN_TOP,parseInt(seconds/10),cxt);
  renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARIN_TOP,parseInt(seconds%10),cxt);

  for(var i=0;i<balls.length;i++){
    cxt.fillStyle=balls[i].color;

    cxt.beginPath();
    cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
    cxt.closePath();

    cxt.fill();
  }
}
/**
 * [renderDigit 绘制时钟小球]
 * @param  {[type]} x   [margin-left]
 * @param  {[type]} y   [margin-top]
 * @param  {[type]} num [0-9数字模型]
 * @param  {[type]} cxt [绘图上下文]
 * @return {[type]}     [description]
 */
function renderDigit(x,y,num,cxt){
  cxt.fillStyle="rgb(0,102,153)";

  for(var i=0;i<digit[num].length;i++){
    for(var j=0;j<digit[num][i].length;j++){
      if(digit[num][i][j]==1){
        cxt.beginPath();
        cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
        cxt.closePath();

        cxt.fill();
      }
    }
  }
}
