/* ==========================================================================
   AtlasPhysicsLevelIntro (关卡像素开场动画系统)
   序章：黑屏白字打字机介绍历史背景 -> 像素动画三幕式剧场（全自动播放）
   - 幕 1: 物理学家介绍 (THE SCIENTIST)
   - 幕 2: 历史故事与危机 (THE STORY & CRISIS)
   - 幕 3: 任务挑战与物理定律 (YOUR MISSION & LAWS)
   ========================================================================== */

(() => {
  const introData = {
    P01: {
      title: "阿基米德与浮力之谜",
      roleTitle: "古希腊力学与流体先驱",
      eraLocation: "公元前 250 年 · 西西里岛叙拉古王国",
      prologueText:
        "叙拉古国王赫农二世交付工匠足金打造奉献给神明的王冠，却怀疑其中被掺入了等重廉价的白银。国王命阿基米德在不损毁王冠的前提下查明真相。\n\n面对这道看似无解的难题，阿基米德在跨入注满热水的浴缸时，凝视着溢出的水流猛然顿悟——力学史上的第一声惊叹，即将震动整座地中海。",
      quote:
        "给我一个支点，我能撬动整个地球；给物体一个空间，水会告诉它能否远航。",
      story:
        "叙拉古的潮汐港要在退潮前运走四箱重要仪器。船工们深信沉重的金属与石料必沉无疑，拒绝让满载的货船离港。",
      challenge:
        "通过调整材料的形状制造出中空的吃水舱，先实现空载漂浮；再计算最大排开水重与货物总重的平衡，实现满载航行！",
      missionStep1: "亲手改变材料形状，比较同一质量不同形态的浮沉",
      missionStep2: "装载四箱重物进行满载测试，找到吃水与承载的安全边界",
      law: "F浮 = ρ水 · g · V排 = G总（漂浮平衡）",
    },
    P02: {
      title: "伽利略与自由落体加速",
      roleTitle: "近代实验科学与运动学之父",
      eraLocation: "1590 年 · 意大利比萨与帕多瓦",
      prologueText:
        "两千年来，亚里士多德的学说统治着欧洲大学所有的讲堂。经院学者们断言重物必比轻物下落更快，并将此奉为神圣不容置疑的真理。\n\n年轻的数学教授伽利略却走上钟楼与斜面。他决定抛弃陈腐的经院教条，让光滑的木槽、铜球与跳动的节拍器，亲自为大自然的真实法则作证。",
      quote:
        "真理不在经院学者的陈腐教条里，而在自然这本用数学符号写成的大书之中。",
      story:
        "钟楼里的三只报时钟越敲越急，管理员坚称是钟机坏了。伽利略却在光滑斜面上俯身倾听，坚信坏的不是钟，而是常人对时间的成见。",
      challenge:
        "重排轨道上三只小铜钟的位置刻度（1:4:9），让小球敲击出完全均匀的节拍；随后抬高坡度，验证加速规律的普适性！",
      missionStep1: "在轨道上拖动并测定钟距，让加速中的小球敲出等时节拍",
      missionStep2:
        "换上更陡的坡度，验证从静止开始的位移严格与时间的平方成正比",
      law: "s ∝ t²（从静止开始的匀加速运动）",
    },
    P03: {
      title: "牛顿与万有引力轨道",
      roleTitle: "经典物理与微积分集大成者",
      eraLocation: "1665 年 · 英国剑桥郡伍尔斯索普庄园",
      prologueText:
        "致命的大瘟疫席卷英伦，剑桥大学被迫关闭遣散学子。二十三岁的青年牛顿隐居在寂静的乡间农庄，在漫长的沉思中推演着开普勒行星定律。\n\n当成熟的苹果在暮色中笔直落向草地，一道穿越时空的灵感闪电划破夜空：那股将苹果拉向地心的力量，难道不可以穿透云层，一路延伸至苍穹深处的月球？",
      quote:
        "我不知道世人怎样看我，但我只觉得自己像在海边玩耍的孩童，拾到一枚更平滑的石子。",
      story:
        "树上的苹果会直坠地面，天上的月亮为何千百年来悬在夜空不落？牛顿邀你登上海拔穿透云层的高山，展开一场思想实验。",
      challenge:
        "消除空气阻力的干扰，从低速发射炮弹开始，一步步加速，直到炮弹下落的弧度正好与地球表面的弯曲一致，形成环绕轨道！",
      missionStep1: "测算平抛速度，观察炮弹从坠地过渡到掠过地平线",
      missionStep2:
        "寻找闭合圆形轨道的临界速度，揭示天体运行与地面落体的同一引力法则",
      law: "F = G · (M·m / r²)，万有引力充当向心力",
    },
    P04: {
      title: "焦耳与机械热功当量",
      roleTitle: "能量守恒定律的关键奠基人",
      eraLocation: "1843 年 · 英国索尔福德酿酒工坊",
      prologueText:
        "工业革命的蒸汽巨兽在浓烟中轰鸣，然而当时的科学泰斗们依然深信热是一种名为“热质”的无形流体，在冷热之间流动却永不消亡。\n\n酿酒师之子焦耳在阴冷的作坊地下室里，日复一日记录着重锤下落带动叶轮搅动水流所引起的极微弱温升。他执着地测量着每一个刻度，誓要揭开热与机械做功之间的终极联系。",
      quote:
        "自然界的力量不会湮灭，它们只是在运动、重力与热之间无休止地转换形态。",
      story:
        "阴冷的蒸汽工坊里，重锤落下带动叶片搅动绝热容器中的水，温度计水银柱仅上升了极其微小的一格。工匠们讥讽这只是手温造成的误差。",
      challenge:
        "排除环境散热与测量误差，严格记录机械重锤做功（W = mgh）与水吸热（Q = cmΔT）的精确数值，揭示热本质上是机械能量的转化！",
      missionStep1: "控制重锤坠落次数与水温读数，剥离外界传热干扰",
      missionStep2: "精密测量功与温升的比例，证实机械功与热能严格等价",
      law: "1 cal ≈ 4.184 J（机械功完全转化为内能）",
    },
    P05: {
      title: "托马斯·杨与双缝干涉",
      roleTitle: "光的波动说的伟大复兴者",
      eraLocation: "1801 年 · 英国伦敦皇家学会",
      prologueText:
        "牛顿的《光学》微粒说被奉为神圣教条长达百年，学术界无人敢于公开质疑光是粒子的定论。\n\n通晓十余门语言的博学者托马斯·杨，在昏暗百叶窗上凿开小孔，让阳光穿过两道极狭窄的细缝落在白墙上。展现在世人眼前的，不是预想中的两道亮线，而是一排令人震撼的明暗相间干涉条纹……",
      quote:
        "当两束同源的光相遇，光芒不仅可以增强光芒，更可以在黑暗处相互抵消。",
      story:
        "双缝花园的黄昏，日光穿过屏风上的两道极其微狭的细缝。助手惊呼：白墙上不仅没有更亮，反而凭空出现了一条条整齐的黑色暗纹！",
      challenge:
        "改变单缝与双缝的遮挡状态，微调光波波长与屏幕间距，观察明暗交替干涉条纹的漂移规律，用无可辩驳的证据推翻牛顿微粒说！",
      missionStep1:
        "对比单缝衍射与双缝干涉，验证两束光波峰波谷叠加形成的明暗条纹",
      missionStep2: "调整狭缝间距，证明暗条纹由波程差等于半波长奇数倍产生",
      law: "Δx = (L / d) · λ（波的干涉条纹间距公式）",
    },
    P06: {
      title: "法拉第与电磁感应实验",
      roleTitle: "电磁场理论与实验巨匠",
      eraLocation: "1831 年 · 伦敦阿尔伯马尔街皇家研究所",
      prologueText:
        "奥斯特发现了电流能让磁针偏转，但整整十一年间，无数顶尖学者用最强磁铁企图制造出电流，均以失败告终。\n\n装订工学徒出身的法拉第在手记里写下誓言：“将磁转变为电”。在皇家学会地下实验室无数次寂静的尝试后，当他猛然将磁铁插进闭合铜线圈的一瞬间，检流计指针终于发出了命运的跃动。",
      quote:
        "把一块磁铁放在铜线圈旁毫不起眼；但这正是点亮未来整个文明世界的火种。",
      story:
        "既然奥斯特证明了电能生磁，为何把强力磁铁静止插在铜线圈里却毫无电流？工坊管事嘲笑电磁感应只是一场幻梦。",
      challenge:
        "将磁铁以不同速度推进与拔出线圈，观察灵敏检流计的瞬间偏转，揭示出唯有磁通量发生动态变化时，才能激发出感应电动势！",
      missionStep1: "推进、拔出与静止磁铁，对比检流计指针的瞬时摆动与归零",
      missionStep2: "探究线圈匝数与磁铁移动速度对感应电流强度的决定性影响",
      law: "E = -n · (ΔΦ / Δt)（法拉第电磁感应定律）",
    },
    P07: {
      title: "麦克斯韦与赫兹电磁波接力",
      roleTitle: "电磁理论集大成者与无线电先驱",
      eraLocation: "1865－1887 年 · 英国剑桥与德国卡尔斯鲁厄",
      prologueText:
        "麦克斯韦用四组偏微分方程预言了电磁场将在真空中以光速传播，但二十年里未曾有人捕获过这股无形的波动。\n\n直到 1887 年的秋夜，卡尔斯鲁厄工学院暗室里，赫兹架起了火花放电线圈与微小的铜谐振环。当高压火花噼啪炸响，几米开外静止的铜环开口处，也悄然跳跃起微弱而耀眼的火花。",
      quote:
        "数学公式推导出了光速传播的电磁波；数十年后，火花隙的微光照亮了整个时空。",
      story:
        "麦克斯韦在手稿中预言电与磁在真空中交替激发形成电磁波；半个世纪后的落日信号海峡，年轻的赫兹支起火花发生器试图隔空捕获它。",
      challenge:
        "搭建高频火花发射天线，调谐远端接收环的固有谐振频率，让肉眼无法看见的高频电磁波动在接收端激发出同频率的跳跃火花！",
      missionStep1: "调节火花放电频率，排查静电感应与空间行波的根本区别",
      missionStep2: "旋转接收环寻找极化方向与波长节点，证实电磁波以光速传播",
      law: "c = 1 / √(ε₀μ₀) = f · λ（电磁波传播规律）",
    },
    P08: {
      title: "居里夫人与天然放射性",
      roleTitle: "放射化学先驱 · 双料诺奖得主",
      eraLocation: "1898 年 · 法国巴黎皇家理化学校废弃木棚",
      prologueText:
        "贝克勒尔偶然发现铀盐自发感光，但学界大多认为这只是普通的荧光残留。居里夫人敏锐地意识到：这绝非寻常反应，而是原子内部隐藏着巨大能量的铁证。\n\n在冬天滴水成冰的破旧木棚中，玛丽·居里用沉重的铁棒在成吨剧毒沥青铀矿中连续提炼数年。在压电石英秤不可思议的偏转深处，前所未有的放射性新元素正散发出幽蓝的微光。",
      quote:
        "生活中没有什么可怕的东西，只有需要被理解的东西。现在正是需要更多理解的时候。",
      story:
        "深夜简陋的沥青棚屋研究所里，压电石英秤的放电指针急速偏转。天然沥青铀矿中释放的放射性强度，竟然百倍于纯铀金属！",
      challenge:
        "建立无辐射空白对照基准，测定纯铀与不同矿石样本的电离饱和电流，从异常高强的放射信号中，锁定隐藏未知的强放射性新元素！",
      missionStep1: "执行仪器零漂校准与空白对照，排除环境湿度与空气漏电干扰",
      missionStep2:
        "精确比对沥青矿残渣与标准铀样本，证实矿石中必存在未发现的高活性物质",
      law: "I = q · N（射线电离空气产生饱和离子电流）",
    },
    P09: {
      title: "普朗克与能量子假说",
      roleTitle: "量子物理之父 · 辐射定律开创者",
      eraLocation: "1900 年 · 德国柏林物理学会",
      prologueText:
        "十九世纪末，人们以为物理学大厦已经完全竣工。然而，黑体辐射的实测曲线却如同晴天霹雳——经典电磁学计算出高频短波能量将趋于无穷，酿成了令人绝望的“紫外灾难”。\n\n以保守严谨著称的普朗克，在推导公式的绝境中做出了颠覆常理的假设：能量在微观世界中绝非连续流淌，而是以一份份不可分割的“量子”跳跃辐射。",
      quote:
        "科学不能解决自然的终极奥秘，因为我们本身就是自然的一部分，是在尝试解开自己。",
      story:
        "炼钢厂与实验室的高温黑体炉光芒耀眼。经典的连续波动理论预测高频短波会发出无限大能量（紫外灾变），而实测光谱曲线却在高频急剧掉头向下。",
      challenge:
        "打破物理量无限可分的连续性执念，设定微观带电振子吸收与辐射能量是以离散的份额 hν 跳跃进行的，完美拟合全波段黑体辐射曲线！",
      missionStep1: "在低频与高频两端比对维恩公式与瑞利-金斯公式的局限性",
      missionStep2:
        "引入作用量子常数 h，让辐射能量以量子化份额交换，平息紫外灾变",
      law: "E = n · h · ν（能量量子化假说）",
    },
    P10: {
      title: "爱因斯坦与光量子效应",
      roleTitle: "现代物理学泰斗 · 奇迹年创造者",
      eraLocation: "1905 年 · 瑞士伯尔尼联邦专利局",
      prologueText:
        "二十六岁的伯尔尼三等专利审查员爱因斯坦，在办公桌前审阅图纸的间隙，凝视着一个终极问题：光究竟是什么？\n\n为什么耀眼的极强红光打在金属板上激发不出一个电子，而极微弱的暗蓝光却能瞬间击出电子？在人类物理史上最为璀璨的“奇迹年”里，旧时空的绝对壁垒在年轻人的笔下轰然倒塌。",
      quote: "若要问我真正关心的物理问题，那便是：光究竟是什么？",
      story:
        "紫罗兰光电实验室里，极强的红色探照灯照在金属板上半天，却打不出哪怕一个电子；而换上一束极其微弱的暗蓝光，电子却在瞬间被击出！",
      challenge:
        "将光的频率（光子能量）与光强（光子数量）彻底分开，测量不同单色光的截止电压，揭示电子能否逸出只取决于单光子能量与金属逸出功！",
      missionStep1:
        "用高强红光与弱蓝光对比，证明光电子产生无须累积能量的时间延迟",
      missionStep2:
        "测量不同频率光的遏止电势，验证光电效应方程及金属逸出功边界",
      law: "Ek = h·ν - W逸（爱因斯坦光电效应方程）",
    },
  };

  function createIntro({ id, host, onComplete, onSkip, paused = false, startLabel = '选择身份 · 进入关卡 ►', missionCaption = '3幕探索 · 收集事实证据' }, config = {}) {
    const P = config.art || window.AtlasPhysicsPixelArt;
    const D = config.data || window.AtlasPhysicsData;
    const l = D.byId[id] || {};
    const info = config.info || introData[id] || introData.P01;
    const subject = config.subject || "PHYSICS";

    let phase = "prologue"; // "prologue" (黑屏白字打字) -> "theater" (像素动画三幕)
    let act = 1; // 1: 人物, 2: 故事与危机, 3: 任务挑战
    let autoplay = true;
    let isPaused = paused || matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 定时器引用
    let typingTimer = null;
    let prologueWaitTimer = null;
    let transitionTimer = null;
    let actTicker = null;
    let actTotalMs = 0;
    let actRemainingMs = 0;

    let container = null;
    let blackoutScreen = null;
    let completeTyping = null;

    function escapeHtml(str) {
      return String(str).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    }

    // ==========================================
    // 第一阶段：黑屏白字打字机序章
    // ==========================================
    function initPrologue() {
      blackoutScreen = document.createElement("div");
      blackoutScreen.className = "px-blackout-screen";
      blackoutScreen.innerHTML = `
        <header class="px-prologue-header">
          <div class="px-prologue-tag">
            <i></i>
            <span>HISTORICAL PROLOGUE // SCENARIO ${id.slice(1)}</span>
          </div>
          <button class="px-intro-skip" data-action="skip">跳过动画 [ESC] ►</button>
        </header>
        <main class="px-prologue-stage">
          <div class="px-prologue-box">
            <div class="px-prologue-era">
              <span class="px-dot"></span>
              <span>${escapeHtml(info.eraLocation)}</span>
            </div>
            <h2 class="px-prologue-title">${escapeHtml(info.title)}</h2>
            <div class="px-prologue-body"><span class="px-typed-text"></span><span class="px-caret">█</span></div>
          </div>
        </main>
        <footer class="px-prologue-footer">
          <div class="px-prologue-hint">
            按 <kbd>SPACE</kbd> / 点击黑屏快速显字 · 按 <kbd>ESC</kbd> 跳过
          </div>
          <div class="px-prologue-status">
            <span class="px-status-dot"></span>
            <span class="px-status-text">正在载入背景史实...</span>
          </div>
        </footer>
      `;

      container.appendChild(blackoutScreen);

      const typedTextEl = blackoutScreen.querySelector(".px-typed-text");
      const statusTextEl = blackoutScreen.querySelector(".px-status-text");
      const fullText = info.prologueText;
      let charIndex = 0;
      let typingFinished = false;

      function onTypingFinished() {
        if (typingFinished) return;
        typingFinished = true;
        if (typingTimer) {
          clearInterval(typingTimer);
          typingTimer = null;
        }
        typedTextEl.textContent = fullText;
        if (statusTextEl) {
          statusTextEl.textContent = "载入完毕 · 正在接入现场...";
        }

        // 自然停留 1.5 秒后结束黑屏并进入动画
        if(isPaused)return;
        prologueWaitTimer = setTimeout(() => {
          endPrologueAndEnterTheater();
        }, 1500);
      }
      completeTyping = onTypingFinished;

      // 开始逐字打字（间隔 28ms，约 3~3.5 秒打完）
      typingTimer = setInterval(() => {
        if (charIndex < fullText.length) {
          charIndex++;
          typedTextEl.textContent = fullText.slice(0, charIndex);
        } else {
          onTypingFinished();
        }
      }, 28);

      // 黑屏点击交互：未打完时点一次全显，已打完时再点立即切进动画
      blackoutScreen.addEventListener("click", (e) => {
        if (e.target.closest("button[data-action='skip']")) return;
        if (!typingFinished) {
          onTypingFinished();
        } else {
          endPrologueAndEnterTheater();
        }
      });

      // 暴露给按键使用的快进方法
      blackoutScreen._fastForward = () => {
        if (!typingFinished) {
          onTypingFinished();
        } else {
          endPrologueAndEnterTheater();
        }
      };
      if(isPaused)onTypingFinished();
    }

    function endPrologueAndEnterTheater() {
      if (phase !== "prologue") return;
      phase = "theater";

      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
      if (prologueWaitTimer) {
        clearTimeout(prologueWaitTimer);
        prologueWaitTimer = null;
      }

      if (blackoutScreen) {
        blackoutScreen.classList.add("px-prologue-exit");
        transitionTimer = setTimeout(() => {
          if (blackoutScreen && blackoutScreen.parentNode) {
            blackoutScreen.parentNode.removeChild(blackoutScreen);
          }
          blackoutScreen = null;
        }, 380);
      }

      // 渲染第一幕并启动自动播放
      renderAct();
    }

    // ==========================================
    // 第二阶段：像素剧场自动播放控制
    // ==========================================
    function getActDuration(actNum) {
      if (actNum === 1) return 4500;
      if (actNum === 2) return 5000;
      return 5500;
    }

    function startActTimer() {
      if (actTicker) {
        clearInterval(actTicker);
        actTicker = null;
      }
      if (!autoplay) return;

      actTotalMs = getActDuration(act);
      actRemainingMs = actTotalMs;
      updateProgressBar(0);
      updateCountdownInButton();

      actTicker = setInterval(() => {
        if (!isPaused) {
          actRemainingMs -= 100;
          const pct = Math.max(
            0,
            Math.min(100, ((actTotalMs - actRemainingMs) / actTotalMs) * 100),
          );
          updateProgressBar(pct);
          updateCountdownInButton();

          if (actRemainingMs <= 0) {
            clearInterval(actTicker);
            actTicker = null;
            if (act < 3) {
              next();
            } else {
              finish();
            }
          }
        }
      }, 100);
    }

    function updateProgressBar(pct) {
      if (!container) return;
      const bar = container.querySelector(".px-intro-progress-fill");
      if (bar) {
        bar.style.width = pct + "%";
      }
    }

    function updateCountdownInButton() {
      if (!container) return;
      const badge = container.querySelector(".px-btn-countdown");
      if (badge) {
        const sec = Math.max(1, Math.ceil(actRemainingMs / 1000));
        badge.textContent = `(${sec}s)`;
      }
    }

    function renderAct() {
      if (!container) return;
      const stage = container.querySelector(".px-intro-stage");
      const steps = container.querySelectorAll(".px-step-pill");
      const nextBtn = container.querySelector(".px-intro-actions");

      steps.forEach((p, i) => {
        p.classList.toggle("active", i + 1 === act);
      });

      if (act === 1) {
        stage.innerHTML = `
          <div class="px-act-person">
            <div class="px-person-frame">
              ${P.portrait(id)}
              <span class="px-person-era-badge">${escapeHtml(l.era || "")}</span>
            </div>
            <div class="px-person-info">
              <span class="px-kicker">SCENARIO ${id.slice(1)} // THE SCIENTIST</span>
              <h2>${escapeHtml(l.person || "")}</h2>
              <div class="px-english">${escapeHtml(l.english || "")} · ${escapeHtml(l.place || "")}</div>
              <div class="px-role-badge">◆ ${escapeHtml(info.roleTitle)}</div>
              <blockquote class="px-person-quote">“${escapeHtml(info.quote)}”</blockquote>
            </div>
          </div>
        `;
        nextBtn.innerHTML = `
          <button class="px-intro-btn-next" data-action="next">了解历史故事 02 ► <span class="px-btn-countdown"></span></button>
        `;
      } else if (act === 2) {
        stage.innerHTML = `
          <div class="px-act-story">
            <div class="px-story-scene-wrapper">
              ${P.scene(id, { round: 0 })}
            </div>
            <div class="px-story-dialogue">
              <span class="px-kicker">ACT 02 // HISTORICAL CRISIS & DISPUTE</span>
              <h3>${escapeHtml(info.title)}</h3>
              <p class="px-story-text">${escapeHtml(info.story)}</p>
              <div class="px-story-npc-box">
                <small>争议现场 ◈</small>
                <span>面对未决的疑问，常人的直觉正在阻碍新的解释诞生。</span>
              </div>
            </div>
          </div>
        `;
        nextBtn.innerHTML = `
          <button class="px-intro-btn-next" data-action="next">查看科学任务 03 ► <span class="px-btn-countdown"></span></button>
        `;
      } else {
        stage.innerHTML = `
          <div class="px-act-mission">
            <div class="px-mission-header">
              <h3><span>■</span> 你的科学挑战与取证任务</h3>
              <span>${escapeHtml(missionCaption)}</span>
            </div>
            <p class="px-story-text" style="color:var(--event-text,#f0f4fc);font-weight:600;margin-bottom:14px">
              ${escapeHtml(info.challenge)}
            </p>
            <div class="px-mission-grid">
              <div class="px-mission-card">
                <small>行动 01 // 建立参照</small>
                <p>${escapeHtml(info.missionStep1)}</p>
              </div>
              <div class="px-mission-card">
                <small>行动 02 // 面对新条件</small>
                <p>${escapeHtml(info.missionStep2)}</p>
              </div>
              <div class="px-mission-formula">
                <strong>核心科学定律</strong>
                <code>${escapeHtml(info.law)}</code>
              </div>
            </div>
          </div>
        `;
        nextBtn.innerHTML = `
          <button class="px-intro-btn-start" data-action="start">${escapeHtml(startLabel)} <span class="px-btn-countdown"></span></button>
        `;
      }

      startActTimer();
      container
        .querySelector(".px-intro-actions button")
        ?.focus({ preventScroll: true });
    }

    function gotoAct(targetAct) {
      act = targetAct;
      renderAct();
    }

    function next() {
      if (act < 3) {
        gotoAct(act + 1);
      } else {
        finish();
      }
    }

    function prev() {
      if (act > 1) {
        gotoAct(act - 1);
      }
    }

    function togglePause() {
      setPaused(!isPaused);
    }

    function setPaused(value) {
      isPaused = value;
      if (!container) return;
      container.classList.toggle('px-intro-paused',isPaused);
      if(isPaused&&phase==='prologue'){
        if(prologueWaitTimer){clearTimeout(prologueWaitTimer);prologueWaitTimer=null;}
        completeTyping?.();
      }
      const toggleBtn = container.querySelector(".px-intro-toggle-play");
      if (toggleBtn) {
        toggleBtn.textContent = isPaused ? "▶ 恢复自动" : "⏸ 暂停自动";
      }
    }

    function cleanAllTimers() {
      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
      if (prologueWaitTimer) {
        clearTimeout(prologueWaitTimer);
        prologueWaitTimer = null;
      }
      if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }
      if (actTicker) {
        clearInterval(actTicker);
        actTicker = null;
      }
    }

    function finish() {
      cleanAllTimers();
      window.removeEventListener("keydown", keyHandler, true);
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (typeof onComplete === "function") onComplete();
    }

    function skip() {
      cleanAllTimers();
      window.removeEventListener("keydown", keyHandler, true);
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (typeof onSkip === "function") onSkip();
    }

    // 创建 DOM 剧场主容器
    container = document.createElement("div");
    container.className = "px-intro-theater";
    const theme=P.themes?.[id];
    if(theme)for(const [name,value] of Object.entries({bg:theme.paper,panel:theme.panel,gold:theme.accent,text:theme.ink,dim:theme.muted,line:theme.far||theme.line}))if(value)container.style.setProperty('--event-'+name,value);
    container.innerHTML = `
      <div class="px-intro-progress-bar">
        <div class="px-intro-progress-fill"></div>
      </div>
      <header class="px-intro-header">
        <div class="px-intro-tag">
          <i></i>
          <span>${escapeHtml(subject)} CUTSCENE // SCENARIO ${id.slice(1)}</span>
        </div>
        <div class="px-intro-header-actions">
          <button class="px-intro-toggle-play" data-action="toggle-pause">⏸ 暂停自动</button>
          <button class="px-intro-skip" data-action="skip">跳过动画 [ESC] ►</button>
        </div>
      </header>
      <main class="px-intro-stage"></main>
      <footer class="px-intro-footer">
        <div class="px-intro-steps">
          <button class="px-step-pill" data-step="1">01 人物</button>
          <button class="px-step-pill" data-step="2">02 故事</button>
          <button class="px-step-pill" data-step="3">03 任务</button>
        </div>
        <div class="px-intro-actions"></div>
      </footer>
    `;

    container.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.action === "skip") {
        skip();
      } else if (btn.dataset.action === "toggle-pause") {
        togglePause();
      } else if (btn.dataset.action === "next") {
        next();
      } else if (btn.dataset.action === "start") {
        finish();
      } else if (btn.dataset.step) {
        gotoAct(Number(btn.dataset.step));
      }
    });

    const keyHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.removeEventListener("keydown", keyHandler, true);
        skip();
      } else if (e.key === "Tab") {
        const visible = [...container.querySelectorAll("button")].filter(
          (el) =>
            el.getClientRects().length &&
            !el.closest(".px-prologue-exit") &&
            (phase !== "prologue" || el.closest(".px-blackout-screen")),
        );
        const first = visible[0],
          last = visible.at(-1);
        if (!first) return;
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            !container.contains(document.activeElement))
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            !container.contains(document.activeElement))
        ) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        if (
          e.target.closest("button") &&
          (phase === "theater" || e.key === "Enter")
        )
          return;
        if (phase === "prologue") {
          e.preventDefault();
          if (blackoutScreen && blackoutScreen._fastForward) {
            blackoutScreen._fastForward();
          }
        } else {
          e.preventDefault();
          next();
        }
      } else if (e.key === "ArrowRight") {
        if (phase === "theater") {
          next();
        }
      } else if (e.key === "ArrowLeft") {
        if (phase === "theater") {
          prev();
        }
      }
    };
    window.addEventListener("keydown", keyHandler, true);

    host.appendChild(container);

    // 首先启动第一阶段：黑屏白字序章
    initPrologue();
    setPaused(isPaused);
    blackoutScreen
      .querySelector(".px-intro-skip")
      ?.focus({ preventScroll: true });

    return {
      pause: setPaused,
      destroy() {
        window.removeEventListener("keydown", keyHandler, true);
        cleanAllTimers();
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      },
    };
  }

  window.AtlasLevelIntro = { create: createIntro };
  window.AtlasPhysicsLevelIntro = {
    data: introData,
    create: createIntro,
  };
})();
