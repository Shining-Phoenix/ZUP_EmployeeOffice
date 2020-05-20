import M from 'materialize-css/dist/js/materialize.min'

export default {
  install(Vue) {
    Vue.prototype.$message = function (html) {
      M.toast({html, classes: 'rounded teal'})
    }

    Vue.prototype.$error = function (html) {
      M.toast({html: `[Ошибка]: ${html}`, classes: 'rounded teal'})
    }
  }
}
