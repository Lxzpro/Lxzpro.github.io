var posts=["posts/49656.html","posts/16107.html","posts/20709.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };