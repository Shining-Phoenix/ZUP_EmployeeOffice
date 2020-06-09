<template>
    <div class="div-calendar" align=center>
        <table class="calendar" border="0" cellspacing="0" cellpadding="1">
            <thead>
            <tr>
                <td colspan="7">
                {{months[month]}}
                </td>
            </tr>
            <tr>
                <td v-for="headDay of weekabbrs"
                    :key="headDay">
                    {{headDay}}
                </td>
            </tr>
            </thead>
            <tbody ref="tableBody">
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "calendar-month",
        data: function () {
            return {
                weekabbrs: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                months : [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
            }
        },
        props:[
            'year',
            'month',
            'days'
        ],
        mounted() {
            this.$refs.tableBody.innerHTML = this.calendar(+this.year, +this.month)
        },
        methods:
            {calendar(year, month) {
                    let Dlast = new Date(year, month + 1, 0).getDate()
                    const D = new Date(year, month, Dlast)
                    const Dfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay()
                    let calendar = '<tr>'
                    if (Dfirst != 0) {
                        for (let i = 1; i < Dfirst; i++) calendar += '<td> </td>'
                    } else {
                        for (let i = 0; i < 6; i++) calendar += '<td> </td>'
                    }

                    for (let i = 1; i <= Dlast; i++) {
                        const arrayDay = this.days.find((currentValue)=>{
                            const dayNumber = new Date(currentValue.work_date).getDate()
                            return dayNumber === i
                        })

                        if (arrayDay && arrayDay.work_hour && arrayDay.work_hour != 0) {
                            calendar += '<td class="working">' + i + '</td>'
                        }
                        else if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
                            calendar += '<td class="today">' + i + '</td>'
                        } else {
                            calendar += '<td>' + i + '</td>'
                        }
                        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
                            calendar += '</tr> <tr>'
                        }
                    }

                    calendar += ' </tr>'

                    return calendar
                }
            }
    }
</script>

<style>
    .calendar {
        width: 100%;
        font: monospace;
        line-height: 1.2em;
        font-size: 15px;
        text-align: center;
    }
    .calendar thead tr:first-child {
        font-size: large;
        background-color: #212121;
        color: #E0E0E0;
    }
    .calendar thead tr:last-child {
        font-size: medium;
        background-color: gray;
        color: white;
    }
    .calendar tbody td {
        color: rgb(44, 86, 122);
    }
    .calendar tbody td:nth-child(n+6), .calendar .holiday {
        color: rgb(231, 140, 92);
    }
    .calendar tbody td.today {
        background: rgb(220, 0, 0);
        color: #fff;
    }
    .calendar tbody td.working {
        background: #E0E0E0;
        color: black;
    }
    .div-calendar{
        width:100%;
        border:1px
        solid grey;
        padding:6px;
    }
</style>