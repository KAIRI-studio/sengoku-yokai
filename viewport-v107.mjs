// All positions use one coordinate system: the currently visible browser viewport.
export function viewportLayout({width,height,left=0,top=0,insets={}}){
 const w=Math.max(1,width),h=Math.max(1,height),safeX=Math.max(0,insets.left||0,insets.right||0),safeTop=Math.max(0,insets.top||0),safeBottom=Math.max(0,insets.bottom||0);
 const availableWidth=Math.max(1,w-safeX*2),availableHeight=Math.max(1,h-safeTop-safeBottom),gameWidth=Math.min(availableWidth,availableHeight*1672/941),gameHeight=gameWidth*941/1672;
 const sideWidth=Math.max(0,(w-gameWidth)/2),gameLeft=left+sideWidth,gameTop=top+safeTop+(availableHeight-gameHeight)/2;
 return {game:{left:gameLeft,top:gameTop,width:gameWidth,height:gameHeight},left:{left,top:gameTop,width:sideWidth,height:gameHeight},right:{left:gameLeft+gameWidth,top:gameTop,width:sideWidth,height:gameHeight}};
}
