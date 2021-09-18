import axios from "axios";

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info
        },
        clearInfo(state) {
            state.info = {}
        }
    },
    actions: {
        async fetchInfo({dispatch, commit}) {
            try {
                const pk = await dispatch('getUid')
                const resp = await axios.post('/api/user/info', {pk})
                commit('setInfo', resp.data)
            } catch (e) {
                const eDescription = 'Ошибка запроса данных пользователя!'
                commit('setError', eDescription)
                throw eDescription
            }
        }
    },
    getters: {
        info: s => s.info
    }
}
