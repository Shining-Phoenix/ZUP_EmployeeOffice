<template>
  <div>
    <Loader v-if="loading"/>
    <v-app id="inspire"  v-else>
      <v-navigation-drawer
              v-model="isOpen"
              app
              :clipped="$vuetify.breakpoint.lgAndUp"
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
      <v-app-bar
              dark
              :clipped-left="$vuetify.breakpoint.lgAndUp"
              app
      >
        <v-app-bar-nav-icon @click.prevent="isOpen = !isOpen"></v-app-bar-nav-icon>

        <v-toolbar-title dark>Личный кабинет сотрудника</v-toolbar-title>
      </v-app-bar>


      <v-content
              class="fill-height">
        <router-view/>
        <v-tooltip
                v-model="showTooltip"
                right
                close-delay="10">
          <span> {{ message }} </span>
        </v-tooltip>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import messages from '@/utils/messages'

  export default {
    name: 'main-layout',
    data: () => ({
      isOpen: true,
      loading: true,
      showTooltip: false,
      message: '',
      links: [
        {title: 'Личные данные', url: '/', exact: true},
        {title: 'Расчетные листки', url: '/payment-list'},
        {title: 'Заявки на справки', url: '/inquiry-request-list'}
      ],
    }),
    methods: {
      logout() {
        this.$store.dispatch('logout')
      },
    },
    async mounted() {
      if (!Object.keys(this.$store.getters.info).length) {
        await this.$store.dispatch('fetchInfo')
      }

      this.loading = false
    },
    computed: {
      error() {
        return this.$store.getters.error
      }
    },
    watch: {
      error(fbError) {
        if (fbError) {
          this.message = messages[fbError] || fbError || 'Что-то пошло не так'
          this.showTooltip = true
          setInterval(()=>this.showTooltip = false, 5000)
        }
      }
    }
  }
</script>
