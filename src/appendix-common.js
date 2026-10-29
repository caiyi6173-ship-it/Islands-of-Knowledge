(() => {
  const value=(p,k,f)=>p[k]===undefined?f:p[k];
  function number(v,lo,hi){if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError('Outside appendix model');return v;}
  function integer(v,lo,hi){number(v,lo,hi);if(!Number.isInteger(v))throw new RangeError('Integer required');return v;}
  function choice(v,options){if(!options.includes(v))throw new RangeError('Unknown appendix choice');return v;}
  function list(v,convert,max=16){if(!Array.isArray(v)||v.length>max)throw new RangeError('Invalid appendix steps');return v.map(convert);}
  const near=(a,b,eps=1e-7)=>Math.abs(a-b)<=eps;
  const chain=(actual,expected)=>JSON.stringify(actual)===JSON.stringify(expected);
  function result(goal,measurement,readings,feedback,fixed={},factParams){return {legal:true,referenceValid:true,goalSupported:goal,measurement,readings,feedback,fixed,...(factParams?{factParams}:{})};}
  const api={value,number,integer,choice,list,near,chain,result};if(typeof module!=='undefined')module.exports=api;if(typeof window!=='undefined')window.AtlasAppendixCommon=api;
})();
