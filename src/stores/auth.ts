import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, UserRole } from '@/types/database'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!currentUser.value)
  const isSuperAdmin = computed(() => currentUser.value?.role === 'superadmin')
  const isAdmin = computed(() => 
    ['superadmin', 'campus_admin', 'corp_admin', 'company_admin'].includes(currentUser.value?.role || '')
  )
  const isParticipant = computed(() => currentUser.value?.role === 'participant')
  const fullName = computed(() => 
    currentUser.value ? `${currentUser.value.first_name} ${currentUser.value.last_name}` : ''
  )

  async function loadUser(authId: string) {
    const { data, error: err } = await supabase
      .from('users')
      .select('*, company:companies(*), profile:user_profiles(*)')
      .eq('auth_id', authId)
      .single()
    if (err) throw err
    currentUser.value = data
  }

  async function login(username: string, password: string) {
    loading.value = true; error.value = null
    try {
      const { data: userData, error: userErr } = await supabase
        .from('users').select('email, username, active').eq('username', username).single()
      if (userErr || !userData) throw new Error('Usuario no encontrado')
      if (!userData.active) throw new Error('Usuario inactivo.')
      if (!userData.email) throw new Error('Sin email. Usa magic link.')
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email: userData.email, password })
      if (authErr) throw new Error('Contraseña incorrecta')
      if (data.user) await loadUser(data.user.id)
    } catch (e: unknown) { error.value = e instanceof Error ? e.message : 'Error'; throw e }
    finally { loading.value = false }
  }

  async function loginWithMagicToken(token: string) {
    loading.value = true; error.value = null
    try {
      const { data: userData, error: tokenErr } = await supabase
        .from('users').select('*').eq('magic_token', token)
        .gt('magic_token_expires_at', new Date().toISOString()).single()
      if (tokenErr || !userData) throw new Error('Link inválido o expirado')
      currentUser.value = userData
    } catch (e: unknown) { error.value = e instanceof Error ? e.message : 'Error'; throw e }
    finally { loading.value = false }
  }

  async function logout() { await supabase.auth.signOut(); currentUser.value = null }

  async function init() {
    loading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) await loadUser(session.user.id)
    } finally { loading.value = false }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) await loadUser(session.user.id)
      else if (event === 'SIGNED_OUT') currentUser.value = null
    })
  }

  function hasRole(roles: UserRole[]) { return roles.includes(currentUser.value?.role as UserRole) }

  return { currentUser, loading, error, isAuthenticated, isSuperAdmin, isAdmin, isParticipant, fullName, login, loginWithMagicToken, logout, init, hasRole }
})
