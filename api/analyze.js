const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";
const DEFAULT_MODELS=[process.env.GEMINI_MODEL||"gemini-3.8-flash","gemini-3.5-flash-lite","gemini-3.8-flash"].filter(function(x,i,a){return x&&a.indexOf(x)===i});

const RESPONSE_SCHEMA={
  type:"object",
  properties:{
    score:{type:"number"},
    score_reason:{type:"string"},
    score_breakdown:{
      type:"object",
      properties:{
        visual:{type:"number"},
        message:{type:"number"},
        platform:{type:"number"},
        audience:{type:"number"}
      },
      required:["visual","message","platform","audience"]
    },
    media_analysis:{type:"string"},
    visual_summary:{type:"string"},
    visual_strengths:{type:"array",items:{type:"string"}},
    visual_weaknesses:{type:"array",items:{type:"string"}},
    audience_fit:{type:"string"},
    platform_strategy:{type:"string"},
    platform_tips:{type:"array",items:{type:"string"}},
    style_variations:{type:"array",items:{type:"object",properties:{style:{type:"string"},hook:{type:"string"},caption:{type:"string"},cta:{type:"string"},hashtags:{type:"string"}},required:["style","hook","caption","cta","hashtags"]}},
    content_mode:{type:"string"},
    hook:{type:"string"},
    hook_usage:{type:"string"},
    hook_options:{type:"array",items:{type:"string"}},
    video_hook:{type:"string"},
    voiceover:{type:"string"},
    video_structure:{type:"array",items:{type:"string"}},
    on_screen_text:{type:"array",items:{type:"string"}},
    photo_strategy:{type:"string"},
    caption:{type:"string"},
    hashtags:{type:"string"},
    cta:{type:"string"},
    visual_text:{type:"string"},
    content_ideas:{type:"array",items:{type:"string"}},
    tips:{type:"array",items:{type:"string"}}
  },
  required:["score","score_reason","score_breakdown","media_analysis","visual_summary","visual_strengths","visual_weaknesses","audience_fit","platform_strategy","platform_tips","style_variations","content_mode","hook","hook_usage","hook_options","video_hook","voiceover","video_structure","on_screen_text","photo_strategy","caption","hashtags","cta","visual_text","content_ideas","tips"]
};

function cors(res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
}

function cleanJson(text){
  var raw=String(text||"").trim();
  var fenced=raw.replace(/^\s*\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`\s*$/,"").trim();
  var match=fenced.match(/\{[\s\S]*\}/);
  if(!match)throw new Error("AI tidak mengembalikan JSON yang valid.");
  return JSON.parse(match[0]);
}

function buildPrompt(o){
  return "Kamu adalah Content Desct AI Analyst. Pahami media terlebih dahulu, baru buat strategi konten. Jangan sekadar mengisi template.\n\n"+
    "PROSES ANALISIS:\n"+
    "1. Amati semua foto/frame video dan catat objek, orang, teks, suasana, komposisi, aksi, dan konteks yang benar-benar terlihat.\n"+
    "2. Bedakan fakta visual dari dugaan. Jangan mengarang harga, merek, spesifikasi, lokasi, identitas, manfaat, atau klaim produk.\n"+
    "3. Tentukan pesan utama yang paling didukung oleh media.\n"+
    "4. Temukan kekuatan dan kelemahan visual terhadap tujuan konten.\n"+
    "5. Sesuaikan strategi dengan platform, tujuan, fokus, audiens, dan gaya bahasa.\n"+
    "6. Buat copy yang spesifik terhadap media, bukan kalimat generik yang bisa dipakai untuk gambar apa pun.\n"+
    "7. Tentukan mode konten: FOTO jika semua media adalah foto; VIDEO jika ada video/frame video; CAMPURAN jika keduanya ada.\n"+
    "8. Untuk FOTO: hook adalah kalimat pembuka caption. Caption boleh lebih informatif.\n"+
    "9. Untuk VIDEO: hook utama dipakai pada 1–3 detik pertama sebagai voice-over atau teks layar. Caption harus singkat karena informasi utama disampaikan oleh video.\n"+
    "10. Untuk VIDEO, isi video_hook dan voiceover dengan kalimat natural; boleh sama jika paling sesuai.\n"+
    "11. Untuk CAMPURAN, prioritaskan strategi video bila ada video.\n"+
    "12. Untuk visual_details, jelaskan subjek, setting, komposisi, warna, teks yang benar-benar terbaca, aksi/penggunaan yang terlihat, dan mood visual. Jika sesuatu tidak terlihat jelas, tulis bahwa tidak terlihat jelas; jangan menebak.\n"+
    "13. Lakukan pemeriksaan akhir agar semua output konsisten dengan bukti visual dan pilihan pengguna.\n"+
    "14. Sesuaikan format dan gaya output secara spesifik dengan platform yang dipilih. Instagram: visual-first, hook singkat, caption ringkas-menengah, CTA interaksi/simpan. TikTok: hook sangat cepat, bahasa native video pendek, retention dan payoff. Facebook: konteks lebih jelas, conversational, dorong komentar/share. YouTube: kuatkan alasan menonton, judul/thumbnail logic, dan struktur yang menjaga retention; untuk Shorts tetap cepat. Threads: utamakan percakapan, opini/cerita natural, hashtag minimal. X: kalimat pembuka padat, mudah dibalas/di-quote, media sebagai pendukung. Jangan mengklaim aturan algoritma yang pasti.\n"+
    "15. Isi platform_strategy dengan arahan praktis untuk platform yang dipilih dan platform_tips dengan 3 tips yang benar-benar spesifik terhadap platform tersebut.\n"+
    "16. Buat style_variations berisi tepat 3 versi yang benar-benar berbeda: Natural & santai, Persuasif, dan Storytelling. Jangan hanya mengganti satu-dua kata. Ubah sudut pembuka, susunan caption, cara menyampaikan manfaat, dan CTA pada tiap versi, tetapi pertahankan fakta yang terlihat di media. Setiap versi wajib memiliki style, hook, caption, cta, dan hashtags.\n"+
    "17. Setiap generate ulang harus menghasilkan pendekatan baru. Gunakan variationToken sebagai sinyal variasi. Jangan menyalin hook, caption, CTA, atau susunan kalimat dari hasil sebelumnya jika tidak diperlukan oleh fakta media.\n\n"+
    "KONTEKS:\n"+
    "Platform: "+o.platform+"\n"+
    "Tujuan: "+o.goal+"\n"+
    "Fokus: "+(o.context||"(tidak ada)")+"\n"+
    "Target audiens: "+o.audience+"\n"+
    "Gaya bahasa: "+o.tone+"\n"+
    "Mode media: "+o.contentMode+"\n"+
    "Variation token: "+(o.variationToken||"baru")+"\n\n"+
    "ATURAN KUALITAS:\n"+
    "- Gunakan Bahasa Indonesia natural dan konkret.\n"+
    "- Jangan menjanjikan viral, trending, pasti laku, atau performa tertentu.\n"+
    "- Buat tepat 3 hook_options dengan pendekatan berbeda: curiosity, benefit, dan relatable/story. Hook utama juga harus spesifik terhadap media.\n"+
    "- Hook harus cocok dengan mode media: caption untuk foto; voice-over/teks awal untuk video.\n"+
    "- Caption harus sesuai platform dan tujuan. Untuk video, buat caption ringkas dan tidak mengulang penjelasan panjang.\n"+
    "- Hashtag hanya yang relevan dengan isi media dan konteks.\n"+
    "- CTA harus sesuai tujuan; jangan selalu mengarah ke pembelian.\n"+
    "- Ide konten berikutnya harus berasal dari media yang dianalisis.\n"+
    "- visual_text wajib berasal dari media yang benar-benar terlihat: jika ada teks pada gambar/video, gunakan atau adaptasi teks yang terbaca; jika tidak ada teks yang layak, buat overlay singkat yang relevan dengan objek atau adegan yang terlihat. Jangan memakai kalimat generik yang tidak terkait media.\n"+
    "- Skor adalah kesiapan dan kecocokan konten, bukan prediksi viral.\n\n"+
    "Kembalikan HANYA JSON sesuai schema.";
}

function buildParts(o){
  var parts=[{text:buildPrompt(o)}];
  for(var i=0;i<o.media.length;i++){
    var item=o.media[i];
    if(!item||typeof item.data!=="string")continue;
    var m=item.data.match(/^data:(image\/[^;]+);base64,(.+)$/s);
    if(m){
      parts.push({text:"Media "+(i+1)+": "+(item.name||item.type||"visual")});
      parts.push({inline_data:{mime_type:m[1],data:m[2]}});
    }
  }
  return parts;
}

async function callGemini(model,parts){
  var response=await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent?key="+encodeURIComponent(process.env.GEMINI_API_KEY),
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{role:"user",parts:parts}],
        generationConfig:{
          responseMimeType:"application/json",
          responseSchema:RESPONSE_SCHEMA,
          thinkingConfig:{thinkingLevel:"medium"},
          temperature:0.9,
          topP:0.95,
          maxOutputTokens:5000
        }
      })
    }
  );
  var data=await response.json().catch(function(){return{}});
  if(!response.ok)throw new Error(((data&&data.error&&data.error.message)||"Gemini API error.")+" [model: "+model+"]");
  var outputText=data&&data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts?
    data.candidates[0].content.parts.filter(function(p){return typeof p.text==="string"}).map(function(p){return p.text}).join(""):"";
  if(!outputText)throw new Error("Gemini tidak mengembalikan hasil analisis. [model: "+model+"]");
  return cleanJson(outputText);
}

export default async function handler(req,res){
  cors(res);
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({error:"Method tidak diizinkan."});
  if(!process.env.GEMINI_API_KEY)return res.status(500).json({error:"GEMINI_API_KEY belum dipasang di environment backend."});
  try{
    var body=req.body||{};
    if(typeof body==="string"){try{body=JSON.parse(body)}catch(e){body={}}}
    var platform=body.platform||"Instagram";
    var goal=body.goal||"Jangkauan";
    var context=body.context||"";
    var audience=body.audience||"Umum";
    var tone=body.tone||"Natural & santai";
    var variationToken=body.variationToken||"";
    var contentMode=body.contentMode||"FOTO";
    var media=body.media||[];
    if(!Array.isArray(media)||!media.length)return res.status(400).json({error:"Tidak ada media untuk dianalisis."});
    if(media.length>20)return res.status(400).json({error:"Jumlah frame/media terlalu banyak."});
    var parts=buildParts({platform:platform,goal:goal,context:context,audience:audience,tone:tone,contentMode:contentMode,variationToken:variationToken,media:media});
    if(parts.length===1)return res.status(400).json({error:"Media gambar/frame tidak valid."});
    var lastError=null;
    for(var j=0;j<DEFAULT_MODELS.length;j++){
      try{return res.status(200).json(await callGemini(DEFAULT_MODELS[j],parts))}
      catch(error){lastError=error;console.error("Gemini model failed:",DEFAULT_MODELS[j],error.message)}
    }
    return res.status(503).json({error:lastError?lastError.message:"Semua model AI tidak tersedia saat ini."});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error.message||"Analisis AI gagal."});
  }
}
