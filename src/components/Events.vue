<template>
    <v-card
        class="mx-auto"
        height="245"
    >
        <v-card-title class="white--text deep-purple">
            My next actions
        </v-card-title>

        <v-virtual-scroll
            item-height="50"
            :items="events"
        >
            <template v-slot:default="{ item }">
                <v-list-item :key="item.id">
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                            {{ item.name }}
                        </v-list-item-title>
                    </v-list-item-content>


                    <v-list-item-action>
                        {{ item.dateFormat }}
                    </v-list-item-action>
                </v-list-item>

                <v-divider />
            </template>
        </v-virtual-scroll>
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
