<template>
    <div>
        <div class="row">
            <div class="input-field col">
                <select
                        ref="selectMonth">
                    <option v-for="item in months" :key="item.id"
                            v-bind:class="{selected: item.sel} "
                            :value="item.id"
                            :selected="item.sel"
                            >{{ item.value }}
                    </option>
                </select>
                <label>Выберете месяц</label>
            </div>
            <div class="input-field col">
                <select
                        ref="selectYear">
                    <option v-for="year in years" :key="year.year"
                            :value="year.year"
                            :selected="year.sel"
                            >{{ year.year }}
                    </option>
                </select>
                <label>Выберете год</label>
            </div>
            <a class="waves-effect waves-teal btn-large"
               @click="getPaymentList"
               :disabled = "loading"
            >
                Сформировать</a>
        </div>
        <Loader v-if="loading"/>
        <div v-else-if="!loading && paiments.length && paiments.length > 0" class="row">
            <div>
                <div v-for = "(groupItem) in paiments"
                     :key="groupItem.group">
                        <h6>{{ groupItem.group }}</h6>
                        <table>
                            <tbody>
                            <tr v-for = "item in groupItem.items"
                                :key="item.payment_position">
                                <td width="80%" class="no-padding">{{ item.payment_position }}</td>
                                <td width="20%" class="no-padding rightText">{{ item.payment_sum | numeral('0,0.00')  }}</td>
                            </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
        <h5 v-else-if="!loading">Данные отсутствуют</h5>
    </div>


</template>

<script>
    import M from 'materialize-css/dist/js/materialize.min'

    export default {
        name: "payment-list",
        data: () => ({
            date: new Date(),
            loading: true,
            months: [
                {id: 1, value: 'Январь',},
                {id: 2, value: 'Февраль'},
                {id: 3, value: 'Март'},
                {id: 4, value: 'Апрель'},
                {id: 5, value: 'Май'},
                {id: 6, value: 'Июнь',},
                {id: 7, value: 'Июль'},
                {id: 8, value: 'Август'},
                {id: 9, value: 'Сентябрь'},
                {id: 10, value: 'Октябрь'},
                {id: 11, value: 'Ноябрь'},
                {id: 12, value: 'Декабрь'}],
            years: [],
            paiments: [],
            selectMonth: null,
            selectYear: null
        }),
        methods: {
            async getPaymentList() {
                this.loading = true

                //TODO разобраться
                const textMonth = this.selectMonth.input.value.slice(0, -1)
                const textYear = this.selectYear.input.value.slice(0, -1)
                const valueMonth = this.months.find(value => value.value === textMonth).id

                try {
                    //TODO разобраться
                    const payment_month = new Date(textYear, valueMonth-1, 1, 0, 0, 0, 0)
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
        created() {

            const year = this.date.getFullYear()

            for (let step = year - 30; step < year + 31; step++) {
                this.years.push({year: step})
            }
            this.years[30].sel = 'selected';
            this.months[this.date.getMonth()].sel = 'selected';

        },
        mounted() {
            this.selectMonth = M.FormSelect.init(this.$refs.selectMonth, {defaults: [2]})
            this.selectYear = M.FormSelect.init(this.$refs.selectYear, {defaults: [2]})
            this.getPaymentList()

        },

    }
</script>

<style scoped>
    h6{
        margin-top: 0px;
        background-color: #e1f5fe;
    }
    .rightText{
        text-align: right;
    }
</style>
