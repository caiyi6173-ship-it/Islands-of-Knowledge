/* Frame the inhabited islands, leaving the illustration's outer sea to bleed offscreen. */
(() => {
  function worldFit(width,height){
    const t=Math.max(0,Math.min(1,(height-320)/100));
    const framingHeight=1000-160*t*t*(3-2*t);
    return Math.min(width/1440,height/framingHeight);
  }
  function stationScale(mapScale,width,height){
    const screenScale=width<=700||height<=340?.54:.68;
    return screenScale/mapScale;
  }
  function islandScale(mapScale,width,height){return (width<=700||height<=340?.52:.9)/mapScale;}
  const api={worldFit,stationScale,islandScale};
  if(typeof module!=='undefined')module.exports=api;
  if(typeof window!=='undefined')window.AtlasMapCamera=api;
})();
