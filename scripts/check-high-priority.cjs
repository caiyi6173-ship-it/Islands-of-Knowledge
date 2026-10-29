const { spawn, execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const cli = path.join(root, "node_modules/@playwright/cli/playwright-cli.js");
const port = Number(process.env.BROWSER_TEST_PORT) || 4188;
const url = `http://127.0.0.1:${port}`;
const session = `regression-${process.pid}`;
const output = path.join(root, "output/browser-regressions");
const testName = process.argv[2] || "high-priority";
const reportPath=path.join(output, `${testName}.json`);
if (!["high-priority", "worldline", "first-voyage", "postal-world", "nightwatch", "revision", "atlas", "return", "appendix", "presentation", "campaign", "resilience", "onboarding", "harbor", "map-activation", "scroll-layout"].includes(testName)) throw new Error("Unknown browser check");
fs.mkdirSync(output, { recursive: true });
function run(...args) {
  const lifecycle=path.join(output,`${testName}.lifecycle.log`);
  fs.appendFileSync(lifecycle,`${new Date().toISOString()} ${args[0]} start\n`);
  try {
    const result=execFileSync(process.execPath, [cli, `-s=${session}`, ...args], {
      cwd: root,
      windowsHide: true,
      encoding: "utf8",
      timeout: args[0]==="close"?15000:args[0]==="open"?45000:["campaign","onboarding"].includes(testName) ? 300000 : testName === "nightwatch" ? 240000 : 180000,
      maxBuffer: 8 * 1024 * 1024,
    });
    fs.appendFileSync(lifecycle,`${new Date().toISOString()} ${args[0]} completed\n`);
    return result;
  } catch (error) {
    const detail = `${error.stdout || ""}\n${error.stderr || ""}`.trim()||error.message;
    fs.appendFileSync(lifecycle,`${new Date().toISOString()} ${args[0]} failed: ${detail.slice(-1000)}\n`);
    fs.writeFileSync(path.join(output, "failure.log"), detail);
    throw new Error(`CLI ${args[0]}: ${detail}`);
  }
}
async function main() {
  // Never leave last week's green report beside a failed or interrupted new run.
  fs.writeFileSync(reportPath,JSON.stringify({passed:false,status:"running",checks:[],pageErrors:[]},null,2));
  fs.writeFileSync(path.join(output,`${testName}.lifecycle.log`),`${new Date().toISOString()} session ${session}\n`);
  // A separate server and isolated contexts leave the player's real save untouched.
  const server = spawn(process.execPath, ["server.cjs"], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    windowsHide: true,
    stdio: "ignore",
  });
  let serverError;
  server.on("error", (error) => {
    serverError = error;
  });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (serverError) throw serverError;
      if (server.exitCode !== null)
        throw new Error(`Test server exited: ${server.exitCode}`);
      try {
        ready = (await fetch(url)).ok;
      } catch {}
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error("Test server did not start");
    run("open", url, "--browser", process.env.BROWSER_TEST_BROWSER || "chrome");
    const log = run("run-code", `--filename=tests/browser/${testName}.js`);
    fs.writeFileSync(path.join(output, `${testName}.log`), log);
    const match = log.match(/### Result\r?\n([^\r\n]+)/);
    const result = match && JSON.parse(match[1]);
    if(result)result.passed=result.passed===true&&Array.isArray(result.checks)&&Array.isArray(result.pageErrors)&&result.pageErrors.length===0;
    fs.writeFileSync(reportPath,JSON.stringify(result||{passed:false,status:"invalid-result",checks:[],pageErrors:[]},null,2));
    if (!result?.passed || result.pageErrors?.length)
      throw new Error(log.split("### Ran Playwright code")[0]);
    fs.writeFileSync(
      path.join(output, `${testName}.json`),
      JSON.stringify(result, null, 2),
    );
    for (const check of result.checks) console.log(`PASS ${check}`);
    console.log(
      `PASS ${result.checks.length} browser checks; ${result.pageErrors.length} page errors`,
    );
  } finally {
    try {
      run("close");
    } catch {}
    server.kill();
  }
}
main().catch((error) => {
  let report={checks:[],pageErrors:[]};
  try{report=JSON.parse(fs.readFileSync(reportPath,"utf8"));}catch{}
  fs.writeFileSync(reportPath,JSON.stringify({...report,passed:false,status:"failed",error:error.message},null,2));
  console.error(error.message);
  process.exitCode = 1;
});
