<template>
    <div>
        <v-container
                class="fill-height flexStart mb-0"
                fluid>
            <div class="page-title">
                <h3>Графики работы </h3>
            </div>
            <v-row>
                <v-col cols="2" class="pb-0">
                    <v-select
                            :items="years"
                            label="Выберете год"
                            ref="yearSelect"
                            v-model="year"
                            @change="changeYear"
                            class="mb-0 pb-0"
                            hide-details
                    ></v-select>
                </v-col>
            </v-row>
        </v-container>
        <v-container  v-if="loading">
            <Loader/>
        </v-container>
        <v-container
                class="fill-height pt-0"
                fluid
                v-else-if="employeeData"
                v-for="emploee of employeeData"
                :key="emploee.employee"
            >
                <h3 
                v-if="employeeData.length > 1" class="employee-block-head"> Таб. № {{ emploee['tabNom'] }}</h3>
                <h3 v-if="employeeData.length > 1" class="employee-tabel_head"> {{ emploee['organizationName'] }}</h3>
                <h3 v-if="employeeData.length > 1" class="mb-2 employee-tabel_head"> {{ emploee['positionName'] }}</h3>

                <calendar-month
                        v-for="monthData of emploee.months"
                        :key="monthData.month"
                        :year="year"
                        :month="monthData.month"
                        :days="monthData.days"
                        class="mb-5 flex-30 mr-5 ml-5"
                        >
                </calendar-month>
        </v-container>
        <v-container v-else>
            <h3>
                Ошибка получения данных
            </h3>
        </v-container>
    </div>
    
</template>

<script>
    import CalendarMonth from '../components/CalendarMonth'

    export default {
        components: {CalendarMonth},
        name: "work-schedule-data",
        data: () => ({
            loading: true,
            employeeData: null,
            years: [],
            year: new Date().getFullYear()
            }),
        async mounted() {
            const currentYear = new Date().getFullYear()
            for (let i=-3; i < 4; i++ ){
                this.years.push({value: currentYear + i, text: currentYear + i})
            }

            await this.changeYear()
        },
        methods: {
            async changeYear(){
                this.loading = true
                try {
                    this.employeeData = await this.$store.dispatch('fetchEmployeeWorkScheduleData', this.year)              
                } catch (e) {
                    this.employeeData = null
                }

                finally {
                    this.loading = false
                }
            }
        }
    }
</script>

<style>
    .flex-30{
        flex: 20%;
        min-height: 157px;
    }

        .employee-tabel_head{
        background-color: #EE82EE;
        padding-left: 5mm;
        border-bottom-width: 1mm;
        color: black;
        border-bottom: 2mm;
        border-bottom-color: darkgreen;
        width: 100%;
    }

    .employee-block-head{
        background-color:#9c27b0;
        padding-left: 5mm;
        width: 100%;
    }
</style>
