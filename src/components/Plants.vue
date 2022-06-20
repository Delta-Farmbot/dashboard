<template>
    <v-card
        class="mx-auto"
        height="1"
    >
        <v-card-title class="white--text green">
            What is growing right now?
        </v-card-title>

        <v-row dense>
            <v-col
                v-for="(plantType, i) in plantTypes"
                :key="i"
                cols="6"
            >
                <v-card :class="i < 2 ? 'rounded-t-0' : ''" height="181">
                    <br>
                    <v-img
                        class="mx-auto"
                        :src="openfarmSlugs.includes(plantType) ? require(`../assets/plants/${plantType}.svg`) : require('../assets/plants/plant.png')"
                        width="130"
                    />

                    <div>
                        <v-card-title
                            class="text-h5 font-weight-bold"
                            style="margin-top: -50px"
                            v-text="getPlantsOfType(plantType).length"
                        />

                        <v-card-subtitle style="font-size: 16px" v-text="_.startCase(plantType)" />
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: 'Plants',

        props: {
            plants: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                openfarmSlugs: ['beetroot', 'carrot', 'leek', 'radish', 'spinach', 'swiss-chard'],
            };
        },

        computed: {
            plantTypes () {
                return _.uniq(_.map(this.plants, 'openfarm_slug'));
            },
        },

        methods: {
            getPlantsOfType (plantType) {
                return _.filter(this.plants, {openfarm_slug: plantType});
            },
        },
    };
</script>
