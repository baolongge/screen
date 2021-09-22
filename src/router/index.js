import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes:[
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "introduce" */ '../views/home/index.vue')
      },
  ]
})

export default router