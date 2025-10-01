(function () {
  const {
    randomNum,
    basicWordCount,
    btnLink,
    key: AIKey,
    Referer: AIReferer,
    gptName,
    switchBtn,
    mode: initialMode,
  } = GLOBAL_CONFIG.postHeadAiDescription;

  const { title, postAI, pageFillDescription } = GLOBAL_CONFIG_SITE;

  let lastAiRandomIndex = -1;
  let animationRunning = true;
  let mode = initialMode;
  let refreshNum = 0;
  let prevParam;
  let audio = null;
  let isPaused = false;
  let summaryID = null;

  const post_ai = document.querySelector(".post-ai-description");
  const aiTitleRefreshIcon = post_ai.querySelector(".ai-title .anzhiyufont.anzhiyu-icon-arrow-rotate-right");
  let aiReadAloudIcon = post_ai.querySelector(".anzhiyu-icon-circle-dot");
  const explanation = post_ai.querySelector(".ai-explanation");

  let aiStr = "";
  let aiStrLength = "";
  let delayInit = 600;
  let indexI = 0;
  let indexJ = 0;
  let timeouts = [];
  let elapsed = 0;

  const observer = createIntersectionObserver();
  const aiFunctions = [introduce, aiTitleRefreshIconClick, aiRecommend, aiGoHome];

  const aiBtnList = post_ai.querySelectorAll(".ai-btn-item");
  const filteredHeadings = Array.from(aiBtnList).filter(heading => heading.id !== "go-tianli-blog");
  filteredHeadings.forEach((item, index) => {
    item.addEventListener("click", () => {
      aiFunctions[index]();
    });
  });

  document.getElementById("ai-tag").addEventListener("click", onAiTagClick);
  aiTitleRefreshIcon.addEventListener("click", onAiTitleRefreshIconClick);
  document.getElementById("go-tianli-blog").addEventListener("click", () => {
    window.open(btnLink, "_blank");
  });
  aiReadAloudIcon.addEventListener("click", readAloud);

  async function readAloud() {
    if (!summaryID) {
      anzhiyu.snackbarShow("摘要还没加载完呢，请稍后。。。");
      return;
    }
    aiReadAloudIcon = post_ai.querySelector(".anzhiyu-icon-circle-dot");
    aiReadAloudIcon.style.opacity = "0.2";
    if (audio && !isPaused) {
      audio.pause();
      isPaused = true;
      aiReadAloudIcon.style.opacity = "1";
      aiReadAloudIcon.style.animation = "";
      aiReadAloudIcon.style.cssText = "animation: ''; opacity: 1;cursor: pointer;";
      return;
    }

    if (audio && isPaused) {
      audio.play();
      isPaused = false;
      aiReadAloudIcon.style.cssText = "animation: breathe .5s linear infinite; opacity: 0.2;cursor: pointer";
      return;
    }

    const options = {
      key: AIKey,
      Referer: AIReferer,
    };
    const requestParams = new URLSearchParams({
      key: options.key,
      id: summaryID,
    });

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Referer: options.Referer,
      },
    };

    try {
      const response = await fetch(`https://summary.tianli0.top/audio?${requestParams}`, requestOptions);
      if (response.status === 403) {
        console.error("403 refer与key不匹配。");
      } else if (response.status === 500) {
        console.error("500 系统内部错误");
      } else {
        const audioBlob = await response.blob();
        const audioURL = URL.createObjectURL(audioBlob);
        audio = new Audio(audioURL);
        audio.play();
        aiReadAloudIcon.style.cssText = "animation: breathe .5s linear infinite; opacity: 0.2;cursor: pointer";
        audio.addEventListener("ended", () => {
          audio = null;
          aiReadAloudIcon.style.opacity = "1";
          aiReadAloudIcon.style.animation = "";
        });
      }
    } catch (error) {
      console.error("请求发生错误❎");
    }
  }
  if (switchBtn) {
    document.getElementById("ai-Toggle").addEventListener("click", changeShowMode);
  }

  aiAbstract();
  showAiBtn();

  function createIntersectionObserver() {
    return new IntersectionObserver(
      entries => {
        let isVisible = entries[0].isIntersecting;
        animationRunning = isVisible;
        if (animationRunning) {
          delayInit = indexI === 0 ? 200 : 20;
          timeouts[1] = setTimeout(() => {
            if (indexJ) {
              indexI = 0;
              indexJ = 0;
            }
            if (indexI === 0) {
              explanation.innerHTML = aiStr.charAt(0);
            }
            requestAnimationFrame(animate);
          }, delayInit);
        }
      },
      { threshold: 0 }
    );
  }

  function animate(timestamp) {
    if (!animationRunning) {
      return;
    }
    if (!animate.start) animate.start = timestamp;
    elapsed = timestamp - animate.start;
    if (elapsed >= 20) {
      animate.start = timestamp;
      if (indexI < aiStrLength - 1) {
        let char = aiStr.charAt(indexI + 1);
        let delay = /[,.，。!?！？]/.test(char) ? 150 : 20;
        if (explanation.firstElementChild) {
          explanation.removeChild(explanation.firstElementChild);
        }
        explanation.innerHTML += char;
        let div = document.createElement("div");
        div.className = "ai-cursor";
        explanation.appendChild(div);
        indexI++;
        if (delay === 150) {
          post_ai.querySelector(".ai-explanation .ai-cursor").style.opacity = "0.2";
        }
        if (indexI === aiStrLength - 1) {
          observer.disconnect();
          explanation.removeChild(explanation.firstElementChild);
        }
        timeouts[0] = setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      }
    } else {
      requestAnimationFrame(animate);
    }
  }

  function clearTimeouts() {
    if (timeouts.length) {
      timeouts.forEach(item => {
        if (item) {
          clearTimeout(item);
        }
      });
    }
  }

  function startAI(str, df = true) {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    observer.disconnect();
    explanation.innerHTML = df ? "生成中. . ." : "请等待. . .";
    aiStr = str;
    aiStrLength = aiStr.length;
    observer.observe(post_ai);
  }

  async function aiAbstract(num = basicWordCount) {
    if (mode === "tianli") {
      await aiAbstractTianli(num);
    } else {
      aiAbstractLocal();
    }
  }

  async function aiAbstractTianli(num) {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    observer.disconnect();

    num = Math.max(10, Math.min(2000, num));
    const options = {
      key: AIKey,
      Referer: AIReferer,
    };
    const truncateDescription = (title + pageFillDescription).trim().substring(0, num);

    const requestBody = {
      key: options.key,
      content: truncateDescription,
      url: location.href,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: options.Referer,
      },
      body: JSON.stringify(requestBody),
    };
    console.info(truncateDescription.length);
    try {
      let animationInterval = null;
      let summary;
      if (animationInterval) clearInterval(animationInterval);
      animationInterval = setInterval(() => {
        const animationText = "生成中" + ".".repeat(indexJ);
        explanation.innerHTML = animationText;
        indexJ = (indexJ % 3) + 1;
      }, 500);
      const response = await fetch(`https://summary.tianli0.top/`, requestOptions);
      let result;
      if (response.status === 403) {
        result = {
          summary: "403 refer与key不匹配。",
        };
      } else if (response.status === 500) {
        result = {
          summary: "500 系统内部错误",
        };
      } else {
        result = await response.json();
      }

      summary = result.summary.trim();
      summaryID = result.id;

      setTimeout(() => {
        aiTitleRefreshIcon.style.opacity = "1";
      }, 300);
      if (summary) {
        startAI(summary);
      } else {
        startAI("摘要获取失败!!!请检查Tianli服务是否正常!!!");
      }
      clearInterval(animationInterval);
    } catch (error) {
      console.error(error);
      explanation.innerHTML = "发生异常" + error;
    }
  }

  // function aiAbstractLocal() {
  //   const strArr = postAI.split(",").map(item => item.trim());
  //   if (strArr.length !== 1) {
  //     let randomIndex = Math.floor(Math.random() * strArr.length);
  //     while (randomIndex === lastAiRandomIndex) {
  //       randomIndex = Math.floor(Math.random() * strArr.length);
  //     }
  //     lastAiRandomIndex = randomIndex;
  //     startAI(strArr[randomIndex]);
  //   } else {
  //     startAI(strArr[0]);
  //   }
  //   setTimeout(() => {
  //     aiTitleRefreshIcon.style.opacity = "1";
  //   }, 600);
  // }

// 新本地模式函数（对接 DeepSeek API）
  async function aiAbstractLocal() {
    // 1. 准备调用参数（从主题配置中获取 Key 和 Referer）
    const deepSeekKey = AIKey; // 主题配置中 post_head_ai_description.key 字段
    const blogReferer = AIReferer; // 主题配置中 post_head_ai_description.Referer 字段
    const maxSummaryLength = 300; // 摘要最大字数（可改 200-500）
    
    // 2. 提取文章内容（与天离模式逻辑一致，确保内容长度达标）
    const articleContent = (title + pageFillDescription).trim();
    const truncateContent = articleContent.substring(0, basicWordCount); // 截取基础字数
    if (truncateContent.length < 100) {
      startAI("文章内容过短，无法生成摘要~");
      setTimeout(() => aiTitleRefreshIcon.style.opacity = "1", 600);
      return;
    }

    // 3. 显示「生成中」提示
    explanation.innerHTML = "生成中. . .";
    aiTitleRefreshIcon.style.opacity = "0.2"; // 刷新图标置灰

    try {
      // 4. 调用 DeepSeek API（核心请求逻辑）
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepSeekKey}` // 关键：DeepSeek Key 授权
        },
        body: JSON.stringify({
          model: "deepseek-chat", // DeepSeek 基础模型（固定值，不要改）
          messages: [
            {
              role: "user",
              content: `你是博客文章摘要助手，需基于以下内容生成摘要：
              1. 字数控制在 ${maxSummaryLength} 字以内，只保留核心内容（如主题、步骤、结论）；
              2. 语言简洁，不用换行和列表，纯段落式；
              3. 不添加额外评价、建议或扩展内容。
              文章内容：${truncateContent}`
            }
          ],
          max_tokens: maxSummaryLength, // 限制摘要最大长度（与上面一致）
          temperature: 0.7, // 随机性：0.7 适中（0-1 之间，越低越固定）
          stream: false // 关闭流式返回，一次性获取完整摘要
        })
      });

      // 5. 处理 API 响应
      if (!response.ok) {
        throw new Error(`API 请求失败（状态码：${response.status}）`);
      }
      const result = await response.json();
      const summary = result.choices[0].message.content.trim(); // 提取摘要内容

      // 6. 显示生成的摘要
      if (summary) {
        startAI(summary); // 调用现有动画函数显示摘要
      } else {
        startAI("未获取到摘要，请点击刷新重试~");
      }

    } catch (error) {
      // 7. 错误处理（显示友好提示）
      console.error("DeepSeek 摘要生成失败：", error);
      let errorMsg = "摘要生成失败，请检查 API Key 或网络~";
      if (error.message.includes("401")) {
        errorMsg = "API Key 错误，请核对后重新配置~";
      } else if (error.message.includes("403")) {
        errorMsg = "API 权限不足，可能是额度用尽~";
      }
      startAI(errorMsg);

    } finally {
      // 8. 恢复刷新图标状态
      setTimeout(() => aiTitleRefreshIcon.style.opacity = "1", 600);
    }
  }

  function aiRecommend() {
    indexI = 0;
    indexJ = 1;
    clearTimeouts();
    animationRunning = false;
    elapsed = 0;
    explanation.innerHTML = "生成中. . .";
    aiStr = "";
    aiStrLength = "";
    observer.disconnect();
    timeouts[2] = setTimeout(() => {
      explanation.innerHTML = recommendList();
    }, 600);
  }

  function recommendList() {
    let thumbnail = document.querySelectorAll(".relatedPosts-list a");
    if (!thumbnail.length) {
      const cardRecentPost = document.querySelector(".card-widget.card-recent-post");
      if (!cardRecentPost) return "";

      thumbnail = cardRecentPost.querySelectorAll(".aside-list-item a");

      let list = "";
      for (let i = 0; i < thumbnail.length; i++) {
        const item = thumbnail[i];
        list += `<div class="ai-recommend-item"><span class="index">${
          i + 1
        }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
          item.title
        }" data-pjax-state="">${item.title}</a></div>`;
      }

      return `很抱歉，无法找到类似的文章，你也可以看看本站最新发布的文章：<br /><div class="ai-recommend">${list}</div>`;
    }

    let list = "";
    for (let i = 0; i < thumbnail.length; i++) {
      const item = thumbnail[i];
      list += `<div class="ai-recommend-item"><span>推荐${
        i + 1
      }：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${
        item.title
      }" data-pjax-state="">${item.title}</a></div>`;
    }

    return `推荐文章：<br /><div class="ai-recommend">${list}</div>`;
  }

  function aiGoHome() {
    startAI("正在前往博客主页...", false);
    timeouts[2] = setTimeout(() => {
      if (window.pjax) {
        pjax.loadUrl("/");
      } else {
        location.href = location.origin;
      }
    }, 1000);
  }

  function introduce() {
    if (mode == "tianli") {
      startAI("我是文章辅助AI: TianliGPT，点击下方的按钮，让我生成本文简介、推荐相关文章等。");
    } else {
      startAI(`我是文章辅助AI: ${gptName} GPT，点击下方的按钮，让我生成本文简介、推荐相关文章等。`);
    }
  }

  function aiTitleRefreshIconClick() {
    aiTitleRefreshIcon.click();
  }

  // function onAiTagClick() {
  //   if (mode === "tianli") {
  //     post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "none"));
  //     document.getElementById("go-tianli-blog").style.display = "block";
  //     startAI(
  //       "你好，我是Tianli开发的摘要生成助理TianliGPT，是一个基于GPT-4的生成式AI。我在这里只负责摘要的预生成和显示，你无法与我直接沟通，如果你也需要一个这样的AI摘要接口，可以在下方购买。"
  //     );
  //   } else {
  //     post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
  //     document.getElementById("go-tianli-blog").style.display = "none";
  //     startAI(
  //       `你好，我是本站摘要生成助理${gptName} GPT，是一个基于GPT-4的生成式AI。我在这里只负责摘要的预生成和显示，你无法与我直接沟通。`
  //     );
  //   }
  // }
  function onAiTagClick() {
    if (mode === "tianli") {
      // 天离模式介绍（无需修改）
      post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "none"));
      document.getElementById("go-tianli-blog").style.display = "block";
      startAI(
        "你好，我是Tianli开发的摘要生成助理TianliGPT，是一个基于GPT-4的生成式AI。我在这里只负责摘要的预生成和显示，你无法与我直接沟通，如果你也需要一个这样的AI摘要接口，可以在下方购买。"
      );
    } else {
      // 本地模式介绍（修改为 DeepSeek 描述）
      post_ai.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
      document.getElementById("go-tianli-blog").style.display = "none";
      startAI(
        `你好，我是本站摘要生成助理${gptName}，基于 DeepSeek AI 开发。我负责生成本文核心摘要，点击下方按钮可获取推荐文章或返回主页~`
      );
    }
  }

  function onAiTitleRefreshIconClick() {
    const truncateDescription = (title + pageFillDescription).trim().substring(0, basicWordCount);

    aiTitleRefreshIcon.style.opacity = "0.2";
    aiTitleRefreshIcon.style.transitionDuration = "0.3s";
    aiTitleRefreshIcon.style.transform = "rotate(" + 360 * refreshNum + "deg)";
    if (truncateDescription.length <= basicWordCount) {
      let param = truncateDescription.length - Math.floor(Math.random() * randomNum);
      while (param === prevParam || truncateDescription.length - param === prevParam) {
        param = truncateDescription.length - Math.floor(Math.random() * randomNum);
      }
      prevParam = param;
      aiAbstract(param);
    } else {
      let value = Math.floor(Math.random() * randomNum) + basicWordCount;
      while (value === prevParam || truncateDescription.length - value === prevParam) {
        value = Math.floor(Math.random() * randomNum) + basicWordCount;
      }
      aiAbstract(value);
    }
    refreshNum++;
  }

  // function changeShowMode() {
  //   mode = mode === "tianli" ? "local" : "tianli";
  //   if (mode === "tianli") {
  //     document.getElementById("ai-tag").innerHTML = "TianliGPT";

  //     aiReadAloudIcon.style.opacity = "1";
  //     aiReadAloudIcon.style.cursor = "pointer";
  //   } else {
  //     aiReadAloudIcon.style.opacity = "0";
  //     aiReadAloudIcon.style.cursor = "auto";
  //     if ((document.getElementById("go-tianli-blog").style.display = "block")) {
  //       document.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
  //       document.getElementById("go-tianli-blog").style.display = "none";
  //     }
  //     document.getElementById("ai-tag").innerHTML = gptName + " GPT";
  //   }
  //   aiAbstract();
  // }
  function changeShowMode() {
    mode = mode === "tianli" ? "local" : "tianli";
    if (mode === "tianli") {
      // 天离模式逻辑（无需修改）
      document.getElementById("ai-tag").innerHTML = "TianliGPT";
      aiReadAloudIcon.style.opacity = "1";
      aiReadAloudIcon.style.cursor = "pointer";
    } else {
      // 本地模式逻辑（修改这里，隐藏天离按钮和语音图标）
      document.getElementById("ai-tag").innerHTML = gptName + " GPT";
      aiReadAloudIcon.style.opacity = "0"; // 隐藏语音图标（DeepSeek 无语音功能）
      aiReadAloudIcon.style.cursor = "auto";
      // 关键：隐藏天离购买按钮，显示其他功能按钮
      document.getElementById("go-tianli-blog").style.display = "none";
      document.querySelectorAll(".ai-btn-item").forEach(item => item.style.display = "block");
    }
    aiAbstract(); // 切换后重新生成摘要
  }

  function showAiBtn() {
    if (mode === "tianli") {
      document.getElementById("ai-tag").innerHTML = "TianliGPT";
    } else {
      document.getElementById("ai-tag").innerHTML = gptName + " GPT";
    }
  }
})();
