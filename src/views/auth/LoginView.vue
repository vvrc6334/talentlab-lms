<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand-logo">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="#1847F5"/><path d="M10 26V14l8-6 8 6v12H22v-7h-4v7H10z" fill="white"/></svg>
        <span>TalentLab</span>
      </div>
      <div class="login-card">
        <h1>Bienvenido</h1>
        <p class="subtitle">Ingresa con tu usuario y contraseña</p>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group"><label>Usuario</label>
            <input v-model="username" class="input" type="text" placeholder="tu.usuario" required />
          </div>
          <div class="input-group"><label>Contraseña</label>
            <input v-model="password" class="input" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required />
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-full btn-lg" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
        <p class="text-sm text-muted" style="margin-top:20px;text-align:center">¿Recibiste un link por WhatsApp? Haz clic en él para acceder directamente.</p>
      </div>
      <p style="color:#94A3B8;font-size:12px">© 2025 Plan Humano · TalentLab LMS</p>
    </div>
    <div class="login-right">
      <h2>Aprende a tu ritmo,<br/>crece sin límites.</h2>
      <p>Cursos, evaluaciones y certificados desde cualquier lugar.</p>
      <div class="stats-row">
        <div class="stat"><span class="stat-n">100%</span><span class="stat-l">Online</span></div>
        <div class="stat"><span class="stat-n">∞</span><span class="stat-l">Cursos</span></div>
        <div class="stat"><span class="stat-n">24/7</span><span class="stat-l">Disponible</span></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(); const router = useRouter(); const route = useRoute()
const username = ref(''); const password = ref(''); const showPass = ref(false)
const loading = ref(false); const error = ref('')
async function handleLogin() {
  loading.value = true; error.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push((route.query.redirect as string) || (auth.isAdmin ? '/admin' : '/'))
  } catch (e: unknown) { error.value = e instanceof Error ? e.message : 'Error al iniciar sesión' }
  finally { loading.value = false }
}
</script>
<style scoped>
.login-page { display:grid;grid-template-columns:1fr 1fr;min-height:100vh; }
.login-left { display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px;background:white;gap:32px; }
.brand-logo { display:flex;align-items:center;gap:10px;font-family:var(--font-heading);font-size:22px;font-weight:700;color:#0F1B4C; }
.login-card { width:100%;max-width:400px; }
.login-card h1 { font-size:28px;color:#0F1B4C;margin-bottom:8px; }
.subtitle { color:#64748B;margin-bottom:28px; }
.login-form { display:flex;flex-direction:column;gap:18px; }
.error-msg { background:#FEE2E2;color:#DC2626;padding:10px 14px;border-radius:6px;font-size:13px; }
.login-right { background:linear-gradient(135deg,#0F1B4C,#1847F5);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px;color:white; }
.login-right h2 { font-family:var(--font-heading);font-size:36px;line-height:1.2;margin-bottom:20px; }
.login-right p { opacity:.8;font-size:16px;margin-bottom:40px; }
.stats-row { display:flex;gap:40px; }
.stat { display:flex;flex-direction:column;gap:4px; }
.stat-n { font-family:var(--font-heading);font-size:28px;font-weight:700;color:#00C896; }
.stat-l { font-size:12px;opacity:.7; }
@media(max-width:768px){.login-page{grid-template-columns:1fr}.login-right{display:none}.login-left{padding:24px;}}
</style>
