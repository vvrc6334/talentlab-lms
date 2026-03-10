import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, UserCSVRow } from '@/types/database'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(companyId?: string) {
    loading.value = true
    try {
      let query = supabase
        .from('users')
        .select('*, company:companies(name, logo_url), profile:user_profiles(*, job_title:job_titles(name, code))')
        .order('first_name')
      if (companyId) query = query.eq('company_id', companyId)
      const { data, error: err } = await query
      if (err) throw err
      users.value = data || []
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar usuarios'
    } finally { loading.value = false }
  }

  async function createUser(userData: {
    first_name: string; last_name: string; username: string; password: string
    email?: string; phone?: string; rut?: string; company_id?: string; role?: string; avatar_url?: string
  }) {
    let authId: string | undefined
    if (userData.email) {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: userData.email, password: userData.password, email_confirm: true
      })
      if (!authErr && authData.user) authId = authData.user.id
    }
    const { data, error: err } = await supabase.from('users').insert({
      auth_id: authId, first_name: userData.first_name, last_name: userData.last_name,
      username: userData.username, email: userData.email, phone: userData.phone,
      rut: userData.rut, company_id: userData.company_id, role: userData.role || 'participant',
      avatar_url: userData.avatar_url, active: true
    }).select().single()
    if (err) throw err
    return data
  }

  async function importFromCSV(rows: UserCSVRow[], companyId?: string) {
    const results = { success: 0, errors: [] as string[] }
    for (const row of rows) {
      try {
        if (!row.nombre || !row.usuario || !row.contrasena) {
          results.errors.push('Fila inválida: nombre, usuario y contraseña son obligatorios'); continue
        }
        const nameParts = row.nombre.trim().split(' ')
        const firstName = nameParts[0]; const lastName = nameParts.slice(1).join(' ') || '-'
        let resolvedCompanyId = companyId
        if (row.empresa && !companyId) {
          const { data: comp } = await supabase.from('companies').select('id').ilike('name', row.empresa).single()
          if (comp) resolvedCompanyId = comp.id
        }
        const newUser = await createUser({ first_name: firstName, last_name: lastName, username: row.usuario,
          password: row.contrasena, email: row.email, phone: row.celular, rut: row.rut,
          company_id: resolvedCompanyId, role: 'participant' })
        if (row.cargo || row.area || row.jerarquia || row.familia) {
          let matrixCode: string | undefined
          if (row.jerarquia && row.familia) matrixCode = row.jerarquia.toUpperCase() + row.familia.toLowerCase()
          let jobTitleId: string | undefined
          if (row.cargo) {
            const { data: jt } = await supabase.from('job_titles').select('id').ilike('name', row.cargo).single()
            if (jt) jobTitleId = jt.id
          }
          await supabase.from('user_profiles').insert({ user_id: newUser.id, job_title_id: jobTitleId, matrix_code: matrixCode, area: row.area, address: row.direccion })
        }
        if (row.curso && newUser.id) {
          const { data: course } = await supabase.from('courses').select('id').ilike('title', row.curso).single()
          if (course) await supabase.from('enrollments').insert({ user_id: newUser.id, course_id: course.id, company_id: resolvedCompanyId, status: 'active' })
        }
        results.success++
      } catch (e: unknown) {
        results.errors.push('Error en ' + row.usuario + ': ' + (e instanceof Error ? e.message : 'Error'))
      }
    }
    return results
  }

  async function updateUser(id: string, updates: Partial<User>) {
    const { error: err } = await supabase.from('users').update(updates).eq('id', id)
    if (err) throw err
    const idx = users.value.findIndex(u => u.id === id)
    if (idx >= 0) users.value[idx] = { ...users.value[idx], ...updates }
  }

  async function toggleActive(id: string) {
    const user = users.value.find(u => u.id === id)
    if (!user) return
    await updateUser(id, { active: !user.active })
  }

  async function generateMagicToken(userId: string): Promise<string> {
    const token = crypto.randomUUID().replace(/-/g, '')
    const expires = new Date(); expires.setDate(expires.getDate() + 7)
    await supabase.from('users').update({ magic_token: token, magic_token_expires_at: expires.toISOString() }).eq('id', userId)
    return token
  }

  return { users, loading, error, fetchUsers, createUser, importFromCSV, updateUser, toggleActive, generateMagicToken }
})
