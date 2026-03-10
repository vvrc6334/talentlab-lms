<template>
  <div class="participant-layout">
    <header class="top-nav">
      <div class="nav-brand"><svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="#1847F5"/><path d="M10 26V14l8-6 8 6v12H22v-7h-4v7H10z" fill="white"/></svg><span>TalentLab</span></div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active">Inicio</router-link>
        <router-link to="/cursos" active-class="active">Mis cursos</router-link>
        <router-link to="/certificados" active-class="active">Certificados</router-link>
      </nav>
      <div class="nav-user">
        <router-link to="/perfil" class="user-chip"><div class="avatar">{{ initials }}</div><span>{{ auth.currentUser?.first_name }}</span></router-link>
        <button class="btn btn-ghost btn-sm" @click="auth.logout()">Salir</button>
      </div>
    </header>
    <main class="participant-main"><router-view /></main>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const initials = computed(() => auth.currentUser ? `${auth.currentUser.first_name[0]}${auth.currentUser.last_name[0]}`.toUpperCase() : '?')
</script>
<style scoped>
.participant-layout { min-height:100vh;background:#F4F6FB; }
.top-nav { background:white;border-bottom:1px solid #E2E8F0;padding:0 32px;height:60px;display:flex;align-items:center;gap:32px;position:sticky;top:0;z-index:100; }
.nav-brand { display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-size:18px;font-weight:700;color:#0F1B4C; }
.nav-links { display:flex;gap:24px;flex:1; }
.nav-links a { font-size:14px;color:#64748B;text-decoration:none;padding:4px 0;border-bottom:2px solid transparent;transition:all .2s; }
.nav-links a.active,.nav-links a:hover { color:#1847F5;border-bottom-color:#1847F5;text-decoration:none; }
.nav-user { display:flex;align-items:center;gap:12px; }
.user-chip { display:flex;align-items:center;gap:8px;text-decoration:none;color:#1A202C; }
.avatar { width:32px;height:32px;background:#1847F5;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700; }
.participant-main { padding:32px;max-width:1200px;margin:0 auto; }
</style>
