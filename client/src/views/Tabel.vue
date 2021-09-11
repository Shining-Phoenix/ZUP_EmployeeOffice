<template>
    <v-container
            class="fill-height flexStart"
            fluid>
        <div class="page-title">
            <h3>Табель учета рабочего времени</h3>
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
                        <v-btn text color="normal" @click="$refs.menu.save(date); getTabel()">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
        <Loader v-if="loading"/>
        <div
                v-else-if="!loading && tabelData.length && tabelData.length > 0"
                class="row ml-0 mt-3 mr-2 mb-10">
                <employee-tabel
                    v-for = "tabel of tabelData"
                    :key="tabel.index"
                    :tabelData="tabel"
                    :month="date"
                    :showBlockName="tabelData.length > 1"
                ></employee-tabel>
        </div>
        <v-row v-else-if="!loading">
            <v-col cols="12">
                <h3>Данные отсутствуют</h3>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import EmployeeTabel from "../components/EmployeeTabel";
    export default {
        components: {EmployeeTabel},
        name: "tabel",
        data: () => ({
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            loading: true,
            tabelData: null
        }),
        methods: {
            async getTabel() {
                this.loading = true

                try {
                    const tabel_month = new Date(this.date)
                    this.tabelData = await this.$store.dispatch("fetchEmployeeTabel", tabel_month)
                } catch (e) {
                   this.tabelData = []
                } finally {
                   this.loading = false
                }
            }
        },
        mounted() {
            this.getTabel()
        },

    }
</script>

<style scoped>

    .flexStart {
        align-content: flex-start;
    }

</style>
