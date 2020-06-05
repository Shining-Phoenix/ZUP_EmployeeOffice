<template>
    <v-container
            class="fill-height flexStart"
            fluid>
        <div class="page-title">
            <h3>Расчетные листки</h3>
        </div>
        <v-row>
            <v-col cols="2">
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
        <v-row v-else-if="!loading && paiments.length && paiments.length > 0">
            <v-col cols="6">
                <div v-for = "(groupItem) in paiments"
                     :key="groupItem.group">
                        <h4 primary>{{ groupItem.group }}</h4>
                        <v-simple-table>
                            <tbody>
                            <tr v-for = "item in groupItem.items"
                                :key="item.payment_position">
                                <td width="40%" class="no-padding">{{ item.payment_position }}</td>
                                <td width="20%" class="no-padding rightText">{{ item.payment_sum | numeral('0,0.00')  }}</td>
                            </tr>
                            </tbody>
                         </v-simple-table>
                </div>
            </v-col>
        </v-row>
        <v-row  v-else-if="!loading">
            <v-col cols="12">
                <h3>Данные отсутствуют</h3>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "payment-list",
        data: () => ({
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            loading: true
        }),
        methods: {
            async getPaymentList() {
                this.loading = true

                try {
                    const payment_month = new Date(this.date)
                    payment_month.setHours(0)
                    const data = await this.$store.dispatch("fetchEmployeePaymentList", {payment_month})
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
    .rightText{
        text-align: right;
    }
    .flexStart{
        align-content: flex-start;
    }
    h4{
        border-top: thin solid rgba(0, 0, 0, 0.12);
        border-bottom: thin solid rgba(0, 0, 0, 0.12);
        background-color: rgba(0, 0, 0, 0.12);
    }

</style>
