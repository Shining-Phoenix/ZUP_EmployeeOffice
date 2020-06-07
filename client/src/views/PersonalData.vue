<template>
    <div>
        <v-container  v-if="loading">
            <Loader/>
        </v-container>
        <v-container
                class="fill-height"
                fluid
                v-else-if="employeeData">
            <v-row>
                <v-col cols="5">
                    <v-img
                            align="center"
                            class="z-depth-5 v-image-center shadow"
                            width="500"
                            :src="employeeData.image_src"
                    />
                </v-col>
                <v-col cols="7">
                    <h2 class="mb-5"> {{employeeData.surname + ' ' + employeeData.user_name + ' ' + employeeData.patronymic}} </h2>
                    <h3> {{employeeData.organization_name}} </h3>
                    <h3> {{employeeData.subdivision_name}} </h3>
                    <h3> {{employeeData.position_name}} </h3>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-else>
            <h3>
                Ошибка получения данных
            </h3>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "personal-data",
        data: () => ({
            loading: true,
            employeeData: {}
        }),
        async mounted() {
            this.employeeData = await this.$store.dispatch('fetchEmployeeData')
            this.loading = false
        }
    }
</script>

<style scoped>
    .v-image-center{
        margin-left: auto;
        margin-right: auto;
    }
    .shadow{
        box-shadow: 0.4em 0.4em 10px rgba(122,122,122,0.5);
    }
</style>
