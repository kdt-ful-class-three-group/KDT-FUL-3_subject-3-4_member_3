

const hmtlUl = {
  makeLi: function(obj) {
    let string = `<li> <p><span>${obj.title}</span> <span>${obj.content}</span> <span>${obj.id}</span></p> <button class="changeBtn">수정</button> <button>삭제</button> </li>`

    return string
  }


  ,makeHtml: function(innerUl){
    let string = `<!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>글 목록</title>
      <style>
        body {
          margin: 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        .post-list {
          list-style: none;
          padding: 0;
        }
        .post-list li {
          margin-bottom: 20px;
        }
        .post-list li a {
          font-size: 20px;
          text-decoration: none;
          color: #333;
        }
        .post-list li a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
    
      <h1>글 목록</h1>
    
      <div>
        <ul class="post-list">
          <!-- 게시글 목록이 여기서 출력 -->
           ${innerUl}
          </ul>
          
          
      </div>
    
      <div>
        <a href="/"> 글 작성으로 돌아가기</a>
      </div>
    
      <script>
    
        const changeBtn = document.getElementsByClassName('changeBtn')
        for (let i=0; i<changeBtn.length; i++){
          changeBtn[i].addEventListener('click', function(){
            const p = document.getElementsByTagName('p')
            const form = document.createElement('form')
            form.action="/changeLink"; 
            form.method = "POST";
    
            // 폼태그 안에 피태그 들어옴
            form.appendChild(p[i])
    
            const li = document.getElementsByTagName('li')
            li[i].prepend(form)
    
            //p태그 안에 span태그 활용하기
            //input태그 안에 value값으로 사용하기 위해서
            const span = p[i].children
            console.log(span)

            p[i].innerHTML = '<span>'+span[0].textContent+'</span><input type="text" value="'+span[1].textContent+'" name="content"></input><span>'+span[2].textContent+'</span><input type="hidden" name="id" value="'+span[2].textContent+'"></input><button type="submit">작성완료</button>'
            // const btn = document.createElement('button')
            // btn.type="submit"
            
            console.log(i)
          })
        }
    
    
    
    
      </script>
      
    </body>
      </html>
    `
    return string
}}

export default hmtlUl
