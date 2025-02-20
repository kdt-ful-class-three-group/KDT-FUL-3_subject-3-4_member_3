

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
// const server = http.createServer((req, res) => {
//   const parseUrl = url.parse(req.url, true);
//   const method = req.method;
// })


const server = http.createServer((req, res) => {
  const parsUrl = url.parse(req.url, true)
  const mwthod = req.method;

  // 홈페이지 (GET /)
  if (parsUrl.pathname === "/" && method === "GET") {
    res.writeHead(200, {"Content-Type": 'text/html; charset=utf-8'});
    res.end();
  }

  // 글 목록 페이지 (GET /posts)
  if (parsUrl.pathname === "/posts" && method === "GET") {
    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
      if (error) {
        res.writeHead(500, {"Content-Type": "text/plan; charset=utf-8"});
        res.end("오류! 오류! 오류! 오류! 글 목록을 불러 올 수 없습니다. 오류! 오류! 오류! 오류!")
      }

      // JSON에 데이터가 없으면 빈 배열 사용
      const posts = JSIN.parse(data || "[]");
      let html = "<h1>글목록</h1>";

      // 글 목록을 HTML로 변환
      posts.forEach(post => {
        html += `<p><a href="/post?id=${post.id}">${post.title}</a></p>`;
      });

      html += `<a href="/">홈으로</a>`;
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end(html);

    } );
  }

  // 글 상세 보기 (GET /post?id=1)
  if (parsUrl.pathname === "/post" && method === "GET") {
    // URL에서 id값 가져옴

    fs. readFile(DATA_FILE, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
        res.end("오류! 오류! 글 상세 볼 수 없습니다. 오류! 오류! 오류!")
      }
    });
    

    }
  }


});



// 홈페이지 (GET /)
const server = http.createServer(function(req, res){
if(req, res){
  if(req.method === "GET") {
    if(req.url == "/") {
      res.statusCode = 200;
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.end(MAIN_PAGE);
    } else if(req.url === '/style.css'){
      res.statusCode = 200;
      res.setHeader('Content-Type; charset=urf-8');
      res.end();
    }
    if(req.url == "/abc") {}
  }
}

if(req.method == "POST"){
console.log(req.url);
if(req.url === '/login.html'){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(LOGIN_PAGE);
}
}
if (error) {
  res.writeHead(404,)
}
});

server.listen(8000, function(){
  console.log ('서버 도는 중 http:// localhost:8000');
});
