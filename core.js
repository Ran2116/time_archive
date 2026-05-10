

(function (global) {
  'use strict';

  const TA = {};

  TA.fmtDHMS = function (ms) {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    return {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    };
  };
  TA.pad = function (n, w) { return String(n).padStart(w || 2, '0'); };
  TA.pad4 = function (n) { return String(n || 0).padStart(4, '0'); };

  TA.formatDuration = function (ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(d + 'd');
    if (h) parts.push(h + 'h');
    if (m) parts.push(m + 'm');
    if (sec && !d && !h) parts.push(sec + 's');
    return parts.join(' ') || '0s';
  };

  
  TA.halftone = function (targetCanvas, opts) {
    const w = opts.width;
    const h = opts.height;
    const cellSize = opts.cellSize || 3.2;
    const color = opts.color || '#2a1e16';
    const draw = opts.draw;
    const ss = 2; // supersample

    targetCanvas.width = w;
    targetCanvas.height = h;
    targetCanvas.style.width = w + 'px';
    targetCanvas.style.height = h + 'px';

   
    const off = document.createElement('canvas');
    off.width = w * ss;
    off.height = h * ss;
    const offctx = off.getContext('2d');
    offctx.scale(ss, ss);
    offctx.fillStyle = '#fff';
    offctx.fillRect(0, 0, w, h);
    draw(offctx, w, h);
    const src = offctx.getImageData(0, 0, w * ss, h * ss).data;

  
    const tctx = targetCanvas.getContext('2d');
    tctx.clearRect(0, 0, w, h);
    tctx.fillStyle = color;

    const cellPx = cellSize * ss; // in offscreen pixels
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {

        const x0 = Math.floor(cx * cellPx);
        const y0 = Math.floor(cy * cellPx);
        const x1 = Math.min(off.width, x0 + Math.ceil(cellPx));
        const y1 = Math.min(off.height, y0 + Math.ceil(cellPx));
        let sum = 0; let n = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * off.width + x) * 4;

            const lum = (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114) / 255;
            sum += lum; n++;
          }
        }
        if (!n) continue;
        const lum = sum / n;
        const coverage = 1 - lum;
        if (coverage < 0.04) continue;
        const r = Math.max(0.4, Math.sqrt(coverage) * (cellSize * 0.55));
        const dotX = (cx + 0.5) * cellSize;
        const dotY = (cy + 0.5) * cellSize;
        tctx.beginPath();
        tctx.arc(dotX, dotY, r, 0, Math.PI * 2);
        tctx.fill();
      }
    }
  };

  

  TA.drawRound = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    const roman = opts.roman || false;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) / 2 - 6;
    ctx.strokeStyle = '#000'; ctx.lineWidth = Math.max(6, R * 0.12);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = Math.max(2, R * 0.03);
    ctx.beginPath(); ctx.arc(cx, cy, R - Math.max(10, R * 0.16), 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = 'bold ' + (R * 0.24) + 'px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const numerals = roman
      ? ['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI']
      : ['12','1','2','3','4','5','6','7','8','9','10','11'];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const rr = R * 0.72;
      ctx.fillText(numerals[i], cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(4, R * 0.07), 0, Math.PI * 2); ctx.fill();
    const minA = (progress % 1) * Math.PI * 2 - Math.PI / 2;
    const hourA = ((progress / 12) % 1) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(7, R * 0.11);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hourA) * R * 0.48, cy + Math.sin(hourA) * R * 0.48); ctx.stroke();
    ctx.lineWidth = Math.max(4, R * 0.07);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(minA) * R * 0.7, cy + Math.sin(minA) * R * 0.7); ctx.stroke();
  };

  TA.drawGrandfather = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(cx - 55, 50);
    ctx.quadraticCurveTo(cx - 55, 10, cx, 10);
    ctx.quadraticCurveTo(cx + 55, 10, cx + 55, 50);
    ctx.lineTo(cx + 55, h - 10);
    ctx.lineTo(cx - 55, h - 10);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx, 80, 35, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, 80, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = '10px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.fillText(((i + 11) % 12) + 1 + '', cx + Math.cos(a) * 28, 80 + Math.sin(a) * 28);
    }
    const minA = (progress % 1) * Math.PI * 2 - Math.PI / 2;
    const hourA = ((progress / 12) % 1) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, 80);
    ctx.lineTo(cx + Math.cos(hourA) * 18, 80 + Math.sin(hourA) * 18); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, 80);
    ctx.lineTo(cx + Math.cos(minA) * 26, 80 + Math.sin(minA) * 26); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx - 22, 130, 44, h - 160);
    ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 22, 130, 44, h - 160);
    const swing = Math.sin(progress * Math.PI * 4) * 12;
    ctx.strokeStyle = '#444'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 130);
    ctx.lineTo(cx + swing, h - 50); ctx.stroke();
    ctx.fillStyle = '#bfa770';
    ctx.beginPath(); ctx.arc(cx + swing, h - 42, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx + swing, h - 42, 10, 0, Math.PI * 2); ctx.stroke();
  };

  TA.drawSweetPotato = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    ctx.clearRect(0, 0, w, h);
    const darkness = 0.45 + progress * 0.5;
    const v = Math.round((1 - darkness) * 255);
    ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
    ctx.beginPath();
    ctx.moveTo(30, h / 2 + 5);
    ctx.bezierCurveTo(25, h / 2 - 30, 70, h / 2 - 38, 110, h / 2 - 30);
    ctx.bezierCurveTo(160, h / 2 - 22, w - 10, h / 2 - 10, w - 15, h / 2 + 15);
    ctx.bezierCurveTo(w - 20, h / 2 + 40, 140, h / 2 + 48, 100, h / 2 + 44);
    ctx.bezierCurveTo(55, h / 2 + 40, 35, h / 2 + 28, 30, h / 2 + 5);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#000';
    [[80, h/2-8, 3], [130, h/2-16, 2.4], [160, h/2+8, 3.2], [100, h/2+18, 2.6], [180, h/2-4, 2]].forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], p[2], 0, Math.PI * 2); ctx.fill();
    });
    if (progress > 0.1) {
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.globalAlpha = Math.min(1, progress * 1.2);
      for (let i = 0; i < 3; i++) {
        const sx = 70 + i * 40;
        ctx.beginPath();
        ctx.moveTo(sx, h/2 - 34);
        ctx.bezierCurveTo(sx - 6, h/2 - 50, sx + 8, h/2 - 60, sx + 2, h/2 - 80);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };

  TA.drawCandle = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const candleH = (h - 50) * (1 - progress);
    const bottomY = h - 20;
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 24, bottomY, 48, 10);
    ctx.beginPath(); ctx.ellipse(cx, bottomY + 10, 28, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aaa';
    ctx.fillRect(cx - 12, bottomY - candleH, 24, candleH);
    ctx.fillStyle = '#666';
    ctx.fillRect(cx + 4, bottomY - candleH, 8, candleH);
    if (candleH > 2 && progress < 1) {
      ctx.fillStyle = '#444';
      ctx.beginPath();
      ctx.moveTo(cx, bottomY - candleH - 18);
      ctx.quadraticCurveTo(cx - 5, bottomY - candleH - 6, cx, bottomY - candleH);
      ctx.quadraticCurveTo(cx + 5, bottomY - candleH - 6, cx, bottomY - candleH - 18);
      ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, bottomY - candleH); ctx.lineTo(cx, bottomY - candleH - 3); ctx.stroke();
    }
  };

  TA.drawHourglass = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    ctx.fillStyle = '#222';
    ctx.fillRect(cx - 40, 8, 80, 6);
    ctx.fillRect(cx - 40, h - 14, 80, 6);
    ctx.fillRect(cx - 44, 10, 4, h - 20);
    ctx.fillRect(cx + 40, 10, 4, h - 20);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 30, 14); ctx.lineTo(cx + 30, 14);
    ctx.lineTo(cx + 3, h/2); ctx.quadraticCurveTo(cx, h/2 + 2, cx + 3, h/2 + 4);
    ctx.lineTo(cx + 30, h - 14); ctx.lineTo(cx - 30, h - 14);
    ctx.lineTo(cx - 3, h/2 + 4); ctx.quadraticCurveTo(cx, h/2 + 2, cx - 3, h/2);
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#888';
    const topH = (h/2 - 18) * (1 - progress);
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx - 30, 14); ctx.lineTo(cx + 30, 14);
    ctx.lineTo(cx + 3, h/2); ctx.lineTo(cx - 3, h/2); ctx.closePath(); ctx.clip();
    ctx.fillRect(cx - 30, h/2 - topH, 60, topH);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx - 3, h/2 + 4); ctx.lineTo(cx + 3, h/2 + 4);
    ctx.lineTo(cx + 30, h - 14); ctx.lineTo(cx - 30, h - 14); ctx.closePath(); ctx.clip();
    const heapH = (h/2 - 22) * progress;
    const heapW = 26 * Math.sqrt(progress);
    ctx.beginPath();
    ctx.moveTo(cx - heapW, h - 14);
    ctx.quadraticCurveTo(cx, h - 14 - heapH, cx + heapW, h - 14);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    if (progress < 0.99 && progress > 0.01) {
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, h/2 + 4); ctx.lineTo(cx, h - 18); ctx.stroke();
    }
  };

  TA.drawMoon = function (ctx, w, h, opts) {
    const phase = opts.phase || 0;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) / 2 - 10;
    ctx.strokeStyle = '#000'; ctx.lineWidth = Math.max(3, R * 0.06);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R - 1, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#888';
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.fillStyle = '#000';
    const waxing = phase < 0.5;
    const t = phase < 0.5 ? (0.5 - phase) * 2 : (phase - 0.5) * 2;
    if (waxing) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - R);
      ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, true);
      ctx.ellipse(cx, cy, R * t, R, 0, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, cy - R);
      ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(cx, cy, R * t, R, 0, Math.PI / 2, -Math.PI / 2, false);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#000';
    [[cx-14, cy-8, 5], [cx+16, cy+14, 7], [cx-20, cy+22, 4], [cx+8, cy-20, 3]].forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], p[2], 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  };

  TA.drawArc = function (ctx, w, h, opts) {
    const progress = opts.progress || 0;
    ctx.clearRect(0, 0, w, h);
    const cx = w/2, cy = h/2, R = Math.min(w, h)/2 - 8;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx, cy, R - 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R - 6, -Math.PI/2, -Math.PI/2 + progress * Math.PI * 2);
    ctx.closePath(); ctx.fill();
  };

 
  TA.drawDigitalLoop = function (ctx, w, h, opts) {
    const remain = opts.remainMs || 0;
    ctx.clearRect(0, 0, w, h);
    const m = Math.floor(remain / 60000);
    const s = Math.floor((remain % 60000) / 1000);
    const ms = Math.floor((remain % 1000) / 100);
    const text = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

 
    ctx.fillStyle = '#000';
    ctx.fillRect(8, h*0.18, w - 16, h*0.64);
    ctx.fillStyle = '#fff';
    ctx.fillRect(14, h*0.20, w - 28, h*0.60);


    ctx.fillStyle = '#000';
    ctx.font = 'bold ' + (h * 0.46) + 'px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w/2, h/2);

  
    ctx.font = 'bold ' + (h * 0.10) + 'px "JetBrains Mono", monospace';
    ctx.fillText('.' + ms, w/2 + w*0.32, h/2 + h*0.18);

   
    ctx.fillStyle = '#000';
    for (let i = 0; i < 12; i++) {
      const x = 24 + i * ((w - 48) / 11);
      ctx.fillRect(x, h*0.10, 2, 6);
    }
  };

 
  TA.drawHalftonePhoto = function (targetCanvas, imgEl, opts) {
    const w = opts.width;
    const h = opts.height;
    const cellSize = opts.cellSize || 4;
    const color = opts.color || '#2a1e16';
    targetCanvas.width = w;
    targetCanvas.height = h;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const offctx = off.getContext('2d');
    offctx.fillStyle = '#fff'; offctx.fillRect(0, 0, w, h);
    // contain-fit
    const r = Math.min(w / imgEl.width, h / imgEl.height);
    const dw = imgEl.width * r, dh = imgEl.height * r;
    offctx.drawImage(imgEl, (w - dw) / 2, (h - dh) / 2, dw, dh);
    const src = offctx.getImageData(0, 0, w, h).data;

    const tctx = targetCanvas.getContext('2d');
    tctx.clearRect(0, 0, w, h);
    tctx.fillStyle = color;
    const cols = Math.ceil(w / cellSize), rows = Math.ceil(h / cellSize);
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const x0 = Math.floor(cx * cellSize), y0 = Math.floor(cy * cellSize);
        const x1 = Math.min(w, x0 + Math.ceil(cellSize)), y1 = Math.min(h, y0 + Math.ceil(cellSize));
        let sum = 0, n = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * w + x) * 4;
            const lum = (src[i]*0.299 + src[i+1]*0.587 + src[i+2]*0.114) / 255;
            sum += lum; n++;
          }
        }
        if (!n) continue;
        const lum = sum / n;
        const cov = 1 - lum;
        if (cov < 0.04) continue;
        const r2 = Math.max(0.4, Math.sqrt(cov) * (cellSize * 0.6));
        tctx.beginPath();
        tctx.arc((cx + 0.5) * cellSize, (cy + 0.5) * cellSize, r2, 0, Math.PI * 2);
        tctx.fill();
      }
    }
  };

 
  TA.renderClock = function (canvas, type, params) {
    // params: { color, cellSize, progress, phase, roman, width, height, remainMs }
    const w = params.width || canvas.width;
    const h = params.height || canvas.height;
    TA.halftone(canvas, {
      width: w, height: h,
      cellSize: params.cellSize || 3.2,
      color: params.color || '#2a1e16',
      draw: function (ctx, ww, hh) {
        switch (type) {
          case 'round': TA.drawRound(ctx, ww, hh, params); break;
          case 'grandfather': TA.drawGrandfather(ctx, ww, hh, params); break;
          case 'sweet_potato': TA.drawSweetPotato(ctx, ww, hh, params); break;
          case 'candle': TA.drawCandle(ctx, ww, hh, params); break;
          case 'hourglass': TA.drawHourglass(ctx, ww, hh, params); break;
          case 'moon': TA.drawMoon(ctx, ww, hh, params); break;
          case 'arc': TA.drawArc(ctx, ww, hh, params); break;
          case 'digital_loop': TA.drawDigitalLoop(ctx, ww, hh, params); break;
        }
      },
    });
  };


  TA.kindOf = function (type) {
    return ({
      round: 'countdown',
      grandfather: 'cycle',
      sweet_potato: 'countdown',
      candle: 'countdown',
      hourglass: 'countdown',
      moon: 'cycle',
      arc: 'countdown',
      digital_loop: 'loop',
      accumulate: 'accumulate',
      fixed: 'fixed',
      interval: 'cycle',
      waiting: 'subjective',
      photo_countdown: 'countdown',
      photo_accumulate: 'accumulate',
      photo_cycle: 'cycle',
      photo_fixed: 'fixed',
      photo_subjective: 'subjective',
      photo_loop: 'loop',
    })[type] || 'countdown';
  };

  TA.labelOf = function (type) {
    return ({
      round: 'wall clock', grandfather: 'grandfather clock', sweet_potato: 'cooking specimen',
      candle: 'candle', hourglass: 'hourglass', moon: 'astronomical',
      accumulate: 'tally', fixed: 'plaque', interval: 'recurring', waiting: 'subjective',
      arc: 'dial',
      digital_loop: 'digital loop',
      photo_countdown: 'photo countdown', photo_accumulate: 'photo tally',
      photo_cycle: 'photo cycle', photo_fixed: 'photo plaque', photo_subjective: 'photo subjective',
      photo_loop: 'photo loop',
    })[type] || type;
  };

 
  TA.runClock = function (opts) {
    let startedAt = opts.startAt || Date.now();
    let pausedElapsed = 0;
    let paused = false;
    let scrubbing = null; // ms when scrubbing
    let timer = null;
    function elapsed() {
      if (scrubbing != null) return scrubbing;
      if (paused) return pausedElapsed;
      return Math.max(0, Date.now() - startedAt);
    }
    function tick() {
      opts.draw(elapsed());
    }
    function start() {
      if (timer) return;
      timer = setInterval(tick, opts.interval || 1000);
      tick();
    }
    function stop() { clearInterval(timer); timer = null; }
    return {
      start: start,
      stop: stop,
      pause: function () { if (paused) return; pausedElapsed = elapsed(); paused = true; tick(); },
      resume: function () { if (!paused) return; startedAt = Date.now() - pausedElapsed; paused = false; tick(); },
      reset: function () { startedAt = Date.now(); pausedElapsed = 0; paused = false; tick(); },
      restart: function () { startedAt = Date.now(); pausedElapsed = 0; paused = false; tick(); },
      scrub: function (ms) { scrubbing = ms; tick(); },
      liveMode: function () { scrubbing = null; tick(); },
      isPaused: function () { return paused; },
      isScrubbing: function () { return scrubbing != null; },
      now: function () { return elapsed(); },
    };
  };

  global.TA = TA;
})(window);
