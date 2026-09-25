const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";
const MODEL=process.env.OPENAI_MODEL||"gpt-5.6-luna";

function cors(res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
}

function cleanJson(text){
  const match=String(text||"").match(/\{[\s\S]*\}/);
  if(!match)throw new Error("AI tidak mengembalikan JSON yang valid.");
  return JSON.parse(match[0]);
}

export default async function handler(req,res){
  cors(res);
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({error:"Method tidak diizinkan."});
  if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:"OPENAI_API_KEY belum dipasang di environment backend."});

  try{
    const {platform="Instagram",goal="Jangkauan",context="",media=[]}=req.body||{};
    if(!Array.isArray(media)||!media.length)return res.status(400).json({error:"Tidak ada media untuk dianalisis."});
    if(media.length>20)return res.status(400).json({error:"Jumlah frame/media terlalu banyak."});

    const content=[
      {type:"input_text",text:
        "Kamu adalah AI Content Analyst untuk aplikasi Content Desct. Analisis SEMUA visual yang diberikan. "+
        "Untuk frame video, gabungkan informasi antar-frame dan jangan menganggap setiap frame sebagai konten terpisah. "+
        "Jangan mengarang fakta produk, harga, lokasi, nama orang, atau klaim yang tidak terlihat/ditulis pengguna. "+
        "Buat hasil dalam Bahasa Indonesia. Platform: "+platform+". Tujuan: "+goal+". Konteks pengguna: "+(context||"(tidak ada)")+". "+
        "Kembalikan HANYA JSON valid dengan struktur: "+
        '{"score":0-10,"score_reason":"string","media_analysis":"string","hook":"string","caption":"string","hashtags":"string","cta":"string","visual_text":"string","tips":["string","string","string"]}. '+
        "Nilai score berdasarkan kecocokan visual dengan tujuan, kejelasan pesan, dan kesiapan konten; bukan prediksi viral."
      }
    ];

    for(const item of media){
      if(typeof item.data!=="string"||!item.data.startsWith("data:image/"))continue;
      content.push({type:"input_image",image_url:item.data,detail:"low"});
    }

    if(content.length===1)return res.status(400).json({error:"Media gambar/frame tidak valid."});

    const apiResponse=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+process.env.OPENAI_API_KEY,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:MODEL,
        input:[{role:"user",content}],
        max_output_tokens:1800
      })
    });

    const data=await apiResponse.json();
    if(!apiResponse.ok)return res.status(apiResponse.status).json({error:data?.error?.message||"OpenAI API error."});

    const outputText=data.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text||data.output_text||"";
    const result=cleanJson(outputText);
    return res.status(200).json(result);
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error.message||"Analisis AI gagal."});
  }
}
