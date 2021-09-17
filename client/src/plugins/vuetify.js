import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#9c27b0',
            secondary: '#673ab7',
            accent: '#00bcd4',
            error: '#e91e63',
            warning: '#f44336',
            info: '#3f51b5',
            success: '#009688', 
            },
            dark: {
                primary: '#9c27b0',
                secondary: '#673ab7',
                accent: '#00bcd4',
                error: '#e91e63',
                warning: '#f44336',
                info: '#3f51b5',
                success: '#009688', 
                },
        },
      },  
    lang:{
        locales: { ru },
        current: 'ru'
    }
});
