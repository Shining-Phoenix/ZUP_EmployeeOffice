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
                <v-col cols="5" v-if = "employeeData && employeeData[0].image_src">
                    <v-img
                            align="center"
                            class="z-depth-5 v-image-center shadow"
                            width="500"
                            :src="employeeData[0].image_src"
                    />
                </v-col>
                <v-col cols="7">
                    <v-row v-if = "employeeData">
                        <v-col cols="12">
                            <h2 class="mb-5"> {{employeeData[0].surname + ' ' + employeeData[0].user_name + ' ' + employeeData[0].patronymic}} </h2>
                        </v-col>
                    </v-row>                       
                    <v-row 
                        v-for="employeeDataRow of employeeData"
                        :key="employeeDataRow.employee_pk"
                        >
                        <v-col cols="12">
                            <h3> Таб. № {{employeeDataRow.tab_nom}} </h3>
                            <h3> {{employeeDataRow.organization_name}} </h3>
                            <h3> {{employeeDataRow.subdivision_name}} </h3>
                            <h3> {{employeeDataRow.position_name}} </h3>
                        </v-col>
                    </v-row>
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
            employeeData: null
        }),
        async mounted() {
            try {
                this.employeeData = await this.$store.dispatch('fetchEmployeeData')
            }finally {
                this.loading = false
            }
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
