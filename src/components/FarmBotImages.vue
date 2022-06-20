<template>
    <v-card
        class="mx-auto"
    >
        <v-card-title class="white--text" style="background-color: #15a6b0">
            Taken images
        </v-card-title>

        <v-carousel
            cycle
            height="100%"
            hide-delimiters
            interval="4000"
            :show-arrows="false"
        >
            <v-carousel-item
                v-for="(item,i) in images"
                :key="i"
                eager
            >
                <v-img eager :src="item.attachment_url" />
            </v-carousel-item>
        </v-carousel>
    </v-card>
</template>

<script>
    export default {
        name: 'FarmBotImages',

        props: {
            images: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
