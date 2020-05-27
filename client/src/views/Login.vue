<template>
    <v-container
            class="fill-height"
            fluid
            dark
    >
        <v-row
                align="center"
                justify="center"
        >
            <v-col
                    cols="12"
                    sm="8"
                    md="4"
            >
                <form class="whiteBackGround">
                    <div class="row align-center justify-center">
                        <h2 class="card-title">Личный кабинет сотрудника</h2>
                    </div>
                    <v-text-field
                            v-model="email"
                            :error-messages="emailErrors"
                            label="E-mail"
                            required
                            @input="$v.email.$touch()"
                            @blur="$v.email.$touch()"
                    ></v-text-field>
                    <v-text-field
                            v-model="password"
                            :error-messages="passwordErrors"
                            :counter="6"
                            label="Пароль"
                            required
                            @input="$v.password.$touch()"
                            @blur="$v.password.$touch()"
                    ></v-text-field>
                    <div class="buttonDiv row align-center justify-center">
                        <v-btn
                                class="mr-4"
                                :disabled="$v.$invalid || loading"
                                @click.prevent="submit"
                        >Войти
                        </v-btn>
                        <v-btn @click="clear">Очистить</v-btn>
                    </div>
                </form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import messages from '@/utils/messages'
    import {validationMixin} from 'vuelidate'
    import {required, minLength, email} from 'vuelidate/lib/validators'

    export default {
        name: 'login',
        mixins: [validationMixin],
        validations: {
            email: {required, email},
            password: {required, minLength: minLength(6)},
        },
        data: () => ({
            email: '',
            password: ''
        }),
        computed: {
            passwordErrors() {
                const errors = []
                if (!this.$v.password.$dirty) return errors
                !this.$v.password.minLength && errors.push('Пароль должно быть 6 символов или больше')
                !this.$v.password.required && errors.push('Поле обязательно для заполнения')
                return errors
            },
            emailErrors() {
                const errors = []
                if (!this.$v.email.$dirty) return errors
                !this.$v.email.email && errors.push('Введен не правильный e-mail')
                !this.$v.email.required && errors.push('Поле обязательно для заполнения')
                return errors
            },
            loading() {
                return this.$store.getters.loading
            }
        },
        mounted() {
            if (messages[this.$route.query.message]) {
                this.$store.commit('setError', messages[this.$route.query.message])
            }
        },
        methods: {
            async submit() {

                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }

                const formData = {
                    email: this.email,
                    password: this.password
                }

                try {
                    this.$store.commit('clearError')
                    this.$store.commit('setLoading', true)
                    await this.$store.dispatch('login', formData)
                    this.$store.commit('clearLoading')
                    this.$router.push('/')
                } catch (e) {
                    this.$store.commit('clearLoading')
                }
            },
            clear() {
                this.$v.$reset()
                this.password = ''
                this.email = ''
            },
        }
    }

</script>

<style>
    .buttonDiv{
        margin-top: 40px;
    }
    .whiteBackGround{
        background-color: white;
        padding: 30px;
    }
</style>
