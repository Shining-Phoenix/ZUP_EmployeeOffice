<template>
  <ul class="sidenav app-sidenav" :class="{open: value}">

    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active orange darken-1"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{link.title}}</a>
    </router-link>

    <hr class="sidebar-divider">

    <router-link
            tag="li"
            active-class="active"
            :to="'/login?message=logout'"
            @click.native.prevent="logout"
    >
      <a href="#" class="waves-effect waves-teal pointer">Выход</a>
    </router-link>
  </ul>
</template>

<script>
export default {
  props: ['value'],
  data: () => ({
    links: [
      {title: 'Личные данные', url: '/', exact: true},
      {title: 'Расчетные листки', url: '/payment-list'}
    ]
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>
  .sidebar-divider{
    border: none;
    color: teal;
    background-color: teal;
    height: 2px
  }
</style>

