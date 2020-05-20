<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Личный кабинет сотрудника</span>
            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model.trim="email"
                        :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
                >
                <label for="email">Email</label>
                <small
                        class="helper-text invalid"
                        v-if="$v.email.$dirty && !$v.email.required"
                >Поле Email не должно быть пустым</small>
                <small
                        class="helper-text invalid"
                        v-else-if="$v.email.$dirty && !$v.email.email"
                >Введен не корректный Email</small>
            </div>
            <div class="input-field">
                <input
                        id="password"
                        type="password"
                        v-model.trim="password"
                        :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
                >
                <label for="password">Пароль</label>
                <small
                        class="helper-text invalid"
                        v-if="$v.password.$dirty && !$v.password.required"
                >Поле Пароль не должно быть пустым</small>
                <small
                        class="helper-text invalid"
                        v-else-if="$v.password.$dirty && !$v.password.minLength"
                >Пароль должен быть {{$v.password.$params.minLength.min}} символов или больше. Сейчас
                    {{password.length}}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                        :disabled="$v.$invalid || loading"
                >
                    Войти
                    <i class="material-icons right">send</i>
                </button>
            </div>

        </div>
    </form>
</template>

<script>
    import messages from '@/utils/messages'
    import {email, required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: 'login',
        data: () => ({
            email: '',
            password: ''
        }),
        computed: {
            loading() {
                return this.$store.getters.loading
            }
        },
        validations: {
            email: {email, required},
            password: {required, minLength: minLength(6)}
        },
        mounted() {
            if (messages[this.$route.query.message]) {
                this.$message(messages[this.$route.query.message])
            }
        },
        methods: {
            async submitHandler() {

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
            }
        }
    }

</script>
