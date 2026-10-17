// Foot centres measured from the opaque bottom 8% of each trimmed standing image.
export const FOOT_ANCHORS={mitsuhide:.448,hideyoshi:.478,motonari:.586,toshiie:.402,yoshihiro:.477,nobunaga:.632,yukimura:.413,masamune:.503,kenshin:.518,hanzo:.636,ashigaru:.390,shingen:.513,kazutoyo:.366,ieyasu:.477,kanbei:.525,naomasa:.451};
export function characterPlacement(width,height,anchor=.5){const h=330,w=width/height*h;return{x:340-w*anchor,y:80,w,h,ground:410,footX:340};}
