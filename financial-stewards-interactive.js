(() => {
  'use strict';
  const make = (tag, text, props = {}) => Object.assign(document.createElement(tag), {textContent: text, ...props});
  const button = (text, action) => {
    const b = make('button', text, {type: 'button'});
    b.addEventListener('click', action);
    return b;
  };
  const bar = make('div', '', {className: 'study-tools'});
  bar.setAttribute('aria-label', 'Study tools');
  const home = make('a', '← Main page', {href: 'index.html#financial-stewards', className: 'study-home'});
  bar.append(home);
  const launch = button('▶ Read & follow', () => { open(); play(); });
  bar.append(launch);
  const paintToggle = button('Select color', () => {
    painting = !painting;
    document.body.classList.toggle('painting', painting);
    paintToggle.setAttribute('aria-pressed', String(painting));
    palette.hidden = !painting;
  });
  paintToggle.setAttribute('aria-pressed', 'false');
  paintToggle.className = 'paint-toggle';
  bar.append(paintToggle);
  const palette = make('div', '', {className: 'study-palette', hidden: true});
  const color = make('input', '', {type: 'color', value: '#ed6a5a'});
  color.setAttribute('aria-label', 'Choose a paint color');
  palette.append(make('span', 'Pick a color, then tap a shape.'), color);
  for (const hex of ['#ed6a5a', '#f4c95d', '#7bb661', '#69b9e6', '#a58acd', '#d89865', '#ffffff']) {
    const swatch = button('', () => { color.value = hex; });
    swatch.style.background = hex;
    swatch.setAttribute('aria-label', 'Use color ' + hex);
    palette.append(swatch);
  }
  let painting = false;
  const shapeMap = new Map();
  const originals = new Map();
  const property = element => element.namespaceURI === 'http://www.w3.org/2000/svg' ? 'fill' : 'background';
  const register = (element, id) => {
    element.dataset.paintId = id;
    shapeMap.set(id, element);
    const prop = property(element);
    originals.set(id, [element.style.getPropertyValue(prop), element.style.getPropertyPriority(prop)]);
    if (/^#[0-9a-f]{6}$/i.test(colors[id] || '')) element.style.setProperty(prop, colors[id], 'important');
  };
  const paintKey = 'stewards-paint-v1:' + location.pathname;
  let colors = {};
  try { colors = JSON.parse(localStorage.getItem(paintKey) || '{}'); } catch { colors = {}; }
  if (!colors || typeof colors !== 'object' || Array.isArray(colors)) colors = {};
  const undo = [];
  const save = () => { try { localStorage.setItem(paintKey, JSON.stringify(colors)); } catch { status.textContent = 'Colors work here, but this browser cannot save them between visits.'; } };
  const applyColor = (id, value) => {
    if (value) colors[id] = value; else delete colors[id];
    const copies = [shapeMap.get(id), ...dialog.querySelectorAll('[data-paint-id="' + id + '"]')];
    copies.filter(Boolean).forEach(s => {
      const prop = property(s);
      const [original, priority] = originals.get(id) || ['', ''];
      if (value) s.style.setProperty(prop, value, 'important');
      else if (original) s.style.setProperty(prop, original, priority);
      else s.style.removeProperty(prop);
    });
  };
  document.querySelectorAll('.book svg').forEach((svg, svgIndex) => {
    svg.querySelectorAll('rect,circle,ellipse,polygon,path').forEach((shape, shapeIndex) => {
      if (shape.getAttribute('fill') === 'none') return;
      if (shape.tagName.toLowerCase() === 'path' && !/z/i.test(shape.getAttribute('d') || '')) return;
      const id = svgIndex + '-' + shapeIndex;
      register(shape, id);
    });
    // Blank SVG space has no shape to click: supply a paintable canvas behind the art.
    const box = svg.viewBox.baseVal;
    if (box.width && box.height) {
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      for (const [name, value] of Object.entries({x:box.x, y:box.y, width:box.width, height:box.height, fill:'transparent'})) background.setAttribute(name, value);
      background.style.setProperty('stroke', 'none', 'important');
      background.classList.add('paint-canvas');
      svg.prepend(background);
      register(background, svgIndex + '-background');
    }
  });
  document.querySelectorAll('.book .page,.book .panel,.book .verse,.book .lesson,.book .challenge,.book .q,.book .bubble,.book .narration,.book .caption,.book .hand,.book .compare > div')
    .forEach((element, index) => register(element, 'surface-' + index));
  const undoButton = button('Undo', () => {
    const changes = undo.pop();
    if (!changes) return;
    changes.forEach(([id, value]) => applyColor(id, value));
    save(); undoButton.disabled = undo.length === 0;
  });
  undoButton.disabled = true;
  palette.append(undoButton, button('Clear colors', () => {
    const previous = Object.entries(colors);
    if (!previous.length) return;
    undo.push(previous);
    previous.forEach(([id]) => applyColor(id, null));
    save(); undoButton.disabled = false;
  }));
  const status = make('span', '', {className: 'study-save-status'});
  status.setAttribute('role', 'status');
  palette.append(status);
  bar.append(palette);
  const modeToggle = document.querySelector('.coloring-toggle');
  if (modeToggle) bar.insertBefore(modeToggle, paintToggle);
  document.body.prepend(bar);
  const syncMode = () => {
    const enabled = document.body.classList.contains('coloring-mode');
    paintToggle.hidden = !enabled;
    if (!enabled) {
      painting = false;
      document.body.classList.remove('painting');
      paintToggle.setAttribute('aria-pressed', 'false');
      palette.hidden = true;
    }
  };
  document.addEventListener('stewards-mode-change', syncMode);
  syncMode();
  document.addEventListener('click', event => {
    const shape = event.target.closest?.('[data-paint-id]');
    if (!painting || !document.body.classList.contains('coloring-mode') || !shape) return;
    const id = shape.dataset.paintId;
    undo.push([[id, colors[id] || null]]);
    applyColor(id, color.value); save(); undoButton.disabled = false;
  });

  const frames = [];
  const addFrame = (node, title) => {
    if (!node || node.matches('.footer')) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const words = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest('script,style')) words.push(walker.currentNode.textContent.trim());
    }
    frames.push({node, title, text: words.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()});
  };
  document.querySelectorAll('.page').forEach(page => {
    const title = page.querySelector('.page-title,.subtitle')?.textContent || document.title;
    [...page.children].forEach(child => {
      if (child.matches('.footer,.badge')) return;
      if (child.matches('.panel-grid,.compare,.handbox,.challenge')) {
        [...child.children].forEach(node => addFrame(node, title));
      } else addFrame(child, title);
    });
  });
  const dialog = make('dialog', '', {className: 'study-player'});
  const header = make('div', '', {className: 'player-header'});
  const heading = make('h2', 'Read and follow');
  heading.id = 'study-player-heading';
  dialog.setAttribute('aria-labelledby', heading.id);
  header.append(heading, button('Close', () => dialog.close()));
  const stage = make('div', '', {className: 'player-stage'});
  const transcript = make('div', '', {className: 'player-transcript'});
  const notice = make('p', '', {className: 'player-notice'});
  notice.setAttribute('role', 'status');
  const controls = make('div', '', {className: 'player-controls'});
  let index = 0, sentence = 0, chunks = [], running = false, generation = 0, timer = null, utterance = null;
  const synth = window.speechSynthesis;
  const supported = !!synth && 'SpeechSynthesisUtterance' in window;
  const cancel = () => {
    generation++;
    clearTimeout(timer);
    if (supported) synth.cancel();
    utterance = null;
  };
  const pause = () => {
    running = false; cancel(); playButton.textContent = '▶ Play';
  };
  const playButton = button('▶ Play', () => running ? pause() : play());
  const previous = button('← Previous', () => navigate(index - 1));
  const next = button('Next →', () => navigate(index + 1));
  const progress = make('span', '');
  const speed = make('select', '');
  speed.setAttribute('aria-label', 'Reading speed');
  for (const [value, text] of [['0.75','Slower'],['0.9','Normal'],['1.1','Faster']]) speed.add(new Option(text, value, value === '0.9', value === '0.9'));
  speed.addEventListener('change', () => { if (running) { cancel(); speak(); } });
  const voices = make('select', '');
  voices.setAttribute('aria-label', 'Reading voice');
  const loadVoices = () => {
    const selected = voices.value;
    voices.replaceChildren(new Option('Device default voice', ''));
    synth?.getVoices().filter(v => /^en\b/i.test(v.lang)).forEach(v => voices.add(new Option(v.name, v.voiceURI)));
    voices.value = selected || '';
  };
  loadVoices();
  synth?.addEventListener('voiceschanged', loadVoices);
  voices.addEventListener('change', () => { if (running) { cancel(); speak(); } });
  const colorFrame = button('Color this page', () => {
    const source = frames[index].node;
    const target = source.matches('svg,.study-coloring-scene,.panel') ? source :
      source.closest('.page').querySelector('.study-coloring-scene,svg');
    pause(); dialog.close();
    if (!document.body.classList.contains('coloring-mode')) modeToggle?.click();
    if (!painting) paintToggle.click();
    if (target) window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - bar.getBoundingClientRect().height - 20,
      behavior: 'instant'
    });
  });
  controls.append(previous, playButton, next, progress, speed, voices, colorFrame);
  dialog.append(header, stage, transcript, notice, controls);
  document.body.append(dialog);
  const render = () => {
    const frame = frames[index];
    heading.textContent = frame.title;
    const clone = frame.node.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    stage.replaceChildren(clone);
    stage.scrollTop = 0;
    chunks = frame.text ? (typeof Intl.Segmenter === 'function'
      ? [...new Intl.Segmenter('en', {granularity: 'sentence'}).segment(frame.text)].map(s => s.segment)
      : [frame.text]) : [];
    // Keep individual utterances short for mobile speech engines.
    chunks = chunks.flatMap(text => text.match(/.{1,180}(?:\s|$)|\S{1,180}/g) || [text]);
    transcript.replaceChildren(...chunks.map(text => make('span', text + ' ')));
    progress.textContent = (index + 1) + ' / ' + frames.length;
    previous.disabled = index === 0;
    next.disabled = index === frames.length - 1;
    notice.textContent = supported ? '' : 'Speech is unavailable in this browser. Use Previous and Next to follow the frames.';
  };
  const navigate = target => {
    if (target < 0 || target >= frames.length) { pause(); return; }
    cancel(); index = target; sentence = 0; render();
    if (running) speak();
  };
  const speak = () => {
    if (!running) return;
    const token = generation;
    if (!chunks.length) {
      notice.textContent = 'Coloring picture — continuing in five seconds. Pause to stay here.';
      timer = setTimeout(() => { if (token === generation) navigate(index + 1); }, 5000);
      return;
    }
    if (sentence >= chunks.length) {
      if (index === frames.length - 1) { pause(); notice.textContent = 'Chapter complete.'; }
      else navigate(index + 1);
      return;
    }
    [...transcript.children].forEach((span, i) => span.classList.toggle('speaking', i === sentence));
    transcript.children[sentence]?.scrollIntoView({block: 'nearest', behavior: 'instant'});
    utterance = new SpeechSynthesisUtterance(chunks[sentence]);
    utterance.lang = 'en';
    utterance.rate = Number(speed.value);
    const voice = synth.getVoices().find(v => v.voiceURI === voices.value);
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (token !== generation || !running) return;
      sentence++; speak();
    };
    utterance.onerror = event => {
      if (token !== generation) return;
      pause();
      notice.textContent = 'Reading stopped. Choose another voice or press Play to try again.';
    };
    synth.resume();
    synth.speak(utterance);
  };
  function play() {
    if (!supported) return;
    if (sentence >= chunks.length && chunks.length) sentence = 0;
    running = true; playButton.textContent = 'Pause'; notice.textContent = ''; speak();
  }
  function open() {
    if (!frames.length) return;
    render(); dialog.showModal();
    playButton.disabled = !supported;
  }
  dialog.addEventListener('close', pause);
  dialog.addEventListener('cancel', pause);
  window.addEventListener('pagehide', pause);
  window.addEventListener('beforeprint', () => { pause(); if (dialog.open) dialog.close(); });
})();
