

# 프로젝트 구조
```
KDT-FUL-3_subject-3-4_member_3
├─ app.js #index.html의 js파일
├─ data.json  #정보 저장 파일
├─ index.html #홈페이지
├─ package.json #의존성
├─ posrhtml.js #목록 홈페이지 js파일
├─ posts.html # 목록 홈페이지
├─ README.md #프로젝트설명

```

# 실행 방법
1. 저장소를 클론한다. 
```
git clone https://github.com/kdt-ful-class-three-group/KDT-FUL-3_subject-3-4_member_3.git
```
2. 프로젝트 폴더로 이동한다.   
3. 터미널에 node app.js입력

# 구현 기능 목록
- C: create, 폼태그를 사용해서 json파일을 만든다.    
- R: read, 파일을 읽어온다.  
- U: update, 수정 버튼을 누르면 내용을 수정해서 json파일에 덮어 쓴다.  
- D: delete, 삭제 버튼을 누르면 해당 글이 삭제된다.  

# 학습 내용 정리
- id를 오늘 날짜로 정해봄
- posrhhtml.js를 내보내고 불러왔음
- json을 읽어옴
- 글 작성 후 작성한 데이터에 대해 json파일을 덮어씀
- json 데이터를 사용해서 li 태그 만들기
- li태그를 html안에 넣음
- 응답으로 html 문자열 넣어주기
- url에서 id 값을 가져오기
- data.json을 가져와서 객체(배열)로 바꾸기
- 바꾼 배열의 요소 중에 url에서 가져온 id값을 가지고 있는지 확인함
- 수정하기 구현
- url에서 가져온 id값에 해당되는 요소의 순서(인덱스) 가져오기
- 삭제하기 구현