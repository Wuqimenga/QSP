import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import Edit from '@/pages/Edit'
import Preview from '@/pages/Preview'
import Answer from '@/pages/Answer'
import Done from '@/pages/Done'

import CrossOverAnalysis from '@/pages/CrossOverAnalysis'
import Model from '@/pages/Model'
import Share from '@/pages/Share'


import Result from '@/pages/Result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
      {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/share',
      name: 'Share',
      component: Share,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/result',
      name: 'Result',
      component: Result,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/crossoveranalysis/:paperid',
      name: 'CrossOverAnalysis',
      component: CrossOverAnalysis,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/preview',
      name: 'Preview',
      component: Preview,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/answer',
      name: 'Answer',
      component: Answer,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    // {
    //   path: '/analysis',
    //   name: 'Analysis',
    //   component: Analysis,
    //   meta: {
    //     requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    // }
    // },
    {
      path: '/done',
      name: 'Done',
      component: Done,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Edit,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    }, 
    {
<<<<<<< HEAD
      path: '/',
      redirect: '/login'
    },


=======
      path: '/model',
      name: 'Model',
      component: Model,
      meta: {
        requireAuth: true,//以这个字段来说明这个路由是否需要登录认证才能访问
    }
    },
 /*    
    //这个页面没有使用-lyw
    {
      path: '/unconnected',
      name: 'Unconnected',
      component: Unconnected
    },
    */
>>>>>>> 9762527b9daf8fb0a87369b1eb7040513cb71a86

  ]
})

