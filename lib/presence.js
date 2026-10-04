'use client'

import { supabase } from './supabase'

// Dueño único del canal 'online-users': todo el .on('presence', ...) se
// registra ANTES del único .subscribe() que va a existir para este topic
// en toda la app. Navbar.jsx y AdminDashboard.tsx pasan por acá en vez de
// crear/suscribir su propio canal cada uno (eso es lo que causaba
// "cannot add presence callbacks after subscribe()").
let channel = null
let isSubscribed = false
const stateListeners = new Set()
const pendingTracks = []

function getChannel() {
  if (channel) return channel

  channel = supabase.channel('online-users')

  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    stateListeners.forEach((cb) => cb(state))
  })

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      isSubscribed = true
      const toTrack = pendingTracks.splice(0, pendingTracks.length)
      for (const payload of toTrack) {
        await channel.track(payload)
      }
    }
  })

  return channel
}

// El canal vive mientras dure la pestaña (es un dato global, no algo
// atado al ciclo de vida de un componente puntual), así que a propósito
// no se desuscribe cuando un componente se desmonta.
export function trackOnlineUser(payload) {
  const ch = getChannel()
  if (isSubscribed) {
    ch.track(payload)
  } else {
    pendingTracks.push(payload)
  }
}

// Devuelve una función de cleanup que solo saca ESTE listener local
// (no toca el canal compartido) — segura de llamar en cada
// mount/unmount, incluido el doble-montaje de Strict Mode.
export function subscribeOnlineUsersState(callback) {
  const ch = getChannel()
  stateListeners.add(callback)
  callback(ch.presenceState())
  return () => {
    stateListeners.delete(callback)
  }
}
