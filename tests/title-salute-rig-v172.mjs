export const period=4500,shoulder=[550,640],upperPivot=[336,366],elbowPivot=[330,438],armScale=.69;
const keys=[[0,0,0],[850,0,0],[1100,2,-4],[1700,-66,-15],[1900,-65,-15],[2500,-65,-15],[3300,0,0],[4500,0,0]];
export function poseAt(ms){
  const t=ms%period;let a=keys[0],b=keys[1];
  for(let i=1;i<keys.length;i++){b=keys[i];if(t<=b[0])break;a=b}
  const p=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))),e=p*p*(3-2*p);
  return {shoulder:a[1]+(b[1]-a[1])*e,elbow:a[2]+(b[2]-a[2])*e};
}
export function rotate(x,y,angle){const a=angle*Math.PI/180;return[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]}
export function joints(pose){
  const d=rotate((elbowPivot[0]-upperPivot[0])*armScale,(elbowPivot[1]-upperPivot[1])*armScale,pose.shoulder);
  return {elbow:[shoulder[0]+d[0],shoulder[1]+d[1]],foreAngle:pose.shoulder+pose.elbow-3};
}
export function forePoint(point,pose){const j=joints(pose),d=rotate((point[0]-elbowPivot[0])*armScale,(point[1]-elbowPivot[1])*armScale,j.foreAngle);return[j.elbow[0]+d[0],j.elbow[1]+d[1]]}
