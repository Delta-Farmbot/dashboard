<template>
    <v-card height="370">
        <v-card-title class="white--text light-blue lighten-2">
            Weather right now
        </v-card-title>

        <v-img
            class="mx-auto"
            :src="weather.icon"
            width="180"
        />

        <v-card-title>
            <p class="mx-auto">
                {{ _.capitalize(weather.weather[0].description) }}
            </p>
        </v-card-title>

        <v-card-subtitle>
            <span class="font-weight-bold">
                {{ weather.temperature }}
            </span>

            <br>

            {{ dateNow }}
        </v-card-subtitle>
    </v-card>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'Weather',

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
