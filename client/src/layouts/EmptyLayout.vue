<template>
    <div class="grey darken-1 empty-layout">
        <router-view/>
    </div>
</template>

<script>

    import messages from '@/utils/messages'

    export default {
        computed: {
            error() {
                return this.$store.getters.error
            }
        },
        watch: {
            error(fbError) {
                if (fbError) {
                    this.$message(messages[fbError] || fbError || 'Что-то пошло не так')
                }
            }
        }
    }
</script>
