<template>
    <v-app>
        <v-container fluid>
            <Dashboard />
        </v-container>
    </v-app>
</template>

<script>
    import Dashboard from '@/components/Dashboard';

    export default {
        name: 'App',

        components: { Dashboard },
    };
</script>
