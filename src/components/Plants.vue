<template>
    <v-row dense>
        <v-col
            v-for="(plantType, i) in plantTypes"
            :key="i"
            cols="6"
        >
            <v-card>
                <v-img
                    class="mx-auto"
                    :src="require(`../assets/plants/${plantType}.svg`)"
                    width="80"
                />

                <v-card-title
                    class="text-h5"
                    v-text="getPlantsOfType(plantType).length"
                />

                <v-card-subtitle v-text="_.startCase(plantType)" />
            </v-card>
        </v-col>
    </v-row>
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
