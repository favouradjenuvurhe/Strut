/* The line, line-up and look views, swipe/drag/keys, the bag, checkout and pages. */
const N=9,SOLD=3,$=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0'),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const look=i=>[['top',T[i]],['bottom',B[i]],['extra',X[i]]];
const total=i=>look(i).reduce((a,l)=>a+l[1][1],0);
const money=n=>'$'+n.toFixed(2).replace(/\.00$/,'');
const sizesFor=(c,n)=>c==='extra'?(/Boots|Sneakers|Loafers/.test(n)?['40','41','42','43']:['ONE SIZE']):['S','M','L','XL'];
const defSize=(c,n)=>{const z=sizesFor(c,n);return z[Math.min(2,z.length-1)]};
let cur=0,mode='line',bag={},szs={},lastWheel=0,pos=0,dragging=false,moved=0,view='bag',hov=0,lastCur=0,sideFor=-1,order=null;
try{bag=JSON.parse(localStorage.getItem('strut-bag')||'{}')}catch(e){}
const saveBag=()=>{try{localStorage.setItem('strut-bag',JSON.stringify(bag))}catch(e){}};
const icon=k=>'<img src="'+CROP[cur][k]+'" alt="">';
$('num').innerHTML=[0,1].map(()=>'<span class="dg">'+[...'0123456789'].map(d=>'<i>'+d+'</i>').join('')+'</span>').join('');
const gh=document.createElement('img');gh.id='gh';gh.alt='';$('figs').appendChild(gh);
const figs=FIG.map((p,i)=>{const b=document.createElement('button');b.className='fg';b.setAttribute('aria-label','Look '+pad(i+1)+', '+NM[i]);b.innerHTML='<img src="'+p+'" alt="" draggable="false">';
 b.onclick=()=>{if(moved>8)return;if(mode==='lineup'){cur=i;mode='line';render()}else if(mode==='line'){if(i===cur)mode='look';else cur=i;render()}};
 b.onmouseenter=()=>{hov=i;if(mode==='lineup')place()};$('figs').appendChild(b);return b});
const tags=FIG.map((_,i)=>{const t=document.createElement('span');t.className='ut tk';t.textContent=pad(i+1);$('tags').appendChild(t);return t});
const cl=document.createElement('span');cl.className='cl';$('tags').appendChild(cl);
function place(){const st=$('st'),w=st.clientWidth,h=st.clientHeight,bh=Math.min(h*.66,w*.62),bw=bh*.8,P0=[w*.1,h*.6],P1=[w*(w<700?.8:.86),h*.95],cw=w*.92/N;let fx=0,fy=0,fs=1;
 figs.forEach((f,i)=>{const d=i-(mode==='line'?pos:cur);let x,y,s,o=1,bl=0;
  if(mode==='lineup'){x=w*.04+(i+.5)*cw;y=h*.8;s=Math.min(cw*1.45/bw,.7)}
  else if(mode==='look'){if(d){o=0;x=w*.5;y=h*.97;s=.5}else{x=w*(w<700?.6:.58);y=h*.97;s=w<700?1.5:1.05;fx=x;fy=y;fs=s}}
  else{const u=d>=0?.84*Math.pow(.66,d):.84-d*.46;x=P0[0]+(P1[0]-P0[0])*u;y=P0[1]+(P1[1]-P0[1])*u;s=.28+.86*u;bl=Math.min(Math.max(d,0)*1.5,7);o=d<0?Math.max(0,1+d*1.1):d>7?0:1}
  f._tr=`translate(${x-bw/2}px,${y-bh}px) scale(${s})`;
  f.style.cssText=`width:${bw}px;height:${bh}px;transform:${f._tr};opacity:${o};filter:blur(${bl}px);z-index:${50-d};pointer-events:${o?'auto':'none'}`});
 gh.style.cssText=`width:${bw}px;height:${bh}px;transform:translate(${fx-bw/2-bw*.2}px,${fy-bh-8}px) scale(${fs*1.03});opacity:${mode==='look'?.22:0};z-index:30`;
 $('ln').setAttribute('viewBox',`0 0 ${w} ${h}`);
 $('band').setAttribute('points',`${P0[0]},${P0[1]-2} ${P1[0]+20},${P1[1]-14} ${P1[0]+20},${P1[1]+14} ${P0[0]},${P0[1]+3}`);$('band').style.opacity=mode==='line'?1:0;
 const bs=$('base');bs.setAttribute('x1',w*.04);bs.setAttribute('x2',w*.96);bs.setAttribute('y1',h*.84);bs.setAttribute('y2',h*.84);bs.style.opacity=mode==='lineup'?1:0;
 tags.forEach((t,i)=>{t.style.left=(w*.04+(i+.5)*cw)+'px';t.style.top=h*.87+'px';t.style.opacity=mode==='lineup'?1:0});
 cl.style.cssText=`left:${w*.04+(hov+.5)*cw}px;top:${h*.87+36}px;opacity:${mode==='lineup'?1:0}`;cl.textContent=NM[hov].toUpperCase()+' · '+money(total(hov))}
function echo(prev,dir){const f=figs[prev];if(!f||!f._tr)return;for(let k=0;k<3;k++){const g=document.createElement('img');g.src=FIG[prev];g.className='echo';g.alt='';g.style.cssText=`width:${f.style.width};height:${f.style.height};--t:${f._tr};--dx:${dir*(k+1)*70}px;animation-delay:${k*.05}s`;$('figs').appendChild(g);setTimeout(()=>g.remove(),950)}}
const bagItems=()=>Object.keys(bag).map(id=>{const[i,k]=id.split('-').map(Number),l=look(i)[k];return{id,n:l[1][0],p:l[1][1],s:bag[id]}});
const calc=()=>{const it=bagItems(),sub=it.reduce((a,x)=>a+x.p,0),dis=it.length>=3?sub*.1:0;return{it,sub,dis,tot:sub-dis}};
const lines=(arr,rm)=>arr.map((x,i)=>`<div class="ln"><span>${pad(i+1)} ${x.n} · ${x.s} ✓</span><span>${money(x.p)}${rm?` <button data-r="${x.id}" aria-label="Remove ${x.n}" style="text-decoration:underline">×</button>`:''}</span></div>`).join('');
const sums=(sub,dis,tot)=>`<div class="ln"><span>Subtotal</span><span>${money(sub)}</span></div>${dis?`<div class="ln"><span>Full look −10%</span><span>−${money(dis)}</span></div>`:''}<div class="dash"></div><div class="tot"><span>TOTAL</span><span>${money(tot)}</span></div>`;
function bagHTML(){const{it,sub,dis,tot}=calc();let h;
 if(view==='done'&&order)h=`<p class="m">Order confirmed</p><div class="dash"></div><div class="big">NO. ${order.no}</div><p class="q2">You are number ${order.pos} in the line. Doors at ten.</p><div class="dash"></div>${lines(order.items,0)}<div class="dash"></div>${sums(order.sub,order.dis,order.tot)}<button class="cta tk blk" data-x="1">Back to the line</button><div class="bc" aria-hidden="true"></div>`;
 else if(view==='form'&&it.length)h=`<p class="m">Checkout · ${it.length} pieces</p><div class="dash"></div><form id="ck" novalidate>${[['email','Email','email'],['name','Full name','text'],['phone','Phone','tel'],['addr','Address','text'],['city','City','text']].map(f=>`<label class="fl"><span>${f[1]}</span><input name="${f[0]}" type="${f[2]}"><em></em></label>`).join('')}<div class="dash"></div><div class="tot"><span>TOTAL</span><span>${money(tot)}</span></div><button class="cta tk blk" type="submit">Place order</button></form><p class="m" style="text-align:center;margin-top:14px"><button data-v="bag" style="text-decoration:underline;font:inherit;text-transform:uppercase">Back to bag</button></p>`;
 else h=`<p class="m">Your bag · ${it.length} ${it.length===1?'piece':'pieces'}</p><div class="dash"></div>`+(it.length?lines(it,1):'<p class="m" style="color:var(--mute)">Nothing here yet.</p>')+`<div class="dash"></div>${sums(sub,dis,tot)}<button class="cta tk blk" data-c="${it.length?'co':'add'}">${it.length?'Checkout':'Add full look to bag'}</button><p class="m" style="text-align:center;margin-top:14px"><button data-x="1" style="text-decoration:underline;font:inherit;text-transform:uppercase">Back to the line</button></p><div class="bc" aria-hidden="true"></div>`;
 return `<div class="rcpt">${h}</div>`}
function render(){
 if(!dragging)pos=cur;
 if(cur!==lastCur&&mode!=='lineup')echo(lastCur,cur>lastCur?1:-1);
 lastCur=cur;hov=cur;
 $('st').className='stage m-'+mode+(dragging?' drag':'');$('hint').textContent=mode==='line'?'Swipe or drag the line · Tap a look':mode==='look'?'Swipe for the next look':'Tap a look';$$('.tog button').forEach(b=>b.classList.toggle('on',b.dataset.m===(mode==='lineup'?'lineup':'line')));
 gh.src=FIG[cur];const s2=pad(cur+1);$$('.dg',$('num')).forEach((e,k)=>e.style.transform=`translateY(${-s2[k]*.86}em)`);$('num').setAttribute('aria-label','Now serving '+s2);
 $('nm').textContent=NM[cur];$('q').textContent=QU[cur];
 $('stats').innerHTML=[['In line since','06:'+pad(3+cur*4%50)],['Position',s2+' of 09'],['Pieces','03'],['Look total',money(total(cur))]].map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('');
 const sold=cur===SOLD,sh=$('shop');$('no').textContent='NO. '+s2;$('shopT').textContent=mode==='look'?(sold?'Sold out':'Add full look · '+money(total(cur)*.9)):'Shop the look →';sh.className='tk split'+(mode==='look'?' blk':'')+(sold&&mode==='look'?' off':'');
 $('side').innerHTML=look(cur).map((l,k)=>{const[c,[n,p]]=l,id=cur+'-'+k,sz=sizesFor(c,n),sel=szs[id]||defSize(c,n);
  return `<div class="card${sold?' sold':''}"><div class="cm"><span>${s2} · 0${k+1}/03</span><span>${c}</span></div><div class="ic">${icon(k)}</div><div class="sz">${sz.map(z=>`<button data-s="${k}:${z}" class="${sel===z?'on':''}">${z}</button>`).join('')}</div><h3>${n}</h3><div class="pr"><span>${money(p)}</span>${sold?'<button class="tk off" disabled>SOLD OUT</button>':`<button class="tk${bag[id]?' blk':''}" data-a="${k}">${bag[id]?'IN BAG':'ADD'}</button>`}</div></div>`}).join('');
 if(sideFor!==cur){sideFor=cur;const sd=$('side');sd.classList.remove('sw');void sd.offsetWidth;sd.classList.add('sw')}
 $('cnt').textContent=bagItems().length;$('bag').innerHTML=bagHTML();saveBag();place()}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),1800)}
const addLook=()=>{if(cur===SOLD){toast('Sold out');return}look(cur).forEach((l,k)=>{const id=cur+'-'+k;bag[id]=szs[id]||defSize(l[0],l[1][0])});toast('Look added to bag');render()};
const go=d=>{cur=Math.max(0,Math.min(N-1,cur+d));document.body.classList.add('used');render()};
const SH={drop:['Drop 01','Fall Collection',[['Doors','10:00'],['Looks','09'],['Pieces','27'],['Full look','−10%']],'Drop 01 is the first run. Every look is a person in the line, three pieces long: a top, a bottom and something for your feet. Whoever is at the front is being served.'],
 stores:['Stores','Find the line',[['Store 001','France'],['Store 002','Coming soon'],['Online','Always open']],'Store details are placeholders. Add your real addresses and opening hours here.'],
 journal:['Journal','Notes from the line',[['Nov 2026','Why we queue'],['Nov 2026','Notes from the line'],['Oct 2026','Fall, in nine looks']],'Short stories about the looks, the people and the doors. More soon.']};
function navOn(k){$$('.bar nav button').forEach(b=>b.classList.toggle('on',b.dataset.n===k))}
function openSheet(k){const d=SH[k];$('sheet').innerHTML=`<div class="sh-in"><button class="bk" data-n="line">← Back to the line</button><h2>${d[0]}</h2><p class="lead">${d[1]}</p><dl>${d[2].map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl><p>${d[3]}</p></div>`;document.body.classList.remove('bo');document.body.classList.add('sh');navOn(k)}
function closeSheet(){document.body.classList.remove('sh');navOn('line')}
function closeBag(){document.body.classList.remove('bo');if(view==='done'){view='bag';render()}}
document.addEventListener('click',e=>{const t=e.target;let b;
 if(b=t.closest('[data-m]')){mode=b.dataset.m;render()}
 else if(t.closest('#shop')){mode==='look'?addLook():(mode='look',render())}
 else if(t.closest('#back')){mode='line';render()}
 else if(b=t.closest('[data-s]')){const[k,z]=b.dataset.s.split(':');szs[cur+'-'+k]=z;if(bag[cur+'-'+k])bag[cur+'-'+k]=z;render()}
 else if(b=t.closest('[data-a]')){const id=cur+'-'+b.dataset.a;if(bag[id])delete bag[id];else{const l=look(cur)[b.dataset.a];bag[id]=szs[id]||defSize(l[0],l[1][0])}render()}
 else if(b=t.closest('[data-r]')){delete bag[b.dataset.r];render()}
 else if(b=t.closest('[data-c]')){if(b.dataset.c==='co'){view='form';render()}else{closeBag();mode='look';render();addLook()}}
 else if(b=t.closest('[data-v]')){view=b.dataset.v;render()}
 else if(t.closest('[data-x]')){closeBag();closeSheet();mode='line';render()}
 else if(t.closest('#bagBtn')){document.body.classList.contains('bo')?closeBag():(closeSheet(),document.body.classList.add('bo'))}
 else if(b=t.closest('[data-n]')){e.preventDefault();const k=b.dataset.n;if(k==='line'){closeSheet();closeBag();mode='line';render()}else openSheet(k)}});
document.addEventListener('submit',e=>{if(e.target.id!=='ck')return;e.preventDefault();const f=e.target;let bad=null;
 ['email','name','phone','addr','city'].forEach(n=>{const el=f.elements[n],v=el.value.trim();let m='';if(!v)m='Required';else if(n==='email'&&!/^\S+@\S+\.\S+$/.test(v))m='Enter a valid email';else if(n==='phone'&&v.replace(/\D/g,'').length<10)m='Enter a valid phone number';el.setAttribute('aria-invalid',!!m);el.nextElementSibling.textContent=m;if(m&&!bad)bad=el});
 if(bad){bad.focus();return}
 const c=calc();order={no:String(Date.now()).slice(-4),pos:11+Math.floor(Math.random()*38),items:c.it,sub:c.sub,dis:c.dis,tot:c.tot};bag={};view='done';render()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeBag();closeSheet();if(mode==='look'){mode='line';render()}return}
 if(document.body.classList.contains('sh')||/INPUT/.test(document.activeElement.tagName))return;
 if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowDown'){mode='lineup';render()}if(e.key==='ArrowUp'&&mode!=='line'){mode='line';render()}});
$('st').addEventListener('wheel',e=>{if(mode==='lineup'||Math.abs(e.deltaY)+Math.abs(e.deltaX)<20||Date.now()-lastWheel<420)return;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||innerWidth>899){e.preventDefault();lastWheel=Date.now();go((e.deltaX||e.deltaY)>0?1:-1)}},{passive:false});
let sx=null,sy=0,sp=0;
$('st').addEventListener('pointerdown',e=>{if(e.target.closest('.tog,.ns,#back'))return;sx=e.clientX;sy=e.clientY;sp=pos;moved=0});
addEventListener('pointermove',e=>{
 const cu=$('cu');cu.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;const inSt=!!e.target.closest('#st');cu.classList.toggle('on',inSt&&!e.target.closest('.tk,button:not(.fg)'));cu.classList.toggle('v',!!e.target.closest('.fg')&&mode!=='look');
 if(sx===null)return;const dx=e.clientX-sx;moved=Math.abs(dx);
 if(mode==='line'){if(!dragging&&moved>6){dragging=true;$('st').classList.add('drag');document.body.classList.add('used')}
  if(dragging){pos=Math.max(0,Math.min(N-1,sp-dx/(innerWidth<900?170:190)));place()}}});
function endDrag(e){if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;
 if(dragging){dragging=false;let t=Math.round(pos);if(t===Math.round(sp)&&Math.abs(pos-sp)>.2)t+=pos>sp?1:-1;cur=Math.max(0,Math.min(N-1,t));render()}
 else if(mode==='look'&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);
 sx=null}
addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
addEventListener('resize',place);
render();
$('st').classList.add('init');pos=-3;place();void $('st').offsetWidth;$('st').classList.remove('init');pos=cur;place();
