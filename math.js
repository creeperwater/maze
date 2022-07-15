//使用深搜创建地图
function creat_map1(){//主函数
    var direction=[{x:0,y:-2},{x:0,y:2},{x:-2,y:0},{x:2,y:0}];
    var tree=[],player={x:0,y:0},target={x:0,y:0},deep=0,deep_max=0;
    do{
        if(explore()){
            tree[deep]={x:player.x,y:player.y};//记录本层点
            if(deep>deep_max){
                deep_max=deep;
                flag_loc.x=target.x;
                flag_loc.y=target.y;
            }
            deep++;//探索深层
        }else{
            deep--;//回退层数
            target.x=tree[deep].x,target.y=tree[deep].y;//回退目标位置
        }
    }while(deep>0);
    function explore(){//配套探索函数
        player.x=target.x,player.y=target.y;//将玩家位置移动到上次生成的目标位置
        direction.sort(function(){return 0.5-Math.random()});//生成方向随机列表
        for(var i=0;i<4;i++){
            target.x=player.x,target.y=player.y;//试探器目标位置还原
            target.x+=direction[i].x;
            target.y+=direction[i].y;
            if(target.x>=0&&target.x<width&&target.y>=0&&target.y<height){
                if(arr1[target.x][target.y]==1){
                    arr1[(player.x+target.x)/2][(player.y+target.y)/2]=0;
                    arr1[target.x][target.y]=0;
                    return true;//找到可行目标位置，结束递归回true
                }
            }
        }
        return false;//无可行目标位置，结束递归回false
    }
}

function creat_map2(){//主函数
    for(var i=0;i<width;i++){
        arr1[i]=new Array(height).fill(0);
    }
    cut({x1:0,x2:width,y1:0,y2:height});
    function cut(area){
        if(area.x2-area.x1<3||area.y2-area.y1<3){
            return;
        }
        do{
            var cut_x=Math.floor(Math.random()*(area.x2-area.x1-2))+area.x1+1;
            var cut_y=Math.floor(Math.random()*(area.y2-area.y1-2))+area.y1+1;
        }while(cut_x%2==0||cut_y%2==0);  
        for(var i=area.x1;i<area.x2;i++){
            arr1[i][cut_y]=1;
        }
        for(var i=area.y1;i<area.y2;i++){
            arr1[cut_x][i]=1;
        }
        var line=[
            {x1:cut_x,x2:cut_x+1,y1:area.y1,y2:cut_y},//上
            {x1:cut_x,x2:cut_x+1,y1:cut_y+1,y2:area.y2},//下
            {x1:area.x1,x2:cut_x,y1:cut_y,y2:cut_y+1},//左
            {x1:cut_x+1,x2:area.x2,y1:cut_y,y2:cut_y+1}//右
        ];
        line.sort(function(){return 0.5-Math.random()});
        for(var i=0;i<3;i++){
            do{
                var door={x:Math.floor(Math.random()*(line[i].x2-line[i].x1))+line[i].x1,y:Math.floor(Math.random()*(line[i].y2-line[i].y1))+line[i].y1};
            }while(door.x%2==1&&door.y%2==1);
            arr1[door.x][door.y]=0;
        }
        cut({x1:area.x1,x2:cut_x,y1:area.y1,y2:cut_y});//左上
        cut({x1:cut_x+1,x2:area.x2,y1:area.y1,y2:cut_y});//右上
        cut({x1:area.x1,x2:cut_x,y1:cut_y+1,y2:area.y2});//左下
        cut({x1:cut_x+1,x2:area.x2,y1:cut_y+1,y2:area.y2});//右下
    }
}
function creat_map3(){
    var direct=[{x:0,y:-2},{x:0,y:2},{x:-2,y:0},{x:2,y:0}];
    var visit=[{x:0,y:0}],now={x:0,y:0},target={x:0,y:0};
    while(visit.length<(Math.ceil(width/2)*Math.ceil(height/2))){
        direct.sort(function(){return 0.5-Math.random()});
        for(var i=0;i<4;i++){
            target.x=now.x+direct[i].x;
            target.y=now.y+direct[i].y;
            if(target.x>=0&&target.x<width&&target.y>=0&&target.y<height&&arr1[target.x][target.y]==1){
                arr1[target.x][target.y]=0;
                arr1[(target.x+now.x)/2][(target.y+now.y)/2]=0;
                visit.push({x:target.x,y:target.y});
                break;
            }
        }
        var index=Math.floor(Math.random()*visit.length);
        now.x=visit[index].x;
        now.y=visit[index].y;
    }
    flag_loc={x:width-1,y:height-1}
}
//使用广搜寻找路径
function solve(){//主函数
    const direction=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
    var tree=[{x:player_loc.x,y:player_loc.y,f:-1}];
    var visit =new Array(width);
    for(var i=0;i<width;i++){
        visit[i]=new Array(height).fill(0);
    }
    visit[player_loc.x][player_loc.y]=1;
    var front=0;
    var target={x:0,y:0};
    var flag=1;
    while(front<tree.length&&flag){
        for(var i=0;i<4;i++){
            target.x=tree[front].x+direction[i].x;
            target.y=tree[front].y+direction[i].y;
            if(target.x>=0&&target.x<width&&target.y>=0&&target.y<height&&arr1[target.x][target.y]<=0&&visit[target.x][target.y]==0){
                tree.push({x:target.x,y:target.y,f:front});
                visit[target.x][target.y]=1;
                if((target.x==flag_loc.x)&&(target.y==flag_loc.y)){
                    flag=0;
                    break;
                }
            }
        }
        front++;
    }
    mark_path(tree[tree.length-1]);
    function mark_path(target){//配套数据输入函数
        arr2[target.x][target.y]=1;
        if(target.f!=-1){
            mark_path(tree[target.f]);
        }
    }
    arr2[player_loc.x][player_loc.y]=0;
}