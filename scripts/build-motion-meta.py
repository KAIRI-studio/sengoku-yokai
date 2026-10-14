from PIL import Image
import numpy as np,json
from scipy.ndimage import label
from pathlib import Path
r=Path(__file__).resolve().parents[1]
boundaries={'ashigaru':500,'nobunaga':460,'yukimura':480,'kenshin':468,'mitsuhide':450,'kazutoyo':478,'kappa':458,'oni':445,'tengu':435}
meta={}
for id,boundary in boundaries.items():
 im=Image.open(r/'assets'/('motion-'+id+'-v050.webp'));a=np.asarray(im)[:,:,3];w,h=im.size;c=w/4;feet=[];anchors=[];heads=[];rects=[];holes=[]
 for f in range(8):
  x=round(f%4*c);y=8 if f<4 else boundary;end=boundary if f<4 else h-8;cw=round(c);m=a[y:end,x+8:min(w,x+cw-8)]>110;l,n=label(m);sizes=np.bincount(l.ravel());sizes[0]=0;ys,xs=np.where(l==sizes.argmax());bottom=int(ys.max())+y;top=int(ys.min())+y;feet.append(bottom);rects.append([int(xs.min())+x+8,top,int(xs.max()-xs.min()+1),bottom-top+1])
  frameholes=[]
  for q in range(1,n+1):
   if q==sizes.argmax() or sizes[q]<100:continue
   oy,ox=np.where(l==q);xx0=max(int(xs.min()),int(ox.min())-2);xx1=min(int(xs.max()),int(ox.max())+2);yy0=max(int(ys.min()),int(oy.min())-2);yy1=min(int(ys.max()),int(oy.max())+2)
   if xx1>=xx0 and yy1>=yy0 and not np.any(l[yy0:yy1+1,xx0:xx1+1]==sizes.argmax()):frameholes.append([xx0+x+8,yy0+y,xx1-xx0+1,yy1-yy0+1])
  holes.append(frameholes)
  if f<4:
   fx=xs[ys>=ys.max()-30];anchors.append((float(fx.min())+float(fx.max()))/2+8);heads.append(bottom-top)
 meta[id]={'width':w,'height':h,'feet':feet,'rects':rects,'holes':holes,'anchor':round(float(np.median(anchors)),2),'head':round(float(np.median(heads)),2)}
meta['nobunaga']['extensions']={'6':[[1330,775,77,65]]}
meta['yukimura']['extensions']={'5':[[887,675,58,55]]}
meta['ashigaru']['extensions']={'0':[[435,255,14,48]],'5':[[887,685,58,54]],'6':[[1330,685,67,54]]}
meta['kazutoyo']['extensions']={'6':[[1330,665,70,60]]}
meta['mitsuhide']['extensions']={'5':[[887,775,16,55]]}
meta['tengu']['flipped']=[5]
(r/'motion-meta-v050.json').write_text(json.dumps(meta,ensure_ascii=False))
print(json.dumps({k:{'feet':v['feet'],'anchor':v['anchor'],'head':v['head']} for k,v in meta.items()}))
