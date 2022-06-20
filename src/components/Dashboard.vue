<template>
    <v-row class="ma-5">
        <v-col cols="6">
            <FarmBotInfo />
        </v-col>

        <v-col cols="6">
            <Plants v-if="plants.length !== 0" :plants="growingPlants" />
        </v-col>

        <v-col cols="2">
            <WeatherComponent v-if="weather.current != null" :weather="weather.current" />
        </v-col>

        <v-col cols="3">
            <WeatherList :weather-items="weatherData" />
        </v-col>

        <v-col cols="2">
            <Events :events="farmBot.events" height="300" />
        </v-col>

        <v-col cols="2">
            <PlantStatistics
                :plant-stages="plantStages"
            />
        </v-col>

        <v-col cols="3">
            <FarmBotImages
                :images="farmBot.images"
            />
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
    import Events from '@/components/Events';
    import FarmBotImages from '@/components/FarmBotImages';

    export default {
        name: 'Dashboard',

        components: {FarmBotImages, Events, PlantStatistics, Plants, FarmBotInfo, WeatherComponent, WeatherList },

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

                config: {
                    headers: {Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoxNTAwMSwiaWF0IjoxNjUwODc1MzE3LCJqdGkiOiJmNTI3ZjFkOS1kNzg1LTRhZDAtOTgwYy04ZGYwNDM2MDU4YzEiLCJpc3MiOiIvL215LmZhcm0uYm90OjQ0MyIsImV4cCI6MTY1NjA1OTMxNywibXF0dCI6ImNsZXZlci1vY3RvcHVzLnJtcS5jbG91ZGFtcXAuY29tIiwiYm90IjoiZGV2aWNlXzE1MDI4Iiwidmhvc3QiOiJ4aWNvbmZ1bSIsIm1xdHRfd3MiOiJ3c3M6Ly9jbGV2ZXItb2N0b3B1cy5ybXEuY2xvdWRhbXFwLmNvbTo0NDMvd3MvbXF0dCJ9.X_zgXVKGP-5jyfvL7lWOAHk2sEkqpMk9U0i5Gg-GXYF1u0X9g7XaE3FodZ_zpFQJebAXBufHGX7igRBANHnqAXqIpbZAcb1bbKssnjS1VC9Ero6NvilMgDkAKEAZNfS2u41oFhsZbhn3lt5S6c8OieP5bf20sJlo2T9XHteOyyjDcWJ28KlzKfYRAAP6c_0NWm4xQFZLK1R0mnxXeJwaxdkX9uh-EYCG7bPO8IhKQj9hza-oJVeKU1YzDz7yh41lKk_mVN2Ssc1eZ8JXW6z3ACqhkEPDUaiYJX2dCqQ0mka4d7l9rpiFi-ztnIDsMCw75JIwt9D74f9lCM1lANleew`},
                },

                points: [],

                farmBot: {
                    sequences: null,
                    farmEvents: null,
                    events: [],
                    images: [],
                    imageAmount: 100,
                },
            };
        },

        computed: {
            plants () {
                return _.filter(this.points, {pointer_type: 'Plant'});
            },

            growingPlants () {
                return _.filter(this.plants, (plant) => {
                    return plant.plant_stage === 'planted' || plant.plant_stage === 'sprouted' || plant.plant_stage === 'harvested';
                });
            },

            plantStages () {
                return _.groupBy(this.plants, 'plant_stage');
            },

            listAmount () {
                return Math.round(Object.keys(this.plantStages).length * 1.75);
            },

            weatherData () {
                const weather = [];

                if(this.weatherResponse) {
                    const hourly = this.weatherResponse.hourly;

                    for (let i = 0; i < hourly.length && i < this.listAmount; i++) {
                        weather.push(Weather.from(hourly[i]));
                    }

                }

                return weather;
            },
        },

        async created() {
            this.fetchWeather();
            await this.fetchFarmBotPoints();
            await this.fetchFarmBotSequences();
            await this.fetchFarmBotEvents();
            await this.fetchFarmBotImages();

            const self = this;

            setInterval(async function () {
                await self.fetchFarmBotImages();
            }, 1000 * 60 * 60); // 1 hour

            setInterval(self.fetchWeather, 1000 * 60 * 10); // 10 minutes

            setInterval(async function () {
                await self.fetchFarmBotPoints();
                await self.fetchFarmBotSequences();
                await self.fetchFarmBotEvents();
            }, 1000 * 60); // 1 minute
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

            fetchWeather () {
                axios.get(`${this.weatherApiData.weatherBaseUrl}?lat=${this.weatherApiData.latitude}&lon=${this.weatherApiData.longitude}&appid=${this.weatherApiData.weatherAppKey}&units=${this.weatherApiData.units}&lang=${this.weatherApiData.lang}&exclude=${this.weatherApiData.exclude}`).then((response) => {
                    this.weatherResponse = response.data;

                    this.weather.current = Weather.from(this.weatherResponse.current);
                });
            },

            async fetchFarmBotPoints () {
                await axios.get(`https://my.farmbot.io/api/points`, this.config).then((response) => {
                    this.points = response.data;
                });
            },

            async fetchFarmBotSequences () {
                await axios.get(`https://my.farmbot.io/api/sequences`, this.config).then((response) => {
                    this.farmBot.sequences = response.data;
                });
            },

            async fetchFarmBotEvents () {
                await axios.get(`https://my.farmbot.io/api/farm_events`, this.config).then(async (response) => {
                    this.farmBot.farmEvents = response.data;
                    this.farmBot.events = [];
                    var events = [];

                    this.parseSequences(events);

                    await this.parseRegimens(events);

                    events = _.sortBy(events, function(dateObj) {
                        return new Date(dateObj.date);
                    });

                    this.farmBot.events = events.slice(0, this.listAmount);

                    // Order the FarmBot events by date
                    this.farmBot.events.sort(function compare(a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });
                });
            },

            async fetchFarmBotImages () {
                await axios.get(`https://my.farmbot.io/api/images`, this.config).then(async (response) => {
                    this.farmBot.images = _.take(response.data, this.farmBot.imageAmount);
                });
            },

            parseSequences (events) {
                const sequences = _.filter(this.farmBot.farmEvents, {executable_type: 'Sequence'});

                for (let i = 0; i < sequences.length; i++) {
                    const startTime = moment(sequences[i].start_time);
                    const endTime = moment(sequences[i].end_time);

                    if (sequences[i].time_unit === 'never') {
                        events.push({
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

                        for (let j = 0; j < filteredDates.length; j++) {
                            events.push({
                                id: sequences[i].id,
                                name: _.find(this.farmBot.sequences, {id: sequences[i].executable_id}).name,
                                date: filteredDates[j],
                                dateFormat: moment(filteredDates[j]).format('DD-MM-YYYY HH:mm'),
                            });
                        }
                    }
                }
            },

            async parseRegimens(events) {
                const regimens = _.filter(this.farmBot.farmEvents, {executable_type: 'Regimen'});

                for (let i = 0; i < regimens.length; i++) {
                    const startTime = moment(regimens[i].start_time);

                    await axios.get(`https://my.farmbot.io/api/regimens/${regimens[i].executable_id}`, this.config).then((response) => {
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

                        for (let j = 0; j < dates.length; j++) {
                            events.push({
                                id: regimens[i].id,
                                name: name,
                                date: dates[j],
                                dateFormat: moment(dates[j]).format('DD-MM-YYYY HH:mm'),
                            });
                        }
                    });
                }

                return this.farmBot.events;
            },
        },
    };
</script>
