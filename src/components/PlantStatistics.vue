<template>
    <v-card height="0">
        <v-card-title class="white--text orange">
            Plant statuses
        </v-card-title>

        <v-row dense>
            <v-col
                v-for="(items, plantStage) in plantStages"
                :key="plantStage"
                cols="12"
            >
                <v-card
                    class="rounded-t-0"
                >
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title
                                class="text-h5"
                                v-text="items.length"
                            />

                            <v-card-subtitle v-text="_.capitalize(plantStage)" />
                        </div>

                        <v-avatar
                            class="ma-3"
                            size="50"
                            tile
                        >
                            <v-img :src="require(`../assets/plant-stages/${plantStage}.png`)" />
                        </v-avatar>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: 'PlantStatistics',

        props: {
            plantStages: {
                type: Object,
                default: () => {},
            },
        },
    };
</script>
