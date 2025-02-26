const parsUrlwrite = function(res, number, type, data){
  res.writeHead(number, { "Content-Type": `${type}; charset=utf-8` });
  res.end(data);
}

parsUrlwrite(404, "text/hmtl" , "안녕하다")

console.log(parsUrlwrite)

const locationWrite = function(res, number, type, data){
  res.writeHead(number, { Location: type });
            res.end(data);
}