<template>
  <v-navigation-drawer
          v-model="isOpen"
          app
          light
  >
    <v-list
            dense
            nav
    >
      <v-list-item
              v-for="link in links"
              :key="link.url"
              :to="link.url"
              link
              @click.native.prevent="click"
      >
        <v-list-item-content>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
              :to="'/login?message=logout'"
              link
              @click.native.prevent="logout"
      >
        <v-list-item-content>
          <v-list-item-title>Выход</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {value: Boolean},
  data: () => ({
    isOpen: null,
    links: [
      {title: 'Личные данные', url: '/', exact: true},
      {title: 'Расчетные листки', url: '/payment-list'}
    ],
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        this.isOpen = this.value}
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    click() {
      this.isOpen = false
      this.$emit('input', false)
    }
  },
}
</script>


