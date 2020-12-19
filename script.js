'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//Workout
class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords, distance, duration) {
        this.coords = coords; // [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
}


//Running
class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }

}



//Cycling
class Cycling extends Workout {
    constructor(coords, distance, duration, elevation) {
        super(coords, distance, duration);
        this.elevation = elevation;
    }

    calcPace() {
        this.speed = this.distance / this.duration;
        return this.speed;
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

//////////////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this)); 
        inputType.addEventListener('change', this._toggleEleveationField); 
    }

    _getPosition() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {alert('Could not get your position')});
        }
    }

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        console.log(position);
    
        //Leaflet
        const coords = [latitude, longitude];
        console.log(this);
        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map); 
    
    
        this.#map.on('click', this._showForm.bind(this));       
    }

    //Show Form When CLicked on Map
    _showForm(mapE) {
        this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus(); 
    }

    _toggleEleveationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();

        //Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        //Check if data is valid

        //If workout running, create running object
        if(type === 'running') {
            const cadence = +inputCadence.value;
            if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) return alert('Inputs have to be positive numbers');
        }
        //If workout clycling, create cycling object
        if(type === 'cycling') {
            const elevation = +inputElevation.value;
        }
        //Add new object to workout array
        
        //Render workout on map as marker
        const {lat, lng} = this.#mapEvent.latlng;
        L.marker([lat, lng])
                .addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup'
                }))
                .setPopupContent(`${(inputType.value).toUpperCase()}`)
                .openPopup(); 
        
        //Render workout on list

        //Hide form + Clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
                     
        
    }
}

const app = new App();


