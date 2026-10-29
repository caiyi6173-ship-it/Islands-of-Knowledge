/* Authored math event scenarios. Choices are resolved locally by explicit rules. */
(() => {
  const M =
    typeof module !== "undefined" && module.exports
      ? require("./math-models.js")
      : window.AtlasMathModels;
  const Research =
    typeof module !== "undefined" && module.exports
      ? require("./math-investigations.js")
      : window.AtlasMathInvestigations;

  const tuple = (title, text, reply) => ({ title, text, reply });

  const raw = [
    [
      "M01",
      "有理数之外，还有别的数吗？",
      "琴弦数轴庭院里的争端",
      "毕达哥拉斯学派长老坚信万物皆是纯净的整数比。但助手在测绘单位正方形木板时，发现其对角线无论用多么微小的整数单位都无法整除。你得拿出令人信服的证据。",
      "神庙长老",
      "维护整数和谐教条",
      "如果尺子量不出尽头，定是尺子出了差错！神圣的整数怎会有裂隙？",
      ["算术助手", "工坊学徒", "辩证学者"],
      [
        "琴弦与和声的比例",
        "先验证整数比如何产生优美的和声共鸣。空弦试音，别急着断定一切。",
        tuple(
          "拨动纯五度琴弦",
          "设定 2:3 长度比，检验整数比例发出的清澈共鸣。",
          "长老满意地点头：听这纯净的琴音，宇宙的和谐不正在整数比中吗？",
        ),
        tuple(
          "查阅古籍音律表",
          "检索七声音阶与五度相生律的历史记录。",
          "音律表记载了整数比的优美，但这尚未解答几何对角线的度量疑问。",
        ),
        tuple(
          "制作微型三弦琴",
          "多用一份器材，快速试探 3:4 纯四度的和声方向。",
          "和声同样优美。整数比确实支配着和声，但对角线的谜题依然伫立在庭院中。",
        ),
      ],
      [
        "无理的单位对角线",
        "在边长为 1 的正方形上，尝试用分数逼近斜边 √2，检验是否存在公度单位。",
        tuple(
          "使用连分数尺步步逼近",
          "逐步使用 7/5、17/12、41/29 进行多阶逼近测量。",
          "长老的手颤抖了：无论分母扩大到何等庞大，平方后都与 2 差了一丝！",
        ),
        tuple(
          "推导奇偶反证法",
          "在沙盘上写下假设 p/q 互质后的奇偶矛盾推导。",
          "逻辑推导让长老陷入沉思，但他仍希望看到实物测量的残差证据。",
        ),
        tuple(
          "只测量半段斜线",
          "用简化木规快速核验斜边与直角边的相对跨度。",
          "斜边确实大于 1.4 且小于 1.42，初具不可通约迹象，仍待完整论证。",
        ),
      ],
      [
        "宣布无理数的发现与数系的扩充",
        "说明有限整数比的适用范围，以及面对几何对角线时引入无理数的必然性。",
        "一次测量引发了数学史上第一次深刻的数系革命。",
        "所有几何长度都可以用有限整数比精确表达",
      ],
    ],
    [
      "M02",
      "天平两端，怎样称出未知？",
      "天平广场的遗产结算",
      "市集帐房里放着几包密封的名贵香料与砝码。管事急于平账，试图动刀拆开贵重包装。花拉子米指出：只要天平平衡，未知物不用拆开也能算得一清二楚。",
      "帐房总管",
      "按时结算所有物资",
      "不撕开包装，天底下哪有人能知道里面到底有几斤几两？",
      ["算账学徒", "天平工匠", "代数书记员"],
      [
        "同重对消求平衡",
        "从天平两端同时拿走相同数量的包裹和已知砝码，保持平衡。",
        tuple(
          "施加对消操作",
          "两端各拿掉 1 包香料和 3 磅砝码，使左侧只剩单个包裹。",
          "总管瞪大眼睛：天平两边依然平衡，左边是 1 包，右边正好是 4 磅！",
        ),
        tuple(
          "查阅往期物资账簿",
          "翻阅前几期的入库标准重量记录。",
          "账簿记录香料大致在 3 到 6 磅之间，但这还不是本次的准确结算依据。",
        ),
        tuple(
          "先移去单侧砝码试探",
          "快速试探单边减重的倾斜幅度，记录反应方向。",
          "天平倾斜了。两边非对称移动打破了平衡，必须在两端施加完全相同的操作。",
        ),
      ],
      [
        "还原倍数与常数项",
        "面对更复杂的复合方程 3x + 5 = 26，两步还原解出香料单重。",
        tuple(
          "两步还原完整求解",
          "先两端减去 5 磅常数，再均分 3 份得出 x = 7 磅。",
          "总管合上账本由衷赞叹：不用拆封，7 磅的分量算得清清楚楚！",
        ),
        tuple(
          "用估算逐个代入验算",
          "尝试将 5、6、7 分别代入估算天平两端数值。",
          "估算能找到大致解，但不如系统还原法具有普适的说服力。",
        ),
        tuple(
          "快速均分称量试探",
          "使用简易分秤先称其中三分之一包裹。",
          "得到了初步比例，但依然需要完整的代数还原步骤来证明全量。",
        ),
      ],
      [
        "确立代数对消与还原法则",
        "阐明等式两边同加减、同乘除等量这一代数公理的适用条件与范围。",
        "一套称量方法化为了整个人类文明共享的代数学基石。",
        "任何式子都可以随意移项而不需要守恒",
      ],
    ],
    [
      "M03",
      "几何图形，怎样在纸上算出来？",
      "苍蝇测绘台的航海定位",
      "雾气笼罩着航海测绘台。学者们认为几何航线只能凭罗盘肉眼测绘，无法像代数那样列式计算。笛卡尔注视着天花板砖缝，提出了直角坐标轴方案。",
      "测绘官",
      "确保航海图绝不出错",
      "一个点在海面上，一座山在陆地上，你怎能用两行代数算式代表它们？",
      ["测绘学徒", "罗盘工匠", "航海记录员"],
      [
        "十字基准定位地标",
        "以原点为交汇，在正交网格上输入坐标 (4, 3) 锁定灯塔航标。",
        tuple(
          "调准坐标十字线",
          "横向移动 4 格，纵向移动 3 格，准星精准落在航标上方。",
          "测绘官惊呼：两个数字，竟然把茫茫大海上的孤舟位置锁得死死的！",
        ),
        tuple(
          "比对传统海图标注",
          "使用传统方位角与目测记录比对地标。",
          "传统标注指出了方向，但在没有距离基准时极易累积误差。",
        ),
        tuple(
          "单轴定位快速试探",
          "先固定 x = 4，沿纵向滑移寻找目标点。",
          "确认了航标位于第四垂线上，但依然需要纵坐标 y 来完成精准交汇。",
        ),
      ],
      [
        "点连成线，代数成形",
        "将满足 y = 2x 的所有航标点连成一条笔直的引导航线。",
        tuple(
          "贯通代数直线航道",
          "输入直线斜率 2，航线穿透所有航标直达对岸海港。",
          "测绘官抚摸着图纸：原来代数方程画出来，竟是一条不会偏航的笔直大道！",
        ),
        tuple(
          "绘制折线避礁路线",
          "用多段分段折线估算航道走向。",
          "折线避开了部分暗礁，但没有体现解析几何中方程与直线的严密对应。",
        ),
        tuple(
          "两点连线快速检验",
          "连接 (0,0) 与 (1,2) 先画出前驱航道。",
          "航道方向准确，初显线性趋势，仍待全航道完整贯通。",
        ),
      ],
      [
        "公布解析几何与坐标系方法",
        "阐释直角坐标系下点与数对的一一对应，以及代数方程刻画几何曲线的边界。",
        "几何学与代数学两座大陆从此由坐标系紧紧连接在一起。",
        "任何图形脱离坐标轴也拥有固定不变的代数坐标",
      ],
    ],
    [
      "M04",
      "输入与输出，怎样保持秩序？",
      "秩序机器花园的联动难题",
      "花园工坊中的齿轮联动泵输入流速经常忽大忽小，导致出水压力失常。工人们认为机器有自己的脾气，欧拉却在图纸上绘制了严密的函数对应表。",
      "工坊主",
      "追求稳定连续的出水",
      "同一根管子，注进同样多的水，凭什么有时满溢有时干瘪？",
      ["齿轮助手", "管路技工", "数学见习官"],
      [
        "确定线性对应规则",
        "调整传动参数 f(x) = 2x + 1，使三组测试输入输出完全吻合。",
        tuple(
          "调校传动比与偏置",
          "输入齿轮比 k=2，偏置 b=1，三个测试点完全咬合在直线上。",
          "工坊主看着出水读数：输入 1 出 3，输入 3 出 7，水流真的听话了！",
        ),
        tuple(
          "记录往日各批次流量",
          "统计此前几十次手工阀门的出水散点数据。",
          "散点分布粗略呈线性，但没有数学法则支持，无法实现自动控制。",
        ),
        tuple(
          "固定偏置单点测试",
          "先测定输入为 0 时的底水常数 b=1。",
          "找到了截距，确认了基础流量，仍需调整齿轮比来匹配整个输入范围。",
        ),
      ],
      [
        "检验单值映射契约",
        "接入非线性模型，验证每个输入严格对应唯一输出，杜绝多值歧义。",
        tuple(
          "运行单值垂直线检测",
          "在全定义域上检验单值映射，排除同一个 x 产生多个输出的故障。",
          "工坊主拍手称快：一进一出，绝无二致！这就是秩序花园的灵魂！",
        ),
        tuple(
          "绘制双向反函数对照",
          "从输出水压反推所需的输入流量。",
          "反推证实了单调函数的对应性，为逆向控制提供了有力佐证。",
        ),
        tuple(
          "大流量压力测试",
          "输入极值参数检测管道承受极限。",
          "极限压力下未出现多值分叉，初步证实规则稳健，仍待正式提交验证。",
        ),
      ],
      [
        "发表函数单值映射定义",
        "系统阐述函数对应法则的唯一性、定义域与值域的严密边界。",
        "函数概念自此成为描述自然界一切因果规律的核心工具。",
        "一个输入可以同时产生两个随机不确定的输出",
      ],
    ],
    [
      "M05",
      "山谷之上，石桥该修成什么形状？",
      "抛物线石桥的跨度危机",
      "深达百米的峡谷两侧相距 12 米。老石匠砌出的半圆拱石桥太陡滑坡，平木桥又在自重下塌陷。费马拿出鹅毛笔：‘重力塑造的优雅，唯有对称的抛物线能承载。’",
      "老石匠",
      "修一座百人不沉的实心石桥",
      "圆拱自古以来最坚固，连圆拱都垮了，你的这道弯线怎能立得住？",
      ["砌石学徒", "桥梁工匠", "测绘书记官"],
      [
        "抛物线拱跨越峡谷",
        "设定二次函数 y = a(x - h)² + k，顶点置于中央 (6, 5)，使两端落在 (0, 0.5) 与 (12, 0.5)。",
        tuple(
          "合拢抛物线石拱",
          "设定 a = -0.125, h = 6, k = 5，拱券两翼完美咬合在两侧基座上。",
          "老石匠目瞪口呆：拱石没有一块受剪崩裂，整座桥拱宛如一道凝固的彩虹！",
        ),
        tuple(
          "查阅古罗马圆拱文献",
          "对比传统圆拱在不同跨径下的应力分布图纸。",
          "文献表明大跨度圆拱侧推力过大，正需要更平缓的二次曲线来化解。",
        ),
        tuple(
          "砌筑半边试验拱",
          "先搭建左侧半跨 6 米的支撑木架。",
          "半跨拱受力良好，证实了开口曲率的合理性，仍需右侧对称合龙。",
        ),
      ],
      [
        "确保中央通行净空",
        "在拱桥保持两端受力的同时，校验中央 6 米宽区域高度均在 3.5 米以上。",
        tuple(
          "校验安全包络线",
          "实测 x = 3 和 x = 9 处桥下净高 3.875 米，大型马车顺利通关。",
          "老石匠竖起大拇指：不仅结实，桥下还能通大车，真乃神工！",
        ),
        tuple(
          "加固桥墩外侧扶壁",
          "在两端桥基增加侧向受力斜撑。",
          "扶壁增加了结构冗余度，证实了两端水平推力的平衡特性。",
        ),
        tuple(
          "满载沙袋试压",
          "在桥面铺上两车沙袋进行静力载荷试验。",
          "桥拱下沉量极微，抛物线受力表现出色，已具备全线通车条件。",
        ),
      ],
      [
        "公布二次函数极值与对称性",
        "论述二次曲线顶点式、开口系数与对称轴的几何物理意义及适用模型范围。",
        "二次函数从此走出纯数学手稿，化作人间无数坚固的大桥与渡槽。",
        "半圆形拱桥在任何超大跨度下都比抛物线桥更坚固",
      ],
    ],
    [
      "M06",
      "万千变幻，究竟什么永恒不变？",
      "变换镜廊的机关之谜",
      "古殿的镜廊中装满了旋转的铜镜与凸透镜。大门机关锁孔形状怪异，钥匙在镜中翻折、旋转，学徒认为形状完全变了。克莱因步入镜廊：‘寻找变换群中的不变量！’",
      "镜廊守护者",
      "守护神圣的对称秘密",
      "经过了平移、顺时针旋转，钥匙早已面目全非，怎可能开得了同一把锁？",
      ["光学学徒", "机关锁匠", "几何研究员"],
      [
        "全等变换入锁",
        "将钥匙平移 (3, 2) 并旋转 90 度，验证边长与角度完全守恒并成功开锁。",
        tuple(
          "执行刚体平移旋转",
          "操作机关转动台，钥匙图形严丝合缝嵌入第一重旋转锁孔。",
          "守护者惊叹：转了 90 度，挪了 3 格，每条边长和内角居然丝毫不差！",
        ),
        tuple(
          "查阅镜面反射图谱",
          "翻阅单面镜与双面镜成像规律文献。",
          "文献指出了镜像反转的手性特征，为理解几何对称提供了参考。",
        ),
        tuple(
          "先尝试单步平移",
          "只平移 (3, 2) 暂不旋转钥匙方向。",
          "位置对齐了，但方向仍差 90 度，证实刚体变换中位置与朝向的独立性。",
        ),
      ],
      [
        "相似缩放与面积平方律",
        "启用 2 倍缩放透镜，检验角度不变性并证明面积扩大为 4 倍。",
        tuple(
          "运行比例相似检测",
          "缩放因子调至 2，所有内角严密守恒，面积读数由 6 跃升至 24。",
          "守护者心服口服：角度守恒维持了骨架，面积则随尺度平方倍增，妙不可言！",
        ),
        tuple(
          "测量对应边长比",
          "逐一测量放大后三条边的对应线段长度。",
          "各边严格保持 2:1 比例，直接验证了相似三角形的对应边成比例定理。",
        ),
        tuple(
          "小比例 1.5 倍试探",
          "微调透镜至 1.5 倍观察图形轮廓。",
          "轮廓相似性保持完好，面积变为 2.25 倍，支持了平方规律。",
        ),
      ],
      [
        "提出以不变量分类几何学的纲领",
        "阐明全等变换、相似变换与其守恒几何属性的层次结构与严格边界。",
        "埃尔朗根纲领横空出世，将纷繁复杂的几何学统一在变换群的旗帜下。",
        "任何几何图形经过平移和旋转后其边长和面积都会发生改变",
      ],
    ],
    [
      "M07",
      "只凭尺规，怎样筑起永恒真理？",
      "几何回廊的田亩纷争",
      "尼罗河洪水退去后田亩界石被冲毁。官吏们凭感觉拉绳扯皮，争端不断。欧几里得席地而坐，用木杖在沙土中划出圆与直线：‘真理无需争执，公理自会证明一切。’",
      "田亩监察官",
      "尽快平息地界争端",
      "目测差不离就行了，画什么圆规和直尺，难道沙子里的线还能当饭吃？",
      ["测地学徒", "墨线工匠", "公理书记官"],
      [
        "三边刚性与内角和",
        "组装三边固定的三角形桁架，对比四边形的晃动变形，验证内角和恒为 180°。",
        tuple(
          "扣合三角形刚性桁架",
          "卡紧三根连杆，桁架纹丝不动，量角器读数恰为 180 度。",
          "监察官推了推木架：四边形一碰就歪，这三角形竟然稳如磐石！",
        ),
        tuple(
          "查阅古埃及结绳法",
          "查验 12 结绳拉直角三角形的古老工艺。",
          "结绳法提供了经验直观，但未能从公理层面解释为何只有三角形具备刚性。",
        ),
        tuple(
          "测量多个四边形内角",
          "用量角器量测不规则四边形的四个内角。",
          "读数总和为 360 度，展现了多边形内角和与分割成三角形的内在联系。",
        ),
      ],
      [
        "勾股定理的几何拼图",
        "在边长 3, 4, 5 直角三角形的三边外接正方形，完成面积剪拼 9 + 16 = 25。",
        tuple(
          "拼合斜边正方形面积",
          "直角边上的 9 块与 16 块正方瓦完美铺满斜边上的 25 格区域。",
          "监察官长叹：两条直角边的正方形合在一起，不多不少就是斜边的正方形！",
        ),
        tuple(
          "代数平方加法验算",
          "在石板上计算 3² + 4² = 9 + 16 = 25 = 5²。",
          "代数运算完全吻合几何实物，架起了数与形之间的第二座桥梁。",
        ),
        tuple(
          "验证一组非勾股边长",
          "组装 3, 4, 6 钝角三角形外接正方形比对面积。",
          "9 + 16 = 25 < 36，证实了勾股定理严格依赖于 90 度直角条件。",
        ),
      ],
      [
        "确立欧几里得几何演绎体系",
        "阐明从公理公设推导演绎定理的方法论，界定欧氏平面几何适用空间边界。",
        "《几何原本》成为了人类文明两千年来理性思维与逻辑严密的最高典范。",
        "勾股定理适用于包括锐角和钝角在内的所有任意三角形",
      ],
    ],
    [
      "M08",
      "奔流之中，怎样走出一条笔直的航线？",
      "向量石桥的渡河抉择",
      "都柏林运河水流向东湍急奔涌。渡船船夫只顾向正北划桨，结果小船被冲偏撞向下游浅滩。哈密顿在石桥旁拿出小刀刻画箭头：‘速度是箭头，方向就是生命！’",
      "渡口老船夫",
      "安全将乘客渡过急流",
      "水流往东冲，船往北划，老汉使了吃奶的劲，船怎么老往东边斜？",
      ["划桨助手", "航道水手", "物理力学官"],
      [
        "矢量合成直抵对岸",
        "已知东向水流 3 m/s，调节船头偏向西北（西向分量 3 m/s，北向 4 m/s），使合速度正对对岸码头。",
        tuple(
          "校准偏角合成航向",
          "设定船速 5 m/s，偏向西北角 126.87°，合速度向东分量归零，直线驶向正对岸。",
          "老船夫喜出望外：船头斜着划，船身居然稳稳当当地直通正对岸码头！",
        ),
        tuple(
          "查阅河道水流速度表",
          "测定不同时段中央主航道的水流实测流速。",
          "水流数据稳定在 3 m/s，为精确进行矢量合成计算提供了已知边界。",
        ),
        tuple(
          "偏北 45 度初步试探",
          "先让船头朝向北偏西 45 度划行一段距离。",
          "向西分量不足以抵消水冲，船身仍有漂移，需进一步加大偏角。",
        ),
      ],
      [
        "正交分解求最短过河时间",
        "将速度正交分解为垂直与平行分量，探究船头朝北（90°）时过河时间最短的原理。",
        tuple(
          "验证最短时间航向",
          "船头垂直对岸划桨，垂直分量达到最大 5 m/s，过河耗时达到绝对极小。",
          "老船夫恍然大悟：想要最快到对岸，就别管下游冲多远，力气全往对岸使！",
        ),
        tuple(
          "绘制速度分量矩形图",
          "在航图上分解合速度，分别标注 vx 和 vy 的独立作用。",
          "分量图直观展现了两个维度的运动相互独立、互不干扰的物理本质。",
        ),
        tuple(
          "顺流漂流速度测试",
          "停止划桨观察纯水流带动下的漂移距离。",
          "漂流速度完全等于水流速度，证实了矢量加法的叠加原理。",
        ),
      ],
      [
        "公布向量合成与正交分解理论",
        "系统阐述向量大小、方向、加法平行四边形法则及正交坐标分解的普适性。",
        "向量分析让经典力学与现代几何学掌握了描述多维物理世界的通用语言。",
        "只要船的速度绝对值够大就一定能垂直正对岸航行",
      ],
    ],
    [
      "M09",
      "飞逝的瞬间，到底有多快？",
      "变化水钟塔的滴漏疑云",
      "高耸的水钟塔底部青铜水漏滴滴答答。司辰官困惑不解：高水位时水柱喷射，低水位时滴答无力。‘说一小时流三升，可午时那一瞬间，水位究竟降得有多快？’",
      "皇家司辰官",
      "确保报时分秒不差",
      "一瞬间连眨眼都不到，没有起点和终点，你怎么可能量得出一瞬间的速度？",
      ["滴漏技师", "漏壶工匠", "微积分学者"],
      [
        "割线逼近瞬时切线",
        "在水位曲线上考察 t = 10 处，将测量时间间隔从 4s 逐步压缩至 0.2s，观察平均变化率收敛于 -4 cm/s。",
        tuple(
          "缩小时间步长求切线",
          "将步长设为 0.2s，割线斜率稳定逼近瞬时导数 -4 cm/s。",
          "司辰官惊呆了：时间缝隙缩得越小，平均速度就越趋向一个固定的神奇数字！",
        ),
        tuple(
          "记录全天漏水曲线",
          "绘制全天 12 个时辰的水位高度连续折线图。",
          "折线图呈现了水流越来越慢的宏观趋势，但未给出局部的微观变化率。",
        ),
        tuple(
          "单秒粗测平均流速",
          "用量筒收集 t = 10 到 11 秒这一秒内的流出水量。",
          "测得平均流速约为 -3.8 cm/s，虽接近切线，但依然包含一秒内的变化误差。",
        ),
      ],
      [
        "寻找变化率为零的驻点",
        "在示意水位曲线上，令导数 dh/dt = 0，定位 t = 20，并检查它是否为极值点。",
        tuple(
          "定位切线水平驻点",
          "输入 t = 20 秒，切线斜率恰好为零，示意水位达到最低值。",
          "司辰官核对记录：水位先降后升，t = 20 时最低。斜率为零还要结合附近的变化判断极值。",
        ),
        tuple(
          "计算二阶变化率趋势",
          "检查 t = 20 两侧的导数符号，并计算二阶导数。",
          "导数由负变正，二阶导数恒为 0.4，说明这里是极小值；凹凸性未改变，因此不是拐点。",
        ),
        tuple(
          "单点液位溢流试探",
          "在 t = 19 秒时观察溢流管口水位状态。",
          "h(19) = 20.2，高于 h(20) = 20。再检查 h(21) = 20.2，两侧都支持最低水位的判断。",
        ),
      ],
      [
        "发表微分与瞬时变化率学说",
        "阐明极限思想、割线趋近切线的数学机制以及导数描述变化快慢的理论边界。",
        "微积分的曙光照亮了整个近代科学，让人类第一次拥有了捕捉瞬息万变世界的力量。",
        "任意时段的平均变化率可以直接等同于该时段内所有瞬间的变化率",
      ],
    ],
    [
      "M10",
      "迷雾之中，怎样预见重逢的天空？",
      "星空测绘所的轨道追寻",
      "天文学家皮亚齐发现的谷神星在几个阴云密布的夜晚留下三组昏暗坐标后，隐入白昼烈日消失不见。全欧学者哀叹再也找不到它。高斯点亮煤油灯：‘数学能在杂音中抓住轨道！’",
      "老天文学家",
      "搜寻遗失在宇宙深处的微光",
      "只有三组带误差的破数据，全天穹有几万个位置，你怎能算准它重逢的坐标？",
      ["观星助手", "望远镜工匠", "天体计算官"],
      [
        "最小二乘法拟合轨道",
        "调节二次开普勒近似轨道参数，使理论点与三组观测点残差平方和降至 0.25 以下。",
        tuple(
          "校准最佳拟合参数",
          "设定 a = 0.05, b = -1.2, c = 15，残差平方和达到极小值 0.18。",
          "老天文学家扶眼镜细看：曲线没有死板连点，却温柔穿过了所有噪点的中心！",
        ),
        tuple(
          "查阅行星开普勒定律",
          "复核行星轨道椭圆定律与面积定律的先验假设。",
          "先验力学假设为二次多项式拟合提供了合理的物理约束条件。",
        ),
        tuple(
          "简单直线趋势试探",
          "用一元线性回归粗测三个位置点的直线倾向。",
          "残差平方和高达 12.4，线性模型无法反映轨道弯曲，必须采用二次曲线。",
        ),
      ],
      [
        "外推预测重逢方位",
        "代入未来目标时间 t = 24，推算目标仰角并在预报天区由望远镜成功捕获谷神星。",
        tuple(
          "指向预报天空视场",
          "计算仰角 15 度，望远镜准星处赫然出现了一颗移动的微光——谷神星！",
          "老天文学家老泪纵横：找到了！就在你指的那一度天空！数学创造了奇迹！",
        ),
        tuple(
          "评估残差置信区间",
          "根据测量误差方差计算出预报方位的误差椭圆范围。",
          "置信区间把搜索范围从全天穹浓缩至几个视场，大大提高了巡天效率。",
        ),
        tuple(
          "多日外推轨迹比对",
          "计算 t = 25、26 的后续路径趋势。",
          "后续路径与天空背景星座完全吻合，数学模型展现了持久可靠的预测力。",
        ),
      ],
      [
        "确立数学建模与最小二乘法则",
        "系统阐发提出假设、抽象变量、参数估计、外推预测并回到现实检验的完整建模范式。",
        "数学从此不再仅是书斋里的推导，而化作人类探索宇宙与未知世界最锋利的慧眼。",
        "为了完美拟合历史数据应当不惜一切代价让曲线穿过所有噪点",
      ],
    ],
  ];

  const scenarios = raw.map(
    ([
      id,
      question,
      title,
      crisis,
      opponent,
      opponentGoal,
      opponentQuote,
      roleNames,
      act1,
      act2,
      act3,
    ]) => {
      const companion = {
        name: opponent,
        title: opponentGoal,
        quote: opponentQuote,
      };
      const acts = [
        {
          title: act1[0],
          description: act1[1],
          actions: { experiment: act1[2], consult: act1[3], rush: act1[4] },
        },
        {
          title: act2[0],
          description: act2[1],
          actions: { experiment: act2[2], consult: act2[3], rush: act2[4] },
        },
      ];
      const conclusion = {
        title: act3[0],
        description: act3[1],
        scopeGood: act3[2],
        scopeBad: act3[3],
      };
      return {
        id,
        question,
        title,
        crisis,
        companion,
        roleNames,
        acts,
        conclusion,
      };
    },
  );

  const byId = Object.fromEntries(scenarios.map((s) => [s.id, s]));

  const roles = [
    {
      id: "assistant",
      name: "算术助手",
      subtitle: "从容沉着 · 充足时间",
      resources: { time: 9, tools: 4, trust: 2 },
      perk: "时间充裕，适合从容观察与推演",
    },
    {
      id: "maker",
      name: "几何工匠",
      subtitle: "巧手制器 · 节省器材",
      resources: { time: 7, tools: 6, trust: 2 },
      perk: "工具备至，首度正式实验免消耗器材",
    },
    {
      id: "skeptic",
      name: "逻辑学者",
      subtitle: "严密审慎 · 信任更深",
      resources: { time: 6, tools: 4, trust: 3 },
      perk: "思辨深邃，请教人物可获得 2 点证据",
    },
  ];

  function lab(id, round) {
    const second = round === 1;
    const defs = {
      M01: second
        ? {
            prompt: "用连分数逐步逼近斜边 √2：",
            controls: [
              {
                key: "approximation",
                label: "逼近分数",
                values: [
                  ["3:2", "3:2 (1.500)"],
                  ["7:5", "7:5 (1.400)"],
                  ["17:12", "17:12 (1.4167)"],
                  ["41:29", "41:29 (1.4138)"],
                ],
              },
            ],
          }
        : {
            prompt: "调节两根琴弦的长度比例：",
            controls: [
              {
                key: "ratio",
                label: "弦长比",
                values: [
                  ["1:2", "八度 1:2"],
                  ["2:3", "纯五度 2:3"],
                  ["3:4", "纯四度 3:4"],
                  ["5:7", "不协和 5:7"],
                ],
              },
            ],
          },
      M02: second
        ? {
            prompt: "对 3x + 5 = 26，选择已把 x 单独留下的完整求解过程：",
            controls: [
              {
                key: "reduceStep",
                label: "还原步骤",
                values: [
                  ["subtract", "仅减去 5：3x = 21，尚未解出 x"],
                  ["divide", "仅将原式除以 3：x + 5/3 = 26/3"],
                  ["done", "先减去 5，再除以 3：x = 7"],
                ],
              },
            ],
          }
        : {
            prompt: "两边同时拿掉相同负荷 (2x + 3 = x + 7)：",
            controls: [
              {
                key: "eliminatePouch",
                label: "拿掉包裹数",
                values: [
                  [0, "拿掉 0 包"],
                  [1, "两端各拿掉 1 包"],
                  [2, "尝试各拿掉 2 包"],
                ],
              },
              {
                key: "eliminateWeight",
                label: "拿掉砝码数",
                values: [
                  [0, "拿掉 0 磅"],
                  [1, "两端各拿掉 1 磅"],
                  [3, "两端各拿掉 3 磅"],
                ],
              },
            ],
          },
      M03: second
        ? {
            prompt: "设定直线方程 y = mx 的斜率：",
            controls: [
              {
                key: "lineSlope",
                label: "航线斜率 m",
                values: [
                  [1, "斜率 1 (45°)"],
                  [2, "斜率 2"],
                  [3, "斜率 3 (过陡)"],
                ],
              },
            ],
          }
        : {
            prompt: "输入航标 (x, y) 坐标：",
            controls: [
              {
                key: "targetX",
                label: "横坐标 x",
                values: [
                  [2, "x = 2"],
                  [4, "x = 4"],
                  [6, "x = 6"],
                ],
              },
              {
                key: "targetY",
                label: "纵坐标 y",
                values: [
                  [1, "y = 1"],
                  [3, "y = 3"],
                  [5, "y = 5"],
                ],
              },
            ],
          },
      M04: second
        ? {
            prompt: "检验函数映射的单值契约：",
            controls: [
              {
                key: "mappingType",
                label: "对应模式",
                values: [
                  ["single", "单值映射 (每个输入对应唯一输出)"],
                  ["multiple", "多值歧义分支 (一个输入对应两个输出)"],
                ],
              },
            ],
          }
        : {
            prompt: "设定线性传动参数 f(x) = kx + b：",
            controls: [
              {
                key: "factorK",
                label: "齿轮比 k",
                values: [
                  [1, "k = 1"],
                  [2, "k = 2"],
                  [3, "k = 3"],
                ],
              },
              {
                key: "offsetB",
                label: "底水偏置 b",
                values: [
                  [0, "b = 0"],
                  [1, "b = 1"],
                  [2, "b = 2"],
                ],
              },
            ],
          },
      M05: second
        ? {
            prompt: "校验桥下通行净空：",
            controls: [
              {
                key: "archA",
                label: "二次项系数 a",
                values: [
                  [-0.125, "a = -0.125"],
                  [-0.2, "较陡 a = -0.20 (压低通道)"],
                  [-0.08, "平缓 a = -0.08 (两端脱离)"],
                ],
              },
            ],
          }
        : {
            prompt: "调节抛物线石桥顶点式 y = a(x - h)² + k：",
            controls: [
              {
                key: "archA",
                label: "开口系数 a",
                values: [
                  [-0.25, "过陡 a = -0.25"],
                  [-0.125, "a = -0.125"],
                  [-0.05, "过缓 a = -0.05"],
                ],
              },
              {
                key: "archH",
                label: "对称轴位置 h",
                values: [
                  [4, "偏左 h = 4"],
                  [6, "h = 6"],
                  [8, "偏右 h = 8"],
                ],
              },
              {
                key: "archK",
                label: "顶点高度 k",
                values: [
                  [3, "k = 3 米"],
                  [5, "k = 5 米"],
                  [7, "k = 7 米"],
                ],
              },
            ],
          },
      M06: second
        ? {
            prompt: "设定比例缩放因子 s：",
            controls: [
              {
                key: "scaleS",
                label: "缩放因子 s",
                values: [
                  [1, "s = 1 (全等原寸)"],
                  [2, "s = 2 (放大相似)"],
                  [3, "s = 3 (过大放大)"],
                ],
              },
            ],
          }
        : {
            prompt: "设定平移与旋转参数：",
            controls: [
              {
                key: "shiftX",
                label: "横向平移 Δx",
                values: [
                  [0, "0 格"],
                  [3, "向东 3 格"],
                  [5, "向东 5 格"],
                ],
              },
              {
                key: "shiftY",
                label: "纵向平移 Δy",
                values: [
                  [0, "0 格"],
                  [2, "向北 2 格"],
                  [4, "向北 4 格"],
                ],
              },
              {
                key: "rotateDeg",
                label: "旋转角度 θ",
                values: [
                  [0, "0° (不旋转)"],
                  [90, "顺时针 90°"],
                  [180, "180°"],
                ],
              },
            ],
          },
      M07: second
        ? {
            prompt: "选择外接正方形的边长组：",
            controls: [
              {
                key: "sideA",
                label: "直角边 a",
                values: [
                  [3, "a = 3"],
                  [5, "a = 5"],
                ],
              },
              {
                key: "sideB",
                label: "直角边 b",
                values: [
                  [4, "b = 4"],
                  [6, "b = 6"],
                ],
              },
              {
                key: "sideC",
                label: "斜边 c",
                values: [
                  [5, "c = 5 (勾股数)"],
                  [7, "c = 7 (非勾股)"],
                ],
              },
            ],
          }
        : {
            prompt: "选择骨架几何形状：",
            controls: [
              {
                key: "shapeType",
                label: "几何多边形",
                values: [
                  ["triangle", "三角形（三边铰链刚性）"],
                  ["quadrilateral", "四边形（四边铰链易变形）"],
                ],
              },
            ],
          },
      M08: second
        ? {
            prompt: "选择追求最短渡河时间的划桨角度：",
            controls: [
              {
                key: "boatAngle",
                label: "航向角",
                values: [
                  [90, "正对岸 90° (垂直分量最大)"],
                  [120, "偏向上游 120°"],
                  [60, "偏向下游 60°"],
                ],
              },
            ],
          }
        : {
            prompt: "已知东向水流 3 m/s，调节渡船速度与航向：",
            controls: [
              {
                key: "boatAngle",
                label: "航向朝向",
                values: [
                  [90, "正北 90°"],
                  [126.87, "126.87°"],
                  [60, "东北偏东 60°"],
                ],
              },
              {
                key: "boatSpeed",
                label: "划桨速度",
                values: [
                  [3, "3 m/s"],
                  [5, "5 m/s"],
                  [6, "6 m/s"],
                ],
              },
            ],
          },
      M09: second
        ? {
            prompt: "寻找变化率等于零的驻点时刻：",
            controls: [
              {
                key: "zeroSlopeT",
                label: "时刻 t",
                values: [
                  [10, "t = 10 秒"],
                  [20, "t = 20 秒 (导数为 0)"],
                  [30, "t = 30 秒"],
                ],
              },
            ],
          }
        : {
            prompt: "缩小求导时间间隔 Δt：",
            controls: [
              {
                key: "deltaT",
                label: "时间步长 Δt",
                values: [
                  [4, "Δt = 4s (割线误差大)"],
                  [2, "Δt = 2s (中等间隔)"],
                  [0.2, "Δt = 0.2s (极微逼近切线)"],
                ],
              },
            ],
          },
      M10: second
        ? {
            prompt: "设定未来预报时间 t：",
            controls: [
              {
                key: "predT",
                label: "推算时刻",
                values: [
                  [20, "t = 20 天"],
                  [24, "t = 24 天"],
                  [28, "t = 28 天"],
                ],
              },
            ],
          }
        : {
            prompt: "为三组虚拟角度记录拟合二次曲线（并非真实轨道计算）：",
            controls: [
              {
                key: "modelA",
                label: "二次项系数 a",
                values: [
                  [0.02, "a = 0.02"],
                  [0.05, "a = 0.05"],
                  [0.1, "a = 0.10"],
                ],
              },
              {
                key: "modelB",
                label: "一次项系数 b",
                values: [
                  [-0.8, "b = -0.8"],
                  [-1.2, "b = -1.2"],
                  [-1.6, "b = -1.6"],
                ],
              },
            ],
          },
    };
    const definition = defs[id];
    const ranges = {
      targetX: { min: 0, max: 8, step: 1 },
      targetY: { min: 0, max: 7, step: 1 },
      lineSlope: { min: 0, max: 4, step: 0.1 },
      factorK: { min: 0, max: 4, step: 0.1 },
      offsetB: { min: -2, max: 4, step: 0.1 },
      rotateDeg: { min: 0, max: 360, step: 15 },
      archA: { min: -0.5, max: -0.01, step: 0.001 },
      archH: { min: 2, max: 10, step: 1 },
      archK: { min: 1, max: 8, step: 0.1 },
      scaleS: { min: 0.5, max: 3, step: 0.1 },
      shiftX: { min: -5, max: 5, step: 1 },
      shiftY: { min: -5, max: 5, step: 1 },
      boatAngle: { min: 0, max: 180, step: 0.01 },
      boatSpeed: { min: 1, max: 10, step: 0.1 },
      zeroSlopeT: { min: 0, max: 30, step: 1 },
      deltaT: { min: 0.05, max: 5, step: 0.01 },
      predT: { min: 10, max: 40, step: 1 },
      modelA: { min: 0.01, max: 0.2, step: 0.01 },
      modelB: { min: -2, max: 0, step: 0.1 },
    };
    for (const control of definition.controls) {
      if (control.value === undefined) {
        control.value =
          control.key === "archA"
            ? -0.125
            : control.key === "modelA"
              ? 0.05
              : control.values[0][0];
      }
      if (ranges[control.key]) control.range = ranges[control.key];
    }
    return definition;
  }

  function cleanParams(id, round, rawParams = {}) {
    if (!rawParams || typeof rawParams !== "object") rawParams = {};
    const cleaned = Object.fromEntries(
      lab(id, round).controls.map((c) => {
        let value = rawParams[c.key];
        if (c.range && typeof value === "number" && Number.isFinite(value)) {
          const { min, max, step } = c.range;
          value = Math.max(min, Math.min(max, value));
          value = Number(
            (min + Math.round((value - min) / step) * step).toFixed(3),
          );
        } else if (!c.values.some(([v]) => v === value)) {
          value = c.value;
        }
        return [c.key, value];
      }),
    );
    if (id === "M10" && round === 1) {
      cleaned.modelA =
        typeof rawParams.modelA === "number" &&
        Number.isFinite(rawParams.modelA)
          ? Math.max(0.01, Math.min(0.2, rawParams.modelA))
          : 0.05;
      cleaned.modelB =
        typeof rawParams.modelB === "number" &&
        Number.isFinite(rawParams.modelB)
          ? Math.max(-2, Math.min(0, rawParams.modelB))
          : -1.2;
      cleaned.modelC = 15;
    }
    return cleaned;
  }

  function test(id, round, params) {
    const p = cleanParams(id, round, params);
    const out = M.outcome(id, round, p);
    const r = out.result;
    const readings = [];
    switch (id) {
      case "M01":
        if (round === 0) {
          readings.push(["弦长比", p.ratio]);
          readings.push([
            "音程对照",
            r.harmonious ? "符合本关目标音程" : "不在本关目标音程",
          ]);
        } else {
          readings.push(["连分数逼近", p.approximation]);
          readings.push(["平方残差", r.err.toFixed(4)]);
        }
        break;
      case "M02":
        if (round === 0) {
          readings.push([
            "左侧剩余",
            `${r.leftPouches}包 + ${r.leftWeights}磅`,
          ]);
          readings.push([
            "右侧剩余",
            `${r.rightPouches}包 + ${r.rightWeights}磅`,
          ]);
        } else {
          readings.push([
            "还原阶段",
            p.reduceStep === "subtract"
              ? "3x = 21（尚未均分）"
              : p.reduceStep === "divide"
                ? "x + 5/3 = 26/3（常数仍在）"
                : "先消常数，再均分：x = 7",
          ]);
          readings.push(["解得重量", r.solved ? "7 磅" : "未完成"]);
        }
        break;
      case "M03":
        if (round === 0) {
          readings.push(["当前坐标", `(${r.x}, ${r.y})`]);
          readings.push(["距离目标", `${r.dist.toFixed(2)} 格`]);
        } else {
          readings.push(["直线斜率", String(r.slope)]);
          readings.push(["航线状态", r.onLine ? "穿透航标" : "偏离航标"]);
        }
        break;
      case "M04":
        if (round === 0) {
          readings.push(["对应规则", `f(x) = ${r.k}x + ${r.b}`]);
          readings.push(["测试点输出", r.outputs.join(", ")]);
        } else {
          readings.push(["映射类型", r.singleValued ? "单值映射" : "多值歧义"]);
          readings.push(["契约状态", r.singleValued ? "契约成立" : "违约多值"]);
        }
        break;
      case "M05":
        if (round === 0) {
          readings.push(["左桥基高度", `${r.leftH.toFixed(2)} 米`]);
          readings.push(["右桥基高度", `${r.rightH.toFixed(2)} 米`]);
        } else {
          readings.push(["通道净高", `${r.clearanceAt3.toFixed(2)} 米`]);
          readings.push([
            "通行状态",
            r.safeClearance ? "安全通车" : "净空不足",
          ]);
        }
        break;
      case "M06":
        if (round === 0) {
          readings.push(["位移矢量", `(${r.sx}, ${r.sy})`]);
          readings.push(["旋转角", `${r.rot}°`]);
        } else {
          readings.push(["尺度因子", `${r.s}x`]);
          readings.push(["面积倍率", `${r.areaRatio} 倍`]);
        }
        break;
      case "M07":
        if (round === 0) {
          readings.push(["骨架类型", r.isTri ? "三角形" : "四边形"]);
          readings.push(["力学刚性", r.rigid ? "刚性锁定" : "易晃变形"]);
        } else {
          readings.push(["直角边平方和", `${r.a * r.a + r.b * r.b}`]);
          readings.push(["斜边平方", `${r.c * r.c}`]);
        }
        break;
      case "M08":
        if (round === 0) {
          readings.push(["横向漂移", `${r.vx.toFixed(2)} m/s`]);
          readings.push([
            "航向状态",
            r.straightAcross ? "直抵对岸" : "斜向漂移",
          ]);
        } else {
          readings.push(["垂直速度", `${r.vy.toFixed(2)} m/s`]);
          readings.push(["过河时间", r.minTimeAngle ? "最短极值" : "耗时较长"]);
        }
        break;
      case "M09":
        if (round === 0) {
          readings.push(["时间步长", `Δt = ${r.dt}s`]);
          readings.push(["平均变化率", `${r.avgSlope.toFixed(2)} cm/s`]);
        } else {
          readings.push(["选定时刻", `t = ${r.zeroSlopeT}s`]);
          readings.push(["切线斜率", r.isStationary ? "0 (驻点)" : "非零变动"]);
        }
        break;
      case "M10":
        if (round === 0) {
          readings.push(["残差平方和", r.rss.toFixed(4)]);
          readings.push(["拟合判定", r.fitted ? "高精度拟合" : "偏差过大"]);
        } else {
          readings.push(["预测仰角", `${r.predY.toFixed(1)}°`]);
          readings.push(["视场捕获", r.verified ? "捕获天体" : "未见天体"]);
        }
        break;
      default:
        break;
    }
    return {
      params: p,
      success: out.ok,
      readings,
      detail: out.message,
      result: r,
    };
  }

  function fresh(id, roleId = null, prev = null) {
    const role = roles.find((r) => r.id === roleId) || null;
    const endings = Array.isArray(prev?.endings) ? [...prev.endings] : [];
    const bestStars = Math.max(
      0,
      Math.min(3, Math.trunc(Number(prev?.bestStars) || 0)),
    );
    return {
      version: 4,
      id,
      role: role?.id || null,
      resources: role
        ? M.clone(role.resources)
        : { time: 0, tools: 0, trust: 0 },
      round: 0,
      evidence: [],
      log: [],
      pending: false,
      last: null,
      ended: false,
      ending: null,
      argument: null,
      endings,
      bestStars,
      supplies: 0,
      cleared: prev?.cleared === true,
      events: [],
    };
  }

  function cost(state, action, params = {}, meta = {}) {
    if (meta.comparison && action === "experiment") {
      const cmp = Research.comparison(
        state,
        cleanParams(state.id, state.round, params),
      );
      if (cmp?.fair && cmp.discount) return { time: 1, tools: 0 };
    }
    return {
      time:
        action === "experiment"
          ? 2
          : action === "consult"
            ? 1
            : action === "rush"
              ? 2
              : 0,
      tools:
        action === "rush"
          ? 2
          : action === "experiment" &&
              !(
                state.role === "maker" &&
                !state.log.some((l) => l.action === "experiment")
              )
            ? 1
            : 0,
    };
  }

  function canAct(state, action, params = {}, meta = {}) {
    const c = cost(state, action, params, meta);
    return (
      !!state.role &&
      !state.ended &&
      state.resources.time >= c.time &&
      state.resources.tools >= c.tools
    );
  }

  function comparisonOffer(state) {
    if (
      !state.role ||
      state.ended ||
      state.round >= 2 ||
      !state.log.some(
        (entry) => entry.round === state.round && entry.action === "experiment",
      )
    )
      return null;
    const used = state.log.some(
      (entry) => entry.round === state.round && entry.comparison?.discount,
    );
    const c = used ? cost(state, "experiment") : { time: 1, tools: 0 };
    return {
      ...c,
      discounted: !used,
      affordable:
        state.resources.time >= c.time && state.resources.tools >= c.tools,
    };
  }

  function resolve(state, action, params, rawMeta = {}) {
    if (!byId[state.id]) return false;
    const meta = Research.sanitize(
      rawMeta,
      state.id,
      state.round,
      state.log.length,
    );
    if (!canAct(state, action, params, meta)) return false;
    if (state.round === 2) {
      if (state.pending || !["publish", "reserve", "claim"].includes(action))
        return false;
      const verdict = meta.argument
        ? Research.assess(state, meta.argument)
        : null;
      if (meta.argument) state.argument = M.clone(meta.argument);
      const points =
          verdict?.score ?? state.evidence.reduce((n, e) => n + e.points, 0),
        proof = state.evidence.some(
          (e) => e.kind === "experiment" || e.action === "experiment",
        ),
        strong = verdict
          ? verdict.valid
          : points >= 3 && proof && state.resources.trust > 0;
      const ending =
        action === "claim" ||
        (action === "publish" && meta.argument?.scope === "universal")
          ? "overreach"
          : action === "reserve" || !strong
            ? "provisional"
            : points >= 4 && proof
              ? "breakthrough"
              : "discovery";
      state.ended = true;
      state.ending = ending;
      if (!state.endings.includes(ending)) state.endings.push(ending);
      if (["breakthrough", "discovery"].includes(ending)) {
        state.cleared = true;
      }
      const r = rating(state);
      if (r.count > state.bestStars) state.bestStars = r.count;
      state.log.push({
        round: 2,
        action,
        ending,
        title: byId[state.id].conclusion.title,
        evidenceCount: state.evidence.length,
      });
      return true;
    }

    if (!["experiment", "consult", "rush", "skip"].includes(action))
      return false;
    if (
      state.pending &&
      !(
        (action === "experiment" &&
          state.last?.action === "experiment" &&
          !state.last.success) ||
        (meta.followUp &&
          ((action === "experiment" &&
            ["experiment", "consult", "rush"].includes(state.last?.action)) ||
            (action === "consult" &&
              ["experiment", "rush"].includes(state.last?.action) &&
              !state.log.some(
                (entry) =>
                  entry.round === state.round && entry.action === "consult",
              ))))
      )
    )
      return false;

    const experimentParams =
      action === "experiment"
        ? cleanParams(state.id, state.round, params)
        : null;
    const comparison = experimentParams
      ? Research.comparison(state, experimentParams)
      : null;
    if (meta.comparison && (action !== "experiment" || !comparison?.fair))
      return false;

    const c = cost(state, action, params, meta);
    state.resources.time -= c.time;
    state.resources.tools -= c.tools;

    if (action === "skip") {
      const entry = {
        round: state.round,
        action: "skip",
        title: "暂不行动，保留资源",
        text: "你把未能回答的问题留在记录里，没有为它编造解释。",
        success: false,
        points: 0,
        result: null,
        cost: c,
      };
      state.log.push(entry);
      state.last = entry;
      state.pending = true;
      return true;
    }

    if (action === "consult") {
      const points =
        state.role === "skeptic" &&
        !state.log.some((l) => l.action === "consult")
          ? 2
          : 1;
      const text = byId[state.id].acts[state.round].actions.consult.reply;
      const entry = {
        round: state.round,
        action: "consult",
        kind: "consult",
        title: byId[state.id].acts[state.round].actions.consult.title,
        text,
        success: true,
        points,
        cost: c,
        result: null,
      };
      const evidence = {
        round: state.round,
        kind: "consult",
        points,
        title: byId[state.id].acts[state.round].title,
        detail: text,
      };
      const existing = state.evidence.findIndex((e) => e.round === state.round);
      if (
        points &&
        (existing < 0 || points > state.evidence[existing].points)
      ) {
        if (existing < 0) state.evidence.push(evidence);
        else state.evidence[existing] = evidence;
      }
      state.log.push(entry);
      state.last = entry;
      state.pending = true;
      return true;
    }

    if (action === "rush") {
      const probeReady = state.role === "maker" || state.evidence.length > 0;
      const points = probeReady ? 1 : 0;
      const success = probeReady;
      const text = success
        ? byId[state.id].acts[state.round].actions.rush.reply
        : "快速试探未能找到规律，消耗了宝贵的材料。可以先请教，或用完整实验建立参照。";
      if (!success) {
        state.resources.trust = Math.max(0, state.resources.trust - 1);
      }
      const entry = {
        round: state.round,
        action: "rush",
        kind: "rush",
        title: byId[state.id].acts[state.round].actions.rush.title,
        text,
        success,
        points,
        cost: c,
        result: null,
      };
      const evidence = {
        round: state.round,
        kind: "rush",
        points,
        title: byId[state.id].acts[state.round].title,
        detail: text,
      };
      const existing = state.evidence.findIndex((e) => e.round === state.round);
      if (
        points &&
        (existing < 0 || points > state.evidence[existing].points)
      ) {
        if (existing < 0) state.evidence.push(evidence);
        else state.evidence[existing] = evidence;
      }
      state.log.push(entry);
      state.last = entry;
      state.pending = true;
      return true;
    }

    if (action === "experiment") {
      const result = test(state.id, state.round, params);
      const points = result.success ? 2 : 0;
      const success = result.success;
      const duplicate = state.log.some(
        (entry) =>
          entry.round === state.round &&
          entry.action === "experiment" &&
          JSON.stringify(entry.result.params) === JSON.stringify(result.params),
      );
      if (success && !duplicate) {
        state.resources.trust = Math.min(5, state.resources.trust + 1);
      } else if (!success) {
        state.resources.trust = Math.max(0, state.resources.trust - 1);
      }
      const obs = Research.observe(
        state.id,
        state.round,
        result,
        meta.prediction,
      );
      const cmp = comparison
        ? {
            ...comparison,
            discount: comparison.discount && meta.comparison === true,
          }
        : null;
      const entry = {
        round: state.round,
        action: "experiment",
        kind: "experiment",
        title: byId[state.id].acts[state.round].actions.experiment.title,
        text: result.detail,
        success,
        points,
        observation: obs,
        comparison: cmp,
        cost: c,
        result,
      };
      const evidence = {
        round: state.round,
        kind: "experiment",
        points,
        title: byId[state.id].acts[state.round].title,
        detail: result.detail,
      };
      const existing = state.evidence.findIndex((e) => e.round === state.round);
      if (
        points &&
        (existing < 0 ||
          points > state.evidence[existing].points ||
          (points === state.evidence[existing].points &&
            state.evidence[existing].kind !== "experiment"))
      ) {
        if (existing < 0) state.evidence.push(evidence);
        else state.evidence[existing] = evidence;
      }
      state.log.push(entry);
      state.last = entry;
      state.pending = true;
      return true;
    }
    return false;
  }

  function advance(state) {
    if (!state.pending || state.ended || state.round >= 2) return false;
    state.round++;
    state.pending = false;
    state.last = null;
    return true;
  }

  function act(state, action, params = {}, rawMeta = {}) {
    if (!state || typeof state !== "object") return null;
    const next = M.clone(state);
    if (!resolve(next, action, params, rawMeta)) return null;
    next.events.push({
      type: "action",
      action,
      params:
        next.round < 2 && action === "experiment"
          ? cleanParams(next.id, next.round, params)
          : {},
      ...(Object.keys(rawMeta || {}).length ? { research: rawMeta } : {}),
    });
    return next;
  }

  function next(state) {
    const result = M.clone(state);
    if (!advance(result)) return null;
    result.events.push({ type: "advance" });
    return result;
  }

  function reopenArgument(state) {
    if (!state.ended || state.round !== 2) return false;
    state.ended = false;
    state.ending = null;
    state.argument = null;
    state.last = null;
    state.pending = false;
    return true;
  }

  function revise(state) {
    const result = M.clone(state);
    if (!reopenArgument(result)) return null;
    result.events.push({ type: "revise" });
    return result;
  }

  function rating(state) {
    const cleared =
      state.ended && ["breakthrough", "discovery"].includes(state.ending);
    const trials = state.log.filter((entry) => entry.action === "experiment");
    const failures = state.log.filter(
      (entry) => entry.success === false,
    ).length;
    const complete = [0, 1].every((round) =>
      trials.some((entry) => entry.round === round && entry.success),
    );
    const fair = trials.some((entry) => entry.comparison?.fair);
    const stars = [
      {
        label: "发现成立",
        earned: !!cleared,
        hint: "用证据支持结论，完成关卡",
      },
      {
        label: "亲手验证",
        earned: !!cleared && complete,
        hint: "两幕都留下成功的正式实验",
      },
      {
        label: "对照研究",
        earned:
          !!cleared && complete && fair && failures <= 1 && !state.supplies,
        hint: "完成公平对照，正式失误不超过 1 次，且未使用补给",
      },
    ];
    return {
      stars,
      count: stars.filter((star) => star.earned).length,
      failures,
      fair,
      complete,
    };
  }

  function canResupply(state) {
    if (!state.role || state.ended || state.round >= 2 || state.supplies)
      return false;
    const ordinary = cost(state, "experiment");
    if (
      state.resources.time >= ordinary.time &&
      state.resources.tools >= ordinary.tools
    )
      return false;
    return !comparisonOffer(state)?.affordable;
  }

  function supply(state) {
    if (!canResupply(state)) return false;
    state.resources.time += 4;
    state.resources.tools += 2;
    state.supplies = 1;
    return true;
  }

  function resupply(state) {
    const result = M.clone(state);
    if (!supply(result)) return null;
    result.events.push({ type: "supply" });
    return result;
  }

  function restore(id, record) {
    if (record?.version !== 4 || record.id !== id || !byId[id])
      return fresh(id);
    const state = fresh(id, record.role, record);
    if (!state.role) return state;
    for (const e of (Array.isArray(record.events) ? record.events : []).slice(
      0,
      512,
    )) {
      if (!e || typeof e !== "object") break;
      const ok =
        e.type === "advance"
          ? advance(state)
          : e.type === "revise"
            ? reopenArgument(state)
            : e.type === "supply"
              ? supply(state)
              : e.type === "action"
                ? resolve(state, e.action, e.params, e.research)
                : false;
      if (!ok) break;
      state.events.push(M.clone(e));
    }
    return state;
  }

  const api = {
    scenarios,
    byId,
    roles,
    lab,
    cleanParams,
    test,
    fresh,
    cost,
    canAct,
    comparisonOffer,
    rating,
    canResupply,
    resupply,
    act,
    next,
    revise,
    restore,
    isCleared: (r) => r?.version === 4 && r.cleared === true,
  };

  if (typeof window !== "undefined") window.AtlasMathScenarios = api;
  if (typeof module !== "undefined") module.exports = api;
})();
