/* Historical questions, fictional encounters. Dialogue is a game creation. */
(() => {
  const levels = [
    {
      id: "P01",
      person: "阿基米德",
      english: "ARCHIMEDES",
      era: "古希腊 · 公元前 3 世纪",
      place: "潮汐港",
      title: "装不下最后一箱的船",
      concept: "浮力与平衡",
      act: "第一幕 · 让世界可以理解",
      color: "#608b83",
      opening:
        "潮水漫过旧码头。船工正把第四箱仪器搬回岸上——这艘小船，似乎怎么也装不下它。",
      greeting: "先别丢掉那箱仪器。同样一块材料，换个形状，会发生什么？",
      steps: [
        {
          title: "先让船体浮起来",
          goal: "把同一块材料做成能浮起的船。先空载试航。",
          action: "把船放进水里",
          hint: "实心团排不开足够的水。试试中空、开口向上的船体。",
          success: "它浮起来了！材料没有变轻，却能在进水前排开更多水。",
        },
        {
          title: "把四箱仪器一起带走",
          goal: "带上四箱器材，选一艘承载空间足够的船，再次离港。",
          action: "载着器材离港",
          hint: "每箱都增加重量。更宽的中空船体能在淹没前排开更多水。",
          success: "四箱器材抵达对岸。浮力与总重量平衡，船才有余量继续航行。",
        },
      ],
      defaults: { shape: "lump", cargo: 0 },
      takeaway:
        "漂浮时，排开水的重量等于船与货物的总重量。改变形状可以改变最大承载能力。",
      letter: "后来的人：别只问东西有多重，也问它为自己让出了多少空间。",
      nextQuestion: "能让东西保持平衡以后，我们还要学会描述它怎样动。",
      formula: "F浮 = ρ水gV排　　漂浮时 F浮 = G总",
      boundary:
        "水密度取1 kg/L；船体1.2 kg，每箱1.2 kg。船型决定进水前最大排水体积。此处不模拟侧翻和流体阻力。",
      history:
        "阿基米德研究平衡与浮体。港口运货是游戏创作，船型用简化模型表现浮力。",
      source: [
        "伽利略博物馆 · 平衡科学",
        "https://catalogue.museogalileo.it/section/ScienceOfEquilibrium.html",
      ],
    },
    {
      id: "P02",
      person: "伽利略",
      english: "GALILEO",
      era: "意大利 · 17 世纪",
      place: "斜面钟楼",
      title: "钟声为什么越来越急？",
      concept: "速度与加速度",
      act: "第一幕 · 让世界可以理解",
      color: "#a68752",
      opening:
        "钟楼管理员坚持说，三只钟坏了。小球经过时，它们总是越响越急。伽利略却把耳朵凑向了轨道。",
      greeting: "也许钟没有坏。先听一遍，再试着挪动它们。",
      steps: [
        {
          title: "让钟声变成均匀的节拍",
          goal: "拖动三只小钟，再释放小球，让三次钟声以相等间隔响起。",
          action: "放下小球，听钟声",
          hint: "小球越来越快，后面的钟要隔得更远。试试轨道刻度1、4、9。",
          success: "叮——叮——叮。相等时间里，小球走过的距离越来越长。",
        },
        {
          title: "坡变陡了，规律还在吗？",
          goal: "把轨道换成陡坡。保留你的钟位，看看均匀节拍能否继续出现。",
          action: "在新坡度上放球",
          hint: "换成陡坡会整体变快，但从静止开始的位移仍与时间平方成正比。",
          success: "节拍变快，但依然均匀。你找到了能跨越一次具体实验的关系。",
        },
      ],
      defaults: { bells: [1, 2, 3], slope: "gentle" },
      takeaway: "从静止开始的理想匀加速运动中，位移与时间的平方成正比。",
      letter: "后来的人：把太快的变化慢下来，把含糊的感觉变成可以比较的记录。",
      nextQuestion: "测出了运动的变化，是什么在改变它？",
      formula: "s ∝ t²（从静止开始的匀加速运动）",
      boundary:
        "理想纯滚动，同一坡度上加速度恒定；钟位表示轨道距离。播放为加速演示，忽略碰钟的能量变化。",
      history:
        "钟声斜面借鉴博物馆保存的后世演示装置；没有证据表明伽利略原样做过这套三钟实验。",
      source: [
        "伽利略博物馆 · 斜面装置",
        "https://www.museogalileo.it/it/galileo/strumenti.html",
      ],
    },
    {
      id: "P03",
      person: "牛顿",
      english: "ISAAC NEWTON",
      era: "英国 · 17 世纪",
      place: "山顶轨道台",
      title: "一封绕过世界的信",
      concept: "引力与轨道",
      act: "第一幕 · 让世界可以理解",
      color: "#687f9a",
      opening:
        "山另一边的邮路被云海吞没。牛顿在纸上画了一个圆，又画了一只从山顶飞出的信筒。",
      greeting: "先在思想中造一个没有空气阻力的世界。看看一封信可以飞多远。",
      steps: [
        {
          title: "一封普通的投递",
          goal: "先用较小的水平初速度投出信筒，观察它怎样回到地面。",
          action: "投出第一封信",
          hint: "选择较小的初速度。抛出去以后，它仍受到指向星球中心的引力。",
          success: "信筒向前飞，也向地面落。引力一直在改变它的运动方向。",
        },
        {
          title: "让落下的信绕过世界",
          goal: "增加水平初速度，让信筒不碰到地面，绕星球一周。",
          action: "尝试环球投递",
          hint: "参考圆轨道速度是刻度1.00。太慢会落地，太快可能逃离。",
          success: "投递完成！它一直在下落，但弯曲的地面也一直从它下方退开。",
        },
      ],
      defaults: { speed: 0.6 },
      takeaway:
        "天体轨道和地面抛体可以在同一套引力规律下理解；环绕不表示没有重力。",
      letter: "后来的人：地上的运动与天上的运动，也许从来不是两回事。",
      nextQuestion: "运动停下以后，能量会藏在哪里？",
      formula: "F = GMm/r²　　v圆 = √(GM/r)",
      boundary:
        "牛顿炮弹思想实验的信筒改编。无空气、无自转，中心引力，两体近似。速度以发射高度处圆轨道速度为单位。",
      history:
        "牛顿用山顶发射的思想实验把抛体与环绕运动联系起来。本关运行简化的炮弹模型，不代表实际进行过山顶发射。",
      source: [
        "欧洲空间局 · 牛顿的炮弹",
        "https://www.esa.int/ESA_Multimedia/Images/2004/12/Newton_s_cannon2",
      ],
    },
    {
      id: "P04",
      person: "焦耳",
      english: "JAMES JOULE",
      era: "英国 · 1840 年代",
      place: "热功工坊",
      title: "没有炉火的热水",
      concept: "功、热与能量",
      act: "第二幕 · 寻找看不见的联系",
      color: "#a67551",
      opening:
        "工坊没有点火。悬挂的重物落到底部以后，水中的温度计却往上挪了一小格。",
      greeting: "变化很小。我们把刻度放大，看看停下的运动留下了什么。",
      steps: [
        {
          title: "把重物和水连起来",
          goal: "接上搅拌桨，让重物下落一次，观察水温。",
          action: "松开重物",
          hint: "没有接上绳轮时，重物不能带动水里的桨。先连好传动。",
          success: "水温升高了一点。重物做的功，通过搅拌增加了水的内能。",
        },
        {
          title: "追上漏掉的能量",
          goal: "包好隔热层，继续下落；累计至少三次，使温升达到0.12 ℃。",
          action: "再放下一次重物",
          hint: "隔热后，更多输入留在水中。每次释放都会留下累计记录。",
          success:
            "温度留下了证据。做功、内能增加与向外散热，可以放进同一份账本。",
        },
      ],
      defaults: { connected: false, insulated: false, drops: 0, heat: 0 },
      takeaway: "做功可以增加内能；未留在水中的能量也需要计入周围环境。",
      letter:
        "后来的人：运动可以停下，能量却需要一个去处。去找它，不要把它从账本上划掉。",
      nextQuestion: "除了能量，不同的自然现象还可能共享什么？",
      formula: "W = mgh　　ΔT = Q/(m水c水)",
      boundary:
        "10 kg重物每次下落2 m，1 kg水，c=4180 J/(kg·℃)。未隔热留水比例65%，隔热后90%；温升放大展示，不能靠几次搅拌把水烧开。",
      history:
        "焦耳用落下重物带动桨叶搅水，并测量微小温升。工坊和对白是游戏创作。",
      source: [
        "科学与工业博物馆 · 焦耳",
        "https://blog.scienceandindustrymuseum.org.uk/james-joules-energy/",
      ],
    },
    {
      id: "P05",
      person: "托马斯·杨",
      english: "THOMAS YOUNG",
      era: "英国 · 19 世纪初",
      place: "双缝花园",
      title: "光照不到的亮处",
      concept: "波与光的干涉",
      act: "第二幕 · 寻找看不见的联系",
      color: "#7c8b72",
      opening:
        "花园的白墙上藏着一行字。打开第二道狭缝后，有些地方反而暗了下来。",
      greeting: "多来一道光，为什么有的地方更暗？先盯住墙上的金色刻线。",
      steps: [
        {
          title: "用两道光造出一处暗",
          goal: "打开两道狭缝，调整缝距，让金色刻线落在暗纹里。",
          action: "让光穿过狭缝",
          hint: "同一光源照亮两条缝。暖色光、缝距刻度1.00时，目标位置可相消。",
          success: "光与光叠加，目标处却变暗了。干涉图样显露出第一行字。",
        },
        {
          title: "换了颜色，字又藏起来了",
          goal: "改用蓝光，重新调整缝距，让金色刻线再次落入暗纹。",
          action: "读出第二行字",
          hint: "波长改变，条纹也会移动。蓝光时试试缝距刻度0.75。",
          success: "同样的装置，换了波长就要重新安排。你用干涉找回了整封信。",
        },
      ],
      defaults: { slits: "one", color: "warm", gap: 1 },
      takeaway: "相干光波可以相长或相消叠加；条纹位置取决于波长与几何条件。",
      letter:
        "后来的人：看见明亮，也要解释黑暗。两个原因合在一起，未必带来两倍结果。",
      nextQuestion: "光的波动，能与电和磁联系起来吗？",
      formula: "I ∝ cos²(πd sinθ/λ)",
      boundary:
        "同一单色光源产生相干双缝光，远场示意；不讨论单光子探测。缝距为相对刻度，略去单缝包络。",
      history:
        "杨的干涉研究为光的波动描述提供证据。本关的固定刻线、人物争论与实验操作为教学改编。",
      source: [
        "尼尔斯·玻尔研究所 · 干涉",
        "https://nbi.ku.dk/spoerg_om_fysik/fysik/interferens15/",
      ],
    },
    {
      id: "P06",
      person: "法拉第",
      english: "MICHAEL FARADAY",
      era: "英国 · 1831 年",
      place: "感应工坊",
      title: "磁铁明明还在那里",
      concept: "电磁感应",
      act: "第二幕 · 寻找看不见的联系",
      color: "#608879",
      opening: "工坊停电了。法拉第把一截铜线绕成线圈，把磁铁交到你手里。",
      greeting: "仪表刚才动了一下。你能让同样的事情再发生一次吗？",
      steps: [
        {
          title: "让指针向两边摆动",
          goal: "把磁铁推进线圈，再拉出，比较两次指针的方向。也可以直接拖动磁铁。",
          action: "推进磁铁",
          hint: "靠近与远离会让感应电流反向；磁铁停住时，指针回到零。",
          success:
            "推进和拉出，指针反向。产生感应的是磁通的变化，单纯放在那里不够。",
        },
        {
          title: "让工坊重新转起来",
          goal: "接上摇柄，转动磁铁，为工坊点亮一次照明。",
          action: "转动摇柄",
          hint: "先装上摇柄，把一次移动变成持续的机械输入。",
          success: "灯亮了！工人接手摇柄继续转动。机械输入让电能转换得以持续。",
        },
      ],
      defaults: { magnetX: 15, crank: false },
      takeaway: "回路磁通变化会产生感应电动势；持续发电需要持续能量输入。",
      letter: "后来的人：从变化中寻找联系。电与磁，也许正说着同一种语言。",
      nextQuestion: "电与磁的联系，可以跨过没有导线的海峡吗？",
      formula: "ε = −dΦB/dt",
      boundary:
        "线圈、磁铁与检流计为定性示意。停止时指针归零。摇柄动画有机械输入，完成后由故事中的工人接手。",
      history:
        "法拉第在1831年研究电磁感应。游戏把装置简化成工坊，不声称原样复刻某次实验。",
      source: [
        "皇家研究院 · 法拉第",
        "https://www.rigb.org/explore-science/explore/person/michael-faraday-1791-1867",
      ],
    },
    {
      id: "P07",
      person: "麦克斯韦",
      english: "JAMES C. MAXWELL",
      era: "理论与实验的接力 · 19 世纪",
      place: "海峡信号站",
      title: "没有电线的来信",
      concept: "电磁波与光",
      act: "第二幕 · 寻找看不见的联系",
      color: "#627f93",
      opening:
        "跨海电线断在雾里。笔记预言，变化的电与磁能以波的形式传播；赫兹的实验记录在旁边等待检验。",
      greeting: "让笔记接受现实的检验。先看看对岸能不能收到信号。",
      steps: [
        {
          title: "跨过没有导线的海峡",
          goal: "调整发射频段，与对岸接收刻度3匹配，发送试探信号。",
          action: "发送试探信号",
          hint: "发射与接收需要匹配；调到刻度3，观察对岸指示灯。",
          success: "对岸回信了。理论预言与实验现象终于在这里接上。",
        },
        {
          title: "把回信送到新接收站",
          goal: "对岸换到刻度5，请发送字母R的电报码：· — ·。",
          action: "发送这封电报",
          hint: "频段换到5，再选择短—长—短。",
          success: "· — · 已送达。赫兹的实验接力，把电磁波的线索留给后来的人。",
        },
      ],
      defaults: { frequency: 1, code: "S" },
      takeaway: "光属于电磁波。电磁理论与传播实验连接了电、磁、光。",
      letter: "后来的人：两个领域里相似的规律，也许是一座尚未架起的桥。",
      nextQuestion: "经典理论解释了很多，也会遇到解释不了的新证据。",
      formula: "真空中 c = 1/√(ε₀μ₀)",
      boundary:
        "发射、调谐与编码是简化的现代类比；传播大幅减速显示。频段刻度无量纲，不展示真实无线电电路。",
      history:
        "麦克斯韦建立电磁理论，赫兹后来进行电磁波实验。报码剧情属于跨年代科学记忆，不归为麦克斯韦个人发明。",
      source: [
        "麦克斯韦原著 · 光的电磁理论",
        "https://www.cambridge.org/core/books/abs/treatise-on-electricity-and-magnetism/electromagnetic-theory-of-light/FD07B196379A1F86D55969E409020EC9",
      ],
    },
    {
      id: "P08",
      person: "玛丽·居里",
      english: "MARIE CURIE",
      era: "法国 · 1890 年代末",
      place: "矿石计量所",
      title: "比铀更强的信号",
      concept: "放射性与测量证据",
      act: "第三幕 · 走向新的问题",
      color: "#7f7e94",
      opening:
        "矿石的信号，竟比等质量的铀参考样本还强。居里没有急着宣布发现，她先检查了仪器。",
      greeting: "一个异常值得认真对待，也值得再测一次。先留下比较的基准。",
      steps: [
        {
          title: "这真的是异常吗？",
          goal: "依次测量空白、铀参考样本和矿石，比较同一条件下的信号。",
          action: "测量这份样本",
          hint: "空白背景也要记录。三份样本都测过，比较才有依据。",
          success:
            "矿石信号稳定高于铀参考样本。只看已知的铀含量，似乎解释不了。",
        },
        {
          title: "沿着异常继续追踪",
          goal: "把矿石和强信号组分各测至少两次，看看异常能否重复。",
          action: "再做一次测量",
          hint: "矿石与强信号组分都需要重复测量。一次读数不能替代稳定证据。",
          success:
            "异常可以重复，强信号集中在某个组分里。我们得到值得进一步鉴别的线索。",
        },
      ],
      defaults: {
        sample: "background",
        readings: { background: [], uranium: [], ore: [], fraction: [] },
      },
      takeaway:
        "对照、重复与异常推动研究；放射性测量本身不能单独证明发现了某种新元素。",
      letter:
        "后来的人：如果事实不合解释，不要先把事实擦掉。检查它，然后继续追问。",
      nextQuestion: "物质内部与光的研究，分别打开了经典理论之外的新问题。",
      formula: "净信号 = 样本读数 − 背景读数",
      boundary:
        "纯虚拟测量，读数为教学示意，无现实操作。读数有有限波动；样本质量、时长与探测条件相同。",
      history:
        "贝克勒尔首先发现自发放射性；玛丽与皮埃尔·居里继续研究并发现钋、镭。此关表现简化的证据调查。",
      source: [
        "诺贝尔奖官网 · 研究脉络",
        "https://www.nobelprize.org/prizes/themes/the-nobel-prize-in-physics-1901-2000/",
      ],
    },
    {
      id: "P09",
      person: "普朗克",
      english: "MAX PLANCK",
      era: "德国 · 1900 年",
      place: "黑体炉房",
      title: "炉光里的裂缝",
      concept: "能量交换的量子化",
      act: "第三幕 · 走向新的问题",
      color: "#aa7854",
      opening:
        "炉房里，实测光谱与旧模型在高频部分对不上。普朗克把两条曲线叠了又叠。",
      greeting: "参数已经调过了。也许该重新看看，我们允许能量怎样交换。",
      steps: [
        {
          title: "试着改变交换的规则",
          goal: "先对照旧模型，再给低频和高频振子各送对一份能量，试用分份交换模型。",
          action: "对照炉光记录",
          hint: "点选能量包后点击振子：低频用1，高频用3。再选“按频率分份”。",
          success: "分份交换让预测与观测接近。高频对应的每一份能量，也更大。",
        },
        {
          title: "另一种温度也能解释吗？",
          goal: "把炉温调高，用同一套分份交换规则，再比较一次实测光谱。",
          action: "比较高温记录",
          hint: "升高炉温，再看峰的位置和高频一端。模型要能面对另一组证据。",
          success: "同一个假设，在两种温度下接受了检验。新的解释由此留下裂缝。",
        },
      ],
      defaults: {
        model: "continuous",
        temperature: "warm",
        packet: 1,
        fed: [],
      },
      takeaway:
        "普朗克在热辐射问题中引入与频率有关的能量份额；这与后来提出光量子的步骤不同。",
      letter: "后来的人：当旧规则始终对不上证据，也许需要改变允许发生的事情。",
      nextQuestion: "如果能量按份交换，光本身能否也用一份一份来理解？",
      formula: "Eₙ = nhf　　每份 ΔE = hf",
      boundary:
        "能量包是振子交换规则的类比。光谱采用无量纲普朗克分布与低频经典近似；不表示任意宏观能量都只能取整数。",
      history:
        "普朗克研究黑体辐射并引入能量量子。炉房、能量包与对白为教学创作。",
      source: [
        "诺贝尔奖官网 · 能量量子",
        "https://www.nobelprize.org/prizes/themes/the-nobel-prize-in-physics-1901-2000/",
      ],
    },
    {
      id: "P10",
      person: "爱因斯坦",
      english: "ALBERT EINSTEIN",
      era: "瑞士 · 1905 年",
      place: "光电研究站",
      title: "怎样也照不开的门",
      concept: "光量子与光电效应",
      act: "第三幕 · 走向新的问题",
      color: "#778a92",
      opening:
        "最后一道门没有钥匙孔。很亮的红光照着金属，机关毫无反应；旁边暗一些的蓝光却留下了另一种线索。",
      greeting: "把“光有多少”和“每一份光有多大能量”分开试试。",
      steps: [
        {
          title: "一束很亮的红光",
          goal: "先记录强红光的结果，再用弱蓝光触发第一块金属。",
          action: "照射金属机关",
          hint: "先用强度4或5的红光，再用强度1或2的蓝光，比较电子是否逸出。",
          success: "强红光没有打开它，弱蓝光却可以。每个光子的能量取决于频率。",
        },
        {
          title: "门后还有另一块金属",
          goal: "第二块金属更难释放电子。换一种频率，让最后的机关响应。",
          action: "打开最后一道门",
          hint: "这块金属需要更高频率。试试紫外光。",
          success:
            "门打开了。但“光是什么”没有成为一句简单口号：波动与光量子的证据都还在。",
        },
      ],
      defaults: { color: "red", intensity: 5 },
      takeaway:
        "单光子光电效应中，频率决定单个光子能量；超过阈频后，强度影响逸出电子数量。",
      letter:
        "后来的人：别把已经成功的解释当作世界的终点。把新的问题，继续寄向未来。",
      nextQuestion: "十封信已启程。下一封，留给你。",
      formula: "E光子 = hf　　K最大 = hf − W逸出",
      boundary:
        "弱光单光子模型，排除多光子与热发射。第一块金属逸出功2.2 eV，第二块3.5 eV。电子数与强度作定性示意。",
      history:
        "爱因斯坦用光量子解释光电效应，这是研究既有实验的理论工作。本关的测量场景与对白为教学改编，不表示这些实验由爱因斯坦亲手完成。",
      source: [
        "诺贝尔奖官网 · 光电效应",
        "https://educationalgames.nobelprize.org/educational/physics/quantised_world/waves-particles-1.html",
      ],
    },
  ];
  const api = {
    version: 3,
    levels,
    byId: Object.fromEntries(levels.map((l) => [l.id, l])),
  };
  if (typeof window !== "undefined") window.AtlasPhysicsData = api;
  if (typeof module !== "undefined") module.exports = api;
})();
