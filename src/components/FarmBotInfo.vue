<template>
    <v-card height="300">
        <v-img
            class="mx-auto"
            :src="require(`../assets/logo.svg`)"
            width="190"
        />

        <v-card-title>
            Farmie's stats
        </v-card-title>

        <v-card-subtitle>
            Hi I'm Farmie! Outside I am taking care of a lot of vegatables. Here is some info about what I am doing.
        </v-card-subtitle>
    </v-card>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'FarmBotInfo',

        props: {
            weather: {
                type: Object,
                default: () => {},
            },
        },

        data () {
            return {
                dateNow: null,
            };
        },

        created() {
            this.todayDate();

            setInterval(this.todayDate, 1000);
        },

        methods: {
            todayDate () {
                this.dateNow = moment().format('MMMM Do YYYY HH:mm:ss');
            },
        },
    };
</script>
