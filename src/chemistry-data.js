/* Authored encounters. Historical notes are separate from fictional dialogue. */
(() => {
  const sources = {
    boyle: [
      "Science History Institute · 波义耳",
      "https://www.sciencehistory.org/education/scientific-biographies/robert-boyle/",
    ],
    dalton: [
      "Science History Institute · 道尔顿",
      "https://www.sciencehistory.org/education/scientific-biographies/john-dalton/",
    ],
    periodic: [
      "Royal Society of Chemistry · 周期表的发展",
      "https://periodic-table.rsc.org/about",
    ],
    lewis: [
      "Lewis · The Atom and the Molecule, 1916",
      "https://pubs.acs.org/doi/10.1021/ja02261a002",
    ],
    avogadro: [
      "Science History Institute · 阿伏伽德罗",
      "https://www.sciencehistory.org/education/scientific-biographies/amedeo-avogadro/",
    ],
    hoff: [
      "Nobel · 现代化学的发展",
      "https://www.nobelprize.org/prizes/themes/the-nobel-prize-in-chemistry-the-development-of-modern-chemistry/",
    ],
    pauling: [
      "Pauling · 1954 Nobel lecture",
      "https://www.nobelprize.org/uploads/2018/06/pauling-lecture.pdf",
    ],
    lavoisier: [
      "Science History Institute · 拉瓦锡",
      "https://www.sciencehistory.org/education/scientific-biographies/antoine-laurent-lavoisier/",
    ],
    faraday: [
      "Royal Institution · 法拉第",
      "https://www.rigb.org/explore-science/explore/person/michael-faraday-1791-1867",
    ],
    daniell: [
      "Science Museum Group · 丹尼尔电池藏品",
      "https://collection.sciencemuseumgroup.org.uk/objects/co33732",
    ],
    shape: [
      "OpenStax · 分子结构与极性",
      "https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity",
    ],
    cell: [
      "OpenStax · 原电池",
      "https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells",
    ],
  };
  const choice = (key, label, options, value, role = "condition") => ({
    key,
    label,
    options,
    value,
    role,
    type: "choice",
  });
  const range = (key, label, min, max, step, value, unit = "") => ({
    key,
    label,
    min,
    max,
    step,
    value,
    unit,
    type: "range",
  });
  const task = (title, goal, controls, hint, success, failure) => ({
    title,
    goal,
    controls,
    hint,
    success,
    failure,
  });
  const levels = [
    {
      id: "C01",
      person: "罗伯特·波义耳",
      english: "ROBERT BOYLE",
      era: "英国 · 17 世纪",
      life: "1627—1691",
      place: "玻璃标本港",
      concept: "物质与性质",
      title: "两瓶一模一样的白色粉末",
      color: "#badc90",
      bg: "#18251f",
      panel: "#22372b",
      sky: "#c9dfc2",
      ground: "#789b69",
      opening:
        "港口的样品标签被海水浸坏了。盐与糖看起来几乎一样，下一艘船又送来了两块相似的金属。波义耳请你用可重复的性质找回标签。",
      quote: "眼睛看见的相似，值得再交给另一种测量。",
      history:
        "波义耳在《怀疑的化学家》（1661）中质疑传统的元素观，提倡用实验研究物质。港口失落标签的事件为教学创作，并非他的真实实验。",
      takeaway:
        "用多种性质交叉鉴别物质，先说明样品与测量条件。颜色相似并不意味着同一种物质。",
      formula: "证据 = 已知条件下的测量 + 与参考样品的比较",
      boundary:
        "这里只含指定纯样品：固定温度下的盐、糖、铁、铜。电导值为同条件溶液的相对示意。单一性质不能鉴别现实中所有未知物。",
      sources: [sources.boyle],
      claim: "指定条件下，多种性质可以帮助区分这些样品。",
      wrong: "颜色一样，就一定是同一种物质。",
      tasks: [
        task(
          "找回白色粉末的标签",
          "在盐和糖中鉴别未知样品 A。选择能区分它们的仪器，再贴标签。",
          [
            choice(
              "instrument",
              "检测仪器",
              [
                ["eye", "只看颜色"],
                ["density", "密度计"],
                ["conductivity", "溶液电导仪"],
              ],
              "eye",
            ),
            choice(
              "identity",
              "样品标签",
              [
                ["sugar", "糖"],
                ["salt", "盐"],
              ],
              "sugar",
              "answer",
            ),
          ],
          "参考：盐 / 糖的密度分别约 2.16 / 1.59 g/cm³；同条件溶液中，盐的电导明显更强。",
          "测量与盐的参考性质吻合。颜色没有告诉你的事，仪器补上了。",
          "样品 A 与盐的参考值吻合；仅看颜色无法区分，标签还需要有效测量支持。",
        ),
        task(
          "换一种材料，换一种证据",
          "样品 B 是铁或铜。找一种直接有效的性质来区分它们。",
          [
            choice(
              "instrument",
              "检测仪器",
              [
                ["eye", "只看轮廓"],
                ["conductivity", "检测导电"],
                ["magnet", "移入磁场"],
              ],
              "eye",
            ),
            choice(
              "identity",
              "样品标签",
              [
                ["copper", "铜"],
                ["iron", "铁"],
              ],
              "copper",
              "answer",
            ),
          ],
          "两块金属都能导电；本关给定样品中，铁会被磁铁明显吸引。",
          "样品被磁铁吸引，支持给它贴上铁的标签。",
          "导电是两块金属的共同性质；试试磁性，并根据观察贴标签。",
        ),
      ],
    },
    {
      id: "C02",
      person: "约翰·道尔顿",
      english: "JOHN DALTON",
      era: "英国 · 19 世纪初",
      life: "1766—1844",
      place: "原子砝码坊",
      concept: "原子与元素",
      title: "两份碳氧账单，为什么差一倍？",
      color: "#eea27c",
      bg: "#2c211e",
      panel: "#3b2c27",
      sky: "#edd0aa",
      ground: "#bc805e",
      opening:
        "相同质量的碳，能与两种不同质量的氧组成不同物质。道尔顿铺开原子符号，邀请你把看似杂乱的称量结果拼成整数比例。",
      quote: "把颗粒一颗颗数清，质量账单会出现秩序。",
      history:
        "道尔顿在 19 世纪初提出近代原子论，用原子及其组合解释化合比例。他的部分原子量和化学式后来得到修正。这里用现代 CO 与 CO₂ 数据重述比例问题。",
      takeaway:
        "在给定化合物中，组成原子数有固定比例；整体放大数量不会改变组成比例。",
      formula: "C : O 原子数 = 1 : 1 或 1 : 2；相对原子质量约 12 : 16",
      boundary:
        "原子圆点不是直接观察到的外形。原子量采用取整近似，只处理普通化学组合，不讨论同位素或核反应。",
      sources: [sources.dalton],
      claim: "整数原子数组合可以解释这里两种固定的质量比例。",
      wrong: "改变同一种化合物的份量，会任意改变它的原子比例。",
      tasks: [
        task(
          "还原第一份账单",
          "氧与碳的质量比为 4:3。调节原子数，使比例与 CO 一致。",
          [
            range("carbon", "碳原子", 1, 4, 1, 1, "个"),
            range("oxygen", "氧原子", 1, 8, 1, 2, "个"),
          ],
          "每个 C 按 12 份质量计，每个 O 按 16 份计。先比较 1 个 C 与 1 个 O。",
          "碳氧个数比 1:1，对应质量比 12:16，即 3:4。",
          "先分别用原子数乘以 12 和 16，再比较氧/碳质量比。",
        ),
        task(
          "多出来的一份氧",
          "另一份账单的氧/碳质量比为 8:3。可以整体放大，但不能改变比例。",
          [
            range("carbon", "碳原子", 1, 4, 1, 2, "个"),
            range("oxygen", "氧原子", 1, 8, 1, 2, "个"),
          ],
          "固定碳为 1 个，试着让氧的质量变成上一份的两倍。",
          "碳氧个数比 1:2；同量碳结合的氧质量是前一份的两倍。",
          "这份账单需要 C:O=1:2；把所有原子一起放大仍应保持这个比例。",
        ),
      ],
    },
    {
      id: "C03",
      person: "德米特里·门捷列夫",
      english: "DMITRI MENDELEEV",
      era: "俄国 · 1869 年与现代解释",
      life: "1834—1907",
      place: "元素温室",
      concept: "电子与价电子",
      title: "温室里的元素，应该住在哪一格？",
      color: "#d1d88a",
      bg: "#232b20",
      panel: "#333e2a",
      sky: "#d9e5b9",
      ground: "#88995c",
      opening:
        "温室里的元素卡片没有按颜色排队，而是按重复出现的性质分组。先认识门捷列夫的分类，再用现代电子层模型解释钠和氯的不同。",
      quote: "先找到重复的性质，再追问重复从哪里来。",
      history:
        "门捷列夫于 1869 年提出周期分类，并为未知元素留下空位。他的工作早于电子发现；关卡中的价电子和电子层是后来发展的现代解释。",
      takeaway:
        "对本关的主族元素，电子层数联系周期，价电子数帮助解释成键特点。钠与氯同处第三周期，价电子数不同。",
      formula: "Na：2,8,1；Cl：2,8,7（简化电子层表示）",
      boundary:
        "圆圈不是真实电子轨道；本关只处理 Na 和 Cl 两个主族原子，不能用这套简单规则覆盖全部过渡元素。",
      sources: [sources.periodic],
      claim: "钠和氯有相同的电子层数，但价电子数不同。",
      wrong: "门捷列夫用电子层理论直接发明了周期表。",
      tasks: [
        task(
          "给钠安排座位",
          "钠原子有 11 个电子；内层先填 2、8，确定占用层数与最外层电子数。",
          [
            range("shells", "占用电子层", 2, 4, 1, 2, "层"),
            range("outer", "最外层电子", 1, 8, 1, 4, "个"),
          ],
          "11 = 2 + 8 + 1。不是把 11 个电子全部放在最外层。",
          "3 层、最外层 1 个电子，与钠的简化排布吻合。",
          "钠的排布是 2,8,1：数电子层，再单独数最外层。",
        ),
        task(
          "给氯留下另一格",
          "氯原子有 17 个电子；它与钠同周期，却属于另一主族。",
          [
            range("shells", "占用电子层", 2, 4, 1, 3, "层"),
            range("outer", "最外层电子", 1, 8, 1, 1, "个"),
          ],
          "17 = 2 + 8 + 7。周期相同不代表价电子相同。",
          "3 层、最外层 7 个电子，解释了两张卡片为什么分属不同主族。",
          "氯的排布是 2,8,7；与钠同为 3 层，最外层却不是 1 个。",
        ),
      ],
    },
    {
      id: "C04",
      person: "吉尔伯特·路易斯",
      english: "GILBERT N. LEWIS",
      era: "美国 · 1916 年",
      life: "1875—1946",
      place: "电子对灯房",
      concept: "共价键入门",
      title: "电子没有搬家，两个原子为何连在一起？",
      color: "#c5a5e8",
      bg: "#282034",
      panel: "#392c48",
      sky: "#d9c9ea",
      ground: "#947ca6",
      opening:
        "灯房墙上只有原子符号和小小的电子点。路易斯提出，把一对电子画在两个原子之间，也许能解释它们如何结合。你来补全两幅电子账本。",
      quote: "两点之间的一对电子，也能成为一座桥。",
      history:
        "路易斯在 1916 年的论文《原子与分子》中提出共享电子对的成键思想。电子点式至今仍是描述成键和电子分配的基础工具。",
      takeaway:
        "共享电子对形成共价键；孤对电子也必须计入总电子账本。H₂ 的单键和 O₂ 的双键对应不同数量的共享电子对。",
      formula: "H—H：1 对共享电子；O=O：2 对共享电子 + 总共 4 对孤对电子",
      boundary:
        "采用局域电子对模型。O₂ 的实际顺磁性需要分子轨道理论解释；八隅体规则也有例外。孤对数在本关指整个分子的总对数。",
      sources: [sources.lewis],
      claim: "共享电子对与孤对电子共同组成这里的价电子账本。",
      wrong: "所有共价键都是一个原子把电子完全转交给另一个原子。",
      tasks: [
        task(
          "为氢点一座桥",
          "两个 H 各带 1 个电子；安排共享电子对与整个分子的孤对电子数。",
          [
            range("pairs", "共享电子对", 0, 3, 1, 0, "对"),
            range("lone", "总孤对电子", 0, 6, 1, 0, "对"),
          ],
          "H₂ 总共只有 2 个价电子；共享后，每个氢周围按 2 个电子计。",
          "1 对共享电子、0 对孤对，恰好用完两个氢的价电子。",
          "H₂ 总电子只有 2 个。多出的电子对不能凭空产生，0 对共享也没有键。",
        ),
        task(
          "补完氧的双桥",
          "两个 O 总共提供 12 个价电子。让每个 O 达到简化八隅体。",
          [
            range("pairs", "共享电子对", 0, 3, 1, 1, "对"),
            range("lone", "总孤对电子", 0, 6, 1, 2, "对"),
          ],
          "双键用 4 个电子；剩下 8 个电子成为 4 对孤对，每个 O 分到 2 对。",
          "2 对共享、总共 4 对孤对：总电子 12，每个氧周围按 8 个计。",
          "同时核对总电子数与每个氧的八隅体；孤对总数要在两边对称分配。",
        ),
      ],
    },
    {
      id: "C05",
      person: "阿梅代奥·阿伏伽德罗",
      english: "AMEDEO AVOGADRO",
      era: "意大利 · 1811 年的分子假说",
      life: "1776—1856",
      place: "分子邮局",
      concept: "分子与组成",
      title: "一枚分子邮票，装了几个原子？",
      color: "#a7b4f0",
      bg: "#222637",
      panel: "#30364b",
      sky: "#d2daf0",
      ground: "#8390af",
      opening:
        "邮局把原子印章与分子包裹混在了一起。阿伏伽德罗提醒大家：气体粒子和组成它的原子不能总当作同一件事。现在用现代分子式重新清点包裹。",
      quote: "先说清楚数的是原子，还是一整个分子。",
      history:
        "阿伏伽德罗在 1811 年提出同温同压下等体积气体含相同数目的粒子的假说，并区分气体粒子与其组成。这里的水、氨组装任务采用现代已知分子式，不是他的实验复原。",
      takeaway:
        "下标描述每个分子里的原子组成；分子前的数量系数改变总个数，不改变单个分子的组成。",
      formula: "3H₂O：3 个水分子，共 6 个 H 与 3 个 O",
      boundary:
        "只数水与氨的原子组成；分子式不自动给出构型、键角或物态，离子晶体也不都由独立分子组成。",
      sources: [sources.avogadro],
      claim: "改变分子份数会改变原子总数，但不改变单个分子的下标。",
      wrong: "把两个水分子合计成 H₄O₂，就得到一种新的水分子。",
      tasks: [
        task(
          "装好水分子包裹",
          "每个水分子放入 2 个 H、1 个 O；试着改变包裹份数。",
          [
            range("first", "每份 H", 1, 4, 1, 1, "个"),
            range("second", "每份 O", 1, 4, 1, 2, "个"),
            range("units", "分子份数", 1, 3, 1, 1, "份"),
          ],
          "H₂O 中的 2 只属于 H；省略的 O 下标表示 1。",
          "每一份都符合 H₂O；总原子数随份数成倍变化。",
          "先修正每一份中的 H 与 O 数量；增加包裹份数不会修正错误的下标。",
        ),
        task(
          "换成氨的邮票",
          "每个 NH₃ 分子应装 1 个 N 与 3 个 H。份数可以自行选择。",
          [
            range("first", "每份 N", 1, 4, 1, 2, "个"),
            range("second", "每份 H", 1, 4, 1, 2, "个"),
            range("units", "分子份数", 1, 3, 1, 1, "份"),
          ],
          "N 后没有下标，即每份 1 个 N；H 后的 3 即每份 3 个 H。",
          "每份都是 NH₃，邮局终于分清了分子数与原子数。",
          "NH₃ 不是 3 个分子，而是一个分子里含有 3 个氢原子。",
        ),
      ],
    },
    {
      id: "C06",
      person: "雅各布斯·范特霍夫",
      english: "J. H. VAN ’T HOFF",
      era: "荷兰 · 1874 年与现代构型模型",
      life: "1852—1911",
      place: "四面体花园",
      concept: "分子空间结构",
      title: "纸上的四根键，能伸向立体空间吗？",
      color: "#efb0bf",
      bg: "#31232c",
      panel: "#45313c",
      sky: "#f0d1d6",
      ground: "#b17d91",
      opening:
        "花园里的甲烷模型被压成了一张纸。范特霍夫的四面体碳给了你新的方向。将模型立起来，再借助现代模型研究水为什么是弯的。",
      quote: "纸面只是投影，试着从另一面看一看。",
      history:
        "1874 年，范特霍夫提出碳的四个价键指向四面体顶点；勒贝尔同年独立提出相关立体化学思想。水的构型任务采用后来的现代模型，不归于范特霍夫的历史工作。",
      takeaway:
        "CH₄ 为四面体，理想键角约 109.5°；水分子的原子构型为折线形，气相常用键角约 104.5°。",
      formula: "CH₄：四面体 ≈109.5°；H₂O：折线形 ≈104.5°",
      boundary:
        "键角转台只演示选定两根键的夹角；CH₄ 偏离理想角时不再是正四面体。电子域构型与原子构型有区别，图中球棍尺寸并非真实比例。",
      sources: [sources.hoff, sources.shape],
      claim: "分子式相同的一个模型，还需要空间构型与键角来描述。",
      wrong: "分子式已经唯一画出了所有原子的平面位置。",
      tasks: [
        task(
          "把甲烷从纸面立起来",
          "选择四面体构型，把参考 H—C—H 键角校准到约 109.5°。",
          [
            choice(
              "shape",
              "构型支架",
              [
                ["flat", "平面十字"],
                ["tetra", "四面体"],
                ["bent", "折线形"],
              ],
              "flat",
            ),
            range("angle", "参考键角", 90, 180, 0.5, 120, "°"),
          ],
          "四根键指向四面体四个顶点；转动视角只改变投影，不改变真正键角。",
          "立体支架与 109.5° 参考角一致；纸面十字不再冒充空间结构。",
          "甲烷需要四面体支架与约 109.5°；只改标签或只改角度都不完整。",
        ),
        task(
          "给水留出孤对的位置",
          "用现代构型模型把水的原子支架改为折线形，角度约 104.5°。",
          [
            choice(
              "shape",
              "原子构型",
              [
                ["linear", "直线形"],
                ["tetra", "四面体"],
                ["bent", "折线形"],
              ],
              "linear",
            ),
            range("angle", "H—O—H 键角", 90, 180, 0.5, 180, "°"),
          ],
          "水有两个成键电子域与两个孤对电子域；原子本身只形成一个弯折的三原子模型。",
          "水的原子构型是折线形；四个电子域不等于四个外围原子。",
          "水的原子构型不是直线或四面体，选择折线形并调整到约 104.5°。",
        ),
      ],
    },
    {
      id: "C07",
      person: "莱纳斯·鲍林",
      english: "LINUS PAULING",
      era: "美国 · 20 世纪化学键研究",
      life: "1901—1994",
      place: "偶极风向台",
      concept: "结构与性质",
      title: "两根极性键，为什么可能没有总方向？",
      color: "#f2c377",
      bg: "#30271d",
      panel: "#443726",
      sky: "#f0dcb4",
      ground: "#b29968",
      opening:
        "风向台上每根键都挂着一支箭头。鲍林的化学键研究启发你比较电子的吸引：有的箭头互相抵消，有的却共同指向一个方向。",
      quote: "看见每一根键以后，别忘了把它们合在一起看。",
      history:
        "鲍林研究化学键的本质、键的离子性与电负性，并获 1954 年诺贝尔化学奖。风向台是教学类比，不是一次真实历史实验。",
      takeaway:
        "分子极性同时取决于键偶极与空间构型。直线 CO₂ 的等大键偶极抵消，折线水分子则有非零合偶极。",
      formula: "等大双矢量合量 = 2p·cos(θ/2)（本关无量纲示意）",
      boundary:
        "箭头采用化学常见的由部分正电指向部分负电的示意。p 是无量纲强度，不是实际 Debye；只比较等大双键偶极模型，不定量推算溶解性。",
      sources: [sources.pauling, sources.shape],
      claim: "有极性键的分子，仍可能因为对称构型而使总偶极抵消。",
      wrong: "只要含有一根极性键，整个分子就一定有非零偶极。",
      tasks: [
        task(
          "让 CO₂ 的箭头相互抵消",
          "保留非零的键偶极强度，将 O—C—O 调为直线，观察合箭头。",
          [
            range("angle", "O—C—O 夹角", 90, 180, 0.5, 120, "°"),
            range("pull", "单键偶极强度", 0, 2, 0.1, 1, "示意"),
          ],
          "不能通过把所有箭头调成 0 来证明抵消；等大反向才是关键。",
          "两根非零箭头方向相反，合量为零。极性键与分子极性需要分别判断。",
          "保留至少 0.5 的键偶极，并把两根键调成约 180°。",
        ),
        task(
          "把箭头放回水的构型",
          "把 H—O—H 调回约 104.5°，保持非零键偶极，寻找合箭头。",
          [
            range("angle", "H—O—H 夹角", 90, 180, 0.5, 180, "°"),
            range("pull", "单键偶极强度", 0, 2, 0.1, 1, "示意"),
          ],
          "两支箭头现在从 H 指向 O。弯折以后，沿对称轴的分量不再抵消。",
          "折线构型中，键偶极的分量叠加，分子保留总方向。",
          "恢复水的约 104.5° 折线构型；强度过小或把模型拉直都不能代表这里的水。",
        ),
      ],
    },
    {
      id: "C08",
      person: "安托万·拉瓦锡",
      english: "ANTOINE LAVOISIER",
      era: "法国 · 18 世纪末",
      life: "1743—1794",
      place: "守恒天平所",
      concept: "化学反应与守恒",
      title: "离开天平的气体，带走了什么？",
      color: "#e2cb82",
      bg: "#2b291e",
      panel: "#3e3a28",
      sky: "#ede5c8",
      ground: "#a89966",
      opening:
        "天平一端的容器正在放出气体，读数越来越小。拉瓦锡请你先划清称量边界：减少的是整个系统的质量，还是留在天平上的那一部分？",
      quote: "把离开容器的也算进去，再合上这本账。",
      history:
        "拉瓦锡以精确称量研究燃烧和气体，推动了化学中的守恒观念。玛丽-安娜·拉瓦锡参与了翻译、记录与科学插图工作。本关放气账本为独立虚拟示例。",
      takeaway:
        "普通化学反应中原子重新组合。质量账本必须包含流入流出的物质；配平也必须同时守住每一种元素的原子数。",
      formula: "封闭系统：m前=m后；2H₂ + O₂ → 2H₂O",
      boundary:
        "放气示例不对应水生成方程，也没有真实药品操作。容器和附件的恒定质量已去皮；只讨论普通化学反应，不延伸至核反应。",
      sources: [sources.lavoisier],
      claim: "把物质流动计入边界后，质量和各元素原子账目都应守恒。",
      wrong: "反应后容器变轻，说明一部分原子消失了。",
      tasks: [
        task(
          "给气体也留一个座位",
          "从 100g 虚拟反应物中释放至少 2g 气体；用密闭边界把它也计入称量。",
          [
            choice(
              "closed",
              "称量边界",
              [
                ["open", "敞口容器"],
                ["closed", "密闭收集"],
              ],
              "open",
            ),
            range("gas", "转为气体的质量", 0, 8, 1, 4, "g"),
          ],
          "气体也有质量。敞口会让气体离开天平；密闭后，容器内外两部分应合计。",
          "气体留在称量边界内，总质量仍是 100g。",
          "密闭收集至少 2g 气体再比较；没有放气的空白不能检验这个问题。",
        ),
        task(
          "把守恒写成方程",
          "分别调整 H₂、O₂、H₂O 前的系数；两种元素都要配平。",
          [
            range("hydrogen", "H₂ 系数", 1, 6, 1, 1),
            range("oxygen", "O₂ 系数", 1, 3, 1, 1),
            range("water", "H₂O 系数", 1, 6, 1, 1),
          ],
          "左边 H=2a、O=2b；右边 H=2c、O=c。2:1:2 是最简整数比。",
          "氢和氧的原子数分别守恒；整数倍也保持平衡。",
          "看元素差额：先使 a=c，再使 c=2b；不能改分子式的下标来配平。",
        ),
      ],
    },
    {
      id: "C09",
      person: "迈克尔·法拉第",
      english: "MICHAEL FARADAY",
      era: "英国 · 1830 年代",
      life: "1791—1867",
      place: "电子渡口",
      concept: "氧化还原",
      title: "电子过河以后，铜为什么增加了？",
      color: "#89d5c3",
      bg: "#1d2b2a",
      panel: "#293e3b",
      sky: "#c7e7df",
      ground: "#6d9b92",
      opening:
        "电子渡口正在清点金属与离子的账目。法拉第把电量与物质变化联系起来：谁失去电子，谁接受电子，渡过多少电量又能沉积多少铜？",
      quote: "电量可以称量变化，前提是每一个电子都有去处。",
      history:
        "法拉第在 1830 年代建立电解定律，将通过的电量与物质变化量定量联系起来。渡船和锌铜配对是教学图像，不是他的原实验复原。",
      takeaway:
        "氧化是失电子，还原是得电子。理想电解中，沉积质量与电量成正比，也取决于每个离子需要的电子数。",
      formula: "Zn → Zn²⁺ + 2e⁻；Cu²⁺ + 2e⁻ → Cu；m=MQ/(zF)",
      boundary:
        "铜按二价离子计算，F≈96485C/mol、M≈63.546g/mol，默认电流效率 100%，忽略副反应。电子流图只作电荷账目，不是真实粒子轨迹。",
      sources: [sources.faraday, sources.cell],
      claim: "电子转移要配平；对同一种离子，理想沉积质量随电量成正比。",
      wrong: "电量相同，无论离子价态和物质种类，沉积质量都一样。",
      tasks: [
        task(
          "给渡船找到正确方向",
          "配平 Zn 与 Cu²⁺ 的电子转移：选择失电子的一方及每次转移的电子数。",
          [
            choice(
              "donor",
              "电子提供者",
              [
                ["Cu", "铜"],
                ["Zn", "锌"],
              ],
              "Cu",
            ),
            range("electrons", "每次电子转移", 1, 3, 1, 1, "个"),
          ],
          "锌变成 Zn²⁺ 失去 2 个电子；Cu²⁺ 接受同样 2 个电子还原成铜。",
          "Zn 提供 2 个电子，Cu²⁺ 接收 2 个电子，电荷与原子账目都闭合。",
          "检查方向与电荷：Zn 是失电子一方，变成 +2 价需要失去 2 个电子。",
        ),
        task(
          "用电量称出沉积铜",
          "铜为 Cu²⁺；设置正确所需电子数，并通过至少 386C 电量，观察理想沉积量。",
          [
            range("charge", "通过的电量", 193, 965, 193, 193, "C"),
            range("valence", "每个铜离子所需电子", 1, 3, 1, 1, "个"),
          ],
          "z 必须与 Cu²⁺ 对应为 2。386C 时约有 127mg 铜沉积；电量加倍，质量也加倍。",
          "二价铜的电子账目正确；你得到了一份质量随电量变化的可核对记录。",
          "这份样品是 Cu²⁺，每个离子需要 2 个电子；再增加电量检查沉积比例。",
        ),
      ],
    },
    {
      id: "C10",
      person: "约翰·弗雷德里克·丹尼尔",
      english: "JOHN FREDERIC DANIELL",
      era: "英国 · 1836 年",
      life: "1790—1845",
      place: "双杯信号站",
      concept: "原电池",
      title: "导线已经接上，指针为什么还不动？",
      color: "#e6b28a",
      bg: "#242b2b",
      panel: "#353c3b",
      sky: "#cce0d9",
      ground: "#779c90",
      opening:
        "信号站摆着两个互相分离的金属杯。丹尼尔让你把氧化与还原放在不同位置，让电子经过外电路。导线之外，还缺一条看不见的回路。",
      quote: "给电子一条外路，也给离子留一条回程。",
      history:
        "丹尼尔于 1836 年发明电池，采用分开的半电池改善持续供电。这里用现代常见锌铜双杯与盐桥画法说明原理，并非早期陶罐电池的外形复刻。",
      takeaway:
        "锌在负极失电子；电子经外电路走向铜电极，Cu²⁺ 在那里得电子。离子通路维持电中性，盐桥中不是电子在流。",
      formula: "Zn + Cu²⁺ → Zn²⁺ + Cu；E≈1.10V；I=E/(R外+R内)",
      boundary:
        "取近似标准电势 1.10V、固定内阻 10Ω，忽略浓度、极化和耗尽。指针是虚拟电流计，不把单节电池描写成能驱动真实灯塔。",
      sources: [sources.daniell, sources.cell],
      claim: "外电路中的电子与离子通路共同维持这套原电池的持续电流。",
      wrong: "只接导线就能永久供电，盐桥负责运送电子。",
      tasks: [
        task(
          "接通两条不同的路",
          "连接外导线与盐桥，让电流计持续偏转。观察两种流动的区别。",
          [
            choice(
              "wire",
              "外导线",
              [
                ["off", "断开"],
                ["on", "连接"],
              ],
              "off",
            ),
            choice(
              "bridge",
              "离子通路",
              [
                ["off", "移走盐桥"],
                ["on", "放回盐桥"],
              ],
              "off",
            ),
          ],
          "只有导线时电荷很快积累；盐桥让离子迁移，维持两杯的电中性。",
          "外路电子、内路离子共同形成完整回路，指针保持偏转。",
          "两条路都需要：电子沿金属导线，离子通过盐桥。",
        ),
        task(
          "给信号选对方向与负载",
          "保持完整回路，判断外路电子方向，并把电流调到至少 20mA。",
          [
            choice(
              "wire",
              "外导线",
              [
                ["off", "断开"],
                ["on", "连接"],
              ],
              "on",
            ),
            choice(
              "bridge",
              "离子通路",
              [
                ["off", "移走盐桥"],
                ["on", "放回盐桥"],
              ],
              "off",
            ),
            choice(
              "direction",
              "电子方向判断",
              [
                ["CuZn", "Cu → Zn"],
                ["ZnCu", "Zn → Cu"],
              ],
              "CuZn",
            ),
            range("load", "外电路电阻", 10, 100, 5, 80, "Ω"),
          ],
          "电子从 Zn 流向 Cu；回路完整时 I=1.10/(R+10)。试着减小外电阻。",
          "方向与负载都满足条件，信号站有了一份完整的供电解释。",
          "先接好两条路，选择 Zn→Cu 的电子方向，再用总电阻计算电流。",
        ),
      ],
    },
  ];
  const byId = Object.fromEntries(levels.map((l) => [l.id, l]));
  const api = { levels, byId, sources };
  if (typeof module !== "undefined") module.exports = api;
  if (typeof window !== "undefined") window.AtlasChemistryData = api;
})();
