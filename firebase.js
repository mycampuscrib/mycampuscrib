<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCC - Add Hostel</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
<style>body{font-family:Poppins,sans-serif;background:#FFFBF5}.playfair{font-family:Playfair Display,serif}</style>
</head>
<body class="p-4">
<div class="max-w-2xl mx-auto">

<div class="bg-white rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#F6F1E8]">
<div class="flex justify-between items-center mb-6">
<p class="font-bold text-sm">Hostel Details</p>
<a href="manager-dashboard.html" class="text-[11px] bg-[#FFFBF5] border px-4 py-2 rounded-full">Dashboard</a>
</div>

<input id="hname" placeholder="Hostel Name - e.g. Theo Hostel" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm bg-[#FFFBF5]">
<input id="location" placeholder="Location - e.g. Amamoma" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm bg-[#FFFBF5]">
<input id="price" placeholder="Price per year - e.g. 3000" type="number" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm bg-[#FFFBF5]">
<input id="beds" placeholder="Beds available" type="number" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm bg-[#FFFBF5]">
<select id="type" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm bg-[#FFFBF5]">
<option value="Single Room">Single Room</option>
<option value="Self Contain">Self Contain</option>
<option value="2 in 1">2 in 1</option>
<option value="3 in 1">3 in 1</option>
<option value="4 in 1">4 in 1</option>
</select>
<textarea id="desc" placeholder="Description..." class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm h-20 bg-[#FFFBF5]"></textarea>

<label class="text-[11px] font-bold">WhatsApp Number</label>
<input id="managerPhone" placeholder="233XXXXXXXXX" class="w-full p-3.5 border border-[#F2E8D5] rounded-xl mb-3 text-sm mt-1 bg-[#FFFBF5]">

<label class="text-[11px] font-bold mb-1 block">Hostel Images (4 images max)</label>
<div class="border-2 border-dashed border-[#F2E8D5] rounded-xl p-4 mb-4 bg-[#FFFBF5]">
<input id="images" type="file" multiple accept="image/*" class="w-full text-xs">
</div>

<button id="uploadBtn" onclick="uploadHostel()" class="w-full bg-[#0f172a] text-white p-4 rounded-full font-bold shadow">Upload for Approval</button>
<p id="msg" class="text-xs text-center mt-3"></p>
</div>
</div>

<script type="module">
import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function compressToBase64(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if(w>h){ if(w>MAX){ h*=MAX/w; w=MAX; } } else { if(h>MAX){ w*=MAX/h; h=MAX; } }
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',0.4));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.uploadHostel = async function(){
  const cur = JSON.parse(localStorage.getItem('mcc_current_manager')||'null');
  if(!cur){ alert("Login first"); location.href="manager-login.html"; return; }
  const btn=document.getElementById('uploadBtn');
  const msg=document.getElementById('msg');
  btn.disabled=true; btn.innerText="Uploading..."; msg.innerText="Uploading...";
  msg.style.color="black";
  try{
    const name=document.getElementById('hname').value.trim();
    const locationVal=document.getElementById('location').value.trim();
    const price=document.getElementById('price').value.trim();
    let phoneRaw=document.getElementById('managerPhone').value.trim()||cur.phone||"";
    let cleanPhone = phoneRaw.replace(/\D/g,'');
    if(cleanPhone.startsWith('0')) cleanPhone = '233'+cleanPhone.substring(1);
    if(!cleanPhone.startsWith('233') && cleanPhone.length==10) cleanPhone = '233'+cleanPhone.substring(1);
    
    if(!name||!locationVal||!price) throw new Error("Fill name, location, price");
    if(!cleanPhone) throw new Error("Enter WhatsApp number");
    const files=document.getElementById('images').files;
    if(files.length===0) throw new Error("Select at least 1 image");
    if(files.length>4) throw new Error("Max 4 images");
    
    let imageUrls=[];
    for(let i=0;i<files.length;i++){
      const base64 = await compressToBase64(files[i]);
      imageUrls.push(base64);
    }
    
    await addDoc(collection(db,"hostels"),{
      name, location:locationVal, price:Number(price),
      beds:Number(document.getElementById('beds').value)||1,
      type:document.getElementById('type').value,
      description:document.getElementById('desc').value.trim(),
      managerPhone:cleanPhone,
      managerEmail:cur.email, managerName:cur.name,
      images:imageUrls, videoUrl:"",
      status:"pending",
      views:0, inquiries:0,
      createdAt:serverTimestamp()
    });
    msg.style.color="green"; msg.innerText="✅ Sent for Approval!";
    btn.innerText="Done!";
    setTimeout(()=>location.href="manager-dashboard.html",1500);
  }catch(e){
    msg.style.color="red"; msg.innerText="Error: "+e.message;
    btn.disabled=false; btn.innerText="Upload for Approval";
  }
}
</script>
</body>
</html>