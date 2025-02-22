const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require("querystring");
const DATA_FILE = "data.json";
const PORT = 8000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  if (parsedUrl.pathname === "/" && method === "GET") {
    fs.readFile("index.html", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("오류! 페이지를 찾을 수 없습니다.");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }

  if (parsedUrl.pathname === "/post" && method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      const parsedData = querystring.parse(body);
      const newPost = {
        id: Date.now(),
        title: parsedData.title,
        content: parsedData.content
      };

      fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        const posts = err ? [] : JSON.parse(data || "[]");
        posts.push(newPost);
        fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), err => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("글 작성에 실패했습니다.");
            return;
          }
          res.writeHead(302, { Location: "/posts" });
          res.end();
        });
      });
    });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중... http://localhost:${PORT}`);
});