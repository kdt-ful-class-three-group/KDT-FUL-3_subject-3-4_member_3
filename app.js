

// http 모둘 불러오기
const http = require('http');
// 파일을 읽고 쓰기 위한 모듈
const fs = require('fs')
// url 분석(경로 및 퀴리 스트링으로 변환 )
const url = require('url');
// POST요청에서 데이터를 추출할때 사용
const qurystring = require("qurystring");
const { error } = require('console');

// 서버 포트 설정
const PORT = 8000;


// 서버 생성
const server = http.createServer((req, res) => {
  const parsUrl = url.parse(req.url, true);
  const method = req.method;

  // 홈페이지 (GET /)
  if (parsUrl.pathname === "/" && method === "GET") {
    res.writeHead(200, {"Content-Type": 'text/html; charset=utf-8'});
    res.end("<h1>홈페이지</h1><a href= '/post'>게시글 목록 보기</a>");
  }


  // 글 목록 페이지 (GET /posts)
  if (parsedUrl.pathname === "/posts" && method === "GET") {
    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8" });
          res.end("오류! 오류! 오류! 글 목록을 불러올 수 없다 휴먼, 오류! 오류! 오류!")
      }

      // JSON 데이터가 없으면 빈 배열 사용
      const posts = JSON.pars(data || "[]");
      let html = "<h1>글 목록</h1>";
      
      // 글 목록을 HTML로 변환
      posts.foreach(post => {html += `<p><a href="/post?id=${post.id}">${post.title}</a></p>`;
      });

      html +=`<a href = "/">홈으로</a>`;
      res.writeHead(200, {"COntent-Type": "text/html; charset=utf-8"});
      
      res.end(html);

    });
  }
  


  // 글 상세 보기 (GET /post?id=1)
  if (parsedUrl.pathname === "/post" && method === "GET") {

    // URL에서 id 값을 가져옴
    const postId = parsedUrl.query.id;

    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
        res.end("오류! 오류! 오류! 글을 불러 올 수 없습니다. 휴먼, 오류! 오류! 오류!");
      }
      const posts = JSON.parse(data || "[]");

      // ID가 일치하는 글 찾기
      const post = posts.find(p => p.id == postId);
    });
    if (!post) {
      res.writeHead(404, {
        "COntet-Type": "text/plain; charset=utf-8"});
        res.end("해당 글을 찾을 수 없다 휴먼,");
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>${post.title}</h1><p>${post.content}</p><a href='/posts'>목록으로</a>`);
  }); 
}


      // 글 작성( POST/ post)
      if (parsUrl.pathname === "/post" && method === "POST") {

        // 요청을 저장할 변수
        let body = "";

        // 데이터갈 때마다 body에 저장
        req.on("data", chunk => {
          body += chunk.toSring();
        });

        // 데이터 수신 완료 후 실행
        req.on("end", () => {
          const parsData = qurystring.parse(body);

          const newPost = {

            // 현재 시간을 ID로 사용
            id: DataTransfer.now(),
            title: parsData.title, // 제목
            content: parsData.content // 내용
          };

          // 기존 데이터 파일 읽어오기
          fs.readFile(DATA_FILE, "utf-8", (err, data) => {
            let posts =[];
            if (!err) {
              posts = JSON.parse(data || "[]");
            }

            // 새 글 추가
            post.push(newPost);

            // JSON 파일에 저장
            fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), err => {
              if(err) {
                res.writeHead(500, {"Constent-Type": "text/plain; charset=utf-8"});
                res.end("글 저장 실패했다 휴먼,");
              }

              // 글 목록으로 다시 되돌리기
              res.writeHead(302, {Location: "/posts"});
              res.end();
            });
          });
        });
      }




      // 404에러 페이지
      res. writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<h1>404 - 페이지를 찾을 수 없당께~! </h1>");
    

    // 서버 실행
    server.listen(PORT, () => {
      console.log(`서버 실 행 중... http://localhost:${POST}`);
    });
  


