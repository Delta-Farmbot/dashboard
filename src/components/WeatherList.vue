<template>
    <v-card
        class="mx-auto"
        height="300"
    >
        <v-list>
            <v-list-item-group
                color="primary"
            >
                <v-list-item
                    v-for="(item, i) in weatherItems"
                    :key="i"
                >
                    <v-list-item-icon class="ma-0">
                        <v-img
                            :src="item.icon"
                            width="55"
                        />
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                            {{ item.date }}
                        </v-list-item-title>
                    </v-list-item-content>


                    <v-list-item-action>
                        {{ item.temperature }}
                    </v-list-item-action>
                </v-list-item>
            </v-list-item-group>
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
