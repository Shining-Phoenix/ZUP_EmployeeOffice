<template>
    <div>
        <v-container class="page-title">
            <h3>История заявок </h3>
        </v-container>
        <v-container v-if="loading">
            <Loader/>
        </v-container>

        <v-container
                v-else
                class="fill-height mb-0 pt-0"
                fluid
                dark>
            <v-row>
                <v-col cols="12" class="mt-0 pt-0">
                    <v-data-table
                            :headers="headers"
                            :items="records"
                            locale="ru"
                            item-key="pk"
                            no-data-text="Заявки не найдены"

                    >
                        <template v-slot:item.doc_date="{ item }">
                            <v-chip v-if="item.deleted"
                                    :color="'red'"
                            >{{item.doc_date | dateFormat('DD.MM.YYYY HH:mm:ss')}}
                            </v-chip>
                            <v-chip v-else-if="item.disabled_on_web"
                                    :color="'#E0E0E0'"
                            >{{item.doc_date | dateFormat('DD.MM.YYYY HH:mm:ss')}}
                            </v-chip>
                            <span v-else>{{item.doc_date | dateFormat('DD.MM.YYYY HH:mm:ss')}}</span>
                        </template>
                        <template v-slot:top>
                            <v-btn
                                    text
                                    color="normal"
                                    @click="$router.push('/new-inquiry-request')">
                                <v-icon
                                        small
                                        class="mr-2"
                                >
                                    mdi-plus-circle
                                </v-icon>
                                Добавить
                            </v-btn>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                    small
                                    @click="editItem(item)"
                            >
                                mdi-pencil
                            </v-icon>
                            <v-icon
                                    small
                                    @click="deleteItem(item)"
                                    :disabled="item.disabled_on_web"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    export default {
        name: "inquiry-request-list",
        data: () => ({
            loading: true,
            headers: [
                {text: 'Дата', value: 'doc_date', sortable: false},
                {text: 'Статус', value: 'status', sortable: false},
                {text: 'Тип', value: 'type_name', sortable: false},
                {text: 'Действия', value: 'actions', sortable: false},
            ],
        }),
        computed: {
            records() {
                return this.$store.getters.inquiryRequestList
            },
        },
        async mounted() {
            await this.$store.dispatch('fetchInquiryRequestsByUser')
            this.loading = false
        },
        methods: {
            editItem(item) {
                try {
                    this.$router.push('/inquiry-request/' + item.pk)
                } catch (e) {
                    1 + 1
                }
            },

            async deleteItem(item) {
                try {
                    item.deleted = !item.deleted
                    await this.$store.dispatch('updateInquiryRequest', item)
                } catch (e) {
                    1 + 1
                }
            },

        },
    }
</script>

<style>

    .v-data-table-header{
        background-color: #212121;
    }
    .theme--light.v-data-table thead tr th{
        color: #E0E0E0;
        font-size: 16px;
    }

</style>