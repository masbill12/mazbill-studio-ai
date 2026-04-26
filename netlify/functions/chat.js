export async function handler(event) {
  try {
    const { message, image } = JSON.parse(event.body);

    const payload = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    if (image) {
      payload.contents[0].parts.push({
        inlineData: {
          mimeType: "image/png",
          data: image
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // 🔥 HANDLE ERROR API
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data
        })
      };
    }

    // 🔥 PARSING YANG BENAR
    let reply = "⚠️ AI gak kasih jawaban";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      reply = parts.map(p => p.text || "").join("");
    }

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
