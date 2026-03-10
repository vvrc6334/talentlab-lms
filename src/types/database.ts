export type UserRole = 'superadmin' | 'campus_admin' | 'corp_admin' | 'company_admin' | 'participant'
export type ResourceType = 'video' | 'document' | 'image' | 'scorm' | 'link' | 'audio' | 'h5p' | 'text'
export type AssessmentType = 'quiz' | 'survey' | 'true_false' | 'open' | 'nps' | 'checklist'
export type QuestionType = 'multiple_choice' | 'true_false' | 'open_text' | 'nps_scale' | 'likert_scale' | 'multiple_select' | 'rating'
export type EnrollmentStatus = 'active' | 'completed' | 'failed' | 'withdrawn' | 'pending'
export type NotificationChannel = 'app' | 'email' | 'whatsapp'

export interface Corporation { id: string; name: string; logo_url?: string; primary_color: string; active: boolean; created_at: string; updated_at: string }
export interface Company { id: string; corporation_id?: string; name: string; rut?: string; logo_url?: string; primary_color?: string; address?: string; phone?: string; email?: string; active: boolean; created_at: string; updated_at: string }
export interface HierarchyLevel { id: string; code: string; name: string; order_index: number; created_at: string }
export interface JobFamily { id: string; code: string; name: string; description?: string; color?: string; order_index: number; created_at: string }
export interface JobMatrix { id: string; hierarchy_id: string; family_id: string; code: string; description?: string; created_at: string; hierarchy?: HierarchyLevel; family?: JobFamily }
export interface JobTitle { id: string; matrix_id?: string; name: string; code?: string; description?: string; created_at: string; matrix?: JobMatrix }
export interface User {
  id: string; auth_id?: string; company_id?: string; role: UserRole
  first_name: string; last_name: string; username: string; email?: string
  phone?: string; rut?: string; avatar_url?: string; active: boolean
  magic_token?: string; magic_token_expires_at?: string; created_at: string; updated_at: string
  company?: Company; profile?: UserProfile
}
export interface UserProfile { id: string; user_id: string; job_title_id?: string; matrix_code?: string; area?: string; hierarchy_level?: string; address?: string; external_company?: string; notes?: string; created_at: string; updated_at: string; job_title?: JobTitle }
export interface Category { id: string; name: string; description?: string; default_image_url?: string; color?: string; icon?: string; order_index: number; active: boolean; created_at: string }
export interface Course { id: string; company_id?: string; category_id?: string; title: string; description?: string; image_url?: string; sence_code?: string; duration_hours?: number; passing_score: number; max_attempts: number; is_sequential: boolean; certificate_enabled: boolean; active: boolean; start_date?: string; end_date?: string; created_by?: string; created_at: string; updated_at: string; category?: Category; company?: Company; resources?: CourseResource[] }
export interface CourseResource { id: string; course_id: string; title: string; type: ResourceType; url?: string; content?: string; duration_seconds?: number; file_size_bytes?: number; is_mandatory: boolean; order_index: number; created_at: string; updated_at: string }
export interface Enrollment { id: string; user_id: string; course_id: string; company_id?: string; enrolled_by?: string; status: EnrollmentStatus; progress_percentage: number; final_score?: number; started_at?: string; completed_at?: string; due_date?: string; created_at: string; updated_at: string; course?: Course; user?: User }
export interface ResourceProgress { id: string; user_id: string; resource_id: string; enrollment_id?: string; is_completed: boolean; progress_percentage: number; time_spent_seconds: number; last_position: number; views_count: number; first_accessed_at?: string; last_accessed_at?: string; completed_at?: string }
export interface Assessment { id: string; course_id: string; title: string; type: AssessmentType; description?: string; passing_score: number; max_attempts: number; time_limit_minutes?: number; is_mandatory: boolean; order_index: number; show_results_immediately: boolean; randomize_questions: boolean; created_at: string; updated_at: string; questions?: Question[] }
export interface Question { id: string; assessment_id: string; type: QuestionType; text: string; explanation?: string; points: number; order_index: number; is_required: boolean; created_at: string; options?: QuestionOption[] }
export interface QuestionOption { id: string; question_id: string; text: string; is_correct: boolean; order_index: number }
export interface Certificate { id: string; user_id: string; course_id: string; enrollment_id?: string; verification_code: string; issued_at: string; pdf_url?: string; is_valid: boolean; course?: Course; user?: User }
export interface Notification { id: string; user_id: string; type: string; title: string; message: string; channel: NotificationChannel; is_read: boolean; sent_at?: string; read_at?: string; metadata?: Record<string, unknown>; created_at: string }
export interface UserCSVRow { nombre: string; usuario: string; contrasena: string; email?: string; celular?: string; rut?: string; empresa?: string; cargo?: string; familia?: string; jerarquia?: string; area?: string; direccion?: string; curso?: string }
export type Database = { public: { Tables: {
  corporations: { Row: Corporation; Insert: Partial<Corporation>; Update: Partial<Corporation> }
  companies: { Row: Company; Insert: Partial<Company>; Update: Partial<Company> }
  users: { Row: User; Insert: Partial<User>; Update: Partial<User> }
  user_profiles: { Row: UserProfile; Insert: Partial<UserProfile>; Update: Partial<UserProfile> }
  categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> }
  courses: { Row: Course; Insert: Partial<Course>; Update: Partial<Course> }
  course_resources: { Row: CourseResource; Insert: Partial<CourseResource>; Update: Partial<CourseResource> }
  enrollments: { Row: Enrollment; Insert: Partial<Enrollment>; Update: Partial<Enrollment> }
  assessments: { Row: Assessment; Insert: Partial<Assessment>; Update: Partial<Assessment> }
  questions: { Row: Question; Insert: Partial<Question>; Update: Partial<Question> }
  question_options: { Row: QuestionOption; Insert: Partial<QuestionOption>; Update: Partial<QuestionOption> }
  certificates: { Row: Certificate; Insert: Partial<Certificate>; Update: Partial<Certificate> }
  notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
  hierarchy_levels: { Row: HierarchyLevel; Insert: Partial<HierarchyLevel>; Update: Partial<HierarchyLevel> }
  job_families: { Row: JobFamily; Insert: Partial<JobFamily>; Update: Partial<JobFamily> }
  job_matrix: { Row: JobMatrix; Insert: Partial<JobMatrix>; Update: Partial<JobMatrix> }
  job_titles: { Row: JobTitle; Insert: Partial<JobTitle>; Update: Partial<JobTitle> }
}}}
