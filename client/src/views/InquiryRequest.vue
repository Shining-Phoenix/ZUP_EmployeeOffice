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
                                type="submit"
                                :disabled="record.deleted || record.disabled_on_web"
                        >Записать
                        </v-btn>
                        <v-btn @click="$router.push('/inquiry-request-list')">Отменить</v-btn>
                    </form>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-else>
            <h3>Такого документа нет</h3>
        </v-container>
    </div>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import {maxLength} from "vuelidate/lib/validators";

    export default {
        name: "inquiry-request",
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
                    text: "Редактирование заявки на справку"
                }],
            record: null,
            types: null,
            typesSel: [],
            selectedType: null,
            description: null,
            loading: true
        }),
        async mounted() {
            const id = +this.$route.params.id
            if (this.$store.getters.inquiryRequestList === null){
                await this.$store.dispatch('fetchInquiryRequestsByUser')
            }
            this.record = this.$store.getters.inquiryRequestListByPk(id)
            if (this.record){
                this.types = await this.$store.dispatch('fetchInquiryRequestTypes')
                this.types.forEach((item) => this.typesSel.push({
                    text: item.type_name,
                    value: item.pk
                }))
                this.selectedType = this.record.type_pk
                this.description = this.record.description}

            this.loading = false

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
                this.record.description = this.description
                try {
                    await this.$store.dispatch('updateInquiryRequest', this.record)
                    this.$router.push('/inquiry-request-list')
                } catch (e) {
                    1+1
                }

            }
        }
    }
</script>

<style scoped>

</style>