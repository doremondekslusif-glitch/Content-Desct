const state={platform:"Instagram",goal:"Jangkauan",focus:"Hook audiens",audience:"Umum",tone:"Natural & santai",files:[],selectedHook:""};
const platformNotes={Instagram:"Sesuaikan rekomendasi dengan karakter Instagram.",TikTok:"Fokus pada hook cepat, retention, dan discovery.",Facebook:"Cocokkan dengan percakapan dan engagement komunitas.",YouTube:"Perkuat judul, hook, dan alasan untuk menonton.",Threads:"Utamakan percakapan dan gaya yang natural.",X:"Buat pembuka singkat yang memancing respons."};
const data={
Instagram:{hook:"Ternyata hal kecil ini bisa bikin rutinitas sehari-hari jadi jauh lebih praktis 👀",caption:"Hal kecil yang ternyata kepakai setiap hari ✨\n\nKalau kamu suka sesuatu yang simpel, praktis, dan tetap enak dilihat, ini bisa jadi salah satu yang wajib masuk daily essentials kamu.\n\nMenurut kamu, bagian paling menarik dari konten ini apa?",hashtags:"#InstagramIndonesia #ContentCreator #LifestyleIndonesia #DailyEssentials #Rekomendasi #ExploreIndonesia",cta:"Kalau kamu suka konten seperti ini, simpan dulu dan kasih tahu pendapatmu di komentar.",tips:["Buat 1–2 detik pertama langsung menampilkan objek atau hasil utama.","Tambahkan teks pendek di video agar pesan tetap terbaca tanpa suara.","Akhiri dengan pertanyaan sederhana untuk mendorong komentar."]},
TikTok:{hook:"POV: kamu baru sadar barang ini ternyata bakal kepakai terus 😳",caption:"POV: awalnya cuma penasaran, akhirnya jadi barang yang selalu dibawa 😭✨\n\nKamu tim bawa barang seperlunya atau tim semua harus ada di tas?",hashtags:"#TikTokIndonesia #FYPIndonesia #KontenIndonesia #Lifestyle #Rekomendasi #Tips",cta:"Kamu tim yang mana? Tulis di komentar 👇",tips:["Tampilkan momen paling menarik sejak frame pertama.","Gunakan teks layar yang singkat dan mudah dipindai.","Jaga tempo video agar tidak terlalu lama sebelum payoff."]},
Facebook:{hook:"Satu hal sederhana yang ternyata bikin aktivitas harian lebih praktis.",caption:"Kadang kita tidak membutuhkan sesuatu yang rumit. Yang penting praktis, berguna, dan benar-benar dipakai setiap hari. ✨\n\nApa barang yang paling sering kamu bawa setiap hari?",hashtags:"#FacebookIndonesia #Lifestyle #Inspirasi #Rekomendasi #DailyLife",cta:"Tag teman yang mungkin suka konten seperti ini.",tips:["Gunakan caption yang terasa seperti percakapan.","Dorong komentar dengan pertanyaan yang relevan.","Pastikan thumbnail langsung menjelaskan isi konten."]},
YouTube:{hook:"Kenapa saya baru menemukan ini sekarang?",caption:"Di video ini kita lihat lebih dekat hal yang kelihatannya sederhana, tapi ternyata cukup berguna untuk rutinitas sehari-hari.\n\nTonton sampai akhir dan lihat apakah ini cocok buat kamu.",hashtags:"#YouTubeIndonesia #ShortsIndonesia #Review #Lifestyle #Tips",cta:"Kalau bermanfaat, subscribe dan cek video berikutnya.",tips:["Pastikan 3 detik pertama menjelaskan alasan untuk menonton.","Gunakan judul yang spesifik, bukan sekadar deskriptif.","Buat thumbnail/frame awal yang mudah dipahami."]},
Threads:{hook:"Ada nggak sih barang kecil yang akhirnya jadi barang wajib?",caption:"Awalnya kupikir biasa saja. Ternyata setelah dipakai beberapa kali, malah jadi salah satu barang yang paling sering dicari. 😅\n\nAda barang seperti itu juga di kamu?",hashtags:"#ThreadsIndonesia #DailyLife #Lifestyle #Cerita",cta:"Ceritakan versi kamu di reply.",tips:["Pertahankan bahasa natural dan personal.","Gunakan pertanyaan terbuka untuk memulai percakapan.","Hindari terlalu banyak hashtag agar terasa organik."]},
X:{hook:"Barang sederhana, tapi ternyata kepakai setiap hari.",caption:"Suka menemukan barang yang awalnya terlihat biasa, tapi setelah dipakai malah jadi daily essential?\n\nIni salah satunya.",hashtags:"#Lifestyle #Rekomendasi #DailyEssentials",cta:"Setuju atau tidak?",tips:["Buat kalimat pertama sepadat mungkin.","Sisakan ruang untuk orang membalas atau quote-post.","Gunakan media sebagai pelengkap pesan, bukan pengganti konteks."]}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$$(".platform").forEach(btn=>btn.addEventListener("click",()=>{state.platform=btn.dataset.platform;$$(".platform").forEach(x=>x.classList.toggle("selected",x===btn));$("#platformNote").textContent=platformNotes[state.platform]}));
$$(".focus").forEach(btn=>btn.addEventListener("click",()=>{state.focus=btn.dataset.focus;$$(".focus").forEach(x=>x.classList.toggle("selected",x===btn))}));
$$(".option").forEach(btn=>btn.addEventListener("click",()=>{const type=btn.dataset.audience!==undefined?"audience":"tone";state[type]=btn.dataset[type];$$(".option").filter(x=>x.dataset[type]!==undefined).forEach(x=>x.classList.toggle("selected",x===btn))}));
function showStep(step){$$(".step").forEach(x=>x.classList.toggle("active",x.dataset.step===String(step)));$("#platformPanel").hidden=step!==1;$("#contentPanel").hidden=step!==2;$("#results").hidden=step!==3;if(step===2)$("#contentPanel").scrollIntoView({behavior:"smooth",block:"start"});if(step===3)$("#results").scrollIntoView({behavior:"smooth",block:"start"})}
$("#nextToContent").addEventListener("click",()=>showStep(2));
$("#backToPlatform").addEventListener("click",()=>showStep(1));
$$(".goal").forEach(btn=>btn.addEventListener("click",()=>{state.goal=btn.dataset.goal;$$(".goal").forEach(x=>x.classList.toggle("selected",x===btn))}));
$("#mediaInput").addEventListener("change",e=>addFiles([...e.target.files]));
function addFiles(files){state.files=[...state.files,...files].slice(0,5);renderPreviews()}
function renderPreviews(){$("#previewList").innerHTML="";state.files.forEach((file,i)=>{const wrap=document.createElement("div");wrap.className="preview";const url=URL.createObjectURL(file);if(file.type.startsWith("video/")){const v=document.createElement("video");v.src=url;v.muted=true;wrap.appendChild(v)}else{const img=document.createElement("img");img.src=url;img.alt="Preview";wrap.appendChild(img)}const b=document.createElement("button");b.className="remove";b.textContent="×";b.onclick=()=>{state.files.splice(i,1);renderPreviews()};wrap.appendChild(b);$("#previewList").appendChild(wrap)})}
const goalText={Jangkauan:"Buat pembuka yang kuat dan mudah ditemukan.",Engagement:"Dorong percakapan dan interaksi.",Penjualan:"Fokus pada manfaat dan alasan membeli.",Followers:"Bangun alasan untuk mengikuti akun.",Branding:"Perkuat karakter dan identitas brand.",Edukasi:"Buat informasi mudah dipahami dan disimpan."};
function getMediaProfile(){
  const images=state.files.filter(f=>f.type.startsWith("image/")).length;
  const videos=state.files.filter(f=>f.type.startsWith("video/")).length;
  if(!state.files.length)return {label:"Belum ada media",insight:"Upload minimal satu foto atau video agar generator dapat menyesuaikan hasil.",analysis:"Belum ada media yang dapat dianalisis.",visual:"Tambahkan media terlebih dahulu."};
  if(images&&videos)return {label:`${images} foto + ${videos} video`,insight:"Konten campuran terdeteksi. Hasil diarahkan agar foto dan video saling melengkapi.",analysis:"Media campuran terdeteksi: foto cocok untuk menonjolkan detail/produk, sedangkan video cocok untuk menunjukkan penggunaan, gerakan, atau proses.",visual:"Foto utama: fokus pada manfaat/objek. Video: tambahkan hook singkat di frame awal."};
  if(images)return {label:`${images} foto`,insight:"Mode foto aktif. Rekomendasi difokuskan pada visual, komposisi, detail objek, dan teks yang cocok ditempatkan pada gambar.",analysis:"Mode foto terdeteksi. Gunakan visual utama sebagai fokus pesan, lalu sesuaikan caption dengan objek, suasana, dan tujuan posting.",visual:"Coba teks pendek 3–7 kata yang langsung menyampaikan manfaat utama."};
  return {label:`${videos} video`,insight:"Mode video aktif. Rekomendasi difokuskan pada hook awal, retention, teks layar, dan CTA.",analysis:"Mode video terdeteksi. Prioritaskan frame pembuka yang kuat, pesan utama yang cepat dipahami, dan payoff sebelum penonton kehilangan perhatian.",visual:"Tambahkan hook 1 kalimat pada 1–2 detik pertama."};
}
const ANALYZER_API_URL=window.CONTENT_DESCT_API_URL||localStorage.getItem("contentDesctApiUrl")||"https://content-desct.vercel.app/api/analyze";

async function fileToDataUrl(file,maxSide=720,quality=.62){
  if(file.type.startsWith("image/")){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>{
        const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",quality));
        URL.revokeObjectURL(img.src);
      };
      img.onerror=reject;
      img.src=URL.createObjectURL(file);
    });
  }
  return null;
}

async function videoToFrames(file,count=4){
  return new Promise((resolve,reject)=>{
    const video=document.createElement("video");
    const url=URL.createObjectURL(file);
    video.preload="metadata";
    video.muted=true;
    video.playsInline=true;
    video.onloadedmetadata=async()=>{
      try{
        const duration=Number.isFinite(video.duration)?video.duration:0;
        const times=duration>0?Array.from({length:count},(_,i)=>duration*(i+.5)/count):[0];
        const frames=[];
        for(const time of times){
          video.currentTime=Math.min(time,Math.max(0,duration-.05));
          await new Promise(res=>{video.onseeked=res});
          const maxSide=640,scale=Math.min(1,maxSide/Math.max(video.videoWidth||1,video.videoHeight||1));
          const canvas=document.createElement("canvas");
          canvas.width=Math.max(1,Math.round((video.videoWidth||640)*scale));
          canvas.height=Math.max(1,Math.round((video.videoHeight||360)*scale));
          canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
          frames.push(canvas.toDataURL("image/jpeg",.55));
        }
        URL.revokeObjectURL(url);
        resolve(frames);
      }catch(err){URL.revokeObjectURL(url);reject(err)}
    };
    video.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Video tidak dapat dibaca browser."))};
    video.src=url;
  });
}

async function buildMediaPayload(){
  const media=[];
  for(const file of state.files){
    if(file.type.startsWith("image/")){
      const data=await fileToDataUrl(file);
      if(data)media.push({type:"image",name:file.name,data});
    }else if(file.type.startsWith("video/")){
      const frames=await videoToFrames(file,2);
      frames.forEach((data,index)=>media.push({type:"video_frame",name:file.name+" · frame "+(index+1),data}));
    }
  }
  return media;
}

function setGenerating(isGenerating){
  const btn=$("#generateBtn");
  btn.disabled=isGenerating;
  btn.innerHTML=isGenerating?"<span>◌</span> AI sedang menganalisis media...":"<span>✦</span> Analisis & Generate";
}

function formatText(text){return String(text||"").replace(/\r\n/g,"\n").replace(/\n{3,}/g,"\n\n").split("\n").map(x=>x.trim()?`<div>${escapeHtml(x.trim())}</div>`:"<div class=\"text-gap\"></div>").join("");}
function escapeHtml(text){const el=document.createElement("div");el.textContent=text;return el.innerHTML;}
function renderAiResult(result){
  const d=data[state.platform],ctx=state.focus,m=getMediaProfile();
  const hooks=result.hook_options||[result.hook||d.hook,"POV: ini mungkin yang sedang kamu cari.","Sederhana, tapi ternyata berguna setiap hari."];const hookBox=$("#hookOptions");hookBox.innerHTML="";hooks.forEach((x,i)=>{const row=document.createElement("button");row.type="button";row.className="hook-option"+(x===state.selectedHook?" selected":"");row.dataset.hookIndex=i;const n=document.createElement("span");n.className="hook-number";n.textContent=(i+1)+".";const t=document.createElement("span");t.className="hook-copy";t.textContent=x;row.append(n,t);row.addEventListener("click",()=>{state.selectedHook=x;$(".hook-option").forEach(el=>el.classList.toggle("selected",el===row));$("#hook").textContent=x;showToast("Hook dipilih ✓")});hookBox.appendChild(row)});const ideas=result.content_ideas||["Buat postingan yang menonjolkan manfaat utama.","Tunjukkan cara penggunaan dalam kehidupan sehari-hari.","Buat perbandingan sebelum dan sesudah menggunakan produk.","Jawab pertanyaan yang paling sering ditanyakan audiens.","Buat versi video pendek dari konten ini."];$("#contentIdeas").innerHTML=ideas.map(x=>"<li>"+x+"</li>").join("");$("#mediaSummary").textContent=m.label;
  $("#mediaInsight").textContent="AI menganalisis isi visual media, lalu menyesuaikan hasil dengan platform dan tujuan konten.";
  $("#mediaAnalysis").textContent=result.media_analysis||m.analysis;
  $("#visualText").textContent=result.visual_text||m.visual;
  $("#hook").textContent=result.hook||d.hook;
  $("#caption").innerHTML=formatText(ctx&&result.caption?result.caption+"\n\nKonteks tambahan: "+ctx:(result.caption||d.caption));
  $("#hashtags").textContent=result.hashtags||d.hashtags;
  $("#cta").textContent=result.cta||d.cta;
  const tips=Array.isArray(result.tips)?result.tips:d.tips;
  $("#tips").innerHTML=tips.map(x=>"<li>"+x+"</li>").join("");
  const score=Number(result.score);
  const safeScore=Number.isFinite(score)?Math.max(0,Math.min(10,score)):(state.files.length?8.9:8.2);
  $("#score").textContent=safeScore.toFixed(1);
  $("#scoreBar").style.width=(safeScore*10)+"%";
  $("#scoreText").textContent=(result.score_reason||goalText[state.goal])+" Hasil ini dibuat dari analisis media yang diunggah.";
  showStep(3);
}

async function generate(){
  const d=data[state.platform],ctx=state.focus,m=getMediaProfile();
  if(!state.files.length){
    $("#mediaSummary").textContent=m.label;
    $("#mediaInsight").textContent=m.insight;
    $("#mediaAnalysis").textContent=m.analysis;
    $("#visualText").textContent=m.visual;
    $("#hook").textContent=d.hook;
    $("#caption").textContent=ctx?d.caption+"\n\nKonteks tambahan: "+ctx:d.caption;
    $("#hashtags").textContent=d.hashtags; $("#cta").textContent=d.cta;
    $("#tips").innerHTML=d.tips.map(x=>"<li>"+x+"</li>").join("");
    $("#score").textContent="8.2"; $("#scoreBar").style.width="82%";
    $("#scoreText").textContent=goalText[state.goal]+" Upload foto atau video untuk analisis AI yang sebenarnya.";
    $("#results").hidden=false; showStep(3); return;
  }
  setGenerating(true);
  try{
    const media=await buildMediaPayload();
    const requestBody=JSON.stringify({platform:state.platform,goal:state.goal,context:ctx,audience:state.audience,tone:state.tone,media});
    if(new Blob([requestBody]).size>4*1024*1024)throw new Error("Media terlalu besar untuk dikirim ke backend. Kurangi jumlah foto/video atau gunakan file yang lebih kecil.");
    const response=await fetch(ANALYZER_API_URL,{
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=UTF-8"},
      body:requestBody
    });
    const raw=await response.text();
    let result={};
    try{result=JSON.parse(raw)}catch{}
    if(!response.ok)throw new Error(result.error||"Server AI mengembalikan error.");
    renderAiResult(result);
  }catch(error){
    console.error(error);
    showToast(error.message||"Analisis AI gagal.");
    $("#mediaInsight").textContent="Analisis AI gagal: "+(error.message||"periksa koneksi backend dan URL API.");
    $("#results").hidden=false;
  }finally{setGenerating(false)}
}
$("#generateBtn").addEventListener("click",generate);$("#regenerateBtn").addEventListener("click",generate);$("#backToContent").addEventListener("click",()=>showStep(2));
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast("Berhasil disalin ✓")}catch(error){showToast("Gagal menyalin, coba lagi.")}}\n$(".copy-btn").forEach(btn=>btn.addEventListener("click",async()=>{await copyText($("#"+btn.dataset.copy).textContent)}));\n$("#copyAllBtn").addEventListener("click",async()=>{const sections=[["Pilihan Hook",$("#hookOptions").textContent],["Analisis media",$("#mediaAnalysis").textContent],["Hook",$("#hook").textContent],["Caption",$("#caption").textContent],["Hashtag",$("#hashtags").textContent],["Ide teks visual",$("#visualText").textContent],["CTA",$("#cta").textContent],["Ide konten berikutnya",$("#contentIdeas").textContent],["Saran optimasi",$("#tips").textContent]];await copyText(sections.map(([title,value])=>title+"\n"+value.trim()).join("\n\n"))});
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
const zone=$("#uploadZone");["dragenter","dragover"].forEach(e=>zone.addEventListener(e,x=>{x.preventDefault();zone.style.borderColor="#9b7cff"}));["dragleave","drop"].forEach(e=>zone.addEventListener(e,x=>{x.preventDefault();zone.style.borderColor=""}));zone.addEventListener("drop",e=>addFiles([...e.dataTransfer.files].filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"))));
// Vercel auto-deploy test
