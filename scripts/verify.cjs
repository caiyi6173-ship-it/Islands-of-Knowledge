/* One local acceptance command. Serial browsers keep measured key durations honest. */
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),output=path.join(root,'output');
const suites=['high-priority','worldline','first-voyage','postal-world','nightwatch','revision','atlas','return','appendix','presentation','campaign','resilience','onboarding','harbor','map-activation','scroll-layout'];
const summary={startedAt:new Date().toISOString(),status:'running',passed:false,checks:[]};
fs.mkdirSync(output,{recursive:true});
const summaryPath=path.join(output,'release-verification.json');
const save=()=>fs.writeFileSync(summaryPath,JSON.stringify(summary,null,2));
function browserInputs(){
  const files=['index.html','学科脉络地图.html','server.cjs','package.json','package-lock.json','scripts/check-high-priority.cjs'];
  for(const folder of ['src','tests','assets'])for(const name of fs.readdirSync(path.join(root,folder),{recursive:true})){
    const file=path.join(folder,name);if(fs.statSync(path.join(root,file)).isFile())files.push(file);
  }
  return files.sort();
}
function reusableBrowserChecks(){
  const files=browserInputs(),hash=createHash('sha256');
  for(const file of files)hash.update(file).update(fs.readFileSync(path.join(root,file)));
  summary.sourceFingerprint=hash.digest('hex');
  if(!process.argv.includes('--resume'))return new Map();
  let previous;try{previous=JSON.parse(fs.readFileSync(summaryPath,'utf8'));}catch{return new Map();}
  const unchanged=previous.sourceFingerprint?previous.sourceFingerprint===summary.sourceFingerprint:files.every(file=>fs.statSync(path.join(root,file)).mtimeMs<=Date.parse(previous.startedAt));
  if(!unchanged){console.log('Code, assets or tests changed; running every browser check again.');return new Map();}
  fs.writeFileSync(path.join(output,`release-interrupted-${Date.parse(previous.startedAt)}.json`),JSON.stringify(previous,null,2));
  summary.resumedFrom=previous.startedAt;
  summary.resumeValidation=previous.sourceFingerprint?'matching-sha256':'all-inputs-unchanged-since-previous-start';
  return new Map(previous.checks.filter(check=>check.passed&&check.name.startsWith('browser:')).map(check=>[check.name,check]));
}
function run(args,log,timeout=120000){
  try{
    const text=execFileSync(process.execPath,args,{cwd:root,encoding:'utf8',windowsHide:true,timeout,maxBuffer:16*1024*1024});
    fs.writeFileSync(path.join(output,log),text);return text;
  }catch(error){
    const detail=`${error.stdout||''}\n${error.stderr||''}`.trim()||error.message;fs.writeFileSync(path.join(output,log),detail);throw new Error(`检查失败，见 output/${log}\n${detail.slice(-2000)}`);
  }
}
function mark(name,details){summary.checks.push({name,passed:true,...details});save();console.log(`PASS ${name}`);}
function verify(){
  const reusable=reusableBrowserChecks();
  save();
  fs.writeFileSync(path.join(output,'release-verification.md'),`# 本地完整验收\n\n本次检查正在运行，尚未通过。开始：${summary.startedAt}\n\n[实时 JSON](./release-verification.json)\n`);
  const scripts=['src','scripts'].flatMap(folder=>fs.readdirSync(path.join(root,folder)).filter(name=>/\.(js|cjs)$/.test(name)).map(name=>`${folder}/${name}`));
  for(const file of scripts)run(['--check',file],'release-syntax.log');
  fs.writeFileSync(path.join(output,'release-syntax.log'),`PASS ${scripts.length} JavaScript files\n`);mark('syntax',{files:scripts.length});
  if(!fs.readFileSync(path.join(root,'index.html')).equals(fs.readFileSync(path.join(root,'学科脉络地图.html'))))throw new Error('两个 HTML 入口内容不同');
  mark('matching-entrypoints',{});
  const tests=fs.readdirSync(path.join(root,'tests')).filter(name=>name.endsWith('.test.cjs')).map(name=>`tests/${name}`);
  const unit=run(['--test','--test-reporter=tap',...tests],'release-unit.tap');
  const count=Number(unit.match(/^# tests (\d+)$/m)?.[1]);if(!count)throw new Error('单元测试没有返回测试数');mark('unit',{tests:count});
  for(const name of suites){
    const prior=reusable.get(`browser:${name}`);
    if(prior){
      const saved=JSON.parse(fs.readFileSync(path.join(output,'browser-regressions',`${name}.json`),'utf8'));
      if(saved.passed&&!saved.pageErrors.length&&saved.checks.length===prior.scenarios){mark(`browser:${name}`,{scenarios:prior.scenarios,pageErrors:0,reusedFrom:summary.resumedFrom});continue;}
    }
    console.log(`RUN browser ${name}`);run(['scripts/check-high-priority.cjs',name],`release-browser-${name}.log`,360000);
    const report=JSON.parse(fs.readFileSync(path.join(output,'browser-regressions',`${name}.json`),'utf8'));
    if(!report.passed||report.pageErrors.length)throw new Error(`浏览器报告未通过：${name}`);
    mark(`browser:${name}`,{scenarios:report.checks.length,pageErrors:report.pageErrors.length});
  }
  summary.passed=true;summary.status='passed';summary.finishedAt=new Date().toISOString();save();
  const browserCount=summary.checks.reduce((sum,check)=>sum+(check.scenarios||0),0);
  const resume=summary.resumedFrom?`\n本轮从 ${summary.resumedFrom} 的环境中断续跑。代码、资产与测试未变化；表中标明沿用的已通过组，其余组重新执行。语法、入口和单元测试本轮重跑。\n`:'';
  const report=`# 本地完整验收\n\n开始：${summary.startedAt}\n\n完成：${summary.finishedAt}\n\n${scripts.length} 个 JavaScript 文件、两个一致入口、${count} 项单元测试、${browserCount} 个浏览器场景均通过，页面错误 0。\n${resume}\n命令：\`npm run verify\`；环境中断后可用 \`npm run verify -- --resume\`。代码、资产或测试变化会重跑所有组。各组浏览器串行运行，使用独立测试服务及隔离上下文。\n\n| 检查 | 数量 | 执行情况 |\n|---|---:|---|\n${summary.checks.map(c=>`| ${c.name} | ${c.files||c.tests||c.scenarios||2} | ${c.reusedFrom?'沿用已通过组':'本轮执行'} |`).join('\n')}\n\n[完整 JSON](./release-verification.json)\n\n这些是工程验收结果，不能代替真实玩家对趣味性、理解与节奏的试玩反馈。\n`;
  fs.writeFileSync(path.join(output,'release-verification.md'),report);console.log(`PASS complete acceptance: ${count} unit tests, ${browserCount} browser scenarios`);
}
try{verify();}catch(error){summary.status='failed';summary.error=error.message;summary.finishedAt=new Date().toISOString();save();fs.writeFileSync(path.join(output,'release-verification.md'),`# 本地完整验收\n\n本次检查失败：${error.message}\n\n[本次 JSON](./release-verification.json)\n`);console.error(error.message);process.exitCode=1;}
