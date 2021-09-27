<template>
    <div class="width100 pr-0 pl-0">
        <h3 
        v-if="showBlockName" class="mt-3 employee-block-head"> Таб. № {{ tabNom }}</h3>
        <h3 v-if="showBlockName" class="employee-tabel_head"> {{ organizationName}}</h3>
        <h3 v-if="showBlockName" class="mb-3 employee-tabel_head"> {{ positionName }}</h3>

           <v-row  
                v-if="nachisleno.items.length || lgoti.items.length || uderzano.items.length || viplacheno.items.length"
           
                class="mt-0 pt-0 mr-0">
                <v-col cols="6" class="mt-0 pt-0 ">
                    <payment-group
                        v-if="nachisleno.items.length"
                        :data="nachisleno"
                    ></payment-group>
                    <payment-group
                            v-if="lgoti.items.length"
                            :data="lgoti"
                    ></payment-group>
                </v-col>
                <v-col cols="6" class="mt-0 pt-0 ">
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
            <v-row v-if ="dolgZaPredpriyztiemNaNachalo.items.length || dolgZaPredpriyztiemNaKonec.items.length" 
                class="mr-0">
                <v-col cols="6">
                    <payment-group
                            v-if="dolgZaPredpriyztiemNaNachalo.items.length"
                            :data="dolgZaPredpriyztiemNaNachalo"
                    ></payment-group>
                </v-col>
                <v-col cols="6">
                    <payment-group
                            v-if="dolgZaPredpriyztiemNaKonec.items.length"
                            :data="dolgZaPredpriyztiemNaKonec"
                    ></payment-group>
                </v-col>
            </v-row>
    </div>        
</template>

<script>
    import PaymentGroup from "../components/PaymentGroup";

    export default {
        components: {PaymentGroup},
        name: "payment-list-object",
        props: [
            'showBlockName',
            'tabNom',
            'subdivisionName',
            'positionName',
            'organizationName',
            'typeOfEmployment',
            'dolgZaPredpriyztiemNaNachalo',
            'dolgZaPredpriyztiemNaKonec',
            'nachisleno',
            'uderzano',
            'viplacheno',
            'lgoti']
    }
</script>

<style>
    .width100{
        width: 100%;
    }

    .employee-tabel_head{
        background-color: #EE82EE;
        padding-left: 5mm;
        border-bottom-width: 1mm;
        color: black;
        border-bottom: 2mm;
        border-bottom-color: darkgreen;
    }

    .employee-block-head{
        background-color:#9c27b0;
        padding-left: 5mm;
    }
</style>