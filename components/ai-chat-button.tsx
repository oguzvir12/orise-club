'use client'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!msg.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (e) {
      setResponse("Bir hata oluştu ama admin'e ilettim, merak etme!")
    } finally {
      setLoading(false)
      setMsg('')
    }
  }

  return (
    <>
      {/* SOL ALTA KONUMLANDIRILDI (left-6) - Yazıları ve sepeti kapatmaz */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 left-6 z-[90] h-14 w-14 rounded-full bg-primary text-black shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        aria-label="ORISE AI Buddy Destek"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[90] w-80 h-96 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-xs font-bold text-primary uppercase">ORISE AI Buddy 🤖</span>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white text-xs">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-white space-y-2 p-2">
            {!response && <p className="text-zinc-500">Selam! Kulüp hakkında neyi merak ediyorsun?</p>}
            {response && <p className="bg-zinc-900 p-3 rounded-xl leading-relaxed">{response}</p>}
          </div>
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <input 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-black rounded-full px-3 py-2 text-xs text-white focus:outline-none border border-white/10" 
              placeholder="Soru sor..." 
            />
            <button onClick={sendMessage} className="bg-primary p-2.5 rounded-full text-black hover:opacity-90 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
