

// http 모둘 불러오기
const http = require('http');
// 파일을 읽고 쓰기 위한 모듈
const fs = require('fs')
// url 분석(경로 및 퀴리 스트링으로 변환 )
const url = require('url');
// POST요청에서 데이터를 추출할때 사용
const qurystring = require("qurystring");
const { error } = require('console');
const { title } = require('process');

// 서버 포트 설정
const PORT = 8000;


// 서버 생성
const server = http.createServer((req, res) => {
  const parsUrl = url.parse(req.url, true);
  const method = req.method;

  // 메인페이지(GET /)
  if (parsUrl.pathname === "/" && method === "GET" ) {
    fs.readFile("index.html", (err, data) => {
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8"});
        res.end("오류! 오류! 오류! 페이지를 찾을 수 없다 휴먼,")
    };
  })
  }



  // 홈페이지 (GET /)
  // if (parsUrl.pathname === "/" && method === "GET") {
  //   res.writeHead(200, {"Content-Type": 'text/html; charset=utf-8'});
  //   res.end("<h1>홈페이지</h1><a href= '/post'>게시글 목록 보기</a>");
  // }




  // 글 목록 페이지 (GET /posts)
  if (parsUrl.pathname === "/posts" && method === "GET") {
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
  if (parsURL.pathname === "/post" && method === "GET") {

    // URL에서 id 값을 가져옴
    const postId = parsURL.query.id;

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
  }}); 


 if (parsedUrl.pathname === "/post" && method === "GET") {
        const postId = parsedUrl.query.id; // URL에서 id 값 가져오기

        fs.readFile(DATA_FILE, "utf-8", (err, data) => {
            const posts = err ? [] : JSON.parse(data || "[]");
            const post = posts.find(p => p.id == postId);

            if (!post) {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("해당 글을 찾을 수 없습니다.");
                return;
            }

            let html = `<h1>${post.title}</h1><p>${post.content}</p><a href="/posts">목록으로</a>`;
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
        });
    }


    // 글 목록 페이지 (GET / posts)
    if (parsURL.pathname === "/post" && method === "GET") {
    
      // 파일이 없으면 빈 배열 사용
      const posts = err ? [] : JSON.parse(data || "[]");

      let html = `<h1>글 목록</h1><ul>`;
      posts.foreach(post => {
        html += `<li><a href="/post?id=${post.id}">${post.title}</a></li>`;

        res.writeHead(200, {"Content-Type": "text/html charset=utf-8"});
        res.end(html);
      });
    }



    // 글 상세 보기 페이지(GET /post?id=1)
    if (parsURL.pathname === "/post" && method === "GET") {

      // URL에서 id 값 가져오기
      const postId = parsURL.query.id;
      fs.readFile(DATA_FILE, "utf-8", (err, data) => {

        const post = err ? [] : JSON.parse(data || "[]");
        const posts = posts.find(p => p.id == postId);

        if (!post) {
          res.writeHead(404, {"Content-Type":"text/plain; charset=utf-8"});
          res.end("해당 글을 찾을 수 없다 휴먼,");
        }

        let html = `<h1>${post.title}</h1><p>${post.content}</p><a href="/post">목록으로</a>`
      });
      html += `<li><a href="/post ? id=${post.id}">${post.title}</a>목록으로</li>`;
      html += `</ul><a href="/">홈으로</a>`;
      res.writeHead (200, {"Content-Type": "text/plain; charset=utf-8"});
      res.end(html)
    };


    // 글 작성(POST / post)
    if(parsURL.pathname === "/post" && method === "POST") {
      let body = "";
      req.on("data", chunk => {
      body += chunk.toString();
      });

      req.on("end", () => {
        const parsData = qurystring.parse(body);
        const newPost = {
          id: Data.now(),
          title : parsData.title,
          content : parsData.content
        };

        fs. readFile(DATA_FILE, "utf-8", (err, data) => {
          const posts =err ? [] : JSON.parse(data || "[]");
          posts.push(newPost);

          fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), err => {
            if (err) {
              res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
              res.end("휴먼, 글 작성에 실패했습니다.");

            }

            // 글 목록으로 이동
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
      console.log(`서버 실 행 중... http://localhost:${PORT}`);
    });
  


