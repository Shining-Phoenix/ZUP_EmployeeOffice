<template>
    <div class="employee-tabel">
    <h3 v-if="showBlockName" class="mt-3 mb-3"> Табельный номер: {{ tabelData.tabel_data['ТабНом'] }}</h3>
    <h3 class="mb-1"> Данные по дням: </h3>
        <table border="1"
               width="100%"
                class="employee-tabel_table">
            <tbody

                    ref="dateTable"
            >
             </tbody>
        </table>
        <h3 class="mt-3 mb-1"> Отработано за месяц:</h3>
        <table border="1"
               width="30%"
               class="employee-tabel_table">
            <tbody
            >
                <tr class="employee-tabel_row-days">
                    <td class="employee-tabel_header-days employee-tabel_row-days__td">Дней</td>
                    <td class="employee-tabel_row-days__td">{{ tabelData.tabel_data['ДниЗаМесяц'] }}</td>
                </tr>
                <tr class="employee-tabel_row-days">
                    <td class="employee-tabel_header-days employee-tabel_row-days__td">Часов</td>
                    <td class="employee-tabel_row-days__td">{{ tabelData.tabel_data['ЧасыЗаМесяц'] }}</td>
                </tr>
            </tbody>
        </table>

        <h3 v-if="tabelData.tabel_data['ОтклоненияПоСотруднику'].length"
            class="mt-3 mb-1">Отклонения:</h3>

        <table
               v-if="tabelData.tabel_data['ОтклоненияПоСотруднику'].length"
               border="1"
               width="30%"
               class="employee-tabel_table">
            <tbody
            >
            <tr class="employee-tabel_header-days">
                <td class="employee-tabel_row-days__td">Код</td>
                <td class="employee-tabel_row-days__td">Дни/часы</td>
            </tr>
            <tr class="employee-tabel_row-days"
                v-for="item of tabelData.tabel_data['ОтклоненияПоСотруднику']"
                :key="item.index">
                <td class="employee-tabel_row-days__td">{{ item.НеявкаКод }}</td>
                <td class="employee-tabel_row-days__td">{{ item.НеявкаДниЧасы }}</td>
            </tr>
            </tbody>
        </table>

    </div>
    
</template>

<script>
    export default {
        name: "EmployeeTabel",
        props:['tabelData',
               'month',
               'showBlockName'],
        mounted() {
            let innerHTML = this.$refs.dateTable.innerHTML
            const dayCount = this.getMaxDate()
            const colCount = dayCount === 31 ? 16 : 15

            innerHTML = '<tr class="employee-tabel_header-days">'
            for (let i=1; i <= colCount; i++){
                if (i === colCount && colCount === 16) {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + 'x' + '</td>'
                } else {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + i + '</td>'
                }
            }
            innerHTML += '</tr>'

            innerHTML += '<tr class="employee-tabel_row-days">'
            for (let i=1; i <= colCount; i++){
                if (i === colCount && colCount === 16) {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + 'x' + '</td>'
                } else {
                    if (this.tabelData.tabel_data['Символ' + i] )
                        innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + this.tabelData.tabel_data['Символ' + i]  + '</td>'
                    else
                        innerHTML += '<td width="5%" class="employee-tabel_row-days__td"></td>'
                }
            }
            innerHTML += '</tr>'

            innerHTML += '<tr class="employee-tabel_row-days">'
            for (let i=1; i <= colCount; i++){
                if (i === colCount && colCount === 16) {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + 'x' + '</td>'
                } else {
                    if (this.tabelData.tabel_data['ДополнительноеЗначение' + i] )
                        innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + this.tabelData.tabel_data['ДополнительноеЗначение' + i]  + '</td>'
                    else
                        innerHTML += '<td width="5%" class="employee-tabel_row-days__td"></td>'
                }
            }
            innerHTML += '</tr>'

            innerHTML += '<tr class="employee-tabel_header-days">'
            for (let i=16; i <= colCount + 15; i++){
                if (i > dayCount) {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + 'x' + '</td>'
                } else {
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + i + '</td>'
                }
            }
            innerHTML += '</tr>'

            innerHTML += '<tr class="employee-tabel_row-days">'
            for (let i=16; i <= dayCount; i++){
                    if (this.tabelData.tabel_data['Символ' + i] )
                        innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + this.tabelData.tabel_data['Символ' + i]  + '</td>'
                    else
                        innerHTML += '<td width="5%"></td>'
            }
            innerHTML += '</tr>'

            innerHTML += '<tr class="employee-tabel_row-days">'
            for (let i=16; i <= dayCount; i++){

                if (this.tabelData.tabel_data['ДополнительноеЗначение' + i] )
                    innerHTML += '<td width="5%" class="employee-tabel_row-days__td">' + this.tabelData.tabel_data['ДополнительноеЗначение' + i]  + '</td>'
                else
                    innerHTML += '<td width="5%"></td>'
            }
            innerHTML += '</tr>'

            this.$refs.dateTable.innerHTML = innerHTML
        },
        methods:{
            getMaxDate(){
                const firstDay = new Date(this.month)
                const y = firstDay.getFullYear()
                const m = firstDay.getMonth()

                if (m===1){
                    return y%4 || (y%100 && y%400) ? 28 : 29
                }

                return m===3 || m===5 || m===8 || m===10 ? 30: 31
            }
        }
    }
</script>

<style>
    .employee-tabel{
        width: 100%;
    }
    .employee-tabel_table{
        border-collapse: collapse;
        border-color: #212121;
    }
    .employee-tabel_header-days{
        background-color: #212121;
        color: #E0E0E0;
    }
    .employee-tabel_row-days{
        min-height: 50px;
    }

    .employee-tabel_row-days__td{
        text-align: center;
    }

</style>