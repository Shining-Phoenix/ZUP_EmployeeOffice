<template>
    <Loader v-if="loading"/>

    <div v-else class="row">
        <div class="material-placeholder">
            <div class="row">
                <div class="col s4">
                    <div class="center">
                        <img
                                class="z-depth-5"
                                width="500"
                                :src="employeeData.image_src"
                        />
                    </div>
                </div>
                <div class="col s8">
                    <h2> {{employeeData.surname + ' ' + employeeData.user_name + ' ' + employeeData.patronymic}} </h2>
                    <h3> {{employeeData.organization_name}} </h3>
                    <h3> {{employeeData.subdivision_name}} </h3>
                    <h3> {{employeeData.position_name}} </h3>
                </div>
            </div>
        </div>

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
    h2{
        margin-top: 0;
        margin-bottom: 40px;
        color: orange;
    }
    h3{
        margin-left: 30px;
    }
</style>
