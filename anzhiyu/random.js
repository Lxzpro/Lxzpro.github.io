var posts=["2024/07/06/article-title/","2024/04/30/hello-world/","2024/12/09/other/","2024/12/09/懵儒/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };