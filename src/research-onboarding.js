/* Contextual guidance uses real controls; entrances reuse the original pixel theatre. */
(() => {
  const step=(target,keys,title,text,watch,when)=>({target,keys:keys.split(','),title,text,watch,when});
  const range=key=>`[data-fv-input="${key}"]`;
  const choice=key=>`[data-fv-param="${key}"]`;
  const ap=key=>`[data-ap-choice="${key}"]`;
  const guides={
    P01:{arrival:'四箱货还在岸上，一块材料先下水。',question:'重量不变，换个形状能不能浮起来？',lessons:[
      [step(choice('shape'),'shape','先换一种船型','点一种不同的船型，看看船口和水线。也可以把船型拖进水槽。','看船口与水线，再看“浮态”和“容量余量”。')],
      [step(choice('shape'),'shape','四箱已经装上，再试船型','这一页重量增加了。换船型，检查上一页的办法还能不能用。','看四箱、船口和水线，不能沿用空载结论。')]]},
    P02:{arrival:'计时架上，三只钟越敲越急。',question:'小球越来越快，钟该怎样摆？',lessons:[0,1].map(()=>[
      step('[data-ap-bell]','bells','拖动三只钟的位置','拖坡上的棕色方块，或用“钟 1—3 位置”滑条；保持由近到远。','下方三条时间条包含“释放到第一钟”，不是只算钟与钟之间。'),
      step('[data-ap-action="replay"]','','放球，听一遍节拍','点“放球，重听节拍”。继续调钟位，比较三段时间是否接近。','静音也能看时间条与亮起的钟。')])},
    P03:{arrival:'图册柜里，同一只信筒留下两种轨迹页。',question:'先看给定世界里的落点，再谈用途。',lessons:[
      [step(range('speed'),'speed','拖发射速度滑条','移动“发射速度”，看信筒的轨迹与落点。需要时点“从起点回放”。','对照画面中的收集区与落点读数。'),step(choice('use'),'use','给这张图选用途','在“图页归档用途”里选择这份模型能支持的用途。','改变用途签不会改变轨迹；未检查的项目列在操作区。')],
      [step(range('ratio'),'ratio','现在调相对圆轨道速度','这一页换了球形世界与速度单位。拖滑条，比较轨迹是否碰地或开放。','看完整轨迹与分类；不是把上一页的 m/s 数字搬过来。'),step(choice('use'),'use','保留这页的用途','在用途签上写清这只是给定假设下的解释。','真实运输还需要另外检查。')]]},
    P04:{arrival:'一只落锤，一桶水，一张留热账。',question:'落锤的输入，究竟有多少留在水里？',lessons:[0,1].map(()=>[
      step(ap('coupled'),'coupled','先试一次传动开关','点传动按钮，看看落锤与搅拌器的连接。此时还没有释放落锤。','看落锤与搅拌器之间的连接。'),
      step('[data-ap-action="replay"]','','释放一次落锤','点“释放一次”看演示。可以反复回放，每次只算一次输入。','看水中留热、散出热量与温升，三者来自同一笔账。'),
      step(range('retained'),'retained','把读数写回留热栏','拖“记入水中留热”滑条，对照本页保温条件和实际读数。','温升画面已放大，按读数判断，不按柱子的视觉高度猜。')])},
    P05:{arrival:'暗室里，一张探测屏等着留下图样。',question:'多开一条缝，会出现怎样的明暗？',lessons:[0,1].map(()=>[
      step(ap('slits'),'slits','切换单缝与双缝','点“开单缝”和“开双缝”，比较同一个探测点。','看屏幕明暗条与固定点的强度；这是给定远场模型。'),
      step(range('distance'),'distance','再拖双缝间距','保持本页波长，慢慢改变双缝间距，观察亮暗怎样移动。','记录前核对本页波长、间距与固定点读数。')])},
    P06:{arrival:'线圈工坊里，磁铁停着，指针也停着。',question:'下一班需要知道的，是“放在哪里”还是“怎样动”？',lessons:[
      [step('[data-nw-drive="1"]','trace','按住推进，再松手','按住“推近”让磁铁移动一段，再松手等指针停稳。键盘可聚焦后按住空格。','看输入轨迹与响应曲线：移动的一段和停住的一段要一起留下。')],
      [step('[data-nw-drive="1"]','trace','按住，让线圈转满一圈','按住“正向转动”，让角度越过一整圈，再松手。也可拖舞台手柄。','看角度跨度与正、负响应；轻点一下不够完成连续转动。')]]},
    P07:{arrival:'收发台前，纸带还空着，对岸正在等。',question:'同一个字母，要靠真实的短长音传过去。',lessons:[0,1].map(c=>[
      step(range('tuning'),'tuning','先对接收刻度','拖“发送调谐刻度”，对照右侧对岸刻度。这里只改变接收质量。','看刻度与接收质量，不会替你改写已经按出的符号。'),
      step('[data-cr-action="key"]','pulses',c?'亲手按短、长、短':'亲手按三次短音',c?'在发送键上短按、长按、再短按；松开才结束一音。':'在发送键上短按并松开，重复三次。可聚焦后用空格。','短音约 200 ms、长音约 800 ms；看纸带与实际时长，按错可免费撤回。',p=>p.pulses.length>=3)])},
    P08:{arrival:'档案员把原始读数压在纸夹下面。',question:'异常值得追问，但能直接给新元素命名吗？',lessons:[
      [step(ap('subtract'),'subtract','先把背景扣出来','点“扣背景并排净计数”，把参考与矿石放在同一条件下比较。','原数仍保留；看净计数，而不是只看最大的数字。'),step(ap('scope'),'scope','给这份报告选结论范围','选能被这些读数支持的说法。异常与鉴定特定元素，需要的证据不同。','结论签不会改写原始数据。')],
      [step(ap('batch'),'batch','切换给定批次','比较重复组 A 与另一批 B，再查看扣背景后的趋势。','这些是给定资料，重复点击不会增加独立样本。'),step(ap('scope'),'scope','保留批次和未知原因','核对报告范围，把暂时不知道的原因也留在记录里。','看不同批次的净计数，不把差别擦掉。')]]},
    P09:{arrival:'炉光曲线旁，几处误差一直对不上。',question:'一处吻合，够不够说明整条曲线？',lessons:[0,1].map(()=>[
      step(ap('model'),'model','切换两种模型叠图','点“经典模型”和“量子模型”，在同一标度上比较。','看整条曲线与给定采样点，尤其是高频一侧。'),
      step(range('cursor'),'cursor','拖游标，再选择核对范围','移动“比较游标”，查看局部误差；下面还要选择检查一处还是全部给定点。','拖游标不会改观测点，记录应说明核对过的范围。')])},
    P10:{arrival:'光电柜亮着，检测片却没有响应。',question:'是光子太少，还是每一个光子的能量不够？',lessons:[
      [step('[data-rt-action="capture"]','trials','先夹住一组光源预览','点“夹住当前光源”，把现在的设置留在预览夹。这一步免费。','看预览夹里的设置，以及有没有电子。',p=>p.trials.length>=1),step(range('flux'),'flux','频率先不动，改变通量','拖“相对光子通量”，观察电子响应；先保留频率。','看光源强弱与电子响应是否一起变化。'),step('[data-rt-action="capture"]','trials','把第二组也夹住','点“夹住当前光源”，留下刚才调整后的设置。','两组实际设置都要留在预览夹里。',p=>p.trials.length>=2),step(range('frequency'),'frequency','现在只改变频率','保留通量，拖频率滑条，观察电子响应。','比较频率变化和通量变化带来的不同现象。'),step('[data-rt-action="capture"]','trials','夹住这次频率变化','再点“夹住当前光源”，把这次观察留在预览夹里。','至少三组预览能帮你回看分别改变了什么。',p=>p.trials.length>=3)],
      [step(range('frequency'),'frequency','换材料后重新查阈值','保留光源设置，拖频率滑条，观察材料 B 何时开始发射。','看材料功函数、阈值和电子最大动能；增加通量不能替代足够频率。')]]},
    M01:{arrival:'两根弦放在一起，一根长，一根短。',question:'听到和谐，还要把长度的关系写清。',lessons:[
      [step(range('length'),'length','先改变一点弦长','拖弦端或弦长滑条，松手后看看长度和频率。','固定张力和线密度，观察长度与频率的反向变化。'),step('[data-ap-action="pluck"]','','拨两根弦，比较一下','点“拨两根弦”听演示。静音时也可以对照两根弦的频率。','看长度和频率的关系，声音只是另一种观察方式。')],
      [step(ap('fraction'),'fraction','先比较有理近似','选择一个分数，看它与对角线长度的差距。','近似得很准，不等于已经证明它是精确分数。'),step('[data-ap-proof]','proof','把一般理由按次序放上去','点推理卡放进图旁的列表；可撤回、重排，也可拖入。','让假设、平方关系和奇偶矛盾连起来；“看起来像”不是一般理由。')]]},
    M02:{arrival:'包裹封着，天平两边的账却能一起改。',question:'不拆包裹，能不能知道每包有多重？',lessons:[0,1].map(()=>[
      step('[data-ap-op][data-ap-side="both"]','ops','从两边取走同样的东西','点“两边…”按钮。每一步都会改变两盘和下面的等式。','看两边是否仍相等；仅改一边可免费预览，但不等价。'),
      step('[data-ap-op][data-ap-side="both"]','ops','继续整理到一个 x','看当前等式，再决定取走或相除。走错可以“撤回一步”或“恢复原账单”。','不能停在几个 x 的总重；最后代回原账单核对。')])},
    M03:{arrival:'一张地址签只写着“往右上”。',question:'换个人拿着这张签，还能找到同一个窗口吗？',lessons:[
      [step(choice('origin'),'origin','先选从哪里开始数','点选一个原点，看坐标轴与数字怎样变化。窗口本身不会移动。','东为 +x、北为 +y，每格 1 单位。'),step(range('targetX'),'targetX,targetY','移动投递标记','用横、纵坐标滑条，或拖动图上的小旗。把旗送到小禾的窗口。','先横再纵；看旗与亮色窗口是否重合。')],
      [step(range('lineSlope'),'lineSlope','拖直线上的青色方块','也可拖“斜率 m”滑条，让直线同时对上两个航标。','这页限定 y=mx，不能只对上一个点。')]]},
    M04:{arrival:'输入与输出之间，还缺几根说明用的线。',question:'规则明确，下一班才能知道该把信送去哪。',lessons:[0,1].map(()=>[
      step('[data-ap-numeric="source"]','source','先选一个输入编号','点左边输入，再点右边的“→ 数字”接线；也可在舞台上拖线。','编号 6 标为域外，不能硬套进这张关系表。'),step('[data-ap-link]','links','把给定规则接成关系表','逐个检查域内输入。点击已有连线可移除，接错也可清空。','同一输入不能同时送往两个输出；不同输入允许同一个输出。')])},
    M05:{arrival:'桥洞的最高处够高，船的两边却未必过得去。',question:'先接好两端，再看整个船宽。',lessons:[
      [step(range('h'),'h,k,a','先调曲线的位置和开口','拖 h、k、a 滑条，或用图中棕色顶点与青色控制点。','同时看左右端点误差，不能只看最高点。')],
      [step(range('a'),'a','顶点已固定，只调开口 a','拖 a 滑条，同时核对桥洞两端与矩形船的全宽。','看 x∈[3,9] 最低净空；h、k 这一页不再可调。')]]},
    M06:{arrival:'同一枚站章，两张图纸画出了不同位置。',question:'“先转再移”和“先移再转”，会一样吗？',lessons:[
      [step('[data-cr-op]','order','按顺序放入操作卡','点操作卡依次加入列表。点 ↑ 前移、× 移除，也可拖动重排。','看每一步的中间顶点与最终轮廓，不只看朝向。')],
      [step('[data-cr-op], [data-cr-action="up-op"]','order','交换操作次序','在卡片列表里重排“平移”和“旋转”，需要时点“逐步回放”。','对比同一顶点在放大之前落在哪里。'),step(range('scale'),'scale','最后再调倍率','拖“倍率”滑条。长度与面积分别读，不把两者当成同一个倍数。','看原片、虚线目标与当前实线能否对应。')]]},
    M07:{arrival:'一块看起来像直角的模板，等着进入图册。',question:'像素画得像，不够当成证明。',lessons:[0,1].map(c=>[
      step(range(c?'scale':'a'),c?'scale,a,b,c':'a,b,c',c?'按本页倍数缩放模板':'先拼三条正边长',c?'保留同一原模板，拖整体缩放倍数，观察三块平方板。':'拖 a、b、c 三条滑条，先检查能否闭合成三角形。','看三角形不等式，再看两小平方板之和与大平方板。'),step('[data-ap-proof]','proof','把理由放在图旁','依次点推理卡；走错可以撤回或重排。','闭合前提与勾股逆定理都要有，不能只说“看着像”。')])},
    M08:{arrival:'回程船朝正对岸开，却总被水流带偏。',question:'直达对岸，和最快过河，是同一个目标吗？',lessons:[0,1].map(c=>[
      step(range('angle'),'angle','拖黄色箭头端点或航向滑条',c?'这页允许漂移。改变航向，比较到对岸所用的时间。':'调整船头方向，让船速和水流的合速度指向目标窗口。',c?'看过河时间与竖直速度分量，不必沿用上一页的无漂移目标。':'看对岸漂移量；船头方向不等于实际运动方向。')])},
    M09:{arrival:'两次采样间的平均值，漏掉了某一刻的变化。',question:'把间隔缩短，能怎样接近这一刻？',lessons:[0,1].map(c=>[
      step(range(c?'t':'dt'),c?'t,dt':'dt',c?'先移动切点时刻':'先缩小正采样间隔',c?'拖“切点时刻”，观察切线斜率；采样间隔仍保持为正。':'拖 Δt，比较割线和切线，不能把间隔设为零。','看差商、瞬时率与切线，数值接近不是省略推理的理由。'),step('[data-ap-proof]','proof','按次序放入推理卡',c?'把驻点与二阶导数的判断接起来，再决定是不是极小。':'把差商展开、间隔趋近与极限连接起来。可撤回重排。','列表保留你的理由，零斜率本身还不能说明极小。')])},
    M10:{arrival:'观测信封还压在纸夹下面。',question:'先留下预测，后来看到的数据才有比较的意义。',lessons:[
      [step(range('a'),'a,b,c','拖三个系数拟合给定三点','用 a、b、c 滑条，或拖舞台上的三个控制点。','看三点的最大误差；这里只能使用已给出的拟合资料。')],
      [step(choice('claim'),'claim','先读封存预测与新观测','这封信已公开。对照原预测、观测和误差，再选本次检验能支持的判断。','原预测不会被后来调参改写，新的曲线只能叫修订。')]]},
    C01:{arrival:'留样还在，两张外部标签却被水泡坏了。',question:'看起来相似的东西，用什么性质能分开？',lessons:[0,1].map(()=>[
      step(choice('instrument'),'instrument','先点一种测量工具','在“测性质”里切换工具，或拖留样到仪器上。此时不会扣额度。','对照“本次观察”和“参考”：两种候选都一样的性质还不能定名。'),step(choice('identity'),'identity','再夹身份签','依据刚才的测量选身份签，先别急着正式记录。','标签只是你的判断，不会改变读数；确认参考能排除另一候选。')])},
    C02:{arrival:'两张账单都写着碳和氧，却不是同一种组成。',question:'比较之前，先统一碳的基准。',lessons:[0,1].map(()=>[
      step(range('carbon'),'carbon,oxygen','摆出本页的 C、O 个数','拖碳、氧滑条，观察原子筹码与相对质量条。','看本页分子组成，质量条使用 C=12、O=16 的相对质量。'),step(range('ratioClaim'),'ratioClaim','把氧/碳质量比记下来','用当前组成算 O/C 质量比，再拖“记下质量比”滑条。','可点“整份组成倍增”比较：总量变了，比例是否也变？')])},
    C03:{arrival:'几张性质卡排在桌上，还有一张证据不足。',question:'先按已知性质分组，把不知道的地方留出来。',lessons:[
      [step('[data-ap-classify]','slots','给每张性质卡选组','逐卡读性质，点“组 1 / 组 2”；证据不足的卡可以留空。','看各组是否共享性质，不要为了填满而猜。')],
      [step(range('na'),'na,cl','现代说明页另查电子数','拖 Na、Cl 最外层电子数滑条。历史性质卡与现代解释分别保留。','电子数是本页的说明，不能倒写成历史分类当时已知的证据。')]]},
    C04:{arrival:'图纸上的两颗点，差点被当成多余记号擦掉。',question:'共享，是一起使用，不是在总账里记两次。',lessons:[0,1].map(c=>[
      step('[data-cr-action="place"]','placements',c?'分配六对电子':'把一对电子放进共用区',c?'先选择电子对，再点“共享区 / 左原子周围 / 右原子周围”。也可从托盘拖动。':'选择 e1，再点“共享区”，或把托盘里的点对拖到两个 H 之间。',c?'看全分子总数、共享对和每个 O 周围的数目。':'看全分子与每个 H 的计数；同一对电子只有这一份库存。')])},
    C05:{arrival:'一张分子邮票上，小数字也在传递信息。',question:'复制整张票，和改掉下标，会是一回事吗？',lessons:[0,1].map(c=>[
      step(range('a'),'a,b','先装好一张分子票',c?'拖每份 N、H 的个数，组成这一页的氨分子。':'拖每份 H、O 的个数，组成这一页的水分子。','看“每份组成”，不要把总份数写进分子下标。'),step(range('copies'),'copies','再复制整张票','拖“整张邮票份数”，或点“复制整张票”。','看每份组成是否保持、原子总数怎样随份数变化。')])},
    C06:{arrival:'阿墨抬起图纸折角：原来这张图还有前后。',question:'镜头转了，分子里的角也跟着变吗？',lessons:[0,1].map(()=>[
      step(choice('shape'),'shape','先选本页的候选构型','点“平面十字 / 四面体 / 折线形”，对照本页研究的分子。','左边为空间模型，右边是同一视角的投影。'),step(range('yaw'),'yaw,pitch,angleLabel','转模型，再标参考角','拖空间模型或水平、俯仰滑条；用角标滑条或快捷按钮标注参考角。','观察前后键与投影；角度标注不会把模型本身掰弯。')])},
    C07:{arrival:'两支非零的箭头，合起来却可能没有总方向。',question:'合量为零，不代表原来的分量不存在。',lessons:[0,1].map(()=>[
      step(range('angle'),'p,angle','先保留分量，再调角度','拖键偶极大小与夹角，或拖第二支箭头端点，观察首尾相接。','看两支分量和合箭头，p 不能靠归零来冒充抵消。'),step(ap('mode'),'mode,claim','给模型和判断各选一张签','参考角下可选分子示意；自由改角要标“抽象向量研究”。再选分量是否仍在。','签名不改变向量，合量零也不等于无键极性。')])},
    C08:{arrival:'天平少了几克，绿色气体筹码却还在画面里。',question:'先看称到了哪里，再决定总账是否少了。',lessons:[
      [step('[data-rt-action="capture"]','views','先夹住当前容器状态','点“夹住当前容器状态”，留下天平和气体的这次预览。','看容器内与逸出气体两栏；夹预览免费。',p=>p.views.length>=1),step(choice('lid'),'lid','保持产气量，换一种开闭状态','点开口或封闭按钮，比较气体去了哪里。','比较前后时，让产气量保持一致。'),step('[data-rt-action="capture"]','views','夹住另一种容器状态','再点“夹住当前容器状态”，留下第二组预览。','预览夹里保留一对开闭状态，再核对称量范围。',p=>p.views.length>=2),step(choice('boundary'),'boundary,claim','圈出称量范围，再写判断','点称量范围，或拖舞台边界把手，把逸出气体也计入。再选记录判断。','圈外仍有物质，扩大范围只是把它计回总账。')],
      [step(range('h2'),'h2,o2,h2o','现在只调方程系数','拖 H₂、O₂、H₂O 前的份数滑条，逐元素对账。','分子式下标固定；两侧 H、O 都要相等，并约成最简整数比。')]]},
    C09:{arrival:'锌铜账本上，电子不能只记在一边。',question:'电子去了哪里，数量对得上吗？',lessons:[
      [step(range('lost'),'lost,gained','分别填写失去和得到的电子','拖 Zn、Cu²⁺ 两行滑条，或点各自的“加 1 e⁻”。','看两边电子守恒与半反应，数相等还要符合本页离子变化。')],
      [step(range('charge'),'charge','拖外电源通过的电量','这是一张独立电解页。改变通过电量，观察析铜质量。','电量与析出量联动，跟上一页的原电池账分开。'),step(range('valence'),'valence','再核对每个铜离子所需电子标注','拖标注滑条，检查 Cu²⁺ 的电子账。','改标注不会改实际按 n=2 计算的析铜质量。')]]},
    C10:{arrival:'外面的导线接好了，小灯却还没亮。',question:'电子的外路之外，还有一条什么路？',lessons:[
      [step(choice('wire'),'wire,bridge','先试外导线开关','点“外导线”按钮，比较接通和断开时的电流。','连接会立即响应，不用另点运行。'),step(choice('bridge'),'wire,bridge','再试盐桥，与外路作比较','点盐桥和外导线按钮，比较只接导线、只接盐桥和双路接通。','下方三项观察会打勾；看电流读数。',p=>[['on','off'],['off','on'],['on','on']].every(([wire,bridge])=>p.checks.some(s=>s.wire===wire&&s.bridge===bridge)))],
      [step(range('load'),'load,wire,bridge','接好两路后调整负载','拖外部负载滑条，看电流怎样变化；保持两路接通。','比较电流与本页目标，不用改方向签来“调”电流。'),step(choice('direction'),'direction','标记电子走外路的方向','点一个电子方向签，核对 Zn、Cu 与外导线。','离子在内部迁移，方向签只是说明，不参与计算。')]]},
  };
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const memoryKey='knowledge-islands-guidance-v1';
  const modeLabels={choose:'点选切换',adjust:'拖动调节',hold:'按住 · 松手',assemble:'放置与整理',replay:'点击演示',capture:'夹住预览'};
  // Explain how this particular table runs, rather than inventing a universal Run button.
  const operationNotes={
    P01:'船型立即生效，无需点击运行。',P02:'位置与读数即时更新；点“放球”观看运动。',P03:'轨迹即时更新，可从起点回放。',
    P04:'开关与账目即时更新；点“释放一次”观看落锤。',P05:'缝与间距立即改变屏幕图样。',P06:'按住才持续运动，松手后观察指针停稳。',
    P07:'调谐即时变化；发送键松开时才记下一音。',P08:'点选后立即并排比较给定资料。',P09:'切换模型或拖游标，曲线与误差立即更新。',
    P10:'光源即时响应；“夹住”只保存免费预览。',M01:['弦长和频率即时变化，点“拨弦”听演示。','选择近似、放入理由，图旁立即更新。'],
    M02:'每次变形立即改变天平；可免费撤回。',M03:'坐标与图形即时联动，无需点击运行。',M04:'先选输入，再点输出；也可在舞台拖线。',
    M05:'拖控制点或滑条，桥洞与净空立即变化。',M06:'点卡片即加入操作；可重排、逐步回放。',M07:'边长与平方板即时联动；理由卡点选加入。',
    M08:'调整航向即改变路线，读数即时更新。',M09:'滑条即时改变割线与切线；理由卡点选加入。',M10:['拟合即时预览，正式记录才封存预测。','原预测保持封存，当前曲线可继续修订。'],
    C01:'点工具立即测性质，身份签要单独选择。',C02:'原子数与质量条即时联动。',C03:['点每张卡的分组按钮，证据不足可以留空。','拖滑条立即更新电子数说明。'],
    C04:'先选电子对，再点区域；也可以拖放。',C05:'组成和份数即时联动，复制保留每份组成。',C06:'拖模型或滑条即时转视角，角标单独设置。',
    C07:'角度和箭头即时联动，判断签单独选择。',C08:['开闭即时变化；“夹住”保存免费预览。','系数即时改变账目，分子式下标固定。'],
    C09:'滑条或加电子按钮立即更新账目。',C10:'点导线与盐桥立即接通或断开，无需点击运行。'
  };
  // Choosing an existing origin/source is a meaningful selection, even when its value is unchanged.
  guides.M03.lessons[0][0].selection=true;
  guides.M04.lessons.forEach(steps=>{steps[0].selection=true;steps[0].when=p=>p.source!==6;});
  guides.P06.lessons[0][0].when=p=>p.trace.length>=4&&Math.abs(p.trace.at(-1).value-p.trace[0].value)>.04;
  guides.P06.lessons[1][0].when=p=>p.trace.length>=4&&Math.max(...p.trace.map(s=>s.value))-Math.min(...p.trace.map(s=>s.value))>=360;
  function modeOf(s){
    if(s.keys.some(k=>['trace','pulses'].includes(k)))return 'hold';
    if(!s.keys.some(Boolean))return 'replay';
    if(s.keys.some(k=>['trials','views'].includes(k)))return 'capture';
    if(/proof|cr-op|ap-op|classify|ap-link|action="place"/.test(s.target))return 'assemble';
    if(/fv-input|ap-bell/.test(s.target))return 'adjust';
    return 'choose';
  }
  function readyStep(s,updates,params,previous){
    return !!s&&s.keys.some(k=>k&&Object.hasOwn(updates,k)&&(s.selection||JSON.stringify(params[k])!==JSON.stringify(previous[k])))&&(!s.when||s.when(params));
  }
  // Preferences are deliberately separate from research saves: guidance never creates evidence.
  function readMemory(){
    try{const saved=JSON.parse(localStorage.getItem(memoryKey));if(saved&&typeof saved==='object')return {levels:saved.levels&&typeof saved.levels==='object'&&!Array.isArray(saved.levels)?saved.levels:{},modes:saved.modes&&typeof saved.modes==='object'&&!Array.isArray(saved.modes)?saved.modes:{}};}catch{}
    return {levels:{},modes:{}};
  }
  function mount({host,id,definition,getState,onDismiss}){
    const data=guides[id],guide=host.querySelector('.ro-guide'),modal=host.closest('.modal'),memory=readMemory();
    const opening=document.createElement('div');opening.className='fv-intro fv-classic-intro';opening.hidden=true;modal.append(opening);
    const live=document.createElement('p');live.className='ro-live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');host.append(live);
    const stored=memory.levels[id];
    let condition=getState().activeCondition,runId=getState().runId;
    let steps=stored?.runId===runId&&Array.isArray(stored.steps)?[0,1].map(c=>Math.max(0,Math.min(data.lessons[c].length,Math.floor(Number(stored.steps[c]))||0))):[0,0];
    let index=steps[condition],collapsed=false,helpOpen=false,reviewing=false,checkingRecord=false,open=false,dead=false,cutscene=null;
    let target=null,targetDescription=null,guideKey='',pending=null,settleTimer=0,demoTimer=0,demo=null,demoArea=null,lastActivity=Date.now(),idleOffered=false,stall=false,reaction='';
    let pointerActive=false,keys=new Set(),errorCount=0;
    const lesson=()=>data.lessons[condition];
    const note=()=>Array.isArray(operationNotes[id])?operationNotes[id][condition]:operationNotes[id];
    function remember(){
      steps[condition]=index;memory.levels[id]={runId,steps:[...steps]};
      try{localStorage.setItem(memoryKey,JSON.stringify(memory));}catch{}
    }
    function clearTarget(){
      if(target){target.classList.remove('ro-target','ro-target-pulse');target.removeAttribute('data-ro-label');
        if(targetDescription===null)target.removeAttribute('aria-describedby');else target.setAttribute('aria-describedby',targetDescription);}
      target=null;targetDescription=null;
    }
    function stopDemo(){clearTimeout(demoTimer);demo?.remove();demoArea?.classList.remove('ro-demo-anchor');demo=null;demoArea=null;}
    function cancelPending(){clearTimeout(settleTimer);pending=null;pointerActive=false;keys.clear();stopDemo();}
    function showOpening(paused){
      if(dead)return;cancelPending();cutscene?.destroy();open=true;condition=getState().activeCondition;clearTarget();
      host.classList.add('fv-in-opening');host.inert=true;opening.hidden=false;modal.scrollTop=0;
      const info={challenge:definition.goals.join(' '),missionStep1:definition.goals[0],missionStep2:definition.goals[1]};
      const options={id,host:opening,onComplete:dismiss,onSkip:dismiss,paused,startLabel:'进入实验台 ►',missionCaption:'两组条件 · 自由调试后再记录',info};
      cutscene=id[0]==='P'?window.AtlasLevelIntro.create(options,{info:{...window.AtlasPhysicsLevelIntro.data[id],...info}}):window.AtlasSubjectLevels.createIntro(options,id[0]);
    }
    function visibleTarget(selector){return [...host.querySelectorAll(selector)].find(el=>el.getClientRects().length&&!el.disabled);}
    function focusTarget(selector,scroll=true){
      const el=visibleTarget(selector);if(!el)return;
      const field=el.closest('fieldset,.ap-proof,.ap-classifier')||el;
      if(scroll)field.scrollIntoView({block:'nearest',behavior:'instant'});
      if(!el.matches('button,input,select,[tabindex]'))el.tabIndex=-1;
      el.focus({preventScroll:true});
    }
    function current(){
      const run=getState(),supported=c=>run.records.some(r=>r.condition===c&&r.recordValid&&r.goalSupported);
      if(supported(condition)&&!reviewing){
        if(run.returnCondition!==null)return {target:'[data-fv-action=return]',title:'这次核对已留下',text:'点“返回当前任务”，接着完成原来的委托。',phase:'return'};
        if(!condition)return {target:'[data-fv-action=advance]',title:'这一页已经留好依据',text:'准备好后，点“检查新条件”。我会提醒你这次变了什么。',phase:'advance'};
        if(!host.querySelector('[data-fv-action=archive]'))return {target:'[data-fv-action=post]',title:'成果已收进货单',text:'查看货单，接着安排寄送；也可以继续自由研究。',phase:'posted'};
        return {target:'[data-fv-action=archive]',title:'两页都有依据了',text:'点“收好成果”，把这次研究夹进货单。',phase:'archive'};
      }
      const s=lesson()[index];
      if(s)return {...s,phase:'operate'};
      if(checkingRecord){
        const button=host.querySelector('#fv-record'),price=host.querySelector('.fv-price span')?.textContent;
        return {target:button?.disabled?'.fv-commit':'#fv-record',title:button?.disabled?'先看看还缺哪一步':'准备好，再记录这一组',text:button?.disabled?button.textContent:`本次记录：${price}。只想留现象，可以勾选“只记现象，作为参考”。`,phase:'record'};
      }
      return {target:'.fv-readings',title:'动起来了，看看变化',text:lesson().at(-1).watch,watch:'对照本页目标和读数，继续免费调整；确认后再记录。',phase:'observe'};
    }
    function paint(){
      if(dead)return;
      const run=getState();
      if(condition!==run.activeCondition||runId!==run.runId){
        cancelPending();if(runId!==run.runId)steps=[0,0];condition=run.activeCondition;runId=run.runId;index=steps[condition];
        reviewing=false;checkingRecord=false;helpOpen=false;reaction='';stall=false;lastActivity=Date.now();guideKey='';
      }
      const s=current(),mode=modeOf(s.keys?s:lesson()[Math.min(index,lesson().length-1)]),experienced=!!memory.modes[mode];
      const instruction=s.phase==='operate'&&experienced?s.text.split('。')[0]+'。':s.text;
      guide.dataset.phase=s.phase;guide.dataset.step=String(index);guide.dataset.condition=String(condition);guide.dataset.familiar=String(experienced);
      const change=condition===1&&index===0&&!reviewing?definition.change:'';
      const key=JSON.stringify([condition,index,collapsed,helpOpen,s,change,stall,reaction,experienced]);
      if(key!==guideKey){
        guideKey=key;
        const avatar=`<svg viewBox="-9 -4 46 38" aria-hidden="true" shape-rendering="crispEdges">${window.AtlasFirstVoyageArt.raven(0,0)}</svg>`;
        window.AtlasPhysicsSandbox.patch(guide,`<div class="ro-guide-head"><span class="ro-avatar">${avatar}</span><span class="ro-speaker">阿墨<small>操作搭档</small></span><button data-live-key="ro-help" data-ro-action="help" aria-expanded="${helpOpen}" aria-controls="ro-help">怎么操作 · 免费</button><button data-live-key="ro-collapse" data-ro-action="collapse" aria-expanded="${!collapsed}" aria-controls="ro-body" aria-label="${collapsed?'展开':'收起'}操作指引">${collapsed?'＋':'−'}</button></div>
          <div id="ro-body" class="ro-guide-body" ${collapsed?'hidden':''}>
          <div class="ro-guide-meta"><span>${s.phase==='operate'?modeLabels[mode]:s.phase==='observe'?'观察变化':s.phase==='record'?'正式记录':'接着出发'}</span><small>${s.phase==='operate'?`${index+1} / ${lesson().length} · ${experienced?'熟悉的操作':'第一次动手'}`:'自由调试一直开放'}</small></div>
          ${change?`<p class="ro-change"><b>这次变了什么</b>${esc(change)}</p>`:''}
          ${reaction?`<p class="ro-reaction">${esc(reaction)}</p>`:''}
          <strong>${esc(s.title)}</strong><p id="ro-instruction">${esc(instruction)}</p>
          ${s.phase==='operate'?`<small class="ro-operation-note">${esc(note())}</small>`:s.watch?`<small class="ro-operation-note">${esc(s.watch)}</small>`:''}
          ${s.phase==='observe'?'<button data-live-key="ro-record" class="ro-to-record" data-ro-action="next-hint">我已看过，找到记录按钮 →</button>':''}
          ${stall?'<button class="ro-stall" data-ro-action="help">找不到操作位置？我可以指给你看 ↗</button>':''}
          </div><div id="ro-help" class="ro-help" ${helpOpen?'':'hidden'}>${s.phase==='operate'&&instruction!==s.text?`<p>${esc(s.text)}</p>`:''}<p>${esc(s.phase==='operate'?s.watch:'操作帮助免费；原理与证据的问题，可请人物核对。')}</p><div class="ro-help-actions"><button data-ro-action="locate">指出操作位置 ↗</button><button data-ro-action="demo">看一遍操作示范</button><button data-ro-action="restart">带我重新做一次</button></div></div>`);
      }
      // Keep one stable card above the controls, including while a gesture is in progress.
      clearTarget();if(open||collapsed)return;
      const el=visibleTarget(s.target);if(!el)return;
      target=el.closest('.fv-choices,.fv-number,.ap-proof-cards,.ap-inputs,.ap-outputs')||el;
      targetDescription=target.getAttribute('aria-describedby');target.classList.add('ro-target');
      target.setAttribute('aria-describedby',[targetDescription,'ro-instruction'].filter(Boolean).join(' '));
      target.dataset.roLabel=s.phase==='operate'?'动这里':s.phase==='observe'?'看这里':'下一步';
    }
    function dismiss(){
      if(!open)return;cutscene?.destroy();cutscene=null;open=false;opening.hidden=true;host.classList.remove('fv-in-opening');host.inert=false;
      lastActivity=Date.now();onDismiss?.();paint();focusTarget(current().target,matchMedia('(max-width:760px)').matches);
    }
    function settle(){
      clearTimeout(settleTimer);if(dead||open||pointerActive||keys.size||!pending)return;
      const attempt=pending;pending=null;
      if(attempt.index!==index||attempt.condition!==condition||attempt.runId!==runId)return;
      const s=lesson()[index];if(!s)return;
      memory.modes[modeOf(s)]=true;index++;checkingRecord=false;stall=false;errorCount=0;reaction='✓ 这一步操作完成了。';remember();
      if(index===lesson().length&&getState().records.some(r=>r.condition===condition&&r.recordValid&&r.goalSupported))reviewing=false;
      // Do not replace scientific feedback or award evidence for following a tutorial.
      live.textContent=`操作完成。${current().title}`;paint();
    }
    function schedule(){clearTimeout(settleTimer);settleTimer=setTimeout(settle,140);}
    function changed(updates,params,previous){
      if(dead||open)return;stopDemo();lastActivity=Date.now();stall=false;
      reaction='';
      const s=lesson()[index];
      if(readyStep(s,updates,params,previous))pending={index,condition,runId};
      // A later undo or invalid preview cancels an earlier pending completion.
      else if(pending&&s?.when&&!s.when(params))pending=null;
      if(pending)schedule();
    }
    function recorded(valid){
      cancelPending();reviewing=false;checkingRecord=false;collapsed=false;helpOpen=false;
      reaction=valid?'✓ 记录已留下。':'这份声明还没有依据。现场保留着，可以免费调整再试。';
      paint();
    }
    function update(){paint();}
    function help(){collapsed=false;helpOpen=true;stall=false;idleOffered=true;stopDemo();guideKey='';paint();guide.scrollIntoView({block:'nearest',behavior:'instant'});guide.querySelector('[data-ro-action=locate]')?.focus({preventScroll:true});}
    function blocked(message){
      errorCount++;lastActivity=Date.now();reaction=message;if(errorCount>=2)stall=true;paint();
    }
    function demonstrate(){
      stopDemo();const example=current().phase==='operate'?current():lesson().at(-1);
      reaction=`操作示范 · ${example.title}`;paint();focusTarget(example.target);
      const el=visibleTarget(example.target);if(!el)return;
      demoArea=el.closest('.fv-choices,.fv-number,.ap-proof-cards,.ap-inputs,.ap-outputs')||el;
      demoArea.classList.add('ro-demo-anchor');
      const motion=modeOf(example)==='assemble'&&el.matches('button')?'choose':modeOf(example);
      demo=document.createElement('span');demo.className=`ro-demo ro-demo-${motion}`;demo.setAttribute('aria-hidden','true');
      demo.style.left=`${Math.min(demoArea.clientWidth/2,100)}px`;demo.style.top='50%';
      demo.innerHTML='<span class="ro-demo-ring"></span><svg viewBox="0 0 24 30"><path d="M8 15V3h4v9h3v2h3v2h3v10H9l-7-8 3-3z" fill="var(--fv-ink)" stroke="var(--fv-bg)" stroke-width="2"/></svg>';
      demoArea.append(demo);live.textContent=`操作示范：${example.title}。${note()}`;demoTimer=setTimeout(stopDemo,2400);
    }
    function click(event){
      const button=event.target.closest('[data-ro-action]'),action=button?.dataset.roAction;
      if(!action){const s=lesson()[index];if(!open&&s&&!s.keys.some(Boolean)&&event.target.closest(s.target)&&!event.target.closest(':disabled')){pending={index,condition,runId};schedule();}return;}
      lastActivity=Date.now();stall=false;
      if(action==='collapse'){collapsed=!collapsed;helpOpen=false;stopDemo();paint();}
      if(action==='help'){collapsed=false;helpOpen=!helpOpen;idleOffered=true;stopDemo();paint();}
      if(action==='locate'){focusTarget(current().target);target?.classList.add('ro-target-pulse');}
      if(action==='demo')demonstrate();
      if(action==='next-hint'){checkingRecord=true;helpOpen=false;paint();focusTarget(current().target);}
      if(action==='restart'){cancelPending();reviewing=true;index=0;checkingRecord=false;collapsed=false;helpOpen=false;reaction='从眼前这组条件开始，已有记录会保留。';remember();paint();focusTarget(current().target);}
    }
    function activity(){lastActivity=Date.now();}
    function pointerDown(event){
      activity();if(event.target.closest('.fv-controls,.fv-stage-frame')){pointerActive=true;stopDemo();}
    }
    function pointerUp(){pointerActive=false;if(pending)schedule();}
    function keyDown(event){
      activity();if(event.target.closest('.fv-controls,.fv-stage-frame')&&[' ','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)){keys.add(event.key);stopDemo();}
    }
    function keyUp(event){keys.delete(event.key);if(pending)schedule();}
    function blur(){cancelPending();lastActivity=Date.now();}
    function visibility(){if(document.hidden)blur();else activity();}
    const idleTimer=setInterval(()=>{
      if(dead||open||collapsed||helpOpen||idleOffered||document.hidden||pointerActive||keys.size||current().phase!=='operate')return;
      if(Date.now()-lastActivity>=18000){stall=true;idleOffered=true;paint();}
    },2000);
    const events={click,pointerdown:pointerDown,keydown:keyDown,pointermove:activity,wheel:activity,focusin:activity,dragstart:pointerDown};
    Object.entries(events).forEach(([name,fn])=>host.addEventListener(name,fn,true));
    window.addEventListener('pointerup',pointerUp);window.addEventListener('pointercancel',blur);window.addEventListener('dragend',pointerUp);window.addEventListener('keyup',keyUp);window.addEventListener('blur',blur);window.addEventListener('resize',stopDemo);document.addEventListener('visibilitychange',visibility);
    paint();
    return {showOpening,dismiss,changed,recorded,update,help,blocked,pause(){stopDemo();cutscene?.pause(true);},destroy(){
      dead=true;cancelPending();clearInterval(idleTimer);cutscene?.destroy();cutscene=null;opening.remove();live.remove();host.inert=false;clearTarget();
      Object.entries(events).forEach(([name,fn])=>host.removeEventListener(name,fn,true));
      window.removeEventListener('pointerup',pointerUp);window.removeEventListener('pointercancel',blur);window.removeEventListener('dragend',pointerUp);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',blur);window.removeEventListener('resize',stopDemo);document.removeEventListener('visibilitychange',visibility);
    }};
  }
  const api={guides,operationNotes,modeOf,readyStep,mount};if(typeof module!=='undefined')module.exports=api;if(typeof window!=='undefined')window.AtlasResearchOnboarding=api;
})();
