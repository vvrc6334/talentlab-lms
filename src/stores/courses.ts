import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Course, Category } from '@/types/database'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function fetchCourses(companyId?: string) {
    loading.value = true
    try {
      let query = supabase.from('courses')
        .select('*, category:categories(*), company:companies(name)')
        .eq('active', true).order('title')
      if (companyId) query = query.or('company_id.eq.' + companyId + ',company_id.is.null')
      const { data, error } = await query
      if (error) throw error
      courses.value = data || []
    } finally { loading.value = false }
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').eq('active', true).order('order_index')
    categories.value = data || []
  }

  async function getCourseWithResources(courseId: string) {
    const { data, error } = await supabase.from('courses')
      .select('*, category:categories(*), resources:course_resources(*), assessments:assessments(*, questions:questions(*, options:question_options(*)))')
      .eq('id', courseId).single()
    if (error) throw error
    return data
  }

  async function createCourse(courseData: Partial<Course>) {
    if (!courseData.image_url && courseData.category_id) {
      const cat = categories.value.find(c => c.id === courseData.category_id)
      if (cat?.default_image_url) courseData.image_url = cat.default_image_url
    }
    const { data, error } = await supabase.from('courses').insert(courseData).select().single()
    if (error) throw error
    courses.value.unshift(data)
    return data
  }

  async function updateCourse(id: string, updates: Partial<Course>) {
    const { error } = await supabase.from('courses').update(updates).eq('id', id)
    if (error) throw error
    const idx = courses.value.findIndex(c => c.id === id)
    if (idx >= 0) courses.value[idx] = { ...courses.value[idx], ...updates }
  }

  function getCategoryDefaultImage(categoryName: string): string {
    const imageMap: Record<string, string> = {
      'liderazgo': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      'seguridad': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      'habilidades blandas': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      'ventas': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      'finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      'operaciones': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    }
    const key = Object.keys(imageMap).find(k => categoryName.toLowerCase().includes(k))
    return imageMap[key || ''] || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
  }

  return { courses, categories, loading, fetchCourses, fetchCategories, getCourseWithResources, createCourse, updateCourse, getCategoryDefaultImage }
})
