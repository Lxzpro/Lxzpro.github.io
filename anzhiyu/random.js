var posts=["posts/3713.html","posts/16107.html","posts/20709.html","posts/49656.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };