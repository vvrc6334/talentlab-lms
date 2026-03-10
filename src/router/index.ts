import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { public: true } },
    { path: '/magic/:token', name: 'magic-login', component: () => import('@/views/auth/MagicLoginView.vue'), meta: { public: true } },
    {
      path: '/', component: () => import('@/components/layout/ParticipantLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: () => import('@/views/participant/DashboardView.vue') },
        { path: 'cursos', name: 'my-courses', component: () => import('@/views/participant/MyCoursesView.vue') },
        { path: 'cursos/:id', name: 'course-view', component: () => import('@/views/participant/CourseView.vue') },
        { path: 'certificados', name: 'certificates', component: () => import('@/views/participant/CertificatesView.vue') },
        { path: 'perfil', name: 'profile', component: () => import('@/views/participant/ProfileView.vue') }
      ]
    },
    {
      path: '/admin', component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
        { path: 'usuarios', name: 'admin-users', component: () => import('@/views/admin/UsersView.vue') },
        { path: 'usuarios/nuevo', name: 'admin-user-new', component: () => import('@/views/admin/UserFormView.vue') },
        { path: 'usuarios/importar', name: 'admin-users-import', component: () => import('@/views/admin/UsersImportView.vue') },
        { path: 'cursos', name: 'admin-courses', component: () => import('@/views/admin/CoursesView.vue') },
        { path: 'cursos/nuevo', name: 'admin-course-new', component: () => import('@/views/admin/CourseFormView.vue') },
        { path: 'cursos/:id/recursos', name: 'admin-course-resources', component: () => import('@/views/admin/CourseResourcesView.vue') },
        { path: 'cursos/importar', name: 'admin-courses-import', component: () => import('@/views/admin/CoursesImportView.vue') },
        { path: 'evaluaciones', name: 'admin-assessments', component: () => import('@/views/admin/AssessmentsView.vue') },
        { path: 'matriz', name: 'admin-matrix', component: () => import('@/views/admin/JobMatrixView.vue') },
        { path: 'empresas', name: 'admin-companies', component: () => import('@/views/admin/CompaniesView.vue') },
        { path: 'informes', name: 'admin-reports', component: () => import('@/views/admin/ReportsView.vue') },
        { path: 'certificados', name: 'admin-certificates', component: () => import('@/views/admin/CertificatesView.vue') }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.loading) await auth.init()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'dashboard' }
  if (to.meta.public && auth.isAuthenticated) return { name: auth.isAdmin ? 'admin-dashboard' : 'dashboard' }
})

export default router
