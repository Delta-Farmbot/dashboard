<template>
    <v-card height="623">
        <v-card-title class="white--text deep-purple">
            Farmie's info
        </v-card-title>

        <br>

        <v-img
            class="mx-auto"
            :src="require(`../assets/logo.svg`)"
            width="400"
        />

        <v-card-subtitle>
            <h1 class="mt-5 pa-5 pt-0" style="line-height: 34px">
                Hi I'm Farmie! Outside I am taking care of a lot of vegetables.

                <br>

                I water all the plants and take pictures of them so we can track the progress of the plants.
            </h1>
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
