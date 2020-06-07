<template>
    <v-container
            class="fill-height flexStart"
            fluid>
        <div class="page-title">
            <h3>Расчетные листки</h3>
        </div>
        <v-row>
            <v-col cols="2" class="pb-0">
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
        <Loader v-if="loading"/>
        <v-container
                v-else-if="!loading && paiments.length && paiments.length > 0"
                class="ml-0 pl-0"
        >
            <v-row>
                <v-col cols="6">
                    <payment-group
                        :data="nachisleno"
                    ></payment-group>
                    <payment-group
                            v-if="lgoti.items.length"
                            :data="lgoti"
                    ></payment-group>
                </v-col>
                <v-col cols="6">
                    <payment-group
                            v-if="uderzano.items.length"
                            :data="uderzano"
                    ></payment-group>
                    <payment-group
                            v-if="viplacheno.items.length"
                            :data="viplacheno"
                    ></payment-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <payment-group
                            :data="dolgZaPredpriyztiemNaNachalo"
                    ></payment-group>
                </v-col>
                <v-col cols="6">
                    <payment-group
                            :data="dolgZaPredpriyztiemNaKonec"
                    ></payment-group>
                </v-col>
            </v-row>
        </v-container>

        <v-row  v-else-if="!loading">
            <v-col cols="12">
                <h3>Данные отсутствуют</h3>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import PaymentGroup from "../components/PaymentGroup";

    export default {
        components: {PaymentGroup},
        name: "payment-list",
        data: () => ({
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            loading: true,
            dolgZaPredpriyztiemNaNachalo:null,
            dolgZaPredpriyztiemNaKonec: null,
            nachisleno: null,
            uderzano: null,
            viplacheno: null,
            lgoti: null
        }),
        methods: {
            async getPaymentList() {
                this.loading = true

                try {
                    const payment_month = new Date(this.date)
                    payment_month.setHours(0)
                    const data = await this.$store.dispatch("fetchEmployeePaymentList", {payment_month})

                    this.dolgZaPredpriyztiemNaNachalo = {
                        name: 'Долг предприятия на начало',
                        items: data.filter(item => item.payment_group ==='Входящее сальдо месяца')}
                    this.dolgZaPredpriyztiemNaKonec ={
                        name: 'Долг предприятия на конец',
                        items: data.filter(item => item.payment_group === 'Сальдо по итогам расчетов за месяц')
                    }
                    this.nachisleno ={
                        name: 'Начислено',
                        items: data.filter(item => item.payment_group === 'Начислено')
                    }
                    this.uderzano ={
                        name: 'Удержано',
                        items: data.filter(item => item.payment_group === 'Удержано')
                    }
                    this.viplacheno ={
                        name: 'Выплачено',
                        items: data.filter(item => item.payment_group === 'Выплачено')
                    }
                    this.lgoti ={
                        name: 'Льготы',
                        items: data.filter(item => item.payment_group === 'Льготы')
                    }

                    this.paiments = data
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

</style>
