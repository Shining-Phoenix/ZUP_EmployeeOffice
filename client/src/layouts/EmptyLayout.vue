<template>
    <v-app id="inspire">
        <v-content class="darkBackground">
            <router-view/>
            <v-tooltip
                    v-model="showTooltip"
                    close-delay="10">
                <span> {{ message }} </span>
            </v-tooltip>
        </v-content>
    </v-app>
</template>

<script>

    import messages from '@/utils/messages'

    export default {
        data: () => ({
            showTooltip: false,
            message: ''
        }),
        computed: {
            error() {
                return this.$store.getters.error
            },
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

<style>
    .darkBackground {
        background-color: gray;
    }

</style>
