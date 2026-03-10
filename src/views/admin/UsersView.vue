<template>
  <div class="fade-in">
    <div class="flex justify-between items-center mb-4">
      <div><h1>Usuarios</h1><p class="text-muted text-sm">{{ usersStore.users.length }} usuarios</p></div>
      <div class="flex gap-2">
        <router-link to="/admin/usuarios/importar" class="btn btn-secondary">📥 Importar CSV</router-link>
        <router-link to="/admin/usuarios/nuevo" class="btn btn-primary">+ Nuevo usuario</router-link>
      </div>
    </div>
    <div class="card mb-4">
      <div class="flex gap-2">
        <input v-model="search" class="input" placeholder="🔍 Buscar..." style="max-width:300px" />
        <select v-model="filterRole" class="input" style="max-width:160px">
          <option value="">Todos los roles</option>
          <option value="participant">Participantes</option>
          <option value="company_admin">Admin empresa</option>
        </select>
      </div>
    </div>
    <div class="table-wrapper card" style="padding:0">
      <table>
        <thead><tr><th>Usuario</th><th>Empresa</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id">
            <td><div class="flex gap-2 items-center"><div class="ua">{{ u.first_name[0] }}{{ u.last_name[0] }}</div><div><b>{{ u.first_name }} {{ u.last_name }}</b><br/><small class="text-muted">@{{ u.username }}</small></div></div></td>
            <td>{{ u.company?.name || '—' }}</td>
            <td><span :class="['badge',roleBadge(u.role)]">{{ roleLabel(u.role) }}</span></td>
            <td><span :class="['badge',u.active?'badge-green':'badge-red']">{{ u.active?'Activo':'Inactivo' }}</span></td>
            <td><button class="btn btn-ghost btn-sm" @click="getMagicLink(u.id)">🔗</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="magicModal" class="modal-overlay" @click.self="magicModal=false">
      <div class="card" style="max-width:480px;width:90%">
        <h3>Magic Link (7 días)</h3>
        <div style="background:#F4F6FB;padding:12px;border-radius:6px;font-family:monospace;font-size:12px;word-break:break-all;margin:12px 0">{{ magicUrl }}</div>
        <div class="flex gap-2"><button class="btn btn-primary" @click="copy">📋 Copiar</button><button class="btn btn-ghost" @click="magicModal=false">Cerrar</button></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
const search = ref(''); const filterRole = ref(''); const magicModal = ref(false); const magicUrl = ref('')
onMounted(() => usersStore.fetchUsers())
const filtered = computed(() => usersStore.users.filter(u => {
  const s = search.value.toLowerCase()
  return (!s || `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(s)) &&
    (!filterRole.value || u.role === filterRole.value)
}))
const roleLabel = (r:string) => ({superadmin:'Super Admin',campus_admin:'Campus',company_admin:'Admin',participant:'Participante'}[r]||r)
const roleBadge = (r:string) => ({superadmin:'badge-red',campus_admin:'badge-orange',company_admin:'badge-blue',participant:'badge-gray'}[r]||'badge-gray')
async function getMagicLink(id:string) { const t = await usersStore.generateMagicToken(id); magicUrl.value = `${location.origin}/magic/${t}`; magicModal.value = true }
function copy() { navigator.clipboard.writeText(magicUrl.value); alert('¡Copiado!') }
</script>
<style scoped>
.ua { width:32px;height:32px;background:#EEF1FE;color:#1847F5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0 }
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:200 }
</style>
