import axios from 'axios'

export default {
    actions: {
        async fetchEmployeeData({dispatch, commit}) {
            try {
                const pk = dispatch('getUid')
                const resp = await axios.post('/api/employee/data', {pk})
                console.log(resp.data)
                return resp.data
            } catch (e) {
                console.log(e)
                const eDescription = 'Ошибка запроса данных работника!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchEmployeePaymentList({dispatch, commit}, val) {
            try {
                const Uid = await dispatch('getUid')
                const resp = await axios.get('/api/employee/payment-list', {params:
                        {pk: Uid,
                         payment_month: val.payment_month}
                })
                return resp.data
            } catch (e) {
                console.log(e)
                const eDescription = 'Ошибка запроса данных расчетного листка!'
                commit('setError', eDescription)
                throw eDescription
            }
        }
    }
}
