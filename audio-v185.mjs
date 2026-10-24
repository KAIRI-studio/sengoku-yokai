const KEY='sengoku-yokai-audio-v184';
export const DEFAULT_AUDIO=Object.freeze({bgm:.25,se:.65,muted:false});
export const AUDIO_FILES=Object.freeze(Object.fromEntries(['home','battle','button','attack','skill','gacha','correct','wrong','win','lose'].map(name=>[name,new URL(`./assets/audio-v184/${name}.mp3`,import.meta.url).href])));
export const CUES=Object.freeze({
 button:{gain:.72,gap:55,limit:2,group:'ui',age:600,duration:.8},
 attack:{gain:.5,gap:160,limit:2,group:'battle',age:180,duration:.55},
 skill:{gain:.95,gap:250,limit:1,group:'battle',age:1200,duck:.4,duckMs:1350},
 gacha:{gain:.95,gap:250,limit:1,group:'ui',age:1200,duck:.6,duckMs:1000},
 correct:{gain:.95,gap:250,limit:1,group:'ui',age:1000,duck:.6,duckMs:1200},
 wrong:{gain:.85,gap:250,limit:1,group:'ui',age:1000,duck:.7,duckMs:700},
 win:{gain:1,gap:500,limit:1,group:'result',age:2500},
 lose:{gain:1,gap:500,limit:1,group:'result',age:2500}
});
const clamp=(n,fallback)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):fallback;
export function readAudioSettings(storage){try{const x=JSON.parse(storage?.getItem(KEY)||'null');if(x&&typeof x==='object')return{bgm:clamp(x.bgm,DEFAULT_AUDIO.bgm),se:clamp(x.se,DEFAULT_AUDIO.se),muted:x.muted===true}}catch{}return{...DEFAULT_AUDIO}}
export function configurePlaybackSession(nav=globalThis.navigator){try{if(nav?.audioSession)nav.audioSession.type='playback'}catch{}}
export class GameAudio{
 constructor({storage,contextFactory,fetcher,now,preload=true}={}){
  this.storage=storage;this.settings=readAudioSettings(storage);this.factory=contextFactory||(()=>{const C=globalThis.AudioContext||globalThis.webkitAudioContext;return C?new C():null});this.fetcher=fetcher||globalThis.fetch?.bind(globalThis);this.now=now||(()=>performance.now());this.preload=preload;this.ctx=null;this.unlocked=false;this.unlocking=null;this.scene='home';this.paused=false;this.hidden=false;this.finished=false;this.music=null;this.offsets={home:0,battle:0};this.buffers=new Map();this.voices=new Set();this.lastCue=new Map();this.epochs={ui:0,battle:0,result:0};this.musicRequest=0;this.listeners=new Set();this.duckTimer=null;
 }
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
 changed(){for(const fn of this.listeners)fn({...this.settings})}
 save(){try{this.storage?.setItem(KEY,JSON.stringify(this.settings))}catch{}this.changed()}
 async unlock(){
  configurePlaybackSession();
  if(this.unlocking&&this.ctx?.state==='running')return this.unlocking;
  this.unlocking=(async()=>{try{
   if(!this.ctx){this.ctx=this.factory();if(!this.ctx)return false;this.bgmGain=this.ctx.createGain();this.duckGain=this.ctx.createGain();this.seGain=this.ctx.createGain();const limiter=this.ctx.createDynamicsCompressor?.();if(limiter){limiter.threshold.value=-7;limiter.knee.value=9;limiter.ratio.value=12;limiter.attack.value=.004;limiter.release.value=.12;limiter.connect(this.ctx.destination)}this.bgmGain.connect(this.duckGain);this.duckGain.connect(limiter||this.ctx.destination);this.seGain.connect(limiter||this.ctx.destination);this.applyVolumes()}
   const resumed=this.ctx.resume();
   if(!this.primed&&this.ctx.createBuffer){const source=this.ctx.createBufferSource();source.buffer=this.ctx.createBuffer(1,1,this.ctx.sampleRate||44100);source.connect(this.ctx.destination);source.onended=()=>source.disconnect();source.start(0);this.primed=true}
   await resumed;this.unlocked=this.ctx.state==='running';if(!this.unlocked)return false;void this.syncMusic();if(this.preload)void Promise.allSettled(Object.keys(CUES).map(n=>this.buffer(n)));return true;
  }catch{return false}})();try{return await this.unlocking}finally{this.unlocking=null}
 }
 async buffer(name){
  if(!this.ctx||!this.fetcher)throw Error('Audio unavailable');
  if(!this.buffers.has(name)){const request=this.fetcher(AUDIO_FILES[name]).then(r=>{if(!r.ok)throw Error('Audio load failed');return r.arrayBuffer()}).then(b=>this.ctx.decodeAudioData(b)).catch(e=>{this.buffers.delete(name);throw e});this.buffers.set(name,request)}return this.buffers.get(name);
 }
 applyVolumes(){if(!this.ctx)return;this.bgmGain.gain.value=this.settings.muted?0:this.settings.bgm;this.seGain.gain.value=this.settings.muted?0:this.settings.se}
 setVolume(channel,value){if(channel!=='bgm'&&channel!=='se')return;this.settings[channel]=clamp(value,this.settings[channel]);this.applyVolumes();if(channel==='bgm')void this.syncMusic();this.save()}
 setMuted(value){this.settings.muted=!!value;this.applyVolumes();if(this.settings.muted)this.stopEffects();void this.syncMusic();this.save()}
 desiredMusic(){return !this.settings.muted&&!this.hidden&&!this.paused&&!this.finished&&this.settings.bgm>0?this.scene:null}
 setScene(scene){if(!['home','battle',null].includes(scene))return;if(this.scene!==scene){this.stopEffects('battle');this.stopEffects('result');this.finished=false;this.paused=false}this.scene=scene;for(const name of ['home','battle'])if(name!==scene)this.buffers.delete(name);void this.syncMusic()}
 beginBattle(){this.stopEffects('battle');this.stopEffects('result');this.stopMusic(false);this.offsets.battle=0;this.buffers.delete('home');this.scene='battle';this.finished=false;this.paused=false;void this.syncMusic()}
 setPaused(value){this.paused=!!value;if(this.paused)this.stopEffects('battle');void this.syncMusic()}
 setHidden(value){this.hidden=!!value;if(this.hidden){this.stopEffects();void this.syncMusic()}else if(this.unlocked){void this.ctx?.resume().then(()=>this.syncMusic()).catch(()=>{})}}
 stopMusic(preserve=true){const m=this.music;if(!m)return;this.music=null;if(preserve)this.offsets[m.name]=(m.offset+Math.max(0,this.ctx.currentTime-m.startedAt))%m.buffer.duration;else this.offsets[m.name]=0;try{m.source.stop();m.source.disconnect()}catch{}}
 async syncMusic(){
  const request=++this.musicRequest,name=this.desiredMusic();if(!this.unlocked||!this.ctx||!name){this.stopMusic();return}if(this.music?.name===name)return;this.stopMusic();
  try{const buffer=await this.buffer(name);if(request!==this.musicRequest||this.desiredMusic()!==name)return;const source=this.ctx.createBufferSource();source.buffer=buffer;source.loop=true;source.playbackRate.value=1;source.connect(this.bgmGain);const offset=this.offsets[name]%buffer.duration;this.music={name,source,buffer,offset,startedAt:this.ctx.currentTime};source.start(0,offset)}catch{}
 }
 duck(value,duration){if(!this.ctx)return;clearTimeout(this.duckTimer);this.duckGain.gain.cancelScheduledValues(this.ctx.currentTime);this.duckGain.gain.setTargetAtTime(value,this.ctx.currentTime,.035);this.duckTimer=setTimeout(()=>{this.duckGain?.gain.setTargetAtTime(1,this.ctx.currentTime,.15)},duration);this.duckTimer.unref?.()}
 async effect(name){
  const cue=CUES[name];if(!cue||!this.unlocked||this.settings.muted||this.settings.se<=0||this.hidden||cue.group==='battle'&&(this.paused||this.finished||this.scene!=='battle'))return false;
  const requested=this.now(),last=this.lastCue.get(name)??-Infinity;if(requested-last<cue.gap)return false;this.lastCue.set(name,requested);const epoch=this.epochs[cue.group];
  try{const buffer=await this.buffer(name);if(this.now()-requested>cue.age||this.epochs[cue.group]!==epoch||this.settings.muted||this.hidden||this.settings.se<=0)return false;
   const same=[...this.voices].filter(v=>v.name===name);if(same.length>=cue.limit){if(name==='attack'||name==='button')return false;for(const old of same)this.stopVoice(old)}
   if(this.voices.size>=6){if(name==='attack'||name==='button')return false;this.stopVoice([...this.voices].find(v=>v.name==='attack')||this.voices.values().next().value)}
   const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=buffer;source.playbackRate.value=1;gain.gain.value=cue.gain;source.connect(gain);gain.connect(this.seGain);const voice={name,group:cue.group,source,gain};this.voices.add(voice);source.onended=()=>{this.voices.delete(voice);try{source.disconnect();gain.disconnect()}catch{}};
   if(cue.duck)this.duck(cue.duck,cue.duckMs);source.start();if(cue.duration&&buffer.duration>cue.duration){const end=this.ctx.currentTime+cue.duration;gain.gain.setValueAtTime(cue.gain,Math.max(this.ctx.currentTime,end-.07));gain.gain.linearRampToValueAtTime(0,end);source.stop(end)}return true;
  }catch{return false}
 }
 stopVoice(voice){if(!voice)return;this.voices.delete(voice);try{voice.source.stop();voice.source.disconnect();voice.gain.disconnect()}catch{}}
 stopEffects(group){if(group)this.epochs[group]++;else for(const key of Object.keys(this.epochs))this.epochs[key]++;for(const voice of [...this.voices])if(!group||voice.group===group)this.stopVoice(voice)}
 finishBattle(result){if(this.finished)return;this.finished=true;this.stopEffects('battle');this.stopEffects('result');void this.syncMusic();void this.effect(result==='win'?'win':'lose')}
}
let storage;try{storage=globalThis.localStorage}catch{}
export const gameAudio=new GameAudio({storage});
