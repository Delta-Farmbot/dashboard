<template>
    <v-row class="ma-5">
        <v-col cols="5">
            <v-row class="text-center" dense>
                <v-col cols="6">
                    <WeatherComponent v-if="weather.current != null" :weather="weather.current" />
                </v-col>

                <v-col cols="6">
                    <WeatherList :weather-items="weather.hourly" />
                </v-col>
            </v-row>

            <PlantStatistics
                :harvested-plants="harvestedPlants"
                :planned-plants="plannedPlants"
                :planted-plants="plantedPlants"
                :sprouted-plants="sproutedPlants"
            />
        </v-col>

        <v-col cols="3">
            <FarmBotInfo />

            <v-card v-for="event in farmBot.events" :key="event.id" class="mt-2">
                <v-card-title
                    class="text-h5 text-break"
                >
                    {{ event.name }}
                </v-card-title>

                <v-card-subtitle>{{ event.dateFormat }}</v-card-subtitle>
            </v-card>
        </v-col>

        <v-col cols="4">
            <Plants v-if="plants.length !== 0" :plants="plants" />
        </v-col>
    </v-row>
</template>

<script>
    import axios from 'axios';
    import Weather from '../models/Weather';
    import moment from 'moment';
    import WeatherList from '@/components/WeatherList';
    import WeatherComponent from '@/components/Weather';
    import FarmBotInfo from '@/components/FarmBotInfo';
    import Plants from '@/components/Plants';
    import PlantStatistics from '@/components/PlantStatistics';

    export default {
        name: 'Dashboard',

        components: { PlantStatistics, Plants, FarmBotInfo, WeatherComponent, WeatherList },

        data () {
            return {
                weatherResponse: null,

                currentTemp: null,

                weatherApiData: {
                    weatherBaseUrl: 'https://api.openweathermap.org/data/2.5/onecall',
                    latitude: 51.441799,
                    longitude: 5.458090,
                    units: 'metric',
                    lang: 'en',
                    weatherAppKey: '75ec2d830e56f03e421ee67c3b2b56a3',
                    exclude: 'minutely,daily,alerts',
                },

                weather: {
                    current: null,
                    hourly: [],
                },

                farmbotToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoxNTAwMSwiaWF0IjoxNjUwODc1MzE3LCJqdGkiOiJmNTI3ZjFkOS1kNzg1LTRhZDAtOTgwYy04ZGYwNDM2MDU4YzEiLCJpc3MiOiIvL215LmZhcm0uYm90OjQ0MyIsImV4cCI6MTY1NjA1OTMxNywibXF0dCI6ImNsZXZlci1vY3RvcHVzLnJtcS5jbG91ZGFtcXAuY29tIiwiYm90IjoiZGV2aWNlXzE1MDI4Iiwidmhvc3QiOiJ4aWNvbmZ1bSIsIm1xdHRfd3MiOiJ3c3M6Ly9jbGV2ZXItb2N0b3B1cy5ybXEuY2xvdWRhbXFwLmNvbTo0NDMvd3MvbXF0dCJ9.X_zgXVKGP-5jyfvL7lWOAHk2sEkqpMk9U0i5Gg-GXYF1u0X9g7XaE3FodZ_zpFQJebAXBufHGX7igRBANHnqAXqIpbZAcb1bbKssnjS1VC9Ero6NvilMgDkAKEAZNfS2u41oFhsZbhn3lt5S6c8OieP5bf20sJlo2T9XHteOyyjDcWJ28KlzKfYRAAP6c_0NWm4xQFZLK1R0mnxXeJwaxdkX9uh-EYCG7bPO8IhKQj9hza-oJVeKU1YzDz7yh41lKk_mVN2Ssc1eZ8JXW6z3ACqhkEPDUaiYJX2dCqQ0mka4d7l9rpiFi-ztnIDsMCw75JIwt9D74f9lCM1lANleew',

                points: [],

                farmBot: {
                    sequences: null,
                    farmEvents: null,
                    events: [],
                },
            };
        },

        computed: {
            plants () {
                return _.filter(this.points, {pointer_type: 'Plant'});
            },

            plannedPlants () {
                return _.filter(this.plants, {plant_stage: 'planned'});
            },

            plantedPlants () {
                return _.filter(this.plants, {plant_stage: 'planted'});
            },

            sproutedPlants () {
                return _.filter(this.plants, {plant_stage: 'sprouted'});
            },

            harvestedPlants () {
                return _.filter(this.plants, {plant_stage: 'harvested'});
            },
        },

        created() {
            this.fetchWeather();
            this.fetchFarmBotData();

            setInterval(this.fetchWeather, 1000 * 60 * 10); // 10 minutes
            setInterval(this.fetchFarmBotData, 1000 * 60); // 1 minute
        },

        methods: {
            dateRange (startDate, endDate, unit) {
                const now = startDate.clone(), dates = [];

                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.toISOString());
                    now.add(1, unit);
                }

                return dates;
            },

            fetchWeather() {
                axios.get(`${this.weatherApiData.weatherBaseUrl}?lat=${this.weatherApiData.latitude}&lon=${this.weatherApiData.longitude}&appid=${this.weatherApiData.weatherAppKey}&units=${this.weatherApiData.units}&lang=${this.weatherApiData.lang}&exclude=${this.weatherApiData.exclude}`).then((response) => {
                    this.weatherResponse = response.data;

                    this.parseWeatherData();
                });
            },

            fetchFarmBotData: async function () {
                const config = {
                    headers: {Authorization: `Bearer ${this.farmbotToken}`},
                };

                await axios.get(`https://my.farmbot.io/api/points`, config).then((response) => {
                    this.points = response.data;
                });

                await axios.get(`https://my.farmbot.io/api/sequences`, config).then((response) => {
                    this.farmBot.sequences = response.data;
                });

                await axios.get(`https://my.farmbot.io/api/farm_events`, config).then(async (response) => {
                    this.farmBot.farmEvents = response.data;
                    this.farmBot.events = [];

                    const sequences = _.filter(this.farmBot.farmEvents, {executable_type: 'Sequence'});

                    for (let i = 0; i < sequences.length; i++) {
                        const startTime = moment(sequences[i].start_time);
                        const endTime = moment(sequences[i].end_time);

                        if (sequences[i].time_unit === 'never') {
                            this.farmBot.events.push({
                                id: sequences[i].id,
                                name: _.find(this.farmBot.sequences, {id: sequences[i].executable_id}).name,
                                date: startTime,
                                dateFormat: moment(startTime).format('DD-MM-YYYY HH:mm'),
                            });
                        } else {
                            const timeUnit = (() => {
                                switch(sequences[i].time_unit) {
                                    case 'minutely': return 'minutes';
                                    case 'hourly': return 'hours';
                                    case 'daily': return 'days';
                                    case 'weekly': return 'weeks';
                                    case 'monthly': return 'months';
                                    case 'yearly': return 'years';
                                }
                            })();

                            const dateRange = this.dateRange(startTime, endTime, timeUnit);
                            const filteredDates = _.filter(dateRange, function (date) {
                                return moment(date).isSameOrAfter(moment());
                            });

                            this.farmBot.events.push({
                                id: sequences[i].id,
                                name: _.find(this.farmBot.sequences, {id: sequences[i].executable_id}).name,
                                date: filteredDates[0],
                                dateFormat: moment(filteredDates[0]).format('DD-MM-YYYY HH:mm'),
                            });
                        }
                    }

                    const regimens = _.filter(this.farmBot.farmEvents, {executable_type: 'Regimen'});

                    for (let i = 0; i < regimens.length; i++) {
                        const startTime = moment(regimens[i].start_time);

                        await axios.get(`https://my.farmbot.io/api/regimens/${regimens[i].executable_id}`, config).then((response) => {
                            const data = response.data;
                            const name = data.name;
                            let dates = [];

                            for (let j = 0; j < data.regimen_items.length; j++) {
                                const durationInSeconds = moment.duration(data.regimen_items[j].time_offset).asSeconds();
                                const date = startTime.clone().add(durationInSeconds, 'seconds').toISOString();

                                if (moment(date).isSameOrAfter(moment())) {
                                    dates.push(date);
                                }
                            }

                            this.farmBot.events.push({
                                id: regimens[i].id,
                                name: name,
                                date: dates[0],
                                dateFormat: moment(dates[0]).format('DD-MM-YYYY HH:mm'),
                            });
                        });
                    }

                    this.farmBot.events.sort(function compare(a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });
                });
            },

            parseWeatherData() {
                this.weather.current = Weather.from(this.weatherResponse.current);

                const hourly = this.weatherResponse.hourly;

                this.weather.hourly = [];

                for (let i = 0; i < hourly.length && i < 5; i++) {
                    this.weather.hourly.push(Weather.from(hourly[i]));
                }
            },
        },
    };
</script>
