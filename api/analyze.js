// Vercel sync
const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";
const MODEL=process.env.GEMINI_MODEL||"gemini-3-flash-preview";

function cors(res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
}

function cleanJson(text){
  const raw=String(text||"").trim();
  const fenced=raw.replace(/^\s*\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`\s*$/,"").trim();
  const match=fenced.match(/\{[\s\S]*\}/);
  if(!match)throw new Error("AI tidak mengembalikan JSON yang valid.");
  return JSON.parse(match[0]);
}

export default async function handler(req,res){
  cors(res);
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({error:"Method tidak diizinkan."});

  if(!process.env.GEMINI_API_KEY){
    return res.status(500).json({error:"GEMINI_API_KEY belum dipasang di environment backend."});
  }

  try{
    let body=req.body||{};
    if(typeof body==="string"){
      try{body=JSON.parse(body)}catch{body={}}
    }
    const {platform="Instagram",goal="Jangkauan",context="",media=[]}=body;

    if(!Array.isArray(media)||!media.length){
      return res.status(400).json({error:"Tidak ada media untuk dianalisis."});
    }

    if(media.length>20){
      return res.status(400).json({error:"Jumlah frame/media terlalu banyak."});
    }

    const parts=[{
      text:
        "Kamu adalah AI Content Analyst untuk aplikasi Content Desct. Analisis SEMUA visual yang diberikan. "+
        "Untuk frame video, gabungkan informasi antar-frame dan jangan menganggap setiap frame sebagai konten terpisah. "+
        "Jangan mengarang fakta produk, harga, lokasi, nama orang, atau klaim yang tidak terlihat/ditulis pengguna. "+
        "Buat hasil dalam Bahasa Indonesia. Platform: "+platform+". Tujuan: "+goal+". Konteks pengguna: "+(context||"(tidak ada)")+". "+
        "Kembalikan HANYA JSON valid dengan struktur: "+
        '{"score":0-10,"score_reason":"string","media_analysis":"string","hook":"string","caption":"string","hashtags":"string","cta":"string","visual_text":"string","tips":["string","string","string"]}. '+
        "Nilai score berdasarkan kecocokan visual dengan tujuan, kejelasan pesan, dan kesiapan konten; bukan prediksi viral."
    }];

    for(const item of media){
      if(typeof item.data!=="string"||!item.data.startsWith("data:image/"))continue;
      const match=item.data.match(/^data:(image\/[^;]+);base64,(.+)$/s);
      if(!match)continue;
      parts.push({inline_data:{mime_type:match[1],data:match[2]}});
    }

    if(parts.length===1)return res.status(400).json({error:"Media gambar/frame tidak valid."});

    const apiResponse=await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(MODEL)+":generateContent?key="+encodeURIComponent(process.env.GEMINI_API_KEY),
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          contents:[{role:"user",parts}],
          generationConfig:{
            responseMimeType:"application/json",
            maxOutputTokens:1800,
            temperature:0.4
          }
        })
      }
    );

    const data=await apiResponse.json();
    if(!apiResponse.ok){
      return res.status(apiResponse.status).json({error:data?.error?.message||"Gemini API error."});
    }

    const outputText=data?.candidates?.[0]?.content?.parts
      ?.filter(part=>typeof part.text==="string")
      ?.map(part=>part.text)
      ?.join("")||"";

    if(!outputText)return res.status(502).json({error:"Gemini tidak mengembalikan hasil analisis."});

    return res.status(200).json(cleanJson(outputText));
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error.message||"Analisis AI gagal."});
  }
}
