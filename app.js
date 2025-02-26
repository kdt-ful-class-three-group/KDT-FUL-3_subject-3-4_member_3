const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const DATA_FILE = "data.json";
const PORT = 8000;

// id를 현재 날짜와 시간으로 지정 (단독 id 생성)
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



// posrhtml.js에 있는 htmlUl함수를 ltmlUlFunc변수를 사용해서 불러오기
// 단 posrhtml.js에서는 맨 마지막에 export defult를 작성해서  사용하여 내보내야 한다. 
const htmlUlFunc = require('./posrhtml')
// console.log(htmlUlFunc)


// 
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  

  
  // 
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

          //json 기록 방식
    const newPost = {
      id: getFormattedData(),
      title: parsedData.title,
      content: parsedData.content,
    };

      //title, content 둘 중 하나가 없으면
      if (!parsedData.title || !parsedData.content) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "제목과 내용을 입력해주세요" }));
        return;

      }

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
    let pocket = ""
    for (let i=0; i<jsonArray.length; i++){
      pocket = pocket + htmlUlFunc.default.makeLi(jsonArray[i])
    }

    // li 태그를 html안에 넣기
    let htmlString = htmlUlFunc.default.makeHtml(pocket)
    // console.log(htmlString)

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
      // 받아온 데이터 : bosy
      console.log(body);
      // json배열의 요소가 body에서 받은 id와 동일한 요소에 대해 값을 덮어 씌우기

      //1. json파일을 읽어와서 객체(배열)로 바꾸기
      // readFileSync으로 받은 data.json은 버퍼타입으로 나옴
      // toString을 사용해서 문자열로 바꾼다.
      let dataJson = fs.readFileSync("data.json").toString()
      let dataArray = JSON.parse(dataJson)
      console.log(typeof dataArray)

      //2. body로 받은 데이터를 객채로 바꾸기 : {content='aaa', id='bbb'}
      // id 값을 비교해주기 위해서 body로 받은 데이터로 객체로 바꾸는 것
      let vsid = querystring.parse(body);
      console.log(vsid)
      
      //3. 반복문을 사용해서 body의 id값을 가진 요소 찾기
      dataArray.forEach(function(findId){
        //findId로 들어오는 값은 dataArray의 요소는 객체다

        // findID값과 vsId의 id값이 같으면 새로 덮어 씌우기
        if (findId.id === vsid.id){
          findId.content = vsid.content
        }

      })
      console.log(dataArray)

      //4. 값을 덮어 씌워주고 다시 json파일로 만들기
      // json파일에 json문자열로 넣어준다. 
      fs.writeFileSync('data.json', JSON.stringify(dataArray))

      res.writeHead(302, {Location:'/posts.html'})
      

      res.end()
    })
  }
  
  // url에 /delete가 포함되어있을 때 실행시켜줘
  if (parsedUrl.pathname.includes('/delete') && method === "GET"){
    // 1. url에서 id 값을 가져오기
    // '/'로 쪼갬 req.url.splite('/')
    // 예시: [' ' , 'delete', 'id=2025-02-24%12:34:50']
    let idUrl = req.url. split('/')[2]
console.log('delete제거한 url 출력', querystring.parse(idUrl))


    // 2. data.json을 가져와서 객체(배열)로 바꾸기
    let dataJson = fs.readFileSync("data.json").toString()
      let dataArray = JSON.parse(dataJson)

    // 3. 바꾼 배열의 요소 중에 url에서 가져온 id값을 가지고 있는지 확인
    // url에서 가져온 id 값에 해당되는 요소의 순서(인덱스) 가져오기
    let index = dataArray.findIndex(i => i.id === querystring.parse(idUrl).id)
    console.log(index)

    // 4. 해당 요소를 삭제
    // splice를 인덱스 사용해주기
    dataArray.splice(index,1)
    console.log(dataArray)

    // 5. 다시 data.json을 만들어 주기
    // writeFilesyne는 파일이 없으면 만들어 주고, 있으면 덮어씌운다. 
    // data.json을 데이터어레이 값을 넣어줘
    // json파일에는 json문자열이 들어감
    //stringfy는 문자열
    // parce 객체로 바꾼다. 
    fs.writeFileSync('data.json',JSON.stringify(dataArray))
    
    // 다시 posts.html 요청할게 -> posts.html을 요청해줘
    res.writeHead(302, {Location:'/posts.html'})
        res.end()
  }
  

});

server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중... http://localhost:${PORT}`);
});
