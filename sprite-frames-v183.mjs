// Build a private, padded texture for each animation frame. Filtering can never
// sample adjacent atlas cells; reviewed cutouts remove foreign fragments inside.
const cache=new WeakMap();
export function frameBounds(meta,frame){
 const rects=[meta.rects[frame],...(meta.extensions?.[frame]||[]),...(meta.bridges?.[frame]||[])];
 const x=Math.max(0,Math.min(...rects.map(r=>r[0]))-2),y=Math.max(0,Math.min(...rects.map(r=>r[1]))-2);
 const right=Math.min(meta.width,Math.max(...rects.map(r=>r[0]+r[2]))+2),bottom=Math.min(meta.height,Math.max(...rects.map(r=>r[1]+r[3]))+2);
 return{x,y,width:right-x,height:bottom-y};
}
export function createSpriteFrame(image,meta,frame,makeCanvas=()=>document.createElement('canvas')){
 const bounds=frameBounds(meta,frame),canvas=makeCanvas(bounds.width,bounds.height);canvas.width=bounds.width;canvas.height=bounds.height;
 const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const copy=r=>ctx.drawImage(image,...r,r[0]-bounds.x,r[1]-bounds.y,r[2],r[3]);
 copy(meta.rects[frame]);
 for(const r of meta.holes?.[frame]||[])ctx.clearRect(r[0]-bounds.x,r[1]-bounds.y,r[2],r[3]);
 for(const r of meta.extensions?.[frame]||[])copy(r);
 for(const r of meta.bridges?.[frame]||[])copy(r);
 for(const r of meta.exclusions?.[frame]||[])ctx.clearRect(r[0]-bounds.x,r[1]-bounds.y,r[2],r[3]);
 return{...bounds,canvas};
}
export function spriteFrame(image,meta,frame,makeCanvas){
 let versions=cache.get(image);if(!versions){versions=new WeakMap();cache.set(image,versions)}
 let frames=versions.get(meta);if(!frames){frames=[];versions.set(meta,frames)}
 return frames[frame]??=createSpriteFrame(image,meta,frame,makeCanvas);
}
