if(!window.hasOwnProperty("aiExecuted")){
  console.log(`%cPost-Summary-AI 文章摘要AI生成工具:%chttps://github.com/qxchuckle/Post-Summary-AI%c`, "border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#4976f5;margin:10px 0", "border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;","");
  window.aiExecuted = "chuckle";
}
function ChucklePostAI(AI_option) {
  MAIN(AI_option);
  if(AI_option.pjax){
    document.addEventListener('pjax:complete', ()=>{
      setTimeout(()=>{
        MAIN(AI_option);
      }, 0);
    });
  }
  function MAIN(AI_option) {
    // 如果有则删除
    const box = document.querySelector(".post-ai");
    if (box) {
      box.parentElement.removeChild(box);
    }
    const currentURL = window.location.href;
    // 排除页面
    if(AI_option.eliminate && AI_option.eliminate.length && AI_option.eliminate.some(item => currentURL.includes(item))){
      console.log("Post-Summary-AI 已排除当前页面(黑名单)");
      return;
    }
    if(AI_option.whitelist && AI_option.whitelist.length && !AI_option.whitelist.some(item => currentURL.includes(item))){
      console.log("Post-Summary-AI 已排除当前页面(白名单)");
      return;
    }
    // 获取挂载元素，即文章内容所在的容器元素
    let targetElement = "";
    // 若el配置不存在则自动获取，如果auto_mount配置为真也自动获取
    if(!AI_option.auto_mount && AI_option.el){
      targetElement = document.querySelector(AI_option.el ? AI_option.el : '#post #article-container');
    }else{
      targetElement = getArticleElements();
    }
    // 获取文章标题，默认获取网页标题
    const post_title = document.querySelector(AI_option.title_el) ? document.querySelector(AI_option.title_el).textContent : document.title;
    if (!targetElement) {
      return;
    };
    const interface = {
      name: "然-AI",
        introduce: "我是文章辅助AI: 然-AI，一个基于deepseek的强大语言模型，有什么可以帮到您？😊",
      version: "deepseek",
      button: ["介绍自己😎", "推荐相关文章👍", "生成AI简介🤖", "矩阵穿梭🚀"],
      ...AI_option.interface
    }
    insertCSS(); // 插入css
    // 插入html结构
    const post_ai_box = document.createElement('div');
    post_ai_box.className = 'post-ai';
    post_ai_box.setAttribute('id', 'post-ai');
    targetElement.insertBefore(post_ai_box, targetElement.firstChild);
    post_ai_box.innerHTML = `<div class="ai-title">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21px" height="21px" viewBox="0 0 48 48">
        <g id="&#x673A;&#x5668;&#x4EBA;" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="&#x5F62;&#x72B6;&#x7ED3;&#x5408;" fill="#444444" fill-rule="nonzero"></path></g></svg>
        <div class="ai-title-text">${interface.name}</div>
        <div class="ai-Toggle">切换简介</div>
        <div class="ai-speech-box">
          <div class="ai-speech-content"></div>
        </div>
        <div class="ai-tag">${interface.version}</div>
      </div>
      <div class="ai-explanation">${interface.name}初始化中...</div>
      <div class="ai-btn-box">
        <div class="ai-btn-item">${interface.button[0]}</div>
        <div class="ai-btn-item">${interface.button[1]}</div>
        <div class="ai-btn-item">${interface.button[2]}</div>
        <div class="ai-btn-item">${interface.button[3]}</div>
      </div>`;

    // ai主体业务逻辑
    let animationRunning = true; // 标志变量，控制动画函数的运行
    let explanation = document.querySelector('.ai-explanation');
    let post_ai = document.querySelector('.post-ai');
    let ai_btn_item = document.querySelectorAll('.ai-btn-item');
    let ai_toggle = document.querySelector('.ai-Toggle');
    let ai_speech = document.querySelector('.ai-speech-box');
    let ai_str = '';
    let ai_str_length = '';
    let delay_init = 600;
    let i = 0;
    let j = 0;
    let speed = AI_option.speed || 20;
    let character_speed = speed*7.5;
    let sto = [];
    let elapsed = 0;
    let completeGenerate = false;
    let controller = new AbortController();//控制fetch
    let signal = controller.signal;
    let visitorId = ""; // 标识访客ID
    let summaryId = ""; // 记录当前摘要ID
    const summary_toggle = AI_option.summary_toggle ?? true;
    const summary_speech = AI_option.summary_speech ?? true;
    let switch_control = 0;
    let executedForSwitchControl = false;
    let summary_audio = '';
    let audioBlob = '';
    let isPaused = false;
    const summary_num = AI_option.summary_num || 3; // 切换时允许生成的摘要总数，默认3个
    //默认true，使用tianliGPT，false使用官方api，记得配置Key
    const choiceApi = false;
    const apiKey = "sk-3fdb10608eae4d0b92fd92500681d968";
    //tianliGPT的参数
    const tlReferer = `https://${window.location.host}/`;
    const tlKey = AI_option.key ? AI_option.key : '123456';
    //-----------------------------------------------
    const animate = (timestamp) => {
      if (!animationRunning) {
        return; // 动画函数停止运行
      }
      if (!animate.start) animate.start = timestamp;
      elapsed = timestamp - animate.start;
      if (elapsed >= speed) {
        animate.start = timestamp;
        if (i < ai_str_length - 1) {
          let char = ai_str.charAt(i + 1);
          let delay = /[,.，。!?！？]/.test(char) ? character_speed : speed;
          if (explanation.firstElementChild) {
            explanation.removeChild(explanation.firstElementChild);
          }
          explanation.innerHTML += char;
          let div = document.createElement('div');
          div.className = "ai-cursor";
          explanation.appendChild(div);
          i++;
          if (delay === character_speed) {
            document.querySelector('.ai-explanation .ai-cursor').style.opacity = "0";
          }
          if (i === ai_str_length - 1) {
            observer.disconnect();// 暂停监听
            explanation.removeChild(explanation.firstElementChild);
          }
          sto[0] = setTimeout(() => {
            requestAnimationFrame(animate);
          }, delay);
        }
      } else {
        requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver((entries) => {
      let isVisible = entries[0].isIntersecting;
      animationRunning = isVisible; // 标志变量更新
      if (animationRunning) {
        delay_init = i === 0 ? 200 : 20;
        sto[1] = setTimeout(() => {
          if (j) {
            i = 0;
            j = 0;
          }
          if (i === 0) {
            explanation.innerHTML = ai_str.charAt(0);
          }
          requestAnimationFrame(animate);
        }, delay_init);
      }
    }, { threshold: 0 });
    function clearSTO() {
      if (sto.length) {
        sto.forEach((item) => {
          if (item) {
            clearTimeout(item);
          }
        });
      }
    }
    function resetAI(df = true, str = '生成中. . .') {
      i = 0;//重置计数器
      j = 1;
      clearSTO();
      animationRunning = false;
      elapsed = 0;
      if (df) {
        explanation.innerHTML = str;
      } else {
        explanation.innerHTML = '请等待. . .';
      }
      if (!completeGenerate) {
        controller.abort();
      }
      ai_str = '';
      ai_str_length = '';
      if(summary_toggle){
        ai_toggle.style.opacity = "0";
        ai_toggle.style.pointerEvents = "none";
      }
      if(summary_speech){
        summarySpeechInit();
        ai_speech.style.opacity = "0";
        ai_speech.style.pointerEvents = "none";
      }
      observer.disconnect();// 暂停上一次监听
    }
    function startAI(str, df = true) {
      // 如果打字机配置项存在且为false，则关闭打字机，否则默认开启打字机效果
      if(AI_option.hasOwnProperty('typewriter') && !AI_option.typewriter){
        explanation.innerHTML = str;
      }else{
        resetAI(df);
        ai_str = str;
        ai_str_length = ai_str.length;
        observer.observe(post_ai);//启动新监听
      } 
    }
    function aiIntroduce() {
      startAI(interface.introduce);
    }
    function aiRecommend() {
      resetAI();
      sto[2] = setTimeout(async() => {
        let info = await recommendList();
        if(info === "" || info === false){
          startAI(`${interface.name}的推荐功能正在维护中，暂时无法推荐，请稍后再试。`);
        }else if(info){
          explanation.innerHTML = info;
        }
      }, 200);
    }
    async function aiGenerateAbstract() {
      resetAI();
      const ele = targetElement;
      const content = getTextContent(ele);
      const response = await getGptResponse(content, choiceApi);//true使用tianliGPT，false使用官方api
      if(response){
        startAI(response.summary);
        if(summary_toggle){
          ai_toggle.style.opacity = "1";
          ai_toggle.style.pointerEvents = "auto";
          summarySpeechShow();
        }
      }
    }
    async function switchAbstract() {
      resetAI();
      audioBlob = null;
      const ele = targetElement;
      switch_control = (switch_control + 1) % summary_num;
      const content = getTextContent(ele) + "#".repeat(switch_control);
      let response = "";
      if(switch_control === 1 && !executedForSwitchControl){
        sessionStorage.setItem('backupsSummary', sessionStorage.getItem('summary')); // 将第一次的简介存起来
        executedForSwitchControl = true;
      }
      if(!sessionStorage.getItem(`summary${"#".repeat(switch_control)}`)){
        sessionStorage.removeItem('summary');
        response = await getGptResponse(content, choiceApi);
        if(response){
          sessionStorage.setItem(`summary${"#".repeat(switch_control)}`, JSON.stringify(response));
        }
      }else{
        response = JSON.parse(sessionStorage.getItem(`summary${"#".repeat(switch_control)}`));
        summaryId = response.id;
        if(switch_control === 0){
          sessionStorage.setItem('summary', sessionStorage.getItem('backupsSummary'));
        }else{
          sessionStorage.setItem('summary', sessionStorage.getItem(`summary${"#".repeat(switch_control)}`));
        }
      }
      if(response){
        startAI(response.summary);
        ai_toggle.style.opacity = "1";
        ai_toggle.style.pointerEvents = "auto";
        summarySpeechShow();
      }
    }
    async function recommendList() {
      completeGenerate = false;
      controller = new AbortController();
      signal = controller.signal;
      let response = '';
      let info = '';
      let data = '';
      const options = {
        signal,
        method: 'GET',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
      };
      // 利用sessionStorage缓存推荐列表，有则缓存中读取，无则获取后缓存
      if(sessionStorage.getItem('recommendList')){
        data = JSON.parse(sessionStorage.getItem('recommendList'));
      }else{
        try {
          response = await fetch(`https://summary.tianli0.top/recommends?url=${encodeURIComponent(window.location.href)}&author=${AI_option.rec_method ? AI_option.rec_method : 'all'}`, options);
          completeGenerate = true;
          if (response.status === 429) {
            startAI('请求过于频繁，请稍后再请求AI。');
          }
          if (!response.ok) {
            throw new Error('Response not ok');
          }
          // 处理响应
        } catch (error) {
          if (error.name === "AbortError") {
            // console.log("请求已被中止");
          }else{
            console.error('Error occurred:', error);
            startAI("获取推荐出错了，请稍后再试。");
          }
          completeGenerate = true;
          return false;
        }
        // 解析响应并返回结果
        data = await response.json();
        sessionStorage.setItem('recommendList', JSON.stringify(data));
      }
      if(data.hasOwnProperty("success") && !data.success){
        return false;
      }else{
        info = `推荐文章：<br />`;
        info += '<div class="ai-recommend">';
        data.forEach((item, index) => {
          info += `<div class="ai-recommend-item"><span>推荐${index + 1}：</span><a target="_blank" href="${item.url}" title="${item.title ? item.title : "未获取到题目"}">${item.title ? item.title : "未获取到题目"}</a></div>`;
        });
        info += '</div>'
      }
      return info;
    }
    // 矩阵穿梭
    async function matrixShuttle(){
      resetAI(true, '矩阵穿梭中. . .');
      completeGenerate = false;
      controller = new AbortController();
      signal = controller.signal;
      let response = '';
      let data = '';
      const options = {
        signal,
        method: 'GET',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
      };
      if(sessionStorage.getItem('matrixShuttle')){
        data = JSON.parse(sessionStorage.getItem('matrixShuttle'));
      }else{
        try {
          response = await fetch('https://summary.tianli0.top/websites_used', options);
          completeGenerate = true;
          if (response.status === 429) {
            startAI('请求过于频繁，请稍后再请求AI。');
          }
          if (!response.ok) {
            throw new Error('Response not ok');
          }
          // 处理响应
        } catch (error) {
          if (error.name === "AbortError") {
            // console.log("请求已被中止");
          }else{
            console.error('Error occurred:', error);
            startAI("矩阵穿梭失败了，请稍后再试。");
          }
          completeGenerate = true;
          return false;
        }
        // 解析响应并返回结果
        data = await response.json();
        sessionStorage.setItem('matrixShuttle', JSON.stringify(data));
      }
      const randomElement = getRandomElementFromArray(data.websites);
      if(randomElement){
        startAI(`正在前往 ${randomElement} ，已有 ${data.count} 个网站接入AI摘要。`);
        sto[2] = setTimeout(() => {
          window.open(`https://${randomElement}`, '_blank');
        }, speed*100);
      }else{
        startAI(`没有可以穿梭的网站。`);
      }
    }
    // 随机返回数组中一个元素
    function getRandomElementFromArray(array) {
      if (array.length === 0) {
        return null; // 返回null表示数组为空
      }
      const randomIndex = getRandomIndex(array.length);
      return array[randomIndex];
    }
    function getRandomIndex(max) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    async function summarySpeech(){
      if (!summaryId) return;
      let response = '';
      if(audioBlob && !summary_audio){
        await summarySpeechPlay(audioBlob);
        return;
      }
      if(summary_audio && summary_audio){
        if(isPaused){
          isPaused = false;
          summary_audio.play();
          ai_speech.style.opacity = "0.4";
          ai_speech.style.animation = "ai_breathe .7s linear infinite";
        }else{
          isPaused = true;
          summary_audio.pause();
          ai_speech.style.opacity = "1";
          ai_speech.style.animation = "";
        }
        return;
      }else{
        const options = {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Referer": tlReferer
          },
        };
        const requestParams = new URLSearchParams({
          key: tlKey,
          id: summaryId,
        });
        try {
          ai_speech.style.pointerEvents = "none";
          ai_speech.style.opacity = "0.4";
          response = await fetch(`https://summary.tianli0.top/audio?${requestParams}`, options);
          if (response.status === 403) {
            console.error("403 refer与key不匹配。");
          } else if (response.status === 500) {
            console.error("500 系统内部错误");
          }else{
            audioBlob = await response.blob();
            ai_speech.style.pointerEvents = "auto";
            await summarySpeechPlay(audioBlob);
          }
        }catch (error) {
          console.log("摘要语音请求出错：", error);
          ai_speech.style.opacity = "1";
          ai_speech.style.pointerEvents = "auto";
        }
      }
    }
    function summarySpeechInit(clBlob = false){
      if(!summary_speech){ return; }
      if(summary_audio){
        summary_audio.pause();
        summary_audio.remove();
      }
      summary_audio = null;
      ai_speech.style.opacity = "1";
      ai_speech.style.animation = "";
      if(clBlob){ 
        audioBlob = null;
      }
    }
    function summarySpeechShow(){
      if(!summary_speech){ return; }
      ai_speech.style.opacity = "1";
      ai_speech.style.animation = "";
      ai_speech.style.pointerEvents = "auto";
    }
    async function summarySpeechPlay(audioBlob) {
      if(!summary_speech){ return; }
      const audioURL = URL.createObjectURL(audioBlob);
      summary_audio = new Audio(audioURL);
      summary_audio.play();
      if(AI_option.pjax){
        function handlePjaxComplete() {
          summary_audio.pause();
          summary_audio.remove();
          document.removeEventListener('pjax:complete', handlePjaxComplete);
        }
        document.removeEventListener('pjax:complete', handlePjaxComplete);
        document.addEventListener('pjax:complete', handlePjaxComplete);
      }
      ai_speech.style.opacity = "0.4";
      ai_speech.style.animation = "ai_breathe .7s linear infinite";
      summary_audio.removeEventListener("ended", handleSummaryAudioEnded);
      summary_audio.addEventListener("ended", handleSummaryAudioEnded);
    }
    function handleSummaryAudioEnded() {
      summarySpeechInit();
    }
    //ai首屏初始化，绑定按钮注册事件
    async function ai_init() {
      // 清除缓存
      sessionStorage.removeItem('recommendList');
      sessionStorage.removeItem('backupsSummary');
      for (let i = 0; i < summary_num; i++) {
        sessionStorage.removeItem(`summary${"#".repeat(i)}`);
      }
      explanation = document.querySelector('.ai-explanation');
      post_ai = document.querySelector('.post-ai');
      ai_btn_item = document.querySelectorAll('.ai-btn-item');
      const funArr = [aiIntroduce, aiRecommend, aiGenerateAbstract, matrixShuttle];
      ai_btn_item.forEach((item, index) => {
        if(AI_option.hide_shuttle && index === ai_btn_item.length - 1){
          item.style.display = 'none';
          return;
        }
        item.addEventListener('click', () => {
          funArr[index]();
        });
      });
      ai_toggle = document.querySelector('.ai-Toggle');
      if(summary_toggle){
        ai_toggle.addEventListener('click', () => {
          switchAbstract();
        });
      }else{
        ai_toggle.style.display = 'none';
      }
      ai_speech = document.querySelector('.ai-speech-box');
      if(summary_speech){
        ai_speech.addEventListener('click', () => {
          summarySpeech();
        });
      }else{
        ai_speech.style.display = 'none';
      }
      if(AI_option.summary_directly){
        aiGenerateAbstract();
      }else{
        aiIntroduce();
      }
      // 获取或生成访客ID
      visitorId = localStorage.getItem('visitorId') || await generateVisitorID();
    }
    async function generateVisitorID() {
      try {
        const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
        const fp = await FingerprintJS.default.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        localStorage.setItem('visitorId', visitorId);
        return visitorId;
      } catch (error) {
        console.error("生成ID失败");
        return null;
      }
    }
    //获取某个元素内的所有纯文本，并按顺序拼接返回
    function getText(element) {
      // 需要排除的元素及其子元素
      const excludeClasses = AI_option.exclude ? AI_option.exclude : ['highlight', 'Copyright-Notice', 'post-ai', 'post-series', 'mini-sandbox'];
      if (!excludeClasses.includes('post-ai')) { excludeClasses.push('post-ai'); }
      const excludeTags = ['script', 'style', 'iframe', 'embed', 'video', 'audio', 'source', 'canvas', 'img', 'svg', 'hr', 'input', 'form'];// 需要排除的标签名数组
      let textContent = '';
      for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          // 如果是纯文本节点则获取内容拼接
          textContent += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          let hasExcludeClass = false;
          // 遍历类名
          for (let className of node.classList) {
            if (excludeClasses.includes(className)) {
              hasExcludeClass = true;
              break;
            }
          }
          let hasExcludeTag = excludeTags.includes(node.tagName.toLowerCase()); // 检查是否是需要排除的标签
          // 如果hasExcludeClass和hasExcludeTag都为false，即不包含需要排除的类和标签，可以继续向下遍历子元素
          if (!hasExcludeClass && !hasExcludeTag) {
            let innerTextContent = getText(node);
            textContent += innerTextContent;
          }
        }
      }
      // 返回纯文本节点的内容
      return textContent.replace(/\s+/g, '');
    }
    //获取各级标题
    function extractHeadings(element) {
      const headings = element.querySelectorAll('h1, h2, h3, h4');
      const result = [];
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const headingText = heading.textContent.trim();
        result.push(headingText);
        const childHeadings = extractHeadings(heading);
        result.push(...childHeadings);
      }
      return result.join(";");
    }
    //按比例切割字符串
    function extractString(str, totalLength = 1000, ratioString = "5:3:2") {
      totalLength = Math.min(totalLength, 5000); // 最大5000字数
      if (str.length <= totalLength) { return str; }
      const ratios = ratioString.split(":").map(Number);
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0);
      const availableLength = Math.min(str.length, totalLength);
      const partLengths = ratios.map(ratio => Math.floor((availableLength * ratio) / sumRatios));
      const firstPart = str.substring(0, partLengths[0]);
      const midStartIndex = (str.length - 300) / 2; // 计算中间部分的起始索引
      const middlePart = str.substring(midStartIndex, midStartIndex + partLengths[1]);
      const lastPart = str.substring(str.length - partLengths[2]);
      const result = firstPart + middlePart + lastPart;
      return result;
    }
    //获得字符串，默认进行切割，false返回原文纯文本
    function getTextContent(element, i = true) {
      let content;
      if (i) {
        const totalLength = AI_option.total_length || 1000;
        const ratioString = AI_option.ratio_string || "5:3:2";
        content = `文章的各级标题：${extractHeadings(element)}。文章内容的截取：${extractString(getText(element), totalLength, ratioString)}`;
      } else {
        content = `${getText(element)}`;
      }
      return content;
    }
    //发送请求获得简介
    async function getGptResponse(content, i = true) {
      if (!tlKey) {
        return "没有获取到key，代码可能没有安装正确，详细请查看文档。";
      }
      if (tlKey === "123456") {
        return "请购买 key 使用，如果你能看到此条内容，则说明代码安装正确。";
      }
      completeGenerate = false;
      controller = new AbortController();
      signal = controller.signal;
      let response = '';
      if(sessionStorage.getItem('summary')){
        return JSON.parse(sessionStorage.getItem('summary'));
      }
      if (i) {
        try {
          response = await fetch('https://summary.tianli0.top/', {
            signal: signal,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Referer": tlReferer
            },
            body: JSON.stringify({
              content: content,
              key: tlKey,
              title: post_title,
              url: window.location.href,
              user_openid: visitorId
            })
          });
          completeGenerate = true;
          if (response.status === 429) {
            startAI('请求过于频繁，请稍后再请求AI。');
          }
          if (!response.ok) {
            throw new Error('Response not ok');
          }
          // 处理响应
        } catch (error) {
          if (error.name === "AbortError") {
            // console.log("请求已被中止");
          }else if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            startAI(`${interface.name}请求tianliGPT出错了，你正在本地进行调试，请前往summary.zhheo.com添加本地域名（127.0.0.1:端口）的白名单。`);
          }else{
            startAI(`${interface.name}请求tianliGPT出错了，请稍后再试。`);
          }
          completeGenerate = true;
          return "";
        }
        // 解析响应并返回结果
        const data = await response.json();
        summaryId = data.id;
        sessionStorage.setItem('summary', JSON.stringify(data));
        summarySpeechInit(true);
        return data;
      } else {
        const prompt = `你是一个摘要生成工具，你需要解释我发送给你的内容，不要换行，不要超过200字，只需要介绍文章的内容，不需要提出建议和缺少的东西。请用中文回答，文章内容为：${content}`;
        const apiUrl = "https://api.deepseek.com/v1/chat/completions";
        try {
          response = await fetch(apiUrl, {
            signal: signal,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [{ "role": "user", "content": prompt }],
            })
          });
          completeGenerate = true;
          if (response.status === 429) {
            startAI('请求过于频繁，请稍后再请求AI。');
          }
          if (!response.ok) {
            throw new Error('Response not ok');
          }
          // 处理响应
        } catch (error) {
          console.error('Error occurred:', error);
          startAI(`${interface.name}请求chatGPT出错了，请稍后再试。`);
          completeGenerate = true;
          return "";
        }
          // 解析响应并返回结果
          const data = await response.json();
          const outputText = data.choices[0].message.content;
          // 构造与tianliGPT相同的返回格式
          const result = {
              summary: outputText,
              id: Date.now().toString() // 生成一个简单的ID
          };
          sessionStorage.setItem('summary', JSON.stringify(result));
          return result;
      }
    }
    // 实验性功能，自动获取文章内容所在容器元素
    function getArticleElements(){
      // 计算元素的后代元素总个数
      function countDescendants(element) {
        let count = 1;
        for (const child of element.children) {
          count += countDescendants(child);
        }
        return count;
      }
      // 判断是否有要排除的元素
      function judgeElement(element) {
        const excludedTags = ['IFRAME', 'FOOTER', 'HEADER', 'BLOCKQUOTE']; // 添加要排除的标签
        if(excludedTags.includes(element.tagName)){
          return true;
        }
        const exclusionStrings = ['aplayer', 'comment']; // 排除包含其中字符串的className
        return Array.from(element.classList).some(className => exclusionStrings.some(exclusion => className.includes(exclusion)));
      }
      // 深度搜索，找到得分最高的父元素
      function findMaxHeadingParentElement(element) {
        const tagScores = {
          'H1': 1.5,
          'H2': 1,
          'H3': 0.5,
          'P': 1
        };
        let maxScore = 0;
        let maxHeadingParentElement = null;
        function dfs(element) {
          if (judgeElement(element)) {
            return;
          }
          let score = 0;
          for (const child of element.children) {
            if (child.tagName in tagScores) {
              score += tagScores[child.tagName];
            }
          }
          if (score > maxScore) {
            maxScore = score;
            maxHeadingParentElement = element;
          }
          for (const child of element.children) {
            dfs(child);
          }
        }
        dfs(element);
        return maxHeadingParentElement;
      }
      // 广度优先搜索，标记所有元素，并找到得分最高的父元素
      function findArticleContentElement() {
        const queue = [document.body];
        let maxDescendantsCount = 0;
        let articleContentElement = null;
        while (queue.length > 0) {
          const currentElement = queue.shift();
          // 判断当前元素是否要排除
          if (judgeElement(currentElement)) {
            continue;
          }
          const descendantsCount = countDescendants(currentElement);
          if (descendantsCount > maxDescendantsCount) {
            maxDescendantsCount = descendantsCount;
            articleContentElement = currentElement;
          }
          for (const child of currentElement.children) {
            queue.push(child);
          }
        }
        return findMaxHeadingParentElement(articleContentElement);
      }
      // 返回文章内容所在的容器元素
      return findArticleContentElement();
    }
    
    // 插入css
    function insertCSS(){
      const styleId = 'qx-ai-style';
      if(document.getElementById(styleId)) { return; }
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = AI_option.css || `:root{--ai-font-color:#353535;--ai-post-bg:#f1f3f8;--ai-content-bg:#fff;--ai-content-border:1px solid #e3e8f7;--ai-border:1px solid #e3e8f7bd;--ai-tag-bg:rgba(48,52,63,0.80);--ai-cursor:#333;--ai-btn-bg:rgba(48,52,63,0.75);--ai-title-color:#4c4948;--ai-btn-color:#fff;--ai-speech-content:#fff;}[data-theme=dark],.theme-dark,body.dark,body.dark-theme{--ai-font-color:rgba(255,255,255,0.9);--ai-post-bg:#30343f;--ai-content-bg:#1d1e22;--ai-content-border:1px solid #42444a;--ai-border:1px solid #3d3d3f;--ai-tag-bg:#1d1e22;--ai-cursor:rgb(255,255,255,0.9);--ai-btn-bg:#1d1e22;--ai-title-color:rgba(255,255,255,0.86);--ai-btn-color:rgb(255,255,255,0.9);--ai-speech-content:#1d1e22;}#post-ai.post-ai{background:var(--ai-post-bg);border-radius:12px;padding:10px 12px 11px;line-height:1.3;border:var(--ai-border);margin-top:10px;margin-bottom:6px;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-title{display:flex;color:var(--ai-title-color);border-radius:8px;align-items:center;padding:0 6px;position:relative;}#post-ai .ai-title i{font-weight:800;}#post-ai .ai-title-text{font-weight:bold;margin-left:8px;font-size:17px;}#post-ai .ai-tag{font-size:12px;background-color:var(--ai-tag-bg);color:var(--ai-btn-color);border-radius:4px;margin-left:auto;line-height:1;padding:4px 5px;border:var(--ai-border);}#post-ai .ai-explanation{margin-top:10px;padding:8px 12px;background:var(--ai-content-bg);border-radius:8px;border:var(--ai-content-border);font-size:18px;line-height:1.4;color:var(--ai-font-color);}#post-ai .ai-cursor{display:inline-block;width:7px;background:var(--ai-cursor);height:16px;margin-bottom:-2px;opacity:0.95;margin-left:3px;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-btn-box{font-size:15.5px;width:100%;display:flex;flex-direction:row;flex-wrap:wrap;}#post-ai .ai-btn-item{padding:5px 10px;margin:10px 16px 0px 5px;width:fit-content;line-height:1;background:var(--ai-btn-bg);border:var(--ai-border);color:var(--ai-btn-color);border-radius:6px 6px 6px 0;-webkit-border-radius:6px 6px 6px 0;-moz-border-radius:6px 6px 6px 0;-ms-border-radius:6px 6px 6px 0;-o-border-radius:6px 6px 6px 0;user-select:none;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;cursor:pointer;}#post-ai .ai-btn-item:hover{background:#49b0f5dc;}#post-ai .ai-recommend{display:flex;flex-direction:row;flex-wrap:wrap;}#post-ai .ai-recommend-item{width:50%;margin-top:2px;}#post-ai .ai-recommend-item a{border-bottom:2px solid #4c98f7;padding:0 .2em;color:#4c98f7;font-weight:700;text-decoration:none;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-recommend-item a:hover{background-color:#49b1f5;border-bottom:2px solid #49b1f5;color:#fff;border-radius:5px;}@media screen and (max-width:768px){#post-ai .ai-btn-box{justify-content:center;}}#post-ai .ai-title>svg{width:21px;height:fit-content;}#post-ai .ai-title>svg path{fill:var(--ai-font-color);}#post-ai .ai-Toggle{font-size:12px;border:var(--ai-border);background:var(--ai-btn-bg);color:var(--ai-btn-color);padding:3px 4px;border-radius:4px;margin-left:6px;cursor:pointer;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;-ms-transition:.3s;transition:.3s;font-weight:bolder;pointer-events:none;opacity:0;}#post-ai .ai-Toggle:hover{background:#49b0f5dc;}#post-ai .ai-speech-box{width:21px;height:21px;background:var(--ai-font-color);margin-left:7px;border-radius:50%;display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:center;pointer-events:none;opacity:0;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;-ms-transition:.3s;transition:.3s;cursor:pointer;}#post-ai .ai-speech-content{width:8px;background:var(--ai-speech-content);height:8px;border-radius:50%;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;-ms-transition:.3s;transition:.3s;}#post-ai .ai-speech-box:hover .ai-speech-content{background:#49b0f5;}@keyframes ai_breathe{0%{transform:scale(0.9);-webkit-transform:scale(0.9);-moz-transform:scale(0.9);-ms-transform:scale(0.9);-o-transform:scale(0.9);}50%{transform:scale(1);-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);}}`;
      AI_option.additional_css && (styleElement.textContent += AI_option.additional_css);
      document.head.appendChild(styleElement);
    }

    // 请求个性化推荐
    async function personalizedRecommend(){
      completeGenerate = false;
      controller = new AbortController();
      signal = controller.signal;
      const options = {
        signal,
        method: 'GET',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
      };
      try{
        const response = await fetch(`https://summary.tianli0.top/personalized_recommends?openid=${visitorId}`, options);
        completeGenerate = true;
        const data = await response.json();
        return data;
      }catch{
        startAI(`${interface.name}获取个性化推荐出错了，请稍后再试。`);
        completeGenerate = true;
        return null;
      }
    }

    ai_init();
  }
}
// 兼容旧版本配置项
if(typeof ai_option!=="undefined"){
  console.log("正在使用旧版本配置方式，请前往项目仓库查看最新配置写法");
  new ChucklePostAI(ai_option);
}