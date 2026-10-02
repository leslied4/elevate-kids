(() => {
  const page = document.body;
  const toggle = document.createElement('button');
  // Every filled region is a closed shape, with a separate outline.
  const shape = (tag, attributes, color) =>
    `<${tag} ${attributes} fill="${color}"/>`;
  const path = (d, color) => shape('path', `d="${d}"`, color);
  const rect = (x, y, w, h, color, radius = 6) =>
    shape('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}"`, color);
  const circle = (x, y, r, color) => shape('circle', `cx="${x}" cy="${y}" r="${r}"`, color);
  const group = (x, y, scale, content) =>
    `<g transform="translate(${x} ${y}) scale(${scale})">${content}</g>`;
  const leaf = (x, y, flip = 1) => group(x, y, flip,
    path('M0 0Q-42-4-40-35Q-5-40 0 0Z', '#93c979'));
  const flower = (x, y, color) => group(x, y, 1,
    rect(-4, 0, 8, 56, '#83b76e') + leaf(-3, 40) + leaf(3, -32, -1) +
    Array.from({length: 6}, (_, i) => {
      const angle = i * Math.PI / 3;
      return circle(Math.cos(angle) * 17, Math.sin(angle) * 17, 14, color);
    }).join('') + circle(0, 0, 12, '#ffd46a'));
  const tree = group(0, 0, 1,
    path('M70 230L78 118H103L115 230Z', '#c99b6d') +
    path('M33 139C-4 125 0 81 28 70C13 35 47 10 74 24C91-7 131 3 141 33C180 25 199 64 180 90C210 128 164 161 139 143C112 174 63 170 33 139Z', '#a7d58b') +
    [ [48, 90], [96, 49], [148, 98], [91, 125] ].map(([x, y]) =>
      circle(x, y, 15, '#ee9a83') + leaf(x, y - 12)).join(''));
  const gift = rect(0, 36, 100, 84, '#c2dff3') +
    rect(-5, 25, 110, 24, '#acd2ee') + rect(40, 25, 20, 95, '#f5cc72') +
    path('M50 25C-14 27 11-23 50 25Z', '#f5cc72') +
    path('M50 25C114 27 89-23 50 25Z', '#f5cc72');
  const house = rect(0, 70, 240, 180, '#ffe7b3') +
    path('M-20 75L120-12L260 75Z', '#df9a86') +
    rect(91, 157, 58, 93, '#b3d7eb') + circle(137, 207, 4, '#f5cc72') +
    [28, 169].map(x => rect(x, 110, 43, 53, '#c8e7ee') +
      path(`M${x+21} 110V163M${x} 136H${x+43}`, 'none')).join('') +
    circle(120, 63, 22, '#f5cc72');
  const basket = path('M0 40Q60-45 120 40L110 50Q60-22 10 50Z', '#d6b28b') +
    circle(28, 61, 22, '#ecac84') + circle(65, 51, 25, '#edcd7c') +
    circle(97, 65, 22, '#adc88b') +
    path('M-5 70H125L108 132H12Z', '#e4c29a') +
    [30, 60, 90].map(x => path(`M${x} 72V129`, 'none')).join('') +
    path('M4 93H117M9 114H112', 'none');
  const book = path('M0 0Q55-15 105 8Q155-15 210 0V115Q150 102 105 124Q55 102 0 115Z', '#fff3cf') +
    path('M105 8V124', 'none') +
    path('M24 22Q59 16 84 29V85Q53 73 24 83Z', '#e3edc7') +
    path('M127 29Q163 16 186 22V83Q156 73 127 85Z', '#d4e8f3');

  const coin = (x, y) => circle(x, y, 22, '#f5cc72') + circle(x, y, 14, '#ffe6a0');
  const person = (x, y, color = '#b3d7eb', crown = false) => group(x, y, 1,
    path('M15 100Q60 67 105 100L124 225H-4Z', color) +
    path('M19 113L-20 159L-4 174L37 141Z', '#e7c2a0') +
    path('M100 113L140 150L126 169L83 141Z', '#e7c2a0') +
    circle(60, 55, 37, '#e7c2a0') +
    path('M23 53Q14 0 61 9Q105 1 97 53L83 34Q57 44 35 30Z', '#ac866a') +
    circle(47, 56, 2, '#26313c') + circle(74, 56, 2, '#26313c') +
    path('M48 75Q60 82 72 75', 'none') +
    (crown ? path('M24 17L24-8L46 4L60-16L76 4L96-8V17Z', '#f5cc72') : ''));
  const sack = (x, y) => group(x, y, 1,
    path('M10 0H80L69 28Q123 114 85 130H5Q-29 111 24 28Z', '#e6c799') +
    rect(22, 24, 48, 12, '#adcc8e'));
  const scroll = (x, y) => group(x, y, 1,
    rect(0, 0, 140, 160, '#fff0cb') + rect(-10, -8, 160, 20, '#e2c39e') +
    rect(-10, 150, 160, 20, '#e2c39e') +
    [38, 68, 98, 128].map(v => path(`M24 ${v}H112`, 'none')).join(''));
  const jar = (x, y) => group(x, y, 1,
    path('M20 0H70V28Q111 57 86 123H4Q-23 57 20 28Z', '#e2b49b') +
    rect(16, -8, 58, 17, '#ebcfac') + path('M0 66H91M0 94H91', 'none'));
  const heart = (x, y) => group(x, y, 1,
    path('M70 110C-37 50 3-27 70 19C137-27 177 50 70 110Z', '#efb1bb'));
  const seedling = (x, y) => group(x, y, 1,
    rect(0, 0, 8, 74, '#9ec88a') + leaf(3, 28) + leaf(-5, -7, -1) +
    shape('ellipse', 'cx="4" cy="82" rx="49" ry="14"', '#d8bc96'));
  const tent = (x, y) => group(x, y, 1,
    path('M0 180L110 0L220 180Z', '#edd4ac') +
    path('M67 180L110 85L153 180Z', '#c6dceb'));
  const sheep = (x, y) => group(x, y, 1,
    rect(16, 43, 12, 33, '#d9c1a6') + rect(63, 43, 12, 33, '#d9c1a6') +
    path('M10 48C-18 25 0 1 22 10C35-10 66-5 72 10C104 6 110 45 87 52Z', '#fff4d9') +
    shape('ellipse', 'cx="88" cy="34" rx="19" ry="25"', '#d9c1a6') + circle(95, 30, 3, '#26313c'));
  const chest = (x, y) => group(x, y, 1,
    rect(0, 55, 180, 110, '#cfa481') +
    path('M0 55V28Q90-23 180 28V55Z', '#e2c18b') +
    rect(76, 45, 28, 46, '#f5cc72'));
  const scenes = {
    plan: () => person(45, 126) + person(600, 126, '#efc6ae') +
      [250, 365, 480].map(x => jar(x, 240)).join('') +
      [255, 365, 475].map(x => coin(x + 45, 184)).join(''),
    giving: () => person(155, 120) + person(510, 120, '#efc6ae') +
      group(342, 245, .75, basket),
    heart: () => person(90, 130) + group(330, 150, 1.4, heart(0, 0)) +
      coin(644, 310),
    journey: () => tent(420, 158) + person(150, 125) +
      sheep(62, 328) + sheep(310, 320),
    lot: () => person(85, 120) + person(558, 120, '#efc6ae') +
      sheep(250, 300) + sheep(390, 315) + seedling(460, 166),
    refusal: () => person(80, 130) + person(555, 130, '#dcc5e8', true) +
      chest(317, 220) + path('M260 215H306M285 197L305 215L285 233', 'none'),
    trust: () => path('M300 100Q400 55 500 100V240Q485 310 400 360Q315 310 300 240Z', '#c6dceb') +
      group(355, 158, .65, heart(0, 0)) + person(90, 140) + seedling(620, 285),
    sow: () => person(90, 110) + sack(260, 260) +
      [350, 450, 550, 650].map((x, i) => seedling(x, 205 + i % 2 * 55)).join('') +
      [310, 334, 358].map((x, i) => shape('ellipse', `cx="${x}" cy="${190+i*24}" rx="8" ry="12"`, '#dbb683')).join(''),
    temple: () => person(65, 125, '#dcc5e8', true) +
      [0, 1, 2].map(i => rect(280+i*110, 290-i*50, 95, 60, '#e5d6bd')).join('') +
      [160, 185, 210].map(y => rect(305, y, 350, 17, '#d1af89')).join('') +
      coin(650, 317) + coin(705, 317),
    work: () => person(100, 115) + rect(340, 220, 320, 30, '#d1af89') +
      rect(365, 250, 23, 108, '#d1af89') + rect(611, 250, 23, 108, '#d1af89') +
      path('M420 204L478 120L530 146L462 204Z', '#b3d7eb') + rect(473, 94, 95, 26, '#b1bcc7'),
    book: () => group(250, 180, 1.4, book) + person(55, 130) + person(605, 130, '#efc6ae'),
    miracle: () => person(130, 120) + person(530, 120, '#efc6ae') +
      coin(400, 254) + path('M354 209L448 302M448 209L354 302', 'none'),
    ruler: () => person(120, 110, '#fff0cf') + person(510, 110, '#dcc5e8', true) + chest(328, 255),
    accounts: () => person(80, 125) + scroll(307, 172) + scroll(511, 172) + coin(485, 344),
    goose: () => path('M320 288C250 225 347 185 434 219L450 116Q438 65 475 64Q524 75 489 131L479 262Q446 332 320 288Z', '#fff1d6') +
      path('M488 78L542 98L491 111Z', '#f5cc72') + circle(481, 83, 4, '#26313c') +
      path('M340 258Q381 207 429 256Q391 288 340 258Z', '#d7e6f0') +
      shape('ellipse', 'cx="264" cy="324" rx="32" ry="45"', '#f5cc72'),
    camel: () => path('M155 288L158 187Q185 121 230 169Q276 111 313 173L331 105L317 83Q327 55 355 77L374 115L356 229L325 249V335H305V268H202V335H178L175 278Z', '#e3bf94') +
      circle(345, 91, 3, '#26313c') +
      path('M565 95Q590 62 603 95L583 348Z', '#d3e1ec') +
      shape('ellipse', 'cx="583" cy="108" rx="6" ry="21"', '#ffffff'),
    family: () => group(308, 78, 1, house) + person(65, 136) +
      group(614, 205, .65, person(0, 0, '#efc6ae')),
    widow: () => person(105, 120, '#dcc5e8') + person(570, 120, '#fff0cf') +
      jar(330, 239) + sack(440, 239) + rect(343, 189, 165, 20, '#e5c69c'),
    birds: () => [125, 290].map(x => group(x, 130, 1,
      shape('ellipse', 'cx="0" cy="50" rx="57" ry="34"', '#c6dceb') +
      circle(42, 20, 25, '#c6dceb') + path('M64 16L88 27L65 33Z', '#f5cc72') +
      path('M-37 48Q0 4 30 53Q0 76-37 48Z', '#d2badf') + circle(49, 15, 3, '#26313c'))).join('') +
      flower(510, 230, '#f1b4c6') + flower(650, 253, '#fff0cf'),
    needs: () => group(120, 230, 1, basket) +
      path('M350 160L380 150Q400 178 420 150L450 160L490 218L458 237L441 213V348H358V213L341 237L310 218Z', '#c6dceb') +
      group(565, 155, .65, house),
    talents: () => [5, 2, 1].map((count, col) =>
      Array.from({length: count}, (_, i) => coin(135+col*245+i%2*55, 165+Math.floor(i/2)*60)).join('')).join(''),
    joseph: () => person(90, 120) + [310, 440, 570].map(x => sack(x, 205)).join('') +
      scroll(350, 75),
    growth: () => shape('ellipse', 'cx="130" cy="339" rx="19" ry="12"', '#d8bc96') +
      seedling(302, 245) + group(470, 99, 1.1, tree),
    tithe: () => rect(52, 115, 96, 100, '#fff1cc') +
      Array.from({length: 10}, (_, i) => coin(100+i%5*145, 165+Math.floor(i/5)*130)).join(''),
    abraham: () => person(110, 125) + person(555, 125, '#dcc5e8') +
      sack(345, 260) + coin(389, 215) + tent(300, 10),
    timer: () => circle(400, 220, 105, '#fff1cc') +
      path('M400 145V220L453 251', 'none') + rect(370, 78, 60, 25, '#c6dceb') +
      path('M278 99L521 342', 'none'),
    soil: () => rect(425, 320, 280, 50, '#c7cbd1') +
      [480, 570, 660].map(x => shape('ellipse', `cx="${x}" cy="303" rx="12" ry="8"`, '#d8bc96')).join('') +
      [130, 240, 350].map(x => seedling(x, 240)).join(''),
    letter: () => rect(300, 132, 250, 190, '#fff1cc') +
      path('M300 132L425 242L550 132M300 322L387 231M550 322L463 231', 'none') +
      person(75, 120) + path('M584 171L663 308H505Z', '#f5cc72') +
      path('M584 220V262M584 276V280', 'none'),
    checklist: () => rect(281, 79, 240, 285, '#fff1cc') + rect(345, 65, 110, 30, '#c6dceb') +
      [139, 204, 269].map(y => rect(310, y, 35, 35, '#ffffff') +
        path(`M316 ${y+17}L326 ${y+28}L345 ${y+4}M365 ${y+17}H481`, 'none')).join(''),
    paul: () => person(85, 125) + person(560, 125, '#dcc5e8') +
      sack(300, 245) + scroll(430, 190),
    queen: () => person(100, 120, '#efc6ae', true) +
      person(570, 120, '#dcc5e8', true) + scroll(320, 130) +
      coin(334, 344) + jar(470, 238),
    treasury: () => person(120, 120, '#dcc5e8') + rect(400, 197, 210, 158, '#e2c18b') +
      rect(416, 184, 178, 24, '#cfa481') + rect(458, 190, 92, 8, '#ffffff') +
      coin(456, 139) + coin(515, 139)
  };
  // Separate activities for lessons that previously shared an identical composition.
  Object.assign(scenes, {
    saving: () => jar(335, 230) + coin(380, 175) +
      person(115, 130) + scroll(535, 170),
    study: () => person(325, 65) +
      rect(160, 270, 470, 28, '#d1af89') +
      rect(190, 298, 24, 75, '#d1af89') + rect(577, 298, 24, 75, '#d1af89') +
      group(286, 229, .95, book),
    food: () => person(85, 120) + person(570, 120, '#efc6ae') +
      rect(274, 254, 270, 26, '#d1af89') +
      group(335, 156, .72, basket) +
      rect(294, 280, 20, 90, '#d1af89') + rect(505, 280, 20, 90, '#d1af89'),
    water: () => person(110, 130) + person(545, 130, '#efc6ae') +
      jar(325, 210) + path('M438 257H502L492 320H448Z', '#c6dceb') +
      path('M503 269Q542 269 522 299H498', 'none'),
    clothing: () => person(65, 135) + person(590, 135, '#efc6ae') +
      path('M331 160L365 145Q400 174 435 145L469 160L517 226L483 247L459 217V348H341V217L317 247L283 226Z', '#c6dceb') +
      path('M400 174V345M354 270H385V299H354Z', 'none'),
    orchard: () => group(65, 110, 1.05, tree) +
      group(470, 110, 1.05, tree) + group(321, 250, 1.05, basket),
    watering: () => person(105, 125) +
      path('M320 220H395V293H320Z', '#c6dceb') +
      path('M395 238L450 197L461 213L395 274Z', '#c6dceb') +
      path('M320 225Q278 202 278 252Q278 287 320 279', 'none') +
      seedling(518, 246) + seedling(649, 274) +
      [475, 492, 509].map((x,i) => path(`M${x} ${225+i*12}q-13 17 0 21q13-4 0-21Z`, '#c6dceb')).join(''),
    harvest: () => person(85, 125) + sack(580, 235) +
      [325, 420, 515].map(x => rect(x, 200, 7, 150, '#c4d69a') +
        [210, 247, 284].map(y => group(x+3, y, 1, leaf(0, 0) + leaf(-4, -16, -1))).join('')).join(''),
    firstfruit: () => group(120, 225, 1, basket) +
      group(560, 225, 1, basket) +
      shape('ellipse', 'cx="395" cy="322" rx="73" ry="20"', '#c6dceb') +
      circle(380, 291, 23, '#efb1bb') + circle(418, 291, 23, '#f5cc72') +
      leaf(380, 269),
    rooted: () => group(293, 55, 1.15, tree) +
      path('M379 320L350 397L315 422M379 320L423 397L460 422M379 350V436M354 389L304 379M420 387L466 365', 'none'),
    bills: () => scroll(125, 146) + scroll(525, 146) +
      path('M308 210H461L433 183M461 210L433 237', 'none') +
      path('M310 329L411 249L425 268L324 348L301 354Z', '#f5cc72'),
    departure: () => person(80, 125, '#fff0cf') +
      group(305, 247, .75, chest(0, 0)) +
      person(560, 120, '#dcc5e8', true) +
      path('M518 389H708L684 368M708 389L684 410', 'none'),
    talentsUsed: () => person(58, 120) +
      [0,1,2,3,4].map(i => coin(305+i*75, 175)).join('') +
      [0,1,2,3,4].map(i => coin(305+i*75, 285)).join(''),
    josephService: () => person(285, 110) +
      group(65, 220, .9, basket) + jar(560, 230) +
      rect(553, 112, 112, 73, '#d1af89'),
    messenger: () => tent(470, 151) +
      person(150, 122) + group(315, 246, .65, scroll(0, 0)) +
      path('M91 394Q343 334 689 407', 'none'),
    voyage: () => path('M170 298H629L573 369H222Z', '#d1af89') +
      rect(393, 90, 12, 208, '#d1af89') +
      path('M386 106L213 277H386Z', '#fff0cb') +
      path('M413 127L561 276H413Z', '#c6dceb') +
      path('M115 392Q170 363 225 392T445 392T665 392', 'none'),
    counsel: () => person(120, 130, '#efc6ae', true) +
      person(540, 130, '#dcc5e8', true) +
      group(314, 211, .83, book),
    openDoor: () => rect(365, 90, 235, 277, '#e6c799') +
      path('M389 113L535 146V341L389 364Z', '#c6dceb') +
      circle(506, 250, 6, '#f5cc72') +
      person(110, 140) + group(255, 278, .65, gift),
    volunteers: () => person(67, 127) + person(570, 127, '#efc6ae') +
      rect(248, 219, 292, 123, '#e6c799') +
      rect(248, 219, 292, 24, '#d1af89') +
      group(310, 122, .75, basket),
    meeting: () => person(100, 130) + person(560, 130, '#efc6ae') +
      group(348, 210, .65, person(0, 0, '#d2badf')) +
      group(318, 100, .8, book),
    calendar: () => rect(245, 104, 310, 260, '#fff0cb') +
      rect(245, 104, 310, 49, '#c6dceb') +
      [290,360,430,500].map(x => rect(x, 85, 13, 36, '#d1af89')).join('') +
      [180,242,304].map(y => [280,348,416,484].map(x => rect(x,y,38,35,'#ffffff')).join('')).join('') +
      path('M351 258L361 268L384 244', 'none')
  });
  // Explicit lesson-order mapping: no random or modulo-based scenery selection.
  const pageScenes = {
    1: ['plan','study','journey','lot','refusal','trust','sow','saving','meeting'],
    2: ['plan','temple','heart','trust','work','saving','food','ruler','book','giving','volunteers'],
    3: ['plan','trust','miracle','family','ruler','departure','giving','heart','growth','calendar','meeting'],
    4: ['heart','saving','camel','trust','accounts','bills','calendar','goose','watering','food','family','study','meeting'],
    5: ['heart','study','work','giving','firstfruit','widow','birds','needs','saving','book','family','meeting'],
    6: ['talents','talentsUsed','clothing','food','heart','ruler','water','needs','josephService','joseph','harvest','sow','growth','volunteers','meeting'],
    7: ['tithe','giving','heart','abraham','book','sow','food','timer','study','saving','meeting'],
    8: ['book','clothing','soil','accounts','voyage','letter','miracle','heart','study','checklist','orchard','volunteers'],
    9: ['volunteers','messenger','voyage','heart','food','openDoor','queen','counsel','work','giving','calendar','paul','meeting'],
    10: ['trust','family','firstfruit','sow','harvest','treasury','heart','rooted','watering','plan','orchard','meeting','volunteers']
  };
  const chapter = Number(document.title.match(/Chapter (\d+)/)?.[1] || 1);
  const scene = (index) => {
    const key = pageScenes[chapter]?.[index];
    if (!key) return '';
    return `<svg viewBox="0 0 800 480" aria-hidden="true" focusable="false">
      ${rect(8, 8, 784, 464, '#eef7fc', 22)}
      ${path('M9 382Q400 355 791 382V450Q791 472 770 472H30Q9 472 9 450Z', '#eee0c7')}
      ${scenes[key]()}
    </svg>`;
  };

  document.querySelectorAll('.page:not(.cover)').forEach((chapterPage, index) => {
    const illustration = document.createElement('div');
    illustration.className = 'study-coloring-scene';
    illustration.setAttribute('aria-hidden', 'true');
    illustration.innerHTML = scene(index);
    const footer = chapterPage.querySelector(':scope > .footer');
    chapterPage.insertBefore(illustration, footer);
    chapterPage.classList.add('with-coloring-scene');
  });

  toggle.type = 'button';
  toggle.className = 'coloring-toggle';
  toggle.setAttribute('aria-label', 'Switch between color and coloring-book mode');
  const setMode = enabled => {
    page.classList.toggle('coloring-mode', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'Color mode' : 'Coloring mode';
    document.dispatchEvent(new CustomEvent('stewards-mode-change', {detail: {enabled}}));
  };
  toggle.addEventListener('click', () => {
    const enabled = !page.classList.contains('coloring-mode');
    setMode(enabled);
    const url = new URL(window.location.href);
    url.hash = enabled ? 'coloring' : '';
    try { history.replaceState(null, '', url.href); } catch { /* Local-file restrictions must not navigate. */ }
  });
  document.body.append(toggle);
  setMode(window.location.hash === '#coloring');
})();
