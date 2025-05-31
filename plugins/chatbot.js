import fetch from 'node-fetch'

const respuestasPersonalizadas = {
  hola: (nombre) => `Hola ${nombre} 💖 ¿cómo estás?`,
  'quién es tu creador': () => 'Fui creado con amor por @Alba070503 💞',
  'quien es tu creador': () => 'Fui creado con amor por @Alba070503 💞',
  creador: () => 'Mi creador es @Alba070503, una gran mente detrás de este bot 🤖✨',
  gracias: () => '¡Siempre para servirte! 😊',
  ayuda: () => 'Estoy aquí para ayudarte 💡. Pregúntame lo que quieras.',
  adiós: () => 'Hasta luego 🌸'
}

const API_URL = 'https://api.neoxr.eu/api/gpt4-session'
const API_KEY = 'russellxz'
const SESSION_ID = '1727468410446638'

let handler = async function (m, { conn }) {
  if (m.isGroup || !m.text || m.fromMe) return // Solo privado, no de bot, no grupos

  const userText = m.text.toLowerCase()
  const nombre = m.pushName || 'Usuario'
  const userId = m.sender

  // Respuestas personalizadas
  for (const key in respuestasPersonalizadas) {
    if (userText.includes(key)) {
      return await conn.sendMessage(m.chat, {
        text: respuestasPersonalizadas[key](nombre)
      }, { quoted: m })
    }
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '💬', key: m.key } })

    const res = await fetch(`${API_URL}?q=${encodeURIComponent(userText)}&session=${SESSION_ID}&apikey=${API_KEY}`)
    const data = await res.json()

    if (!data?.status || !data?.data?.message) throw new Error("No se obtuvo respuesta del GPT-4")

    const respuestaGPT = data.data.message

    await conn.sendMessage(m.chat, {
      text: `✨ *GPT-4 responde a @${userId.replace(/[^0-9]/g, "")}:*\n\n${respuestaGPT}\n\n🔹 *Soy un bot creado con cariño por @Alba070503* 🤖`,
      mentions: [userId]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error('❌ Error en autoGPT:', err.message)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al obtener respuesta:*\n_${err.message}_`
    }, { quoted: m })
  }
}

handler.all = true
export default handler
