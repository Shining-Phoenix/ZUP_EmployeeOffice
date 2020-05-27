<template>
  <div>
    <Loader v-if="loading"/>
    <v-app id="inspire"  v-else>
      <Navbar @click="isOpen = !isOpen"/>

      <Sidebar v-model="isOpen"/>

      <v-content :class="{full: !isOpen}">
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
  import Navbar from '@/components/app/Navbar'
  import Sidebar from '@/components/app/Sidebar'
  import messages from '@/utils/messages'

  export default {
    name: 'main-layout',
    data: () => ({
      isOpen: false,
      loading: true,
      showTooltip: false,
      message: ''
    }),
    async mounted() {
      if (!Object.keys(this.$store.getters.info).length) {
        await this.$store.dispatch('fetchInfo')
      }

      this.loading = false
    },
    components: {
      Navbar,
      Sidebar
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
