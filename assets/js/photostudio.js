// ToolMandi photo studio engine — shared by Passport / Student / LinkedIn photo makers.
// Crop (drag + zoom) to an exact output size, with optional background replacement
// for plain backgrounds (flood fill from the edges). 100% in-browser.

// Pure function (also unit-tested): replace background pixels in an RGBA array.
// Background colour is sampled from the corners; anything connected to an edge
// and within `tol` colour distance of that sample is replaced with `rgb`.
function tmBgReplace(data, w, h, tol, rgb){
  function px(x,y){ return (y*w+x)*4; }
  // sample corner blocks (6x6)
  var sr=0, sg=0, sb=0, cnt=0, blocks=[[0,0],[w-6,0],[0,h-6],[w-6,h-6]];
  for(var b=0;b<blocks.length;b++) for(var yy=0;yy<6;yy++) for(var xx=0;xx<6;xx++){
    var i=px(blocks[b][0]+xx, blocks[b][1]+yy); sr+=data[i]; sg+=data[i+1]; sb+=data[i+2]; cnt++;
  }
  sr/=cnt; sg/=cnt; sb/=cnt;
  function isBg(i){ var dr=data[i]-sr, dg=data[i+1]-sg, db=data[i+2]-sb; return Math.sqrt(dr*dr+dg*dg+db*db) <= tol; }
  var visited=new Uint8Array(w*h), stack=[];
  function seed(x,y){ var k=y*w+x; if(!visited[k]){ visited[k]=1; stack.push(k); } }
  for(var x=0;x<w;x++){ seed(x,0); seed(x,h-1); }
  for(var y=0;y<h;y++){ seed(0,y); seed(w-1,y); }
  while(stack.length){
    var k=stack.pop(), cx=k%w, cy=(k-cx)/w, i=k*4;
    if(!isBg(i)){ visited[k]=2; continue; } // 2 = frontier (not background)
    data[i]=rgb[0]; data[i+1]=rgb[1]; data[i+2]=rgb[2]; data[i+3]=255; visited[k]=3;
    if(cx>0 && !visited[k-1]){ visited[k-1]=1; stack.push(k-1); }
    if(cx<w-1 && !visited[k+1]){ visited[k+1]=1; stack.push(k+1); }
    if(cy>0 && !visited[k-w]){ visited[k-w]=1; stack.push(k-w); }
    if(cy<h-1 && !visited[k+w]){ visited[k+w]=1; stack.push(k+w); }
  }
  // soften the edge: frontier pixels next to real subject interior get a 35%
  // blend toward the new background (pixels fully surrounded by replaced
  // background — like a wall gap between arm and torso — are left alone)
  for(var k2=0;k2<w*h;k2++) if(visited[k2]===2){
    var cx2=k2%w, cy2=(k2-cx2)/w, hasInterior=false;
    if(cx2>0 && visited[k2-1]===0) hasInterior=true;
    if(cx2<w-1 && visited[k2+1]===0) hasInterior=true;
    if(cy2>0 && visited[k2-w]===0) hasInterior=true;
    if(cy2<h-1 && visited[k2+w]===0) hasInterior=true;
    if(hasInterior){ var i2=k2*4; data[i2]=data[i2]*0.65+rgb[0]*0.35; data[i2+1]=data[i2+1]*0.65+rgb[1]*0.35; data[i2+2]=data[i2+2]*0.65+rgb[2]*0.35; }
  }
  return data;
}

// Studio controller bound to a visible stage canvas.
function tmCreateStudio(canvas, outW, outH){
  var ctx=canvas.getContext('2d');
  var st={ img:null, w:outW, h:outH, panX:0, panY:0, zoom:1, bg:null }; // bg: {tol:48, rgb:[255,255,255]}
  canvas.width=outW; canvas.height=outH;
  function baseDraw(target){
    var c2=target.getContext('2d');
    c2.fillStyle='#ffffff'; c2.fillRect(0,0,st.w,st.h);
    if(!st.img) return;
    var s=Math.max(st.w/st.img.naturalWidth, st.h/st.img.naturalHeight)*st.zoom;
    var dw=st.img.naturalWidth*s, dh=st.img.naturalHeight*s;
    var dx=(st.w-dw)/2+st.panX, dy=(st.h-dh)/2+st.panY;
    dx=Math.min(0, Math.max(st.w-dw, dx)); dy=Math.min(0, Math.max(st.h-dh, dy));
    st.panX=dx-(st.w-dw)/2; st.panY=dy-(st.h-dh)/2;
    c2.drawImage(st.img, dx, dy, dw, dh);
  }
  function draw(){
    baseDraw(canvas);
    if(st.bg && st.img){
      var id=ctx.getImageData(0,0,st.w,st.h);
      tmBgReplace(id.data, st.w, st.h, st.bg.tol, st.bg.rgb);
      ctx.putImageData(id,0,0);
    }
  }
  var dragging=false, lx=0, ly=0;
  canvas.addEventListener('pointerdown', function(e){ dragging=true; lx=e.clientX; ly=e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', function(e){ if(!dragging) return; var r=canvas.getBoundingClientRect(); st.panX+=(e.clientX-lx)*(st.w/r.width); st.panY+=(e.clientY-ly)*(st.h/r.height); lx=e.clientX; ly=e.clientY; draw(); });
  canvas.addEventListener('pointerup', function(){ dragging=false; });
  return {
    setImage: function(img){ st.img=img; st.panX=0; st.panY=0; st.zoom=1; draw(); },
    setSize: function(w,h){ st.w=w; st.h=h; canvas.width=w; canvas.height=h; st.panX=0; st.panY=0; st.zoom=1; draw(); },
    setZoom: function(z){ st.zoom=z; draw(); },
    setBg: function(bg){ st.bg=bg; draw(); },
    draw: draw,
    state: st,
    output: function(){ var c=document.createElement('canvas'); c.width=st.w; c.height=st.h; var save=canvas; baseDraw(c); if(st.bg && st.img){ var x=c.getContext('2d'); var id=x.getImageData(0,0,st.w,st.h); tmBgReplace(id.data, st.w, st.h, st.bg.tol, st.bg.rgb); x.putImageData(id,0,0); } return c; }
  };
}
