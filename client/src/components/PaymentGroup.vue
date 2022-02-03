<template>
    <div>
        <h4 primary class="pl-1"> {{ data.name }}</h4>
        <v-simple-table v-if = "data.name === 'Начислено' && data.items.length && data.items.length != 0 ">
            <thead class="data_head">
                <tr>
                    <td rowspan="2" class="table_head">Вид</td>
                    <td rowspan="2" class="table_head text-md-center">Период</td>
                    <td colspan="2" class="table_head text-md-center">Рабочие</td>
                    <td rowspan="2" class="table_head text-md-center">Оплачено</td>
                    <td rowspan="2" class="table_head text-md-center">Сумма</td>
                </tr>
                <tr>
                    <td class="table_head">Дни</td>
                    <td class="table_head">Часы</td>
                </tr>
            </thead>    
            <tbody>
            <tr v-for = "item in data.items"
                :key="item.prioritet">
                <td width="35%" class="no-padding"> {{ item.payment_position }}</td>
                <td width="15%" class="no-padding"> {{ item.validity }}</td>
                <td width="5%" class="no-padding"> {{ item.days }}</td>
                <td width="5%" class="no-padding"> {{ item.hours }}</td>
                <td width="15%" class="no-padding"> {{ item.hours_or_days }}</td>
                <td width="25%" class="no-padding rightText">{{ item.payment_sum | numeral('0,0.00')  }}</td>
            </tr>
            </tbody>
        </v-simple-table>
        <v-simple-table v-else-if = "data.name === 'Удержано' && data.items.length && data.items.length != 0 ">
            <thead class="data_head">
                <tr>
                    <td class="table_head ">Вид</td>
                    <td class="table_head text-md-center">Период</td>
                    <td class="table_head text-md-center">Сумма</td>
                </tr>
            </thead>    
            <tbody>
            <tr v-for = "item in data.items"
                :key="item.prioritet">
                <td width="35%" class="no-padding"> {{ item.payment_position }}</td>
                <td width="15%" class="no-padding"> {{ item.validity }}</td>
                <td width="25%" class="no-padding rightText">{{ item.payment_sum | numeral('0,0.00')  }}</td>
            </tr> 
            </tbody>
        </v-simple-table>
        <v-simple-table v-else-if = "data.items.length && data.items.length != 0 ">
            <tbody>
                <tr v-for = "item in data.items"
                    :key="item.prioritet">
                    <td width="35%" class="no-padding"> {{ item.payment_position }}</td>
                    <td width="15%" class="no-padding"> {{ item.validity }}</td>
                    <td width="10%" class="no-padding rightText">{{ item.payment_sum | numeral('0,0.00')  }}</td>
                </tr>
            </tbody>
        </v-simple-table>
        <v-simple-table v-else>
            <tbody>
            <tr>
                <td width="40%" class="no-padding"></td>
                <td width="20%" class="no-padding rightText">{{ 0| numeral('0,0.00')  }}</td>
            </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script>
    export default {
        name: "payment-group",
        props: ['data']
    }
</script>

<style scoped>
    .rightText{
        text-align: right;
    }
    h4{
        border-top: thin solid rgba(0, 0, 0, 0.12);
        border-bottom: thin solid rgba(0, 0, 0, 0.12);
        background-color: #9c27b0;
        color: #E0E0E0;
    }
    .data_head{
        background-color: #EE82EE;
        color: black;
        border-bottom-color: darkgreen;
        width: 100%;
    }
    .table_head{
        border-color: #9c27b0;
        height: 30px;
        color: #9c27b0;
        font-weight: bold;
    }
    .body_td{
        color: #9c27b0;
    }

</style>