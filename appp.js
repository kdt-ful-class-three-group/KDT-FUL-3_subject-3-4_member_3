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

const server = http.createServer(function(req, res){

  console.log(req.url);
  // html 불러오기
  if(req.method === "GET") { 
    
    if (req.url === "/index.html") {
      const mainpage = fs.readFileSync("./index.html")
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(page);
      res.end(mainpage);
    } else if (req.url === "/posts.html"){
      const postshtml = fs.readFileSync('posts.html');
      res.writeHead(200, {"Content-Type": "text/html"})
      res.write(page);
      res.end(postshtml);
    } else if (req.url === "/app.js") {
      const appjs = fs.readFileSync('app.js');
      res.writeHead(200, {"Content-Type": "application/javascript"})
      res.write(javascript);
      res.end(appjs);
    } 
  }
}

)

server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중... http://localhost:${PORT}`);
});