/* Original, low-resolution cinematic scenery. No downloaded frames or video. */
(() => {
  function create(canvas, portraits) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return { draw() {} };
    let width = 960, height = 440;
    const colors = {
      answers: ["#0a1526", "#12283b", "#1a3c4b", "#85cbd8"],
      manuscripts: ["#162337", "#344750", "#607278", "#e8c582"],
      unknown: ["#151b30", "#30344f", "#5e5976", "#b9b0e7"],
      observe: ["#0d182e", "#202e4c", "#485a75", "#9ebbea"],
      evidence: ["#201b2a", "#3b303b", "#70524b", "#efb17b"],
      connections: ["#10272c", "#234046", "#446866", "#8bd8bc"],
      light: ["#171529", "#322a47", "#63516e", "#d3a9df"],
      legacy: ["#151e30", "#30394b", "#625c57", "#e9c987"],
      islands: ["#0c2533", "#1b4453", "#416966", "#edc77c"],
    };
    let palette, time;
    function rect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
    function line(points, color, size = 2) {
      // Quantized connected blocks keep even curved paths visibly pixel-built.
      for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i - 1], [xx, yy] = points[i];
        const steps = Math.ceil(Math.max(Math.abs(xx - x), Math.abs(yy - y)) / 2);
        for (let j = 0; j <= steps; j++) rect(x + (xx - x) * j / Math.max(1, steps), y + (yy - y) * j / Math.max(1, steps), size, size, color);
      }
    }
    function ellipse(x, y, rx, ry, color, fill = false) {
      if (fill) {
        for (let j = -ry; j <= ry; j += 3) {
          const half = rx * Math.sqrt(Math.max(0, 1 - j * j / (ry * ry)));
          rect(x - half, y + j, half * 2 + 2, 3, color);
        }
      } else {
        for (let i = 0; i < 100; i++) {
          const a = i / 100 * Math.PI * 2;
          rect(x + Math.cos(a) * rx, y + Math.sin(a) * ry, 3, 3, color);
        }
      }
    }
    function text(value, x, y, color, size = 12, align = "left") {
      ctx.fillStyle = color;
      ctx.font = `${size}px "Cascadia Mono", Consolas, monospace`;
      ctx.textAlign = align;
      ctx.fillText(value, Math.round(x), Math.round(y));
    }
    function glow(x, y, color = palette[3], size = 4) {
      ctx.globalAlpha = 0.12;
      rect(x - size * 2, y - size * 2, size * 5, size * 5, color);
      ctx.globalAlpha = 0.35;
      rect(x - size, y - size, size * 3, size * 3, color);
      ctx.globalAlpha = 1;
      rect(x, y, size, size, "#fff4cd");
    }
    function stars() {
      for (let i = 0; i < 100; i++) {
        const x = (i * 137 + 31) % width, y = (i * i * 17 + 11) % 260;
        ctx.globalAlpha = 0.25 + (Math.sin(time * 0.7 + i) + 1) * 0.22;
        rect(x, y, i % 7 ? 2 : 3, 2, i % 5 ? "#a0b4cc" : palette[3]);
      }
      ctx.globalAlpha = 1;
    }
    function mountain(x, y, w, h, color) {
      for (let row = 0; row < h; row += 8) {
        const half = w / 2 * (row / h);
        rect(x - half, y + row, half * 2, 8, color);
      }
    }
    function tree(x, y, scale = 1) {
      rect(x - 3 * scale, y - 12 * scale, 6 * scale, 34 * scale, "#66533c");
      for (let j = 0; j < 4; j++) rect(x - (7 + j * 4) * scale, y - (48 - j * 10) * scale, (14 + j * 8) * scale, 14 * scale, j % 2 ? "#3d6260" : "#284b4d");
    }
    function ground() {
      rect(-1000, 348, 3000, 1200, palette[1]);
      rect(-1000, 348, 3000, 5, palette[2]);
      for (let i = 0; i < 60; i++) rect((i * 137) % 1360 - 200, 360 + (i * 29) % 80, 14 + i % 8, 2, i % 2 ? palette[0] : palette[2]);
    }
    function columns(x, y, w, h, count = 5) {
      rect(x - 8, y, w + 16, 10, palette[2]);
      rect(x - 3, y - 7, w + 6, 7, palette[3]);
      for (let i = 0; i < count; i++) {
        const xx = x + i * (w - 16) / (count - 1);
        rect(xx, y + 10, 14, h, palette[2]);
        rect(xx + 2, y + 10, 4, h, "#9d9d91");
        rect(xx - 4, y + h, 22, 8, palette[2]);
      }
      rect(x - 14, y + h + 8, w + 28, 10, palette[2]);
    }
    function house(x, y, w, h, lit = true) {
      rect(x, y, w, h, palette[1]);
      rect(x + 5, y + 5, w - 10, h - 5, palette[2]);
      for (let row = 0; row < 22; row += 5) rect(x - 8 + row, y - row, w + 16 - row * 2, 5, palette[2]);
      for (let i = 0; i < 3; i++) {
        rect(x + 15 + i * (w - 40) / 3, y + 24, 13, 20, palette[0]);
        if (lit) rect(x + 18 + i * (w - 40) / 3, y + 27, 7, 13, palette[3]);
      }
      rect(x + w / 2 - 11, y + h - 40, 22, 40, palette[0]);
    }
    function person(id, x, y, scale = 2) {
      y += Math.round(Math.sin(time * 1.8 + Number(id.slice(1))) * 1.5);
      const image = portraits.get(id);
      if (image?.complete && image.naturalWidth) {
        const ratio = image.naturalHeight / image.naturalWidth;
        ctx.drawImage(image, Math.round(x - 19 * scale), Math.round(y - 38 * ratio * scale), Math.round(38 * scale), Math.round(38 * ratio * scale));
      } else {
        rect(x - 10 * scale, y - 30 * scale, 20 * scale, 24 * scale, palette[2]);
        rect(x - 7 * scale, y - 44 * scale, 14 * scale, 15 * scale, "#e1b98c");
        rect(x - 8 * scale, y - 46 * scale, 16 * scale, 5 * scale, "#c3baa5");
      }
    }
    function book(x, y, scale = 1, open = true) {
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      rect(-44, -28, 88, 58, "#96734a");
      rect(-40, -32, 38, 55, "#dec89b"); rect(3, -32, 38, 55, "#eddbb3");
      rect(-1, -32, 4, 58, "#b79c70");
      for (let i = 0; i < 5; i++) {
        rect(-33, -23 + i * 8, 20 + (i % 2) * 8, 2, "#947b5a");
        rect(10, -23 + i * 8, 16 + (i % 3) * 5, 2, "#ad9166");
      }
      if (open) glow(0, -40, palette[3], 3);
      ctx.restore();
    }
    function water(x, y, w, h) {
      rect(x, y, w, h, "#163e53");
      for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) {
        const xx = x + ((i * 59 + j * 17 + time * (j % 2 ? 7 : -5)) % w + w) % w;
        rect(xx, y + 6 + j * h / 8, 18, 2, j % 2 ? "#35697b" : "#275369");
      }
    }
    function boat(x, y, scale = 1) {
      ctx.save(); ctx.translate(x, y + Math.sin(time * 1.2) * 3); ctx.scale(scale, scale);
      rect(-54, 0, 108, 10, "#b98e57"); rect(-46, 10, 92, 10, "#8c6344"); rect(-32, 20, 64, 5, "#65483c");
      rect(-4, -72, 4, 72, "#a8895c");
      for (let j = 0; j < 55; j += 5) rect(2, -64 + j, 8 + j * 0.65, 5, "#dfd2a6");
      for (let i = 0; i < 4; i++) rect(-41 + i * 18, -14, 13, 14, i % 2 ? "#9b764c" : "#c59d64");
      ctx.restore();
    }
    function scale(x, y) {
      rect(x - 5, y - 62, 10, 66, "#bea16a"); rect(x - 35, y + 4, 70, 9, "#7c6c54");
      line([[x - 62, y - 53], [x + 62, y - 53]], "#e5c785", 4);
      for (const side of [-1, 1]) {
        const xx = x + 55 * side;
        line([[xx, y - 53], [xx - 19, y - 9], [xx + 19, y - 9], [xx, y - 53]], "#bba27a", 2);
        rect(xx - 21, y - 8, 44, 5, "#d6b476");
        rect(xx - 9, y - 23, 19, 14, side < 0 ? "#91b6b0" : "#dec89b");
      }
    }
    function orbit(x, y, radius = 60) {
      ellipse(x, y, radius, radius * 0.4, "#bba172");
      ellipse(x, y, 27, 27, "#517da0", true);
      rect(x - 15, y - 16, 19, 11, "#8ba884"); rect(x + 2, y - 2, 13, 21, "#8ba884");
      const a = time * 0.7;
      glow(x + Math.cos(a) * radius, y + Math.sin(a) * radius * 0.4, "#e4cc8c", 4);
    }
    function waves(x, y, length, color, phase = 0) {
      const points = [];
      for (let i = 0; i <= length; i += 4) points.push([x + i, y + Math.sin(i * 0.055 - time * 2.8 + phase) * 12]);
      line(points, color, 2);
    }
    function tower(x, y, h = 95) {
      line([[x - 22, y], [x, y - h], [x + 22, y]], palette[2], 4);
      for (let i = 1; i < 5; i++) line([[x - 22 + i * 4, y - i * 17], [x + 22 - i * 4, y - i * 17]], "#b9b08a", 2);
      rect(x - 3, y - h - 13, 6, 21, palette[3]);
    }
    function terminal() {
      for (const x of [120, 720]) {
        rect(x, 120, 120, 190, "#142d40");
        for (let j = 0; j < 12; j++) for (let i = 0; i < 4; i++) {
          const yy = 135 + (j * 15 + time * 14) % 167;
          rect(x + 13 + i * 25, yy, 8 + (j + i) % 3 * 5, 3, (i + j) % 3 ? "#386577" : palette[3]);
        }
      }
      rect(344, 154, 272, 158, "#294453"); rect(350, 160, 260, 142, "#0b192b");
      rect(464, 312, 32, 25, "#456270"); rect(410, 337, 140, 8, "#61777b");
      text("AI", 480, 225, "#a3d9dd", 38, "center");
      for (let i = 0; i < 4; i++) rect(390, 243 + i * 12, 70 + ((Math.floor(time * 6) + i * 21) % 110), 3, "#325567");
      const nodes = [[290,160],[670,145],[315,300],[645,320],[480,104]];
      for (const [x,y] of nodes) {
        line([[480,225],[x,y]], "#214253", 1); glow(x,y,palette[3],3);
      }
      book(480, 112, .7);
    }
    function manuscripts() {
      columns(165, 180, 180, 140);
      rect(175, 169, 160, 8, "#c0ad83");
      tree(150,300); tree(820,310,1.3);
      rect(350, 294, 240, 13, "#9e8b6b"); rect(363, 307, 14, 41, "#605c55"); rect(560, 307, 14, 41, "#605c55");
      book(480, 274, 1.15);
      for (let i = 0; i < 6; i++) {
        const yy = 222 + i * 8;
        line([[252,yy],[323,yy + Math.sin(time * 3 + i) * 2]], "#e7c37b", 1);
      }
      rect(245, 208, 5, 68, "#b8975c"); rect(323, 208, 5, 68, "#b8975c");
      line([[540,190],[600,267],[507,267],[540,190]], "#a2beb9", 2);
      rect(540, 229, 15, 15, "#293a43");
      water(620, 307, 180, 65); boat(710,317,.8);
      person("M01", 300, 355, 1.8); person("M07", 448, 360, 1.6); person("P01", 584, 365, 1.8);
    }
    function unknown() {
      columns(180, 120, 600, 218, 7);
      ellipse(480,125,114,50,palette[2],true); rect(365,125,232,10,palette[3]);
      for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) rect(224 + i * 64, 180 + j * 39, 8 + i % 2 * 6, 30, (i+j)%2 ? "#86775e" : "#6b6878");
      rect(380, 203, 204, 108, "#d6c29b"); rect(389, 211, 187, 91, "#eadbb9");
      text("x + 3 = 7", 480, 249, "#6e594e", 20, "center");
      const count = Math.floor(time * 2) % 5;
      for (let i = 0; i < count; i++) rect(415 + i * 31, 272, 16, 16, "#ad965f");
      scale(280,320);
      line([[640,280],[750,280]],palette[3],2); line([[660,300],[660,205]],palette[3],2);
      const points = []; for(let i=0;i<80;i+=3)points.push([663+i,277-i*.65]); line(points,"#9ab8c1",2);
      person("M02", 342, 366, 1.6); person("M03", 628, 370, 1.6); person("M04", 752, 364, 1.5);
    }
    function observe() {
      mountain(670,120,300,230,palette[1]); mountain(155,211,270,138,palette[1]);
      columns(610,161,133,128,4); ellipse(675,161,61,36,palette[2],true);
      rect(670,125,78,9,"#b5a16d"); rect(735,119,12,19,"#ddc78d");
      rect(210,310,290,15,"#80745f");
      line([[208,227],[499,310]],"#d1b17c",5);
      const fraction = (time % 4) / 4, ball = fraction * fraction;
      glow(214+ball*270,222+ball*77,palette[3],7);
      for(const p of [.1,.4,.9]) {
        const x=214+p*270,y=222+p*77;
        line([[x,y-31],[x,y-8]],"#a48e69",2); rect(x-7,y-10,16,7,"#ddbf83");
      }
      orbit(605,111,88); ellipse(763,79,20,20,"#d0d8d3",true);
      for(let i=0;i<9;i++)rect(758+(i%3)*5,65+Math.floor(i/3)*7,4,4,"#a9b7bd");
      person("P02",291,365,1.8); person("P03",640,365,1.8);
    }
    function evidence() {
      house(180,168,235,180); house(583,142,210,206);
      rect(620,107,27,40,"#8c6854");
      for(let i=0;i<6;i++) {
        const cycle=(time*.5+i/6)%1;
        ctx.globalAlpha=(1-cycle)*.4; rect(620+Math.sin(cycle*7)*9,98-cycle*65,12+cycle*18,8,palette[3]);
      }
      ctx.globalAlpha=1;
      rect(378,164,12,150,"#b79e75"); rect(378,164,142,9,"#c6ac7d"); rect(511,164,10,151,"#b79e75");
      const drop=(time%4)/4*54;
      line([[400,173],[400,213+drop]],"#b5a98c",2); rect(390,213+drop,23,30,"#6a6462");
      ellipse(475,304,44,17,"#a67349",true); rect(430,283,90,24,"#9a6745"); ellipse(475,283,44,12,"#bd9062",true);
      line([[476,187],[476,292]],"#d2b681",3);
      const paddle=Math.cos(time*3)*24; line([[475-paddle,287],[475+paddle,287]],"#e3c98f",4);
      rect(537,244,8,58,"#c5d3cd"); rect(539,265-Math.min(17,(time%12)*1.4),4,36+Math.min(17,(time%12)*1.4),"#df9678");
      scale(687,285); rect(638,230,13,35,"#9bc7bd"); rect(731,239,15,26,"#9bc7bd");
      person("P04",350,373,1.8); person("C08",618,375,1.8);
    }
    function connections() {
      water(100,298,760,50); house(340,184,220,152);
      tower(188,297,100); tower(794,295,122);
      waves(207,214,565,"#517f7e");
      for(let j=0;j<6;j++)ellipse(421+j*7,269,11,36,j%2?"#dcaf73":"#9a704c");
      const shift=Math.sin(time*1.5)*25;
      rect(345+shift,258,61,16,"#d48d79");rect(377+shift,258,30,16,"#86afc5");
      rect(335,302,146,10,"#b69b70");
      // The empty slots and long middle rows evoke the actual periodic table.
      for(let row=0;row<7;row++)for(let col=0;col<18;col++) {
        if(row===0&&col>0&&col<17)continue;
        if(row>0&&row<3&&col>1&&col<12)continue;
        const lit=(row*18+col)===Math.floor(time*5)%126;
        rect(570+col*10,151+row*14,7,10,lit?"#f0d99e":((col+row)%4?"#507d76":"#aaac7b"));
      }
      const p=(time*.15)%1;glow(215+p*560,212+Math.sin(p*6)*10,palette[3],4);
      person("P06",311,379,1.7);person("P07",540,379,1.7);person("C03",721,379,1.7);
    }
    function light() {
      columns(181,136,595,202,6);
      rect(206,230,75,84,"#8b6553");rect(216,239,55,64,"#402e31");glow(245,263,"#edab71",7);
      rect(380,191,15,102,"#111b2d");rect(382,226,11,6,"#d4ccec");rect(382,251,11,6,"#d4ccec");
      waves(299,239,79,"#d9bc86");
      rect(505,190,100,106,"#b4b8b7");
      for(let i=0;i<11;i++)rect(509+i*8,198,4,89,i%2?"#eee8d1":"#777e90");
      rect(677,228,10,64,"#bcb7a2");rect(650,285,83,13,"#776e6b");
      line([[627,213],[680,252]],"#80b5e0",3);
      const p=(time*.6)%1;glow(629+p*49,214+p*38,"#80b5e0",4);
      if(p>.65)glow(690+(p-.65)*150,247-(p-.65)*40,palette[3],3);
      for(let i=0;i<4;i++)rect(297+i*10,285,6,12,"#aaa487");
      person("P08",270,382,1.5);person("P05",408,382,1.5);person("P09",557,382,1.5);person("P10",704,382,1.5);
    }
    function legacy() {
      const ids=[...portraits.keys()];
      for(let row=0;row<3;row++)for(let col=0;col<8;col++) {
        const x=216+col*72,y=130+row*53;
        rect(x,y,40,34,palette[1]);for(let j=0;j<3;j++)rect(x+7,y+7+j*8,23,2,palette[2]);
      }
      for(let i=0;i<ids.length;i++) {
        const x=190+(i%15)*42,y=i<15?319:370;
        person(ids[i],x,y,.8);
        if(i>0)line([[x-40,y-43],[x,y-43]],"#746b57",1);
        if(Math.floor(time*2)%ids.length===i)glow(x,y-48,palette[3],3);
      }
      book(480,205,1.55);
      for(const [x,y]of[[280,145],[680,151],[365,99],[592,96]]) {
        line([[480,205],[x,y]],"#7c775e",1);glow(x,y,palette[3],3);
      }
      text("ASK  /  TEST  /  SHARE",480,410,"#a8a497",12,"center");
    }
    function island(x,y,size,kind) {
      for(let row=0;row<35;row+=5)rect(x-size+row*.8,y+row,size*2-row*1.7,6,row<15?"#7f8c76":"#555e5e");
      ellipse(x,y,size,26,"#598776",true);ellipse(x,y-5,size-8,20,"#729777",true);
      tree(x+size*.5,y-22,.55);tree(x-size*.6,y-18,.6);
      if(kind===0) {
        columns(x-26,y-66,53,40,3);ellipse(x,y-66,27,17,"#acb2a0",true);
        scale(x-68,y-8); // the island's balance plaza
      }else if(kind===1) {
        orbit(x,y-55,30);house(x+35,y-25,35,24);tower(x+72,y-9,47);
      }else {
        columns(x-26,y-47,53,34,3);ellipse(x,y-47,27,20,"#9fc5b4",true);
        line([[x+37,y-26],[x+62,y-45],[x+81,y-20]],"#d8c9a2",3);
        for(const[a,b,c]of[[37,-26,"#da9688"],[62,-45,"#95b4d6"],[81,-20,"#d8c9a2"]])rect(x+a-5,y+b-5,11,11,c);
      }
    }
    function islands() {
      water(-1000,180,3000,1000);
      island(289,230,118,0);island(673,222,130,1);island(482,343,160,2);
      rect(458,258,46,21,"#b19467");rect(465,249,33,9,"#d2b980");
      line([[399,247],[457,267]],"#947c59",4);line([[504,267],[555,239]],"#947c59",4);
      line([[481,280],[481,318]],"#947c59",4);glow(480,259,palette[3],5);
      boat(556,309,.36);
      for(let i=0;i<11;i++) {
        const x=190+i*55,y=395+Math.sin(i)*6;
        rect(x+(time*3)%20,y,14,2,"#457180");
      }
    }
    const renderers = { answers:terminal, manuscripts, unknown, observe, evidence, connections, light, legacy, islands };
    function draw(frame, reducedMotion = false, paused = false) {
      const bounds=canvas.getBoundingClientRect();
      if(!bounds.width||!bounds.height)return;
      // Match the display aspect exactly; capping this width squashes wide screens.
      const desired=Math.max(1,Math.round(bounds.width/bounds.height*height));
      if(width!==desired||canvas.height!==height){width=desired;canvas.width=width;canvas.height=height;}
      ctx.imageSmoothingEnabled=false;
      palette=colors[frame.scene.id];time=reducedMotion?2:frame.elapsed/1000;
      rect(0,0,width,height,palette[0]);stars();
      // Enlarge the composition uniformly, with a closer crop on narrow screens.
      const zoom=Math.min(1.25,width/640);
      ctx.save();
      ctx.translate(width/2,height/2);
      ctx.scale(zoom,zoom);
      ctx.translate(-480,-222);
      for(let i=0;i<7;i++)mountain(-140+i*200,212+(i%3)*27,290,160,palette[1]);
      ground();renderers[frame.scene.id]();
      if(frame.scene.id!=="islands") {
        const phase=frame.progress;
        glow(220+phase*520,83+Math.sin(phase*Math.PI)*24,palette[3],3);
      }
      ctx.restore();
      // A short shutter, not a flashing full-screen cut, bridges each set.
      const edge=Math.min(frame.progress*frame.scene.duration,(1-frame.progress)*frame.scene.duration);
      if(edge<350&&!reducedMotion&&!paused){ctx.globalAlpha=(1-edge/350)*.7;rect(0,0,width,height,"#090f1b");ctx.globalAlpha=1;}
    }
    return {draw};
  }
  window.AtlasSitePrologueArt={create};
})();
