const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const DATA_FILE = "data.json";
const PORT = 8000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  // 메인 페이지 제공 (GET 요청)
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
    return;
  }

  // 게시글 저장 (POST 요청)
  if (parsedUrl.pathname === "/post" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = querystring.parse(body);

      // 제목과 내용이 비어 있는지 확인
      if (!parsedData.title || !parsedData.content) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "제목과 내용을 입력해주세요." }));
        return;
      }

      const newPost = {
        id: Date.now(),
        title: parsedData.title,
        content: parsedData.content,
      };

      // 파일에서 기존 데이터 읽기
      fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        let posts = [];
        if (!err && data) {
          try {
            posts = JSON.parse(data);
          } catch (error) {
            console.error("JSON 파싱 오류:", error);
            posts = [];
          }
        }

        // 새 게시글 추가 후 저장
        posts.push(newPost);
        fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ message: "글 작성에 실패했습니다." }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "글 작성 완료!", post: newPost }));
        });
      });
    });

    return;
  }

  // 존재하지 않는 경로 처리
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 페이지를 찾을 수 없습니다.");
});

// 서버 실행 
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중... http://localhost:${PORT}`);
});
