import moment from 'moment';

export default class Weather {
    get temperature () {
        return _.round(this.temp, 0) + ' ℃';
    }

    get icon () {
        return `https://openweathermap.org/img/wn/${this.weather[0].icon}@4x.png`;
    }

    get date() {
        return moment.unix(this.dt).format('HH:mm');
    }

    static from(json) {
        return Object.assign(new Weather(), json);
    }
}
