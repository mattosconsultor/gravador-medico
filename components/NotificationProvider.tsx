// ================================================================
// Notification Provider - Context para notificações globais
// ================================================================

'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Notification, NotificationContextValue } from '@/lib/types/notifications'
import { toast } from 'sonner'

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Calcular não lidas
  const unreadCount = notifications.filter(n => !n.read).length

  // Adicionar notificação
  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'created_at' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Toast visual
    const toastTitle = notification.title
    const toastMessage = notification.message

    toast.success(toastTitle, {
      description: toastMessage,
      duration: 5000,
      action: notification.metadata ? {
        label: 'Ver',
        onClick: () => {
          // Redirecionar baseado no tipo
          const meta = notification.metadata
          if (!meta) return
          
          if (notification.type === 'whatsapp_message' && meta.whatsapp_remote_jid) {
            window.location.href = `/admin/whatsapp?chat=${encodeURIComponent(meta.whatsapp_remote_jid)}`
          } else if (notification.type === 'admin_chat_message' && meta.admin_chat_conversation_id) {
            window.location.href = `/admin/chat?conversation=${meta.admin_chat_conversation_id}`
          }
        }
      } : undefined
    })

    // Notificação do navegador (se permitido)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(toastTitle, {
        body: toastMessage,
        icon: notification.metadata?.profile_picture_url || '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id
      })
    }
  }, [])

  // Marcar como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // Limpar todas
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Pedir permissão para notificações do navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
