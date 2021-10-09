<template>
    <div>
        <v-breadcrumbs
                :items="breadcrumbItems"
                large
                light>

            <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                        :to="item.to"
                        :disabled="item.link"
                >
                    <h3> {{ item.text }} </h3>
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>
        <v-container v-if="loading">
            <Loader/>
        </v-container>
        <v-container
                v-else-if="record"
                class="fill-height"
                fluid
                dark>
            <v-row>
                <v-col
                        cols="12"
                        sm="8"
                        md="4">
                    <form @submit.prevent="handleSubmit">
                        <v-text-field
                                v-model="record.doc_date_str"
                                label="Дата"
                                required
                                :disabled="true"
                        ></v-text-field>
                        <v-select
                                ref="employeesSel"
                                :items="employeesSel"
                                label="Сотрудник"
                                v-model="selectedEmployee"
                                :disabled="record.deleted || record.disabled_on_web"
                        ></v-select>
                        <v-select
                                ref="typesSel"
                                :items="typesSel"
                                label="Тип справки"
                                v-model="selectedType"
                                :disabled="record.deleted || record.disabled_on_web"
                        ></v-select>
                        <v-text-field
                                v-model="record.status"
                                label="Статус"
                                :disabled="true"
                        ></v-text-field>
                        <v-textarea
                                v-model="description"
                                counter
                                label="Комментарии"
                                :error-messages="descriptionErrors"
                                @input="$v.description.$touch()"
                                @blur="$v.description.$touch()"
                                :disabled="record.deleted || record.disabled_on_web"
                        ></v-textarea>
                        <v-btn
                                class="mr-4"
                                color = "#9c27b0"
                                type="submit"
                                :disabled="record.deleted || record.disabled_on_web"
                        >Записать
                        </v-btn>
                        <v-btn 
                            @click="$router.push('/inquiry-request-list')"
                            color = "#EE82EE"

                        >Отменить</v-btn>
                    </form>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-else>
            <h3>Ошибка подготовки данных</h3>
        </v-container>
    </div>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import {maxLength} from "vuelidate/lib/validators";

    export default {
        name: "new-inquiry-request",
        mixins: [validationMixin],
        validations: {
            description: {minLength: maxLength(1000)}},
        data: () => ({
            breadcrumbItems: [{
                to: "/inquiry-request-list",
                link: false,
                text: "История заявок"
            },
                {
                    link: false,
                    text: "Создание заявки на справку"
                }],
            record: null,
            types: null,
            typesSel: [],
            selectedType: null,
            employees: null,
            employeesSel: [],
            selectedEmployee: '',
            description: null,
            loading: true
        }),
        async mounted() {

            try {
                if (this.$store.getters.inquiryRequestList === null) {
                    await this.$store.dispatch('fetchInquiryRequestsByUser')
                }
                this.types = await this.$store.dispatch('fetchInquiryRequestTypes')
                this.types.forEach((item) => this.typesSel.push({
                    text: item.type_name,
                    value: item.pk
                }))
                
                this.employees = await this.$store.dispatch('fetchEmployeeData')
                this.employees.forEach((item) => this.employeesSel.push({
                    text: item.tab_nom + ' (' + item.organization_name + ' - ' + item.position_name + ')',
                    value: item.employee_pk
                }))

                const record = {
                    deleted: false,
                    description: '',
                    disabled_on_web: false,
                    doc_date: new Date(),
                    doc_date_str: null,
                    doc_number: '',
                    pk: null,
                    status: null,
                    status_pk: 1,
                    type_name: this.typesSel[0].text,
                    type_pk: this.typesSel[0].value,
                    user_pk: null,
                    emploees_name: this.employeesSel[0].text,
                    employee_pk: this.employeesSel[0].value,
                }
                record.doc_date_str = record.doc_date.toLocaleString()
                record.status = 'Новый'
                this.selectedType = record.type_pk
                this.selectedEmployee = record.employee_pk
                this.record = record
            }finally {
                this.loading = false
            }
        },
        computed: {
            descriptionErrors() {
                const errors = []
                if (!this.$v.description.$dirty) return errors
                !this.$v.description.minLength && errors.push('Описание должно быть короче 1000 символов')
                return errors},
        },
        methods: {
            async handleSubmit() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                const idx = this.types.findIndex(t => t.pk === this.selectedType)
                this.record.type_name = this.types[idx].type_name
                this.record.type_pk = this.selectedType
                this.record.employee_pk = this.selectedEmployee
                this.record.description = this.description
                try {
                    await this.$store.dispatch('createInquiryRequest', this.record)
                    this.$router.push('/inquiry-request-list')
                } catch (e) {
                    1+1
                }
            }
        }
    }
</script>


