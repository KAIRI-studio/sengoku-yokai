"""Audit production sprite windows; add reviewed exclusion windows without editing art.
Source atlas pixels, anchors, scales, weapon extensions and feet remain unchanged.
Requires Pillow, NumPy and SciPy. Run from any directory.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import label,distance_transform_edt,binary_dilation
ROOT=Path(__file__).resolve().parents[1]
# These disconnected pieces are intentional extensions across atlas gutters.
PRESERVE={
 ('ashigaru',5):[(887,685,68,46)],('ashigaru',6):[(1330,690,77,46)],
 ('nobunaga',6):[(1330,805,92,47)],('yukimura',5):[(887,675,91,55)],
 ('kenshin',5):[(887,638,39,32)],('mitsuhide',5):[(887,806,16,14)],
 ('kazutoyo',6):[(1330,668,86,41),(827,773,60,57)]}
BRIDGES={('ashigaru',5):[[880,683,7,48]],('ashigaru',6):[[1323,683,7,54]],
 ('nobunaga',6):[[1323,805,7,47]],('yukimura',5):[[880,675,7,55]],
 ('kenshin',5):[[880,638,7,32]],('mitsuhide',5):[[880,806,7,14]],
 ('kazutoyo',6):[[1323,668,7,41],[887,773,8,57]]}
def atlas_path(id):
 p=ROOT/'assets'/f'motion-{id}-v050.webp'
 return p if p.exists() else ROOT/'assets'/f'motion-{id}-v100.webp'
def production_window(alpha,m,f):
 allow=np.zeros(alpha.shape,bool)
 for x,y,w,h in [m['rects'][f]]:allow[y:y+h,x:x+w]=True
 for x,y,w,h in m.get('holes',[[]]*8)[f]:allow[y:y+h,x:x+w]=False
 for x,y,w,h in m.get('extensions',{}).get(str(f),[])+m.get('bridges',{}).get(str(f),[]):allow[y:y+h,x:x+w]=True
 return allow

def build():
 meta=json.loads((ROOT/'motion-meta-v100.json').read_text());report=[]
 for id,m in meta.items():
  m['bridges']={str(f):rects for (hero,f),rects in BRIDGES.items() if hero==id}
  alpha=np.asarray(Image.open(atlas_path(id)).convert('RGBA'))[:,:,3];exclusions=[]
  for f in range(8):
   allow=production_window(alpha,m,f);labs,n=label(allow&(alpha>8),structure=np.ones((3,3)))
   counts=np.bincount(labs.ravel());counts[0]=0;body=counts.argmax();kept=labs==body;dist=distance_transform_edt(~kept);bad=[]
   for k in range(1,n+1):
    if k==body:continue
    ys,xs=np.where(labs==k);box=(int(xs.min()),int(ys.min()),int(xs.max()+1-xs.min()),int(ys.max()+1-ys.min()))
    if box in PRESERVE.get((id,f),[]) or dist[labs==k].min()<=3:kept|=labs==k
    else:bad.append((k,box))
   remove=np.isin(labs,[k for k,_ in bad]) if bad else np.zeros(alpha.shape,bool)
   remove=binary_dilation(remove,iterations=2)&~binary_dilation(kept,iterations=1) if bad else remove
   assert not (remove&kept).any(),(id,f,'exclusion would cut preserved art')
   # Encode the exact foreign silhouette as disjoint vertical-merged scanline windows.
   windows=[];active={}
   for yy in np.flatnonzero(remove.any(axis=1)):
    row=remove[yy];edges=np.diff(np.r_[False,row,False].astype(np.int8));runs=list(zip(np.where(edges==1)[0],np.where(edges==-1)[0]));next_active={}
    for xx,end in runs:
     key=(int(xx),int(end));prev=active.get(key)
     if prev is not None and windows[prev][1]+windows[prev][3]==yy:windows[prev][3]+=1;next_active[key]=prev
     else:next_active[key]=len(windows);windows.append([int(xx),int(yy),int(end-xx),1])
    active=next_active
   exclusions.append(windows)
   if windows:report.append({'id':id,'frame':f,'fragments':len(windows),'pixels':sum(int(counts[k]) for k,_ in bad),'exclusions':windows})
  m['exclusions']=exclusions
 (ROOT/'motion-meta-v183.json').write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':'))+'\n')
 (ROOT/'docs'/'sprite-audit-v183.json').write_text(json.dumps({'characters':len(meta),'frames':len(meta)*8,'affectedCharacters':len(set(r['id'] for r in report)),'affectedFrames':len(report),'removedComponents':sum(r['fragments'] for r in report),'findings':report},indent=2)+'\n')
 print(json.dumps({'characters':len(meta),'frames':len(meta)*8,'affectedCharacters':len(set(r['id'] for r in report)),'affectedFrames':len(report),'removedComponents':sum(r['fragments'] for r in report)}))
if __name__=='__main__':build()
