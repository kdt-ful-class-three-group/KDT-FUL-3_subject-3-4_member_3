

  <script>


    // '/posts' 경로에서 게시글 목록을 요청
    fetch('./data.json')
      .then(response => response.json())
      .then(posts => {
        const postList = document.querySelector('.post-list');
        posts.forEach(post => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<p>제목: ${post.title} 내용:${post.content} - ${post.id}</p><button id="changeBtn">수정</button><button id="delateBtn">삭제</button>`;
          postList.appendChild(listItem);
          console.log(post)

        let btn = document.getElementsByTagName('button');
        for( let i=0; i<btn.length; i ++){
          btn[i].addEventListener('click', function(){
            listItem.innerHTML = `<form action='/ChageLink'method="POST"><p>제목: ${post.title} 내용:<input type='text' name='content' value="${post.content}""></input>- ${post.id}</p><input type="hidden" name="id" value="${post.id}""></input><button id="changeBtn">수정</button><button id="delateBtn">삭제</button><button id="okBtn" type="submit">작성완료</button></form>`
          })
        }
        
          
        });
      })
      .catch(error => console.error('게시글을 불러오는 데 실패했습니다.', error));

      

      // console.log(list)

  </script>

</body>
</html>
