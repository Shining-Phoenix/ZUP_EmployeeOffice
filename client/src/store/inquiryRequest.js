import axios from "axios";

export default{

    state:{
        inquiryRequestList: null
    },
    mutations: {
        createInquiryRequestList(state, inquiryRequestList) {
            state.inquiryRequestList = inquiryRequestList
        },
        createInquiryRequest(state, inquiryRequest) {

            state.inquiryRequestList.unshift(inquiryRequest)
        },
        updateInquiryRequest(state, inquiryRequest) {

            const inquiryRequestList = state.inquiryRequestList.concat()
            const idx = inquiryRequestList.findIndex(t => t.pk === inquiryRequest.pk)
            inquiryRequestList[idx] = inquiryRequest
            state.inquiryRequestList = inquiryRequestList
        }
    },
    actions: {
        async createInquiryRequest({dispatch, commit}, inquiryRequest) {
            try {
                const Uid = await dispatch('getUid')
                const data = {...inquiryRequest}
                data.user_pk = Uid
                const pk = await axios.post('/api/inquiry-request/',  data)
                inquiryRequest.pk = pk
                commit('createInquiryRequest', inquiryRequest)
            } catch (e) {
                const eDescription = 'Ошибка создания запроса справки!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async updateInquiryRequest({commit}, inquiryRequest) {
            try {
                const data = {...inquiryRequest}
                await axios.put('/api/inquiry-request/by-id',  data)
                commit('updateInquiryRequest', inquiryRequest)
            } catch (e) {
                const eDescription = 'Ошибка обновления запроса справки!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchInquiryRequestsByUser({dispatch, commit}) {
            try {
                const Uid = await dispatch('getUid')
                const resp = await axios.get('/api/inquiry-request/by-user',  {params:{pk: Uid}})
                commit('createInquiryRequestList', resp.data)
                resp.data.map((obj) => {
                    obj.doc_date = new Date(obj.doc_date)
                    obj.doc_date_str = obj.doc_date.toLocaleString()
                    return obj})
                return resp.data
            } catch (e) {
                const eDescription = 'Ошибка запроса данных запросов справок!'
                commit('setError', eDescription)
                commit('createInquiryRequestList', [])
                throw eDescription
            }
        },
        async fetchInquiryRequestById({dispatch, commit}, id) {
            try {
                const Uid = await dispatch('getUid')
                const resp = await axios.get('/api/inquiry-request/by-id',  {params:
                                                                                            {pk: Uid,
                                                                                            id}
                                                                                        })
                return resp.data
            } catch (e) {
                const eDescription = 'Ошибка запроса данных запросов справок!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchInquiryRequestStatuses({commit}) {
            try {
                const resp = await axios.get('/api/inquiry-request/statuses')
                return resp.data
            } catch (e) {
                const eDescription = 'Ошибка запроса данных статусов запросов справок!'
                commit('setError', eDescription)
                throw eDescription
            }
        },
        async fetchInquiryRequestTypes({dispatch, commit}) {
            try {
                const userBasePk = await dispatch('getUserBasePK')
                const resp = await axios.get('/api/inquiry-request/types',{params: {basePk: userBasePk}})
                return resp.data
            } catch (e) {
                const eDescription = 'Ошибка запроса данных типов запросов справок!'
                commit('setError', eDescription)
                throw eDescription
            }
        }
    },
    getters: {
        inquiryRequestList: s => s.inquiryRequestList,
        inquiryRequestListByPk: s => pk => s.inquiryRequestList.find(t => t.pk === pk)
    }
}