<template>
    <v-app id="inspire">
        <v-content class="darkBackground">
            <router-view/>
            <v-snackbar
                    v-model="showTooltip"
                    top
                    right
            >
                {{ message }}
                <v-btn
                        color="grey"
                        text
                        @click="showTooltip = false"
                >
                    Закрыть
                </v-btn>
            </v-snackbar>
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
                    this.showTooltip = false
                    this.message = messages[fbError] || fbError || 'Что-то пошло не так'
                    this.showTooltip = true
                }
            }
        }
    }
</script>

<style>
    .darkBackground {
        background-color: #9c27b0;;
    }

</style>
