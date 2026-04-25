export async function handler(event) {
  try {
    // ambil data dari frontend
    const { message, image } = JSON.parse(event.body);

    // payload ke Gemini
    const payload = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    // kalau ada gambar
    if (image) {
      payload.contents[0].parts.push({
        inlineData: {
          mimeType: "image/png",
          data: image
        }
      });
    }

    // request ke API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // ambil hasil
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ AI gak kasih jawaban";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
  }
