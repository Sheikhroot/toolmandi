// ToolMandi shared helpers
function $(s, r){ return (r||document).querySelector(s); }
function fmtKB(bytes){ if(bytes<1024) return bytes+' B'; var kb=bytes/1024; return (kb>=100?Math.round(kb):kb.toFixed(1))+' KB'; }
function downloadBlob(blob, name){ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 800); }
function loadImageFromFile(file){ return new Promise(function(res, rej){ var url=URL.createObjectURL(file); var img=new Image(); img.onload=function(){ res({img:img, url:url}); }; img.onerror=rej; img.src=url; }); }
function canvasToBlob(canvas, type, q){ return new Promise(function(res){ canvas.toBlob(res, type, q); }); }
function setupDrop(dropEl, inputEl, onFiles){
  dropEl.addEventListener('click', function(){ inputEl.click(); });
  inputEl.addEventListener('change', function(){ if(inputEl.files.length) onFiles(inputEl.files); inputEl.value=''; });
  ['dragover','dragenter'].forEach(function(ev){ dropEl.addEventListener(ev, function(e){ e.preventDefault(); dropEl.classList.add('over'); }); });
  ['dragleave','drop'].forEach(function(ev){ dropEl.addEventListener(ev, function(e){ e.preventDefault(); dropEl.classList.remove('over'); }); });
  dropEl.addEventListener('drop', function(e){ var f=e.dataTransfer.files; if(f.length) onFiles(f); });
}
// Header / footer shared markup (kept in JS so every page stays in sync)
function tmHeader(root){
  document.write('<header class="site"><div class="wrap"><a class="logo" href="'+root+'">Tool<span>Mandi</span></a><span class="tagline">Free online tools — no signup</span><nav class="main"><a href="'+root+'#image-tools">Image Tools</a><a href="'+root+'#pdf-tools">PDF Tools</a><a href="'+root+'#business-tools">Business Tools</a><a href="'+root+'#daily-tools">Daily Tools</a></nav></div></header>');
}
function tmFooter(root){
  document.write('<footer class="site"><div class="wrap"><p><b style="color:#fff">ToolMandi</b> — free online tools that run 100% in your browser. Your files never leave your device: no uploads, no signup, no watermark.</p><p><a href="'+root+'">All tools</a> · <a href="'+root+'compress-image-to-kb/">Compress Image to KB</a> · <a href="'+root+'passport-photo-maker/">Passport Photo Maker</a> · <a href="'+root+'image-to-pdf/">Image to PDF</a> · <a href="'+root+'merge-pdf/">Merge PDF</a> · <a href="'+root+'whatsapp-link-generator/">WhatsApp Link Generator</a></p><p class="small" style="color:#8fa0b8">Made in Chiniot, Pakistan. ToolMandi is a free service — always check the final file against the requirements of the portal you are submitting to.</p></div></footer>');
}
