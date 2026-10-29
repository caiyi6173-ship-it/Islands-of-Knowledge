/* The arrival camera ends at the live map's exact screen rectangle. */
(() => {
  const camera=typeof module!=='undefined'?require('./map-camera.js'):window.AtlasMapCamera;
  const duration=7000;
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
  const between=(p,a,b)=>smooth((p-a)/(b-a));
  const mix=(a,b,t)=>t===1?b:a+(b-a)*t;
  function frame(progress,width,height,rect){
    const p=clamp(progress),launch=between(p,0,.25),rise=between(p,.34,.88),settle=between(p,.74,1);
    const scale=camera.worldFit(rect.width,rect.height);
    const endX=rect.left+rect.width/2,endY=rect.top+rect.height/2;
    const bank=Math.sin(Math.PI*between(p,.13,.85));
    return {
      progress:p,launch,rise,
      mapScale:mix(scale*3.55,scale,rise),
      centerX:mix(width*.56+Math.sin(p*Math.PI*1.6)*width*.07,endX,settle),
      centerY:mix(height*.88,height*.54,rise)*(1-settle)+endY*settle,
      pitch:mix(57,0,rise),roll:-2.2*bank*(1-settle),
      mapOpacity:between(p,.29,.61),
      mapMaskStart:mix(40,100,between(p,.48,.9)),
      mapMaskEnd:mix(70,140,between(p,.48,.9)),
      panoramaOpacity:1-between(p,.37,.66),
      panoramaScale:1+launch*.38+rise*.22,
      panoramaY:launch*height*.1-rise*height*.2,
      dockY:launch*height*.7,dockScale:1+launch*.55,
      waterTravel:p*height*1.8,
      mist:Math.sin(Math.PI*between(p,.16,.82))*.72,
      skyOpacity:1-between(p,.77,.97),
      uiOpacity:between(p,.87,1),
      copyOpacity:1-between(p,0,.13),
      chapter:p<.2?'离开好奇心港湾':p<.46?'沿着风，掠过海面':p<.78?'升高一点，看见整个群岛':'把下一次提问，交给你',
    };
  }
  const api={duration,frame,smooth};
  if(typeof module!=='undefined')module.exports=api;
  if(typeof window!=='undefined')window.AtlasHarborFlight=api;
})();
