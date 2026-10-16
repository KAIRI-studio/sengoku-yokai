// Positions are expressed in a fixed scene space, independent of cursor and frame rate.
export const CLOUDS=Object.freeze([
 {x:105,y:32,width:200,speed:6.4,alpha:.96},
 {x:665,y:54,width:180,speed:4.5,alpha:.91},
 {x:400,y:113,width:125,speed:2.8,alpha:.78},
 {x:-150,y:78,width:155,speed:5.2,alpha:.88}
].map(Object.freeze));
export function cloudPosition(cloud,seconds,sceneWidth=1000){
 const span=sceneWidth+cloud.width*2;
 return ((cloud.x+seconds*cloud.speed+cloud.width)%span+span)%span-cloud.width;
}
