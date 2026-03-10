<template>
  <div class="fade-in">
    <div class="flex items-center gap-3 mb-4"><router-link to="/admin/usuarios" class="btn btn-ghost btn-sm">← Volver</router-link><h1>Nuevo usuario</h1></div>
    <div class="card" style="max-width:560px">
      <form @submit.prevent="submit" style="display:flex;flex-direction:column;gap:18px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="input-group"><label>Nombre *</label><input v-model="f.first_name" class="input" required placeholder="Juan" /></div>
          <div class="input-group"><label>Apellido *</label><input v-model="f.last_name" class="input" required placeholder="Pérez" /></div>
        </div>
        <div class="input-group"><label>Usuario *</label><input v-model="f.username" class="input" required placeholder="jperez" /></div>
        <div class="input-group"><label>Contraseña *</label><input v-model="f.password" class="input" type="password" required /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="input-group"><label>Email</label><input v-model="f.email" class="input" type="email" /></div>
          <div class="input-group"><label>Celular</label><input v-model="f.phone" class="input" /></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="input-group"><label>RUT</label><input v-model="f.rut" class="input" /></div>
          <div class="input-group"><label>Rol</label><select v-model="f.role" class="input"><option value="participant">Participante</option><option value="company_admin">Admin empresa</option><option value="campus_admin">Admin campus</option></select></div>
        </div>
        <div v-if="error" style="background:#FEE2E2;color:#DC2626;padding:10px;border-radius:6px;font-size:13px">{{ error }}</div>
        <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading?'Creando...':'Crear usuario' }}</button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router'; import { useUsersStore } from '@/stores/users'
const store = useUsersStore(); const router = useRouter()
const loading = ref(false); const error = ref('')
const f = ref({ first_name:'',last_name:'',username:'',password:'',email:'',phone:'',rut:'',role:'participant' })
async function submit() {
  loading.value=true;error.value=''
  try { await store.createUser(f.value); router.push('/admin/usuarios') }
  catch(e:unknown){error.value=e instanceof Error?e.message:'Error'}
  finally{loading.value=false}
}
</script>
