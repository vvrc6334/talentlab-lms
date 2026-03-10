<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ collapsed: col }">
      <div class="sidebar-header">
        <div class="brand" v-if="!col">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="#1847F5"/><path d="M10 26V14l8-6 8 6v12H22v-7h-4v7H10z" fill="white"/></svg>
          TalentLab
        </div>
        <button class="collapse-btn" @click="col = !col">{{ col ? '→' : '←' }}</button>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact-active-class="active"><span>📊</span><span v-if="!col">Dashboard</span></router-link>
        <router-link to="/admin/usuarios" class="nav-item" active-class="active"><span>👥</span><span v-if="!col">Usuarios</span></router-link>
        <router-link to="/admin/cursos" class="nav-item" active-class="active"><span>📚</span><span v-if="!col">Cursos</span></router-link>
        <router-link to="/admin/evaluaciones" class="nav-item" active-class="active"><span>📝</span><span v-if="!col">Evaluaciones</span></router-link>
        <router-link to="/admin/matriz" class="nav-item" active-class="active"><span>🗂️</span><span v-if="!col">Matriz de cargos</span></router-link>
        <router-link to="/admin/certificados" class="nav-item" active-class="active"><span>🏆</span><span v-if="!col">Certificados</span></router-link>
        <router-link to="/admin/informes" class="nav-item" active-class="active"><span>📈</span><span v-if="!col">Informes</span></router-link>
        <router-link v-if="auth.isSuperAdmin" to="/admin/empresas" class="nav-item" active-class="active"><span>🏢</span><span v-if="!col">Empresas</span></router-link>
      </nav>
      <div class="sidebar-footer">
        <div v-if="!col" class="user-info">
          <div class="user-avatar">{{ initials }}</div>
          <div><p class="user-name">{{ auth.fullName }}</p></div>
        </div>
        <button class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,0.6)" @click="auth.logout()">{{ col ? '🚪' : '🚪 Salir' }}</button>
      </div>
    </aside>
    <main class="admin-main" :style="col ? 'margin-left:64px' : 'margin-left:240px'">
      <div class="admin-content"><router-view /></div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(); const col = ref(false)
const initials = computed(() => auth.currentUser ? `${auth.currentUser.first_name[0]}${auth.currentUser.last_name[0]}`.toUpperCase() : '?')
</script>
<style scoped>
.admin-layout { display:flex;min-height:100vh; }
.sidebar { width:240px;background:#0F1B4C;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;transition:width .2s;overflow:hidden; }
.sidebar.collapsed { width:64px; }
.sidebar-header { display:flex;align-items:center;justify-content:space-between;padding:18px 16px;border-bottom:1px solid rgba(255,255,255,0.08); }
.brand { display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-size:17px;font-weight:700;color:white;white-space:nowrap; }
.collapse-btn { background:rgba(255,255,255,0.1);border:none;color:white;width:28px;height:28px;border-radius:6px;cursor:pointer;flex-shrink:0; }
.sidebar-nav { flex:1;padding:12px 8px;display:flex;flex-direction:column;gap:4px;overflow-y:auto; }
.nav-item { display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:6px;color:rgba(255,255,255,0.6);font-size:14px;text-decoration:none;transition:all .15s;white-space:nowrap; }
.nav-item:hover { background:rgba(255,255,255,0.08);color:white;text-decoration:none; }
.nav-item.active { background:#1847F5;color:white; }
.sidebar-footer { padding:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:10px; }
.user-info { display:flex;align-items:center;gap:10px; }
.user-avatar { width:32px;height:32px;background:#1847F5;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0; }
.user-name { color:white;font-size:13px; }
.admin-main { flex:1;transition:margin-left .2s; }
.admin-content { padding:32px;max-width:1400px; }
</style>
