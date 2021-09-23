<template>
    <v-container
            class="fill-height flexStart"
            fluid>
                <div class="page-title ">
                    <h3>Расчетные листки</h3>
                    <v-row>
                        <v-col cols="2" class="pb-0 head-select">
                            <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            v-model="date"
                                            label="Выберите месяц"
                                            readonly
                                            v-on="on"
                                            hide-details
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        v-model="date"
                                        type="month"
                                        no-title
                                        scrollable
                                        locale="ru"
                                        dark
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="normal" @click="menu = false">Отмена</v-btn>
                                    <v-btn text color="normal" @click="$refs.menu.save(date); getPaymentList()">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </div>
                <Loader v-if="loading"/>
            <div
                    v-else-if="!loading && paiments.length && paiments.length > 0"
                    class="row ml-0 mt-3 mr-2 mb-10"
            >
                    <payment-list-object
                        v-for = "paimentList of paiments"
                        :key="paimentList.employeePk"
                        :showBlockName="paiments.length > 1"
                        :tabNom = "paimentList.tabNom"
                        :subdivisionName = "paimentList.subdivisionName"
                        :positionName = "paimentList.positionName"
                        :organizationName = "paimentList.organizationName"
                        :typeOfEmployment = "paimentList.typeOfEmployment"
                        :dolgZaPredpriyztiemNaNachalo = "paimentList.dolgZaPredpriyztiemNaNachalo"
                        :dolgZaPredpriyztiemNaKonec = "paimentList.dolgZaPredpriyztiemNaKonec"
                        :nachisleno = "paimentList.nachisleno"
                        :uderzano = "paimentList.uderzano"
                        :viplacheno = "paimentList.viplacheno"
                        :lgoti = "paimentList.lgoti"
                    ></payment-list-object>
            </div>

            <v-row  v-else-if="!loading">
                <v-col cols="12">
                    <h3 class = "ml-3">Данные отсутствуют</h3>
                </v-col>
            </v-row>
    </v-container>
</template>

<script>
    import PaymentListObject from "../components/PaymentListObject";

    export default {
        components: {PaymentListObject},
        name: "payment-list",
        data: () => ({
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            loading: true,
            paiments: [],
            employees: []
        }),
        methods: {
            async getPaymentList() {
                this.loading = true
                this.employees = []

                try {
                    const payment_month = new Date(this.date)
                    payment_month.setHours(0)
                    const data = await this.$store.dispatch("fetchEmployeePaymentList", {payment_month})
                    for (let row of data) {
                        const employeeData = {}
                        employeeData.employeePk = row.employee
                        employeeData.tabNom = row.tab_nom
                        employeeData.subdivisionName = row.subdivision_name
                        employeeData.positionName = row.position_name
                        employeeData.organizationName = row.organization_name
                        employeeData.typeOfEmployment = row.type_of_employment

                        employeeData.dolgZaPredpriyztiemNaNachalo = {
                            name: 'Долг предприятия на начало',
                            items: row.dataBlock.filter(item => item.payment_group ==='Входящее сальдо месяца')}
                        employeeData.dolgZaPredpriyztiemNaKonec ={
                            name: 'Долг предприятия на конец',
                            items: row.dataBlock.filter(item => item.payment_group === 'Сальдо по итогам расчетов за месяц')
                        }
                        employeeData.nachisleno ={
                            name: 'Начислено',
                            items: row.dataBlock.filter(item => item.payment_group === 'Начислено')
                        }
                        employeeData.uderzano ={
                            name: 'Удержано',
                            items: row.dataBlock.filter(item => item.payment_group === 'Удержано')
                        }
                        employeeData.viplacheno ={
                            name: 'Выплачено',
                            items: row.dataBlock.filter(item => item.payment_group === 'Выплачено')
                        }
                        employeeData.lgoti ={
                            name: 'Льготы',
                            items: row.dataBlock.filter(item => item.payment_group === 'Льготы')
                        }

                        this.employees.push(employeeData)
                    }
                    this.paiments = this.employees
                }
                catch (e) {
                    this.paiments = []
                }
                finally {
                    this.loading = false
                }
            }
        },
        mounted() {
            this.getPaymentList()

        },

    }
</script>

<style scoped>

    .flexStart{
        align-content: flex-start;
    }

    .head-select{
        min-width: 200px;
    }

</style>
