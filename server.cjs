const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".md": "text/plain; charset=utf-8",
};
const port = Number(process.env.PORT) || 4173;
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400).end();
      return;
    }
    const target = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.stat(target, (error, stat) => {
      if (error || !stat.isFile()) {
        res
          .writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
          .end("未找到这个文件");
        return;
      }
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(target)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      fs.createReadStream(target).pipe(res);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`知识群岛：http://127.0.0.1:${port}`),
  );
