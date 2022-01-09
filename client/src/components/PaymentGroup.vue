<template>
    <div>
        <h4 primary class="pl-1"> {{ data.name }}</h4>
        <v-simple-table v-if = "data.items.length && data.items.length != 0 ">
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

</style>