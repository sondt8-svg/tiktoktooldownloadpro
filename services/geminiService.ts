
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getVideoIntelligence = async (title: string, author: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dựa trên video TikTok có tiêu đề: "${title}" của tác giả "${author}". 
      Hãy phân tích và trả về định dạng JSON:
      1. tags: mảng 3-5 hashtag liên quan (tiếng Việt).
      2. viralScore: điểm số từ 0-100 dựa trên mức độ hấp dẫn của tiêu đề.
      3. summary: một câu tóm tắt ngắn gọn phong cách chuyên gia phân tích dữ liệu.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            viralScore: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["tags", "viralScore", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Intel Error:", error);
    return null;
  }
};

export const getAssistantResponse = async (history: {role: string, content: string}[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Bạn là "FlowAI", một trợ lý tải video công nghệ cao. Bạn giúp người dùng hiểu cách tải video TikTok, giải thích các chi tiết kỹ thuật về mã hóa video và cung cấp các sự thật thú vị về xu hướng TikTok. Luôn sử dụng tiếng Việt 100%. Giữ tông giọng hiện đại, súc tích và hữu ích. Sử dụng markdown để định dạng văn bản.',
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
