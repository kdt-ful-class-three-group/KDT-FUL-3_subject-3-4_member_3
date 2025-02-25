const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const DATA_FILE = "data.json";
const PORT = 8000;

function getFormattedData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2,"0");
  const seconds = String(now.getSeconds()).padStart(2,"0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const htmlUlFunc = require('./posrhtml')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  
  console.log(req.method, ' ',req.url)
  if (parsedUrl.pathname === "/" && method === "GET") {
    fs.readFile("index.html", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("오류! 오류! 오류! 페이지를 찾을 수 없습니다.");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  if (parsedUrl.pathname === "/posts" && method === "POST") {
    let body = "";
    //입력 데이터 받음
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    //입력 데이터 받은 후
    req.on("end", () => {
      //받은 데이터 > 객체로
      const parsedData = querystring.parse(body);

      
      // res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      // res.end("404 페이지를 찾을 수 없습니다. ");

      //title, content 둘 중 하나가 없으면
      if (!parsedData.title || !parsedData.content) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "제목과 내용을 입력해주세요" }));
        return;

      }

      //json 기록 방식
      const newPost = {
        id: getFormattedData(),
        title: parsedData.title,
        content: parsedData.content,
      };

      //json을 읽겠다
      fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        //에러가 아니면 배열에 넣겠다
        let posts = [];
        if (!err && data) {
          try {
            posts = JSON.parse(data);
          } catch (error) {
            console.error("JSON 파싱 오류:", error);
            posts = [];
          }
        }
        //작성한 데이터를 넣겠다
        posts.push(newPost);
        //작성한 데이터에 대해 json파일을 덮어씀
        fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ message: "글 작성에 실패했습니다. " }));
            return;
          }
          res.writeHead(302, { Location: "/posts.html" });
          res.end(fs.readFileSync("posts.html"));
        });
      });
    });


    return;
  }

  if (parsedUrl.pathname === "/posts.html" && method === "GET") {
    res.writeHead(200,{'content-type':'text/html; charset=utf-8'})
    res.end(fs.readFileSync('./posts.html'))
  //   fs.readFile(DATA_FILE, "utf-8", (err, data) => {
  //     if (err) {
  //       res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
  //       res.end(JSON.stringify({ message: "글 목록을 불러오는 데 실패했습니다." }));
  //       return;
  //     }

  //     let posts = [];
  //     try {
  //       posts = JSON.parse(data);
  //     } catch (error) {
  //       console.error("JSON 파싱 오류:", error);
  //     }

  //     res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  //     res.end(JSON.stringify(posts));  
  //   });

  //   res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  //   res.end(fs.readFileSync("posts.html"));

  //   return;
  // } else {
  //   res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  //   res.end("404 페이지를 찾을 수 없습니다. ");

  }

  if(parsedUrl.pathname === '/list.html' && method === "GET"){
    res.writeHead(200, {"content-type": "text/html"});
    res.end(fs.readFileSync("./list/html"));
  }

  if (parsedUrl.pathname ==='/data.json'&& method === "GET"){
    res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
    res.end(fs.readFileSync("./data.json"));
  }

  // pathname 안에 "-"와 ":"가 들어가 있으면..
  if (parsedUrl.pathname.includes("-") && parsedUrl.pathname.includes(":")&& method === "GET"){
    const url = req.url;
    console.log (url)
  };

  if (parsedUrl.pathname === '/ChangeLink' && method === "POST"){
    let body = ""
    req.on("data", function(data){
      body = body + data
      // body += data
    })
    req.on('end', function(){
      console.log(body);
      let dataJson = fs.readFileSync("data.json")
      console.log(dataJson)
      res.end()
    })
  }
  
  

});

server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중... http://localhost:${PORT}`);
});
