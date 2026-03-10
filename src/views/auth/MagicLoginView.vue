<template>
  <div class="magic-page">
    <div class="magic-card">
      <h2>TalentLab</h2>
      <div v-if="loading"><div class="spinner"></div><p>Verificando acceso...</p></div>
      <div v-else-if="error"><p>⚠️ {{ error }}</p><router-link to="/login">Ir al login</router-link></div>
      <div v-else><p>✅ ¡Bienvenido! Ingresando...</p></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const route = useRoute(); const router = useRouter(); const auth = useAuthStore()
const loading = ref(true); const error = ref('')
onMounted(async () => {
  try { await auth.loginWithMagicToken(route.params.token as string); setTimeout(() => router.push('/'), 1500) }
  catch (e: unknown) { error.value = e instanceof Error ? e.message : 'Link inválido' }
  finally { loading.value = false }
})
</script>
<style scoped>
.magic-page { min-height:100vh;background:linear-gradient(135deg,#0F1B4C,#1847F5);display:flex;align-items:center;justify-content:center; }
.magic-card { background:white;border-radius:24px;padding:48px;text-align:center;max-width:400px;width:90%; }
.spinner { width:48px;height:48px;border:4px solid #E2E8F0;border-top-color:#1847F5;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px; }
@keyframes spin { to { transform:rotate(360deg) } }
</style>
