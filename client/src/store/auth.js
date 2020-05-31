import axios from 'axios'

export default {

    state: {
        token: null,
        user: {}
    },
    mutations: {
        setToken(state, value) {
            localStorage.setItem('auth-token', value)
            state.token = value
        },
        setUser(state, value){
            localStorage.setItem('user', value)
            state.user = value
        },
        clearToken(state) {
            state.token = null
        },
        clearUser(state) {
            state.user = {}
        }
    },
    getters: {
        token: s => s.token,
        user: s => s.user
    },
    actions: {
        async login({commit}, {email, password}) {
            try {
                const resp = await axios.post('/api/auth/login', {email, password})
                commit('setToken', resp.data.token)
                commit('setUser', JSON.stringify(resp.data.user))
            } catch (e) {
                var eDescription = ''
                if (e.data && e.data.message && ((e.status >= 400) && (e.status < 500))) {
                    eDescription = e.data.message
                } else {
                    console.log(e)
                    eDescription = 'Ошибка авторизации!'
                }

                commit('setError', eDescription)
                throw eDescription
            }
        },
        async register({commit}, {email, password}) {
            try {
                const resp = await axios.post('/api/auth/register', {email, user_password:password})
                commit('setError', resp.data.pk)
                return  resp.data
            } catch (e) {
                var eDescription = ''
                console.log(e)
                if (e.data && e.data.message && ((e.status >= 400) && (e.status < 500))) {
                    eDescription = e.data.message
                } else {
                    console.log(e)
                    eDescription = 'Ошибка регистрации!'
                }

                commit('setError', eDescription)
                throw eDescription
            }
        },
        getUid({state}) {
            const user = JSON.parse(state.user)
            return user ? user.id : null
        },
        getUserBasePK({state}) {
            const user = JSON.parse(state.user)
            return user ? user.basePk : null
        },
        logout({commit}) {
            commit('clearInfo')
            commit('clearToken')
            commit('clearUser')
            localStorage.clear()
        }
    }
}
