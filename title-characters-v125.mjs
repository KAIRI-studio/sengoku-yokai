// Split disconnected figures without changing their alpha edges or baking a background.
export function splitCharacters({data,width,height},minimum=1000){
 const labels=new Int32Array(width*height),queue=new Int32Array(width*height),components=[];let label=0;
 for(let seed=0;seed<labels.length;seed++){if(labels[seed]||data[seed*4+3]<2)continue;let head=0,tail=1,left=width,right=0,top=height,bottom=0;queue[0]=seed;labels[seed]=++label;
  while(head<tail){const n=queue[head++],x=n%width,y=Math.floor(n/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(const q of [x>0?n-1:-1,x<width-1?n+1:-1,y>0?n-width:-1,y<height-1?n+width:-1])if(q>=0&&!labels[q]&&data[q*4+3]>=2){labels[q]=label;queue[tail++]=q}}
  if(tail>=minimum)components.push({label,left,top,width:right-left+1,height:bottom-top+1,count:tail})
 }
 return components.sort((a,b)=>a.left-b.left).map(c=>{const pixels=new Uint8ClampedArray(c.width*c.height*4);for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const from=(y+c.top)*width+x+c.left;if(labels[from]===c.label)pixels.set(data.subarray(from*4,from*4+4),(y*c.width+x)*4)}return{...c,pixels}})
}
export const TITLE_FIGURES=Object.freeze([
 {id:'nobunaga',x:-5,bottom:480,height:325,kind:0,phase:.2},
 {id:'yukimura',x:185,bottom:450,height:245,kind:1,phase:1.7},
 {id:'kenshin',x:639,bottom:485,height:205,kind:2,phase:3.1},
 {id:'kappa',x:826,bottom:414,height:130,kind:3,phase:2.2},
 {id:'oni',x:895,bottom:423,height:151,kind:4,phase:4.8}
].map(Object.freeze));
export const VERTEX=`attribute vec2 aUV;uniform vec4 uRect;uniform vec2 uViewport;uniform float uTime,uKind,uPhase,uShadow;varying vec2 vUV;
void main(){vec2 uv=aUV;vec2 p=uRect.xy+uv*uRect.zw;float t=uTime+uPhase;float upper=1.0-smoothstep(.7,1.0,uv.y);
if(uShadow<.5){float breathe=sin(t*(uKind<3.0?2.1:2.8));p.y-=breathe*(uKind<3.0?2.5:2.0)*upper;p.x+=(uv.x-.5)*breathe*1.5*upper;
float side=uKind==2.0?smoothstep(.5,1.0,uv.x):1.0-smoothstep(.0,.5,uv.x);float cape=side*smoothstep(.28,.55,uv.y)*(1.0-smoothstep(.78,.98,uv.y));if(uKind<3.0){p.x+=sin(t*2.6+uv.y*7.0)*cape*(uKind==1.0?2.5:5.0);p.y+=sin(t*2.6+uv.x*5.0)*cape*1.8;}
else{float hop=pow(max(0.0,sin(t*1.65)),8.0);p.y-=hop*(uKind==3.0?6.0:4.0);float arm=abs(uv.x-.5)*2.0*(1.0-smoothstep(.3,.62,uv.y));p.y+=sin(t*3.0)*arm*2.2;}}
vUV=uv;gl_Position=vec4(p.x/uViewport.x*2.0-1.0,1.0-p.y/uViewport.y*2.0,0,1);}`;
export const FRAGMENT=`precision mediump float;uniform sampler2D uTexture;uniform float uShadow;varying vec2 vUV;void main(){if(uShadow>.5){float d=length((vUV-.5)*2.0);gl_FragColor=vec4(.29,.19,.1,(1.0-smoothstep(.1,1.0,d))*.19);}else{gl_FragColor=texture2D(uTexture,vUV);}}`;
