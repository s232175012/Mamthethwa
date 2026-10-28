const WHATSAPP="27655549854";
const LS_P="MT_FINAL_V3", LS_O="MT_ORDERS_V3", LS_LIKES="MT_LIKES_V3";
const ADMIN={u:"admin",p:"mamthethwa123"};
const CATS=["Combo","T-shirt","Pants","Shoes"];
let tempImgs=["","","","",""];
let products=JSON.parse(localStorage.getItem(LS_P)||"[]");
if(products.length===0){
 products=[
  {id:1,name:"Combo Brown Set",price:1700,cat:"Combo",images:["https://via.placeholder.com/600/fff0f5/ff4d8d?text=Combo"],sizes:{"S":5,"M":8,"L":6},likes:42,ratings:[5,5,5,4,5]},
  {id:2,name:"T-shirt White Oversized",price:350,cat:"T-shirt",images:["https://via.placeholder.com/600/fde8d0/111?text=T-shirt"],sizes:{"S":10,"M":10,"L":10},likes:31,ratings:[5,5,4]},
  {id:3,name:"Pants Cargo Brown",price:750,cat:"Pants",images:["https://via.placeholder.com/600/8B5A2B/fff?text=Pants"],sizes:{"28":3,"30":5,"32":4},likes:28,ratings:[5,4,5]},
  {id:4,name:"Shoes Sneakers Adidas",price:950,cat:"Shoes",images:["https://via.placeholder.com/600/e8e8e8/111?text=Shoes"],sizes:{"3":4,"4":6,"5":5,"6":4},likes:50,ratings:[5,5,5]},
 ];
 localStorage.setItem(LS_P,JSON.stringify(products));
}
let cart=[],current=null,activeCat='all';
const saveP=()=>localStorage.setItem(LS_P,JSON.stringify(products));
const getO=()=>JSON.parse(localStorage.getItem(LS_O)||"[]");
const saveO=o=>localStorage.setItem(LS_O,JSON.stringify(o));
const getLikes=()=>JSON.parse(localStorage.getItem(LS_LIKES)||"[]");
const saveLikes=l=>localStorage.setItem(LS_LIKES,JSON.stringify(l));
function avg(a){if(!a||!a.length)return 5.0;return (a.reduce((x,y)=>x+y,0)/a.length).toFixed(1)}
function toast(m){let d=document.createElement('div');d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:999px;font-size:11px;font-weight:800;z-index:999;animation:pop .3s';d.innerText=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2000)}

// Hours
const hoursBox=document.getElementById('hoursBox');
if(hoursBox){const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];hoursBox.innerHTML=days.map(d=>`<div><span>${d}</span><span>Open 24 hours</span></div>`).join('');}

// SHOP PAGE
if(document.getElementById('products')){
 function render(){
  const box=document.getElementById('products');box.innerHTML="";
  let list=activeCat==='all'?products:products.filter(p=>p.cat===activeCat);
  list.forEach((p,i)=>{
    const total=Object.values(p.sizes).reduce((a,b)=>a+b,0);
    const cls=total==0?'out':total<3?'low':'in';
    const likes=getLikes(); const isLiked=likes.includes(p.id);
    box.innerHTML+=`<div class="card" style="animation-delay:${i*0.06}s" onclick="openProduct(${p.id})">
      <div style="position:relative"><img src="${p.images[0]}"><div class="like-small">${isLiked?'❤️':'🤍'} ${p.likes||0}</div></div>
      <h4>${p.name}</h4><div style="font-weight:800">R${p.price}</div>
      <div style="font-size:10px">★★★★★ ${avg(p.ratings)} (${p.ratings.length}) • ${p.cat}</div>
      <span class="stock ${cls}">${total==0?'OUT':total+' left'}</span>
    </div>`;
  });
  document.getElementById('cartCount').innerText=cart.reduce((a,b)=>a+b.qty,0);
 }
 window.filterCat=(cat,btn)=>{activeCat=cat;document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render();document.getElementById('shop').scrollIntoView({behavior:'smooth'})}
 window.openProduct=id=>{
  current=products.find(x=>x.id==id);
  document.getElementById('mImage').src=current.images[0];
  document.getElementById('mName').innerText=current.name;
  document.getElementById('mPrice').innerText="R"+current.price;
  document.getElementById('mCat').innerText=current.cat;
  document.getElementById('mStock').innerText=`${Object.values(current.sizes).reduce((a,b)=>a+b,0)} left • ${Object.entries(current.sizes).map(([k,v])=>k+':'+v).join(' | ')}`;
  document.getElementById('stockFill').style.width=Math.min(100,Object.values(current.sizes).reduce((a,b)=>a+b,0)*8)+"%";
  const thumbs=document.getElementById('mThumbs');thumbs.innerHTML="";
  current.images.forEach((img,i)=>{if(img)thumbs.innerHTML+=`<img src="${img}" class="${i==0?'active':''}" onclick="setMain('${img}',this)">`});
  const sel=document.getElementById('mSize');sel.innerHTML="";for(let s in current.sizes){sel.innerHTML+=`<option value="${s}" ${current.sizes[s]==0?'disabled':''}>${s} - ${current.sizes[s]} left</option>`}
  document.getElementById('likeCount').innerText=current.likes||0;
  document.getElementById('mAvg').innerText=avg(current.ratings);
  document.getElementById('mRCount').innerText=`(${current.ratings.length})`;
  document.getElementById('likeBtn').classList.toggle('liked',getLikes().includes(current.id));
  document.getElementById('productModal').classList.remove('hidden');document.body.style.overflow='hidden';
 }
 window.setMain=(src,el)=>{document.getElementById('mImage').src=src;document.querySelectorAll('.thumbs img').forEach(i=>i.classList.remove('active'));el.classList.add('active')}
 window.toggleLike=()=>{let likes=getLikes();if(likes.includes(current.id)){likes=likes.filter(x=>x!=current.id);current.likes--}else{likes.push(current.id);current.likes++}saveLikes(likes);saveP();document.getElementById('likeCount').innerText=current.likes;document.getElementById('likeBtn').classList.toggle('liked',likes.includes(current.id));render()}
 window.rateProduct=s=>{current.ratings.push(s);saveP();document.getElementById('mAvg').innerText=avg(current.ratings);document.getElementById('mRCount').innerText=`(${current.ratings.length})`;toast(`Rated ${s}★ ♡`);render()}
 window.addToCart=()=>{const size=document.getElementById('mSize').value;const qty=parseInt(document.getElementById('mQty').value);if(!size){toast('Select size');return}if(qty>current.sizes[size]){document.getElementById('mQtyError').innerText="Only "+current.sizes[size]+" left";return}document.getElementById('mQtyError').innerText="";cart.push({id:current.id,name:current.name,size,qty,price:current.price});closeModal('productModal');render();toast('Added ♡');openCart()}
 window.openCart=()=>{if(cart.length==0){toast('Bag empty ♡');return}let html="",total=0;cart.forEach((c,i)=>{total+=c.price*c.qty;html+=`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ffe4ec;font-size:12px"><span>${c.name} (${c.size}) x${c.qty}</span><span>R${c.price*c.qty} <a href="#" onclick="removeCart(${i});return false" style="color:#ff4d8d">x</a></span></div>`});document.getElementById('cartItems').innerHTML=html;document.getElementById('cartTotal').innerText="Total: R"+total;document.getElementById('cartModal').classList.remove('hidden');document.body.style.overflow='hidden';}
 window.removeCart=i=>{cart.splice(i,1);render();if(cart.length==0)closeModal('cartModal');else openCart()}
 window.closeModal=id=>{document.getElementById(id).classList.add('hidden');document.body.style.overflow='';}
 window.submitOrder=e=>{e.preventDefault();const name=document.getElementById('custName').value,phone=document.getElementById('custPhone').value,del=document.getElementById('custCampus').value,addr=document.getElementById('custAddress').value;const code="MT"+Math.floor(1000+Math.random()*9000);let list="",total=0;cart.forEach(c=>{const pr=products.find(p=>p.id==c.id);if(pr)pr.sizes[c.size]-=c.qty;list+=`• ${c.name} ${c.size} x${c.qty}=R${c.price*c.qty}\n`;total+=c.price*c.qty});saveP();const order={code,name,phone,delivery:del,address:addr,items:[...cart],total,status:"Pending",est:"2-3 days",date:new Date().toLocaleString()};const orders=getO();orders.unshift(order);saveO(orders);const msg=`💖 MAMTHETHWA ORDER ${code} 💖\n${list}\nTotal R${total}\nName: ${name}\nPhone: ${phone}\nDelivery: ${del}\nAddr: ${addr}\nTrack: ${code}`;window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');cart=[];render();closeModal('cartModal');e.target.reset();alert("Your MT Code: "+code+" ♡")}
 window.trackOrder=()=>{const code=document.getElementById('trackInput').value.trim().toUpperCase();if(!code){toast('Enter MT code ♡');return}const order=getO().find(o=>o.code==code);const box=document.getElementById('trackResult');if(!order){box.innerHTML=`<div style="background:#fff;border:2px solid #111;padding:10px;border-radius:12px;margin-top:10px">❌ ${code} not found ♡</div>`;return}box.innerHTML=`<div style="background:#fff;border:2px solid #111;padding:12px;border-radius:12px;margin-top:10px;box-shadow:3px 3px 0 #111"><b>${order.code}</b> - <span style="background:var(--pink);color:#fff;padding:4px 10px;border-radius:999px;font-size:10px">${order.status}</span> • Est ${order.est}<br>Total R${order.total}<br><small>${order.date}</small></div>`}
 render();
}

// ADMIN
if(document.getElementById('loginBox')){
 window.handleImg=(input,idx)=>{
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();reader.onload=e=>{
    const img=new Image();img.onload=()=>{
      const canvas=document.createElement('canvas');const maxW=900;let w=img.width,h=img.height;if(w>maxW){h=h*(maxW/w);w=maxW}canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);
      tempImgs[idx]=canvas.toDataURL('image/jpeg',0.75);
      document.getElementById('prev'+idx).src=tempImgs[idx];document.getElementById('prev'+idx).style.display='block';document.getElementById('up'+idx).parentElement.classList.add('has');
    };img.src=e.target.result;
  };reader.readAsDataURL(file);
 }
 window.adminLogin=()=>{const u=document.getElementById('lUser').value,p=document.getElementById('lPass').value;if(u==ADMIN.u&&p==ADMIN.p){localStorage.setItem('MT_ADMIN','yes');showAdmin()}else{document.getElementById('lError').innerText="Wrong login"}}
 window.adminLogout=()=>{localStorage.removeItem('MT_ADMIN');location.reload()}
 window.switchTab=(t,el)=>{document.querySelectorAll('.admin-card').forEach(c=>c.classList.add('hidden'));document.getElementById('tab-'+t).classList.remove('hidden');document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));if(el)el.classList.add('active');if(t=='products')renderAdminP();if(t=='orders')renderAdminO()}
 function showAdmin(){document.getElementById('loginBox').classList.add('hidden');document.getElementById('adminPanel').classList.remove('hidden');renderAdminP();renderAdminO()}
 window.addProduct=()=>{
  const name=document.getElementById('aName').value,price=parseInt(document.getElementById('aPrice').value),cat=document.getElementById('aCat').value,sizesStr=document.getElementById('aSizes').value;
  const imgs=tempImgs.filter(x=>x);if(!name||!price||imgs.length==0){alert("Need Name, Price, at least 1 pic ♡");return}
  let sizes={};sizesStr.split(',').forEach(p=>{let [k,v]=p.split(':');if(k)sizes[k.trim().toUpperCase()]=parseInt(v)||0});
  products.unshift({id:Date.now(),name,price,cat,images:imgs,sizes,likes:0,ratings:[]});saveP();
  tempImgs=["","","","",""];document.querySelectorAll('.prev').forEach(i=>{i.style.display='none';i.src=''});document.querySelectorAll('.upload-box').forEach(b=>b.classList.remove('has'));
  document.getElementById('aName').value="";document.getElementById('aPrice').value="";document.getElementById('aSizes').value="";
  toast('Published ♡');renderAdminP();
 }
 function renderAdminP(){const box=document.getElementById('adminProducts');if(!box)return;box.innerHTML="";products.forEach(p=>{box.innerHTML+=`<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #ffe4ec"><img src="${p.images[0]}" style="width:44px;height:44px;border-radius:10px;object-fit:cover;border:1.5px solid #111"><span style="flex:1"><b>${p.name}</b> (${p.cat})<br><small>R${p.price} • ${Object.entries(p.sizes).map(([k,v])=>k+':'+v).join(', ')} • ❤️${p.likes} • ★${avg(p.ratings)} • ${p.images.length} pics</small></span><button onclick="deleteProd(${p.id})" style="color:red;border:none;background:none;font-weight:800">🗑️</button></div>`})}
 window.deleteProd=id=>{products=products.filter(x=>x.id!=id);saveP();renderAdminP()}
 function renderAdminO(){const tbody=document.getElementById('adminOrders');if(!tbody)return;const orders=getO();tbody.innerHTML="";orders.forEach(o=>{tbody.innerHTML+=`<tr><td><b>${o.code}</b></td><td>${o.name}</td><td>${o.phone}</td><td>${o.address}<br><small>${o.delivery}</small></td><td>${o.items.map(i=>`${i.name} ${i.size} x${i.qty}`).join('<br>')}</td><td>R${o.total}</td><td><select onchange="changeStatus('${o.code}',this.value)" style="padding:4px;border-radius:999px;border:1.5px solid #111"><option ${o.status=='Pending'?'selected':''}>Pending</option><option ${o.status=='Confirmed'?'selected':''}>Confirmed</option><option ${o.status=='Packed'?'selected':''}>Packed</option><option ${o.status=='Shipped'?'selected':''}>Shipped</option><option ${o.status=='Delivered'?'selected':''}>Delivered</option></select></td><td><select onchange="changeEst('${o.code}',this.value)"><option ${o.est=='2-3 days'?'selected':''}>2-3 days</option><option ${o.est=='1 day'?'selected':''}>1 day</option><option ${o.est=='3-5 days'?'selected':''}>3-5 days</option><option>Delivered</option></select></td><td>${o.date}</td><td><button onclick="deleteOrder('${o.code}')" style="color:red;border:none;background:none">✕</button></td></tr>`})}
 window.changeStatus=(code,val)=>{let os=getO();let o=os.find(x=>x.code==code);if(o){o.status=val;if(val=='Confirmed')o.est='1-2 days';if(val=='Packed')o.est='2 days';if(val=='Shipped')o.est='1 day';if(val=='Delivered')o.est='Delivered';saveO(os);renderAdminO()}}
 window.changeEst=(code,val)=>{let os=getO();let o=os.find(x=>x.code==code);if(o){o.est=val;saveO(os)}}
 window.deleteOrder=code=>{let os=getO().filter(x=>x.code!=code);saveO(os);renderAdminO()}
 if(localStorage.getItem('MT_ADMIN')=='yes'){showAdmin()}
                       }
