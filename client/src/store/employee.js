import axios from 'axios'
import formatDateToString from '../utils/common' 

export default {
    actions: {
        async fetchEmployeeData({dispatch, commit}) {
            try {
                const pk = dispatch('getUid')
                const resp = await axios.post('/api/employee/data', {pk})
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
                         payment_month: formatDateToString(val.payment_month)}
                })
                return resp.data
            } catch (e) {
                console.log(e)
                const eDescription = 'Ошибка запроса данных расчетного листка!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchEmployeeWorkScheduleData({dispatch, commit}, year) {
            try {
                const Uid = await dispatch('getUid')
                const base_pk = await dispatch('getUserBasePK')
                const resp = await axios.get('/api/employee/employee-work-schedules-data-for-period', {params:
                        {pk: Uid,
                         base_pk,
                         year}
                })
                return resp.data
            } catch (e) {
                console.log(e)
                const eDescription = 'Ошибка запроса данных графика работы!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchEmployeeTabel({dispatch, commit}, month) {
            try {
                const Uid = await dispatch('getUid')
                const resp = await axios.get('/api/employee/tabel', {params:
                        {pk: Uid,
                            month}
                })
                for (let itemData of resp.data){
                    itemData.tabel_data = JSON.parse(itemData.tabel_data)
                }

                return resp.data
            } catch (e) {
                console.log(e)
                const eDescription = 'Ошибка запроса данных табеля работы!'
                commit('setError', eDescription)
                throw eDescription
            }
        }
    }
}
