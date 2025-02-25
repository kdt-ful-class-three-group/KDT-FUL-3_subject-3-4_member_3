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
    // json 파일 가져오기
    let jsonText = fs.readFileSync('./data.json').toString()
    // console.log(JSON.parse(jsonText))
    let jsonArray = JSON.parse(jsonText)

    // json 데이터를 사용해서 li태그 만들기
    // json 데이터 => 배열 : [{},{},...,{}]
    let pocket = ""
    for (let i=0; i<jsonArray.length; i++){

      //pocket = '<li>...</li> <li>....</li> <li>....</li>'
      //배열의 요소 개수 만큼 (배열의 길이만큼) li태그가 만들어짐
      pocket = pocket + htmlUlFunc.default.makeLi(jsonArray[i])
    }

    // li 태그문자열의 총합을 html안에 넣기
    let htmlString = htmlUlFunc.default.makeHtml(pocket)
    console.log(htmlString)

    // 응답으로 html문자열 넣어주기

    res.writeHead(200,{'content-type':'text/html; charset=utf-8'})
    res.end(htmlString)
  
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

  if (parsedUrl.pathname === '/changeLink' && method === "POST"){
    let body = ""
    req.on("data", function(data){
      body = body + data
      // body += data
    })
    req.on('end', function(){
      //받아온 데이터 : body
      console.log('body',body);
      //json배열의 요소 중에서 id가 body에서 받은 id와 동일한 요소에 대해 값을 덮어씌우기

      //1. json파일을 읽어와서 객체(배열)로 바꾸기
      //readFileSync로 가져온 data.json : Buffer타입
      //toString을 사용해서 문자열로 바꿈
      let dataJson = fs.readFileSync("data.json").toString()
      let dataArray = JSON.parse(dataJson)
      console.log(typeof dataArray) //object
      //2. body로 받은 데이터를 객체로 바꾸기 : {contet='aaa',id='bbb'}
      //id 값을 비교해주기 위해서 body로 받은 데이터도 객체로 바꾸는 것
      let vsid = querystring.parse(body);
      console.log(vsid)
      //3. 반복문을 사용해서 body의 id값을 가진 요소 찾기
      dataArray.forEach(function(findId){
        //findId로 들어오는 값은 dataArray의 요소 = 객체

        //findId의 id값과 vsid의 id값이 같으면 새로 덮어씌우기
        if(findId.id===vsid.id){
          findId.content = vsid.content
        }
      })
      console.log(dataArray);
      //4. 값을 덮어씌워주고 다시 json파일로 만들기
      //json 파일에 JSON 문자열로 넣어주기
      fs.writeFileSync('data.json',JSON.stringify(dataArray))
      
      res.writeHead(302,{location:'/posts.html'})
      res.end()
    })
  }
  
  // url이 /delete && method 가 GET일 때
  if (parsedUrl.pathname === '/delete' && method === "GET")

});

server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중... http://localhost:${PORT}`);
});
