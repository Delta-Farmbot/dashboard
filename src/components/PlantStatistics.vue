<template>
    <v-card height="0">
        <v-card-title class="white--text orange">
            Plant statuses
        </v-card-title>

        <v-row dense>
            <v-col
                cols="12"
            >
                <v-card class="rounded-t-0">
                    <v-card-title
                        class="text-h5"
                        v-text="harvestedPlants.length"
                    />

                    <v-card-subtitle>Harvested</v-card-subtitle>
                </v-card>
            </v-col>

            <v-col
                cols="12"
            >
                <v-card class="rounded-t-0">
                    <v-card-title
                        class="text-h5"
                        v-text="sproutedPlants.length"
                    />

                    <v-card-subtitle>Sprouted</v-card-subtitle>
                </v-card>
            </v-col>

            <v-col
                cols="12"
            >
                <v-card>
                    <v-card-title
                        class="text-h5"
                        v-text="plantedPlants.length"
                    />

                    <v-card-subtitle>Planted</v-card-subtitle>
                </v-card>
            </v-col>

            <v-col
                cols="12"
            >
                <v-card>
                    <v-card-title
                        class="text-h5"
                        v-text="plannedPlants.length"
                    />

                    <v-card-subtitle>Planned</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: 'PlantStatistics',

        props: {
            harvestedPlants: {
                type: Array,
                default: () => [],
            },

            sproutedPlants: {
                type: Array,
                default: () => [],
            },

            plantedPlants: {
                type: Array,
                default: () => [],
            },

            plannedPlants: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
