<template>
  <div class="fade-in">
    <h1>Dashboard</h1>
    <p class="text-muted" style="margin-bottom:24px">Resumen de la plataforma</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
      <div class="card" v-for="s in stats" :key="s.label">
        <p style="font-size:32px;font-weight:700;color:#1847F5">{{ s.value }}</p>
        <p class="text-muted text-sm">{{ s.label }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const stats = [
  { label: 'Usuarios activos', value: '—' },
  { label: 'Cursos publicados', value: '—' },
  { label: 'Matrículas activas', value: '—' },
  { label: 'Certificados emitidos', value: '—' },
]
</script>
