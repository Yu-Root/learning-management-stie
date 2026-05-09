import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据仪表盘' }
      },
      {
        path: '/assessment',
        name: 'Assessment',
        component: () => import('@/views/Assessment.vue'),
        meta: { title: '智能测评' }
      },
      {
        path: '/courses',
        name: 'Courses',
        component: () => import('@/views/Courses.vue'),
        meta: { title: '课程列表' }
      },
      {
        path: '/course/:id',
        name: 'CourseDetail',
        component: () => import('@/views/CourseDetail.vue'),
        meta: { title: '课程详情' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '学习管理系统'} - 个性化自适应学习平台`
  next()
})

export default router
