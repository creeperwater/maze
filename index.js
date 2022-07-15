//加载资源
var flag_img = new Image();
flag_img.src='asset/flag.jpg';
var bean_img = new Image();
bean_img.src='asset/bean.png';
var player_img_w = new Image();
player_img_w.src='asset/player-w.png';
var player_img_s = new Image();
player_img_s.src='asset/player-s.png';
var player_img_a = new Image();
player_img_a.src='asset/player-a.png';
var player_img_d = new Image();
player_img_d.src='asset/player-d.png';
var player_img=player_img_d;
//读取默认配置
var options=localStorage.getItem('options');
if(options){
  options=JSON.parse(options);
}else{
  options={math:'c',size:'a',sound:'c',music:'c'}
  localStorage.setItem('options',JSON.stringify(options));
}
for(i in options){
  $(`#opt-${i}-${options[i]}`).classList.add('active');
}
//绑定键盘事件
for(let i of $('#options li')){
  i.onclick=function(){
    options[this.id.split('-')[1]]=this.id.split('-')[2];
    localStorage.setItem('options',JSON.stringify(options))
    for(let j of this.parentElement.children){
      j.classList.remove('active');
    }
    this.classList.add('active');
  }
}
document.onkeydown=function (event) {
    event.key==' ' && begin();
};

//开始游戏进程
function begin(){
    init();
    switch(options.math){
        case 'd':
            creat_map1();break;
        case 't':
            creat_map2();break;
        case 'c':
            creat_map3();break;
    }
    draw_map();
    draw_face();
    $('#welcome').style.display='none';
    $('#sidebar').style.display='block';
    document.onkeydown=function (event) {//绑定键盘事件
        switch(event.key){
            case 'w':
                move('w');
                break;
            case 's':
                move('s');
                break;
            case 'a':
                move('a');
                break;
            case 'd':
                move('d');
                break;
            case ' ':
                add_speed();
                break;
            default:
                //pass
        }
    };
    setInterval(function(){if(run){//开始计时
        timer++;
        $('#timer').innerText=timer/10;
    }},100)
}

function init(){//初始化
  //计算宽高
  if(options.size=='c'){
      width=15,height=29;
  }else{
      width=parseInt(window.innerWidth/20);
      if(width%2==0){
          width-=1;
      }
      height=parseInt((window.innerHeight-30)/20);
      if(height%2==0){
          height-=1;
      }
      if(options.size=='s'){
          width>height?width=height:height=width;
      }
  }
  //生成数据矩阵
  arr1 =new Array(width);
  for(i=0;i<width;i++){
      arr1[i]=new Array(height).fill(1);
  }
  arr1[0][0]=0;
  arr2 =new Array(width);
  for(i=0;i<width;i++){
      arr2[i]=new Array(height).fill(0);
  }
  //生成画布
  canvas1=$('#canvas1');
  canvas1.width = width*20;
  canvas1.height = height*20;
  canvas1.style.left=`${(window.innerWidth-width*20)/2}px`;
  ctx1=canvas1.getContext('2d');
  canvas2=$('#canvas2');
  canvas2.width = width*20;
  canvas2.height = height*20;
  canvas2.style.left=`${(window.innerWidth-width*20)/2}px`;
  ctx2=canvas2.getContext('2d');
  //初始化基本参数
  player_loc = {x:0,y:0},flag_loc={x:0,y:0};
  timer = 0, speed = 1, bean_num=0;
  run = true;
}
function draw_map(){//绘制底层地图
  ctx1.clearRect(0, 0, width*20, height*20);
  for(var i=0;i<width;i++){
      for(var j=0;j<height;j++){
          switch(arr1[i][j]) {
              case 0:
                  ctx1.fillStyle='#ddd';
                  ctx1.fillRect(i*20,j*20,20,20);
                  break;
              case 1:
                  ctx1.fillStyle='#222';
                  ctx1.fillRect(i*20,j*20,20,20);
                  break;
              default:
                  //pass
          }
      }
  }
}
function draw_face(){//绘制表层刷新元素
  ctx2.clearRect(0, 0, width*20, height*20);
  for(var i=0;i<width;i++){
      for(var j=0;j<height;j++){
          if(arr2[i][j]==1){
              ctx2.drawImage(bean_img,i*20,j*20,20,20);
          }
      }
  }
  ctx2.drawImage(flag_img,flag_loc.x*20,flag_loc.y*20,20,20);
  ctx2.drawImage(player_img,player_loc.x*20,player_loc.y*20,20,20);
}
function move(key){if(run){for(var i=0;i<speed;i++){
  switch(key) {
      case 'w':
          if(player_loc.y-1>=0&&arr1[player_loc.x][player_loc.y-1]!=1){
                  player_loc.y-=2;
                  player_img=player_img_w;
          }
          break;
      case 's':
          if(player_loc.y+1<height&&arr1[player_loc.x][player_loc.y+1]!=1){
                  player_loc.y+=2;
                  player_img=player_img_s;
          }
          break;
      case 'a':
          if(player_loc.x-1>=0&&arr1[player_loc.x-1][player_loc.y]!=1){
                  player_loc.x-=2;
                  player_img=player_img_a;
          }
          break;
      case 'd':
          if(player_loc.x+1<width&&arr1[player_loc.x+1][player_loc.y]!=1){
                  player_loc.x+=2;
                  player_img=player_img_d;
          }
          break;
      default:
          //pass
  }
  if(arr2[player_loc.x][player_loc.y]){
      arr2[player_loc.x][player_loc.y]=0;
      bean_num++;
  }
  draw_face();
  if((player_loc.x==flag_loc.x)&&(player_loc.y==flag_loc.y)){
      over();
  }
}}}
function pause(){
  if($('#pause').style.display=='none'){
      $('#pause').style.display='flex';
      $('#wsad').style.display='none';
      run=false;
  }else{
      $('#pause').style.display='none';
      run=true;
  }
}
function over(){
  $('#sidebar').style.display='block';
  $('#over').style.display='flex';
  $('#wsad').style.display='none';
  run=false;
  $('#over-note').innerText=`吃豆人用${timer/10}秒完成了${width*height}格的迷宫，总计吃掉了${bean_num}颗豆子。`
}
function wsad(){if(run){
  if($('#wsad').style.display=='none'){
      $('#wsad').style.display='grid';
  }else{
      $('#wsad').style.display='none';
  }
}}
function add_speed(){if(run){
  speed==1?speed=4:speed=1;
  $('#speed').innerText=`x${speed}`;
  $('#add-speed').innerText=`x${speed}`;
}}
function docs_call(){
  if($('#docs').style.display=='none'){
    $('#options').style.display='none';
      $('#docs').style.display='flex';
  }else{
      $('#docs').style.display='none';
  }
}
function options_call(){
  if($('#options').style.display=='none'){
    $('#docs').style.display='none';
    $('#options').style.display='flex';
  }else{
    $('#options').style.display='none';
  }
}