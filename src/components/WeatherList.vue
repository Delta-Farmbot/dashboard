<template>
    <v-card class="mx-auto">
        <v-card-title class="white--text light-blue lighten-2">
            Weather overview
        </v-card-title>

        <v-list>
            <template v-for="(item, i) in weatherItems">
                <v-list-item :key="i">
                    <v-list-item-icon class="ma-0">
                        <v-img
                            :src="item.icon"
                            width="47"
                        />
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>
                            <v-row>
                                <v-col cols="4">
                                    {{ item.date }}
                                </v-col>

                                <v-col cols="5">
                                    {{ _.capitalize(item.weather[0].description) }}
                                </v-col>
                            </v-row>
                        </v-list-item-title>
                    </v-list-item-content>


                    <v-list-item-action>
                        {{ item.temperature }}
                    </v-list-item-action>
                </v-list-item>

                <v-divider
                    v-if="i < weatherItems.length - 1"
                    :key="'divider_' + i"
                />
            </template>
        </v-list>
    </v-card>
</template>

<script>
    export default {
        name: 'Weather',

        props: {
            weatherItems: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
