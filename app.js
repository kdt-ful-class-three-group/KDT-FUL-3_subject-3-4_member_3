

// http 모둘 불러오기
const http = require('http');
// 파일을 읽고 쓰기 위한 모듈
const fs = require('fs')
// url 분석(경로 및 퀴리 스트링으로 변환 )
const url = require('url');
// POST요청에서 데이터를 추출할때 사용
const querystring = require("qurystring");
const { error } = require('console');

// 서버 포트 설정
const PORT = 8000;


// 서버 생성
const server = http.createServer((req, res) => {
  const parsUrl = url.parse(req.url, true)
  const mwthod = req.method;

  // 홈페이지 (GET /)
  if (parsUrl.pathname === "/" && method === "GET") {
    res.writeHead(200, {"Content-Type": 'text/html; charset=utf-8'});
    res.end();
  }

  // 글 목록 페이지 (GET /posts)
  if (parsedUrl.pathname === "/posts" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>글 목록</h1><p>게시글이 없습니다.</p><a href='/'>홈으로</a>");
    return;
}


  // 글 상세 보기 (GET /post?id=1)
  if (parsedUrl.pathname === "/post" && method === "GET") {
    const postId = parsedUrl.query.id;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>글 상세 보기 (ID: ${postId})</h1><p>내용 없음</p><a href='/posts'>목록으로</a>`);
    return;
}

      // 글 작성( POST/ post)
      if (parsUrl.pathname === "/post" && method === "POST") {
        let body = "";
        req.on("data", chunk => {
          body += chunk.toSring();
        });

        req.on("end", () => {
          const parsData = querystring.parse(body);
          res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
          res.end(`<h1> 새 글 작성 완료</h1><p>제목 : ${parsData.title}</p><p>내용 : ${parsData.content}</p><a href='/posts'> 목록으로</a>`);
        });
      }

      // 404에러 페이지
      res. writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<h1>404 - 페이지를 찾을 수 없당께~! </h1>");
    });

    // 서버 실행
    server.listen(PORT, () => {
      console.log(`서버 실 행 중... http://localhost:${POST}`);
    });
  


