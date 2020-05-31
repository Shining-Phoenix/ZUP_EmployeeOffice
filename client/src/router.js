import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'personal-data',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/PersonalData.vue')
        },
        {
            path: '/login',
            name: 'login',
            meta: {layout: 'empty'},
            component: () => import('./views/Login.vue')
        },
        {
            path: '/registration',
            name: 'registration',
            meta: {layout: 'empty'},
            component: () => import('./views/Registration.vue')
        },
        {
            path: '/document-journal',
            name: 'document-journal',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/DocumentJournal.vue')
        },
        {
            path: '/inquiry-request/:id',
            name: 'inquiry-requestl',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/InquiryRequest')
        },
        {
            path: '/new-inquiry-request',
            name: 'new-inquiry-request',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/NewInquiryRequest')
        },
        {
            path: '/inquiry-request-list',
            name: 'inquiry-requestl-list',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/InquiryRequestList')
        },
        {
            path: '/payment-list',
            name: 'payment_list',
            meta: {layout: 'main', auth: true},
            component: () => import('./views/PaymentList.vue')
        },
    ]
})

router.beforeEach((to, from, next) => {

    const currentUser = store.getters.token
    const requireAuth = to.matched.some(record => record.meta.auth)

    if (requireAuth && !currentUser) {
        next('/login?message=login')
    } else {
        next()
    }
})

export default router
