'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { subscribeOnlineUsersState } from '@/lib/presence'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const REFRESH_MS = 7000

const CHART_TEXT_COLOR = '#d1d5db'
const CHART_GRID_COLOR = 'rgba(255,255,255,0.08)'

const CATALOGO_TEST = [
  { id: 'pack_inicial', label: 'Pack Inicial — $4.99 (100 tokens)' },
  { id: 'pack_pro', label: 'Pack Pro — $9.99 (250 tokens)' },
  { id: 'pase_ilimitado', label: 'Pase Ilimitado — $19.99 (1000 tokens)' },
]

function StatCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-black text-amber-400">{value}</div>
      {sublabel && <div className="text-xs text-gray-500 mt-1">{sublabel}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [financiero, setFinanciero] = useState<any>(null)
  const [usuarios, setUsuarios] = useState<any>(null)
  const [contenido, setContenido] = useState<any>(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [packSeleccionado, setPackSeleccionado] = useState(CATALOGO_TEST[0].id)
  const [generando, setGenerando] = useState(false)
  const [mensajeCompra, setMensajeCompra] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [fRes, uRes, cRes] = await Promise.all([
        fetch('/api/admin/financiero'),
        fetch('/api/admin/usuarios'),
        fetch('/api/admin/contenido'),
      ])

      if (!fRes.ok || !uRes.ok || !cRes.ok) {
        throw new Error('No se pudo cargar alguna de las métricas.')
      }

      setFinanciero(await fRes.json())
      setUsuarios(await uRes.json())
      setContenido(await cRes.json())
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Error cargando el panel.')
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchAll])

  // Presence: cuenta conexiones activas (Navbar.jsx es quien las "trackea").
  // Se conecta al canal compartido vía lib/presence.js en vez de crear/suscribir
  // su propio canal — dos .subscribe() independientes sobre el mismo topic
  // ('online-users') es lo que rompía con "cannot add presence callbacks after subscribe()".
  useEffect(() => {
    const unsubscribe = subscribeOnlineUsersState((state: Record<string, unknown>) => {
      setOnlineCount(Object.keys(state).length)
    })
    return unsubscribe
  }, [])

  const handleGenerarCompra = async () => {
    setGenerando(true)
    setMensajeCompra(null)
    try {
      const res = await fetch('/api/admin/generar-compra-prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: packSeleccionado }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setMensajeCompra(data.error || 'No se pudo generar la compra de prueba.')
      } else {
        setMensajeCompra(`Listo — nuevo balance: ${data.balance} tokens.`)
        fetchAll()
      }
    } catch (err: any) {
      setMensajeCompra('Error de red al generar la compra.')
    } finally {
      setGenerando(false)
    }
  }

  const porPackData = {
    labels: (financiero?.porPack || []).map((p: any) => p.packId),
    datasets: [
      {
        label: 'Ingresos por pack (USD)',
        data: (financiero?.porPack || []).map((p: any) => p.total),
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  }

  const usuariosData = {
    labels: ['Compraron', 'Solo free'],
    datasets: [
      {
        data: [usuarios?.compraron || 0, usuarios?.soloFree || 0],
        backgroundColor: ['rgba(245, 158, 11, 0.7)', 'rgba(107, 114, 128, 0.6)'],
        borderColor: ['rgb(245, 158, 11)', 'rgb(107, 114, 128)'],
        borderWidth: 1,
      },
    ],
  }

  const contenidoData = {
    labels: ['Escenas desbloqueadas (historias)', 'Personajes creados'],
    datasets: [
      {
        label: 'Uso de contenido',
        data: [
          contenido?.consumoHistorias?.escenasDesbloqueadas || 0,
          contenido?.creacionPersonajes?.totalCreados || 0,
        ],
        backgroundColor: ['rgba(244, 63, 94, 0.6)', 'rgba(168, 85, 247, 0.6)'],
        borderColor: ['rgb(244, 63, 94)', 'rgb(168, 85, 247)'],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: CHART_TEXT_COLOR } },
    },
    scales: {
      x: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
      y: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: CHART_TEXT_COLOR } },
    },
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
          Panel de Administración
        </h1>
        <p className="text-xs text-gray-500 mt-1">Se actualiza automáticamente cada {REFRESH_MS / 1000} segundos.</p>
      </header>

      {error && (
        <div className="bg-rose-900/30 border border-rose-700 text-rose-300 text-sm rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Financiero */}
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">💰 Financiero</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total histórico"
            value={financiero ? `$${financiero.totalHistorico.toFixed(2)}` : '—'}
            sublabel={financiero?.currency}
          />
          <StatCard
            label="Total mes actual"
            value={financiero ? `$${financiero.totalMesActual.toFixed(2)}` : '—'}
            sublabel={financiero?.currency}
          />
          <StatCard
            label="Suscripciones activas"
            value={financiero?.suscripcionesActivas ?? 'No disponible'}
            sublabel="Todavía no existe esa tabla"
          />
        </div>

        {financiero?.porPack?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 max-w-xl">
            <Bar data={porPackData} options={chartOptions} />
          </div>
        )}

        <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-5 max-w-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            Generar compra de prueba (solo admin)
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={packSeleccionado}
              onChange={(e) => setPackSeleccionado(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white"
            >
              {CATALOGO_TEST.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <button
              onClick={handleGenerarCompra}
              disabled={generando}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm"
            >
              {generando ? 'Generando...' : 'Generar'}
            </button>
          </div>
          {mensajeCompra && <p className="text-xs text-gray-400 mt-2">{mensajeCompra}</p>}
        </div>
      </section>

      {/* Usuarios */}
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">👥 Usuarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Conectados ahora" value={onlineCount} sublabel="Supabase Realtime Presence" />
          <StatCard label="Registros última semana" value={usuarios?.registrosSemana ?? '—'} />
          <StatCard label="Registros último mes" value={usuarios?.registrosMes ?? '—'} />
        </div>

        {usuarios && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 max-w-sm">
            <Doughnut data={usuariosData} options={doughnutOptions} />
          </div>
        )}
      </section>

      {/* Contenido */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">📚 Contenido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Usuarios consumiendo historias"
            value={contenido?.consumoHistorias?.usuarios ?? '—'}
          />
          <StatCard
            label="Usuarios que crearon personajes"
            value={contenido?.creacionPersonajes?.usuarios ?? '—'}
          />
          <StatCard
            label="Fotos/videos generados"
            value={
              contenido
                ? contenido.generacionesContenido.image + contenido.generacionesContenido.video
                : '—'
            }
            sublabel="Próximamente — feature no implementada aún"
          />
        </div>

        {contenido && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 max-w-xl">
            <Bar data={contenidoData} options={chartOptions} />
          </div>
        )}
      </section>
    </div>
  )
}
