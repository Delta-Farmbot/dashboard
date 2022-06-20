<template>
    <v-card
        class="mx-auto"
    >
        <v-card-title class="white--text grey">
            My next actions
        </v-card-title>

        <v-list>
            <template v-for="(event, index) in events">
                <v-list-item :key="index">
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                            {{ event.name }}
                        </v-list-item-title>
                    </v-list-item-content>


                    <v-list-item-action>
                        {{ event.dateFormat }}
                    </v-list-item-action>
                </v-list-item>

                <v-divider
                    v-if="index < events.length - 1"
                    :key="'divider_' + index"
                />
            </template>
        </v-list>
    </v-card>
</template>

<script>
    export default {
        name: 'Events',

        props: {
            events: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
