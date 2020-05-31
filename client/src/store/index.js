import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import employee from './employee'
import inquiryRequest from './inquiryRequest'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
    loading: false,
    token: null
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    clearLoading(state) {
      state.loading = false
    }
  },
  getters: {
    error: s => s.error,
    loading: s => s.loading
  },
  actions: {

  },
  modules: {
    auth,
    info,
    employee,
    inquiryRequest
  }
})
