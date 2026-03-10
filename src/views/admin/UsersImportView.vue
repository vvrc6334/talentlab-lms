<template>
  <div class="fade-in">
    <div class="flex items-center gap-3 mb-4">
      <router-link to="/admin/usuarios" class="btn btn-ghost btn-sm">← Volver</router-link>
      <div><h1>Importar usuarios</h1><p class="text-muted text-sm">Carga masiva desde CSV</p></div>
    </div>
    <div class="steps-row mb-4">
      <div :class="['step', step >= 1 ? 'active' : '']">1. Preparar</div><span>→</span>
      <div :class="['step', step >= 2 ? 'active' : '']">2. Cargar</div><span>→</span>
      <div :class="['step', step >= 3 ? 'active' : '']">3. Confirmar</div><span>→</span>
      <div :class="['step', step >= 4 ? 'active' : '']">4. Resultado</div>
    </div>

    <div v-if="step === 1" class="card fade-in">
      <h2 style="margin-bottom:16px">Formato del CSV</h2>
      <p class="text-muted mb-4">Columnas mínimas obligatorias: <b>nombre, usuario, contrasena</b></p>
      <p class="text-muted mb-4">Opcionales: email, celular, rut, empresa, cargo, familia, jerarquia, area, direccion, curso</p>
      <div class="example-csv">
        <code>nombre,usuario,contrasena,email,empresa<br/>Juan Pérez,jperez,Temp2024!,juan@empresa.cl,Empresa Demo</code>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-secondary" @click="downloadTemplate">📥 Descargar plantilla</button>
        <button class="btn btn-primary" @click="step = 2">Continuar →</button>
      </div>
    </div>

    <div v-if="step === 2" class="card fade-in">
      <h2 style="margin-bottom:16px">Cargar archivo CSV</h2>
      <div class="drop-zone" :class="{ dragging: isDragging }"
        @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
        @drop.prevent="handleDrop" @click="fileInput?.click()">
        <span class="drop-icon">📁</span>
        <p class="font-bold">Arrastra tu CSV aquí o haz clic</p>
        <p class="text-muted text-sm">Solo archivos .csv</p>
        <input ref="fileInput" type="file" accept=".csv" style="display:none" @change="handleFileSelect" />
      </div>
      <div v-if="previewRows.length > 0" class="mt-4">
        <p class="font-bold text-sm mb-2">Vista previa: {{ previewRows.length }} filas</p>
        <div style="overflow-x:auto;max-height:200px">
          <table><thead><tr><th v-for="h in previewHeaders" :key="h">{{ h }}</th></tr></thead>
          <tbody><tr v-for="(row, i) in previewRows.slice(0,5)" :key="i"><td v-for="h in previewHeaders" :key="h">{{ (row as any)[h] || '—' }}</td></tr></tbody>
          </table>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-ghost" @click="step = 1">← Atrás</button>
        <button class="btn btn-primary" :disabled="previewRows.length === 0" @click="step = 3">Continuar →</button>
      </div>
    </div>

    <div v-if="step === 3" class="card fade-in">
      <h2 style="margin-bottom:16px">Confirmar importación</h2>
      <p>Se importarán <strong>{{ previewRows.length }} usuarios</strong>.</p>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-ghost" @click="step = 2">← Atrás</button>
        <button class="btn btn-primary" :disabled="importing" @click="runImport">
          {{ importing ? '⏳ Importando...' : '✅ Confirmar' }}
        </button>
      </div>
    </div>

    <div v-if="step === 4 && results" class="card fade-in">
      <div :style="results.errors.length === 0 ? 'background:#E6FAF5' : 'background:#FFF7ED'" style="padding:20px;border-radius:12px;display:flex;gap:16px;align-items:center;margin-bottom:16px">
        <span style="font-size:36px">{{ results.errors.length === 0 ? '🎉' : '⚠️' }}</span>
        <div>
          <h2>{{ results.errors.length === 0 ? '¡Importación exitosa!' : 'Con advertencias' }}</h2>
          <p>{{ results.success }} usuarios creados.</p>
        </div>
      </div>
      <div v-if="results.errors.length > 0" style="max-height:200px;overflow-y:auto">
        <p v-for="(e, i) in results.errors" :key="i" style="font-size:13px;color:#DC2626;padding:4px 0">⚠️ {{ e }}</p>
      </div>
      <div class="flex gap-2 mt-4">
        <router-link to="/admin/usuarios" class="btn btn-primary">Ver usuarios →</router-link>
        <button class="btn btn-ghost" @click="reset">Importar más</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import type { UserCSVRow } from '@/types/database'
const usersStore = useUsersStore()
const step = ref(1); const isDragging = ref(false); const fileInput = ref<HTMLInputElement>()
const previewRows = ref<UserCSVRow[]>([]); const previewHeaders = ref<string[]>([])
const importing = ref(false); const results = ref<{ success: number; errors: string[] } | null>(null)

function parseCSV(text: string): UserCSVRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  previewHeaders.value = headers
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = vals[i] || '' })
    return { nombre: row.nombre||'', usuario: row.usuario||'', contrasena: row.contrasena||row.contraseña||'', email: row.email, celular: row.celular, rut: row.rut, empresa: row.empresa, cargo: row.cargo, familia: row.familia, jerarquia: row.jerarquia, area: row.area, direccion: row.direccion, curso: row.curso } as UserCSVRow
  }).filter(r => r.nombre)
}

function handleFileSelect(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) readFile(f) }
function handleDrop(e: DragEvent) { isDragging.value = false; const f = e.dataTransfer?.files[0]; if (f) readFile(f) }
function readFile(file: File) { const r = new FileReader(); r.onload = (e) => { previewRows.value = parseCSV(e.target?.result as string) }; r.readAsText(file, 'UTF-8') }

async function runImport() { importing.value = true; try { results.value = await usersStore.importFromCSV(previewRows.value); step.value = 4 } finally { importing.value = false } }

function downloadTemplate() {
  const blob = new Blob(['nombre,usuario,contrasena,email,celular,rut,empresa,cargo,familia,jerarquia,area,curso\nJuan Pérez,jperez,Temp2024!,juan@empresa.cl,56912345678,12345678-9,Empresa Demo,Analista,adm,PA,Finanzas,Liderazgo'], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'plantilla_usuarios.csv'; a.click()
}
function reset() { step.value = 1; previewRows.value = []; results.value = null }
</script>
<style scoped>
.steps-row { display:flex;align-items:center;gap:8px;background:white;border:1px solid #E2E8F0;border-radius:16px;padding:16px 24px }
.step { font-size:13px;color:#94A3B8;padding:4px 12px;border-radius:99px }
.step.active { background:#EEF1FE;color:#1847F5;font-weight:600 }
.example-csv { background:#0F1B4C;border-radius:6px;padding:16px }
.example-csv code { color:#00C896;font-size:12px;font-family:monospace;white-space:pre }
.drop-zone { border:2px dashed #E2E8F0;border-radius:16px;padding:48px;text-align:center;cursor:pointer;transition:all .2s }
.drop-zone:hover,.drop-zone.dragging { border-color:#1847F5;background:#EEF1FE }
.drop-icon { font-size:48px;display:block;margin-bottom:16px }
</style>
