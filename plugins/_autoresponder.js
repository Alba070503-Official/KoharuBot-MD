import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI("AIzaSyBL8zt0eSiidVE_C5o3SgyOW3drFgg9gwg")

let handler = async function (m) {
  // Solo privado y no comandos
  if (m.isGroup || m.isBot || m.isCommand || !m.text) return

  const userText = m.text.toLowerCase()
  const nombre = m.pushName || 'Usuario'

  // Respuestas rápidas personalizadas
  const respuestas = {
    hola: `Hola ${nombre} 💖 ¿cómo estás?`,
    'quién es tu creador': 'Fui creado con amor por @Alba070503 💞',
    'quien es tu creador': 'Fui creado con amor por @Alba070503 💞',
    creador: 'Mi creador es @Alba070503, una gran mente detrás de este bot 🤖✨',
    gracias: '¡Siempre para servirte! 😊',
    ayuda: 'Estoy aquí para ayudarte 💡. Pregúntame lo que quieras.',
    adiós: 'Hasta luego 🌸',
  }

  for (const key in respuestas) {
    if (userText.includes(key)) {
      return await m.reply(respuestas[key])
    }
  }

  try {
    await global.loading?.(m, this)

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(userText)
    const response = result.response.text()
    await m.reply(response)
  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al responder tu mensaje.')
  } finally {
    await global.loading?.(m, this, true)
  }
}

handler.all = true
export default handler
