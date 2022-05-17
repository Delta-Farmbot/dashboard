import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueLodash, { lodash: lodash });

new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
