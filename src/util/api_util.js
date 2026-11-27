export function sendApiQuery(baseUrl, model, apiKey, prompt, imgDataUrl) {
  const headers = { "Content-Type": "application/json" };
  if (apiKey.trim()) {
    headers.Authorization = `Bearer ${apiKey.trim()}`;
  }
  const url = `${baseUrl.trim().replace(/\/+$/, "")}/chat/completions`;
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: model.trim(),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imgDataUrl } },
          ],
        },
      ],
      temperature: 0.7,
      //max_tokens: 1000,
      stream: false,
    }),
  });
}
