import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import 'materialize-css/dist/js/materialize.min'
import router from './router'
import store from './store'
//import dateFilter from '@/filters/date.filter'
import Loader from '@/components/app/Loader'
import axios from 'axios'
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(vueNumeralFilterInstaller, { locale: 'ru' })
Vue.use(VueFilterDateFormat, {
    dayOfWeekNames: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'
    ],
    dayOfWeekNamesShort: [
        'Su', 'Mo', 'Tu', 'We', 'Tr', 'Fr', 'Sa'
    ],
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
})
//Vue.filter('date', dateFilter)
Vue.component('Loader', Loader)

store.commit('setToken', localStorage.getItem('auth-token'))
store.commit('setUser', localStorage.getItem('user'))

new Vue({
    router,
    store,
    render: h => h(App),
    vuetify,

    created: () => {
        axios.interceptors.request.use((config) => {
                const token = store.getters.token;
                if (token) {
                    config.headers.Authorization = token;
                } else {
                    router.push('/login');
                }
                return config;
            })
        axios.interceptors.response.use(
            response => {
                return response;
            },
            function(error) {
                if (error.response.status === 401) {
                    router.push('/login');
                }
                return Promise.reject(error.response);
            }
        );

    },
    mounted(){
        this.$nextTick(()=>document.body.classList.add('app-mounted'))
    }
}
    ).$mount('#app')
