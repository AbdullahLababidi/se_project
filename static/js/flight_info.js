const { createClient } = supabase
const _supabase = createClient('https://pfwnyxmmxgydkohyqrto.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd255eG1teGd5ZGtvaHlxcnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MTg5NjMsImV4cCI6MjAxNTI5NDk2M30.v--PqHL9B8GMFNNW-bp-mMcr7p30V_5hKXVUSRTBGxA');

let arrFlights = [];
let depFlights = [];

async function getArrivalData(){

let { data, error } = await _supabase
  .from('Flight')
  .select()
  .eq('isArriving', true)

  if(error){
  console.log("ERROR");
  }else{
  arrFlights = data;
  }
}

async function getDepartureData(){
  let { data, error } = await _supabase
  .from('Flight')
  .select()
  .eq('isArriving', false)

  if(error){
  console.log("ERROR");
  }else{
  depFlights = data;
  }
}

async function subscribeToChannel(){

_supabase
  .channel('room1')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'Flight' }, () => {
    getArrivalData();
    getDepartureData();
    loadFlights();
  })
  .subscribe()
}

const airlineFlags = {
    'Air Liban': '../static/images/MEA.jpeg',
    'UAE Airlines': '../static/images/Emirates.jpeg',
    'KLM': '../static/images/KLM.jpeg',
    'Qatar Airways': '../static/images/qatarair.jpeg',
  }

      const statusColors = {
    "Scheduled": "#ed5ea1",
    "OnTime": "#e2bb1c",
    "Delayed": "#11b2ae",
    "Canceled": "#9bfc75",
    "Boarding": "#ba9dbe",
    "Landed": "#fd1f4f",
    "Arrived": "#bbc248"
  };

      const arrivalData = [
        { airline: 'Air Liban', number: 'A123', status: 'Confirmed', origin: 'Beirut, Lebanon', schedule: '12:00 PM', terminal: 'T1', date: 'Today', time: '12:00-13:59' },
        { airline: 'UAE Airlines', number: 'A456', status: 'Delayed', origin: 'Tripoli, Lebanon', schedule: '0:30 AM', terminal: 'T2', date: 'Tomorrow', time: '00:00-01:59' },
        { airline: 'KLM', number: 'A347', status: 'Confirmed', origin: 'Amsterdam, Netherlands', schedule: '2:30 AM', terminal: 'T1', date: 'Tomorrow', time: '02:00-03:59' },
        { airline: 'KLM', number: 'A559', status: 'Delayed', origin: 'London, England', schedule: '5:30 PM', terminal: 'T2', date: 'Tomorrow', time: '04:00-05:59' },
        { airline: 'Qatar Airways', number: 'A359', status: 'Confirmed', origin: 'Berlin, Germany', schedule: '6:15 PM', terminal: 'T1', date: 'Tomorrow', time: '06:00-07:59' },
        { airline: 'UAE Airlines', number: 'A985', status: 'Delayed', origin: 'Paris, France', schedule: '14:30 PM', terminal: 'T2', date: 'Day after tomorrow', time: '14:00-15:59' },
      ];

      const departureData = [
        { airline: 'KLM', number: 'D789', status: 'Confirmed', destination: 'Jerusalem, Palestine', schedule: '4:45 PM', terminal: 'T3', gate: 'G5', checkIn: 'Row 8', date: 'Today', time: '16:00-17:59' },
        { airline: 'Qatar Airways', number: 'D101', status: 'Delayed', destination: 'Istanbul, Turkey', schedule: '7:15 PM', terminal: 'T4', gate: 'G2', checkIn: 'Row 10', date: 'Tomorrow', time: '18:00-19:59' },
      ];

      const inFlightData = [
        { airline: 'Air Liban', entertainment: 'Movies, Music', meals: 'Vegetarian, Non-Vegetarian' },
        { airline: 'UAE Airlines', entertainment: 'TV Shows, Games', meals: 'Vegan, Pescatarian' },
        { airline: 'KLM', entertainment: 'Movies, Music', meals: 'Vegetarian, Non-Vegetarian' },
        { airline: 'Qatar Airways', entertainment: 'TV Shows, Games', meals: 'Vegan, Pescatarian' },
      ];

      document.addEventListener('DOMContentLoaded', () => {
      getArrivalData();
      getDepartureData();
      subscribeToChannel();
    const searchInput = document.getElementById('flight-search-input');
    const dateDropdown = document.getElementById('date-dropdown');
    const timeDropdown = document.getElementById('time-dropdown');

    populateDropdowns();
    dateDropdown.value = 'Today';
    timeDropdown.value = 'Any time';

    const changeEvent = new Event('change');
    dateDropdown.dispatchEvent(changeEvent);

    searchInput.addEventListener('input', filterFlights);
    dateDropdown.addEventListener('change', filterFlights);
    timeDropdown.addEventListener('change', filterFlights);

    const lightbox = document.getElementById('lightbox');
    lightbox.addEventListener('click', closeLightbox);
    lightbox.style.display = 'none';

    loadFlights('arrivals');
  });


  function filterFlights() {
    const flightType = document.getElementById('flight-type-toggle').classList.contains('toggle-switch-on') ? 'departures' : 'arrivals';
    loadFlights(flightType);
  }

  function populateDropdowns() {
    const dateDropdown = document.getElementById('date-dropdown');
    const timeDropdown = document.getElementById('time-dropdown');

    dateDropdown.innerHTML = '';
    timeDropdown.innerHTML = '';

    const dates = ['Today', 'Tomorrow', 'Day after tomorrow'];
    const times = ['Any time', '00:00-01:59', '02:00-03:59', '04:00-05:59', '06:00-07:59', '08:00-09:59', '10:00-11:59', '12:00-13:59', '14:00-15:59', '16:00-17:59', '18:00-19:59', '20:00-21:59', '22:00-23:59'];

    dates.forEach(date => {
      const option = document.createElement('option');
      if (date !== 'Any day') {
        const currentDate = new Date();
        if (date === 'Tomorrow') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (date === 'Day after tomorrow') {
          currentDate.setDate(currentDate.getDate() + 2);
        }
        const formattedDate = currentDate.getDate() + ' - ' + currentDate.toLocaleString('en-US', { month: 'short' });
        option.text = formattedDate;
        option.value = date;

        if (date === 'Today') {
          option.selected = true;
        }
      } else {
        option.text = date;
        option.value = date;
      }
      dateDropdown.add(option);
    });

    times.forEach(time => {
      const option = document.createElement('option');
      option.text = time;
      timeDropdown.add(option);
    });
  }




  function getFormattedDateTime(flightDate, timeString, schedule) {
    if (flightDate === 'Today' || flightDate === 'Tomorrow' || flightDate === 'Day after tomorrow') {
      const today = new Date();
      if (flightDate === 'Tomorrow') {
        today.setDate(today.getDate() + 1);
      } else if (flightDate === 'Day after tomorrow') {
        today.setDate(today.getDate() + 2);
      }
      const formattedDate = today.toLocaleDateString('en-US', { month: 'short' }) + ' ' + today.getDate();
      return `${formattedDate} ${schedule || timeString}`;
    } else {

      return schedule || timeString;
    }
  }



  function getTodayDate() {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'short' }) + ' ' + today.getDate();
  }

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { month: 'short' }) + ' ' + tomorrow.getDate();
  }

  function getDayAfterTomorrowDate() {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.toLocaleDateString('en-US', { month: 'short' }) + ' ' + dayAfterTomorrow.getDate();
  }



      function toggleFlightType() {
        const toggleSwitch = document.getElementById('flight-type-toggle');
        toggleSwitch.classList.toggle('toggle-switch-on');
        const isDeparture = toggleSwitch.classList.contains('toggle-switch-on');

        updateHeader(isDeparture);

        setLoadingState();

        setTimeout(() => {

          const flightType = isDeparture ? 'departures' : 'arrivals';
          loadFlights(flightType);

          removeLoadingState();
        }, 2000);
      }

      function updateHeader(isDeparture) {
        const header = document.querySelector('h2');
        const subheader = document.querySelector('p');

        if (isDeparture) {
          header.textContent = 'PASSENGER DEPARTURES';
          subheader.textContent = 'Keep track of departing passenger flights with live updates.';
        } else {
          header.textContent = 'PASSENGER ARRIVALS';
          subheader.textContent = 'Keep track of arriving passenger flights with live updates.';
        }
      }

      function setLoadingState() {

        const loadingIndicator = document.createElement('div');
        const loadingGIFPath = "../static/images/loading.gif";
        loadingIndicator.innerHTML = `<img src="${loadingGIFPath}" alt="Loading..." />`;
        loadingIndicator.id = 'loading-indicator';
        document.body.appendChild(loadingIndicator);

        const flightContainer = document.getElementById('search-results');
        flightContainer.classList.add('loading');
      }

      function removeLoadingState() {

        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.remove();
        }

        const flightContainer = document.getElementById('search-results');
        flightContainer.classList.remove('loading');
      }

      function refreshFlights() {
        const flightType = document.getElementById('flight-type-toggle').classList.contains('toggle-switch-on') ? 'departures' : 'arrivals';
        loadFlights(flightType);
      }

      function loadFlights(flightType) {
    const searchResultsSection = document.getElementById('search-results');
    searchResultsSection.innerHTML = '';

    let filteredFlights = [];

    if (flightType === 'arrivals') {
      filteredFlights = filteredFlights.concat(arrivalData);
    } else if (flightType === 'departures') {
      filteredFlights = filteredFlights.concat(departureData);
    }

    const searchInput = document.getElementById('flight-search-input').value.toLowerCase();
    const selectedDate = document.getElementById('date-dropdown').value;
    const selectedTime = document.getElementById('time-dropdown').value;

    filteredFlights = filteredFlights.filter(flight => {
      return (
        (flight.number.toLowerCase().includes(searchInput) ||
          flight.airline.toLowerCase().includes(searchInput) ||
          (flight.origin && flight.origin.toLowerCase().includes(searchInput)) ||
          (flight.destination && flight.destination.toLowerCase().includes(searchInput))) &&
        (selectedDate === 'Any day' || flight.date === selectedDate) &&
        (selectedTime === 'Any time' || flight.time.includes(selectedTime))
      );
    });

    filteredFlights.forEach(flight => {
      const flightInfo = document.createElement('div');
      flightInfo.classList.add('flight-info');

      const flag = document.createElement('div');
    flag.classList.add('flag');
    flag.style.backgroundImage = `url('${airlineFlags[flight.airline] || 'path/to/default-flag.png'}')`;
    flightInfo.appendChild(flag);

  const statusBanner = document.createElement('div');
    statusBanner.classList.add('status-banner');
    statusBanner.style.backgroundColor = statusColors[flight.status] || '#777';
    statusBanner.textContent = flight.status;
    flightInfo.appendChild(statusBanner);

      const leftColumn = document.createElement('div');
      leftColumn.classList.add('flight-info-left');
      const header = document.createElement('div');
      header.classList.add('flight-header');
      header.textContent = flightType === 'arrivals' ? `From: ${flight.origin}` : `To: ${flight.destination}`;
      leftColumn.appendChild(header);

      const flightCodeAndAirline = document.createElement('p');
      flightCodeAndAirline.textContent = `${flight.number} - ${flight.airline}`;
      leftColumn.appendChild(flightCodeAndAirline);

      const schedule = document.createElement('p');
      schedule.textContent = getFormattedDateTime(selectedDate, flight.time, flight.schedule);
      leftColumn.appendChild(schedule);

      flightInfo.appendChild(leftColumn);

      const rightColumn = document.createElement('div');
      rightColumn.classList.add('flight-info-right');
      const terminalOrGate = document.createElement('p');
      if (flightType === 'arrivals') {
        terminalOrGate.textContent = `Terminal: ${flight.terminal}`;
      } else {
        terminalOrGate.textContent = `          Gate: ${flight.gate}`;
      }
      rightColumn.appendChild(terminalOrGate);

      if (flightType === 'departures') {
        const checkIn = document.createElement('p');
        checkIn.textContent = `Check-in: ${flight.checkIn}`;
        rightColumn.appendChild(checkIn);
      }

      const inFlightButton = document.createElement('button');
      inFlightButton.classList.add('in-flight-button');
      inFlightButton.textContent = 'In-Flight Details';
      inFlightButton.addEventListener('click', () => showInFlightDetails(flight));
      rightColumn.appendChild(inFlightButton);

      flightInfo.appendChild(rightColumn);

      searchResultsSection.appendChild(flightInfo);
    });
  }



      function showInFlightDetails(flight) {
        const lightbox = document.getElementById('lightbox');
        const inFlightDetails = document.getElementById('in-flight-details');
        const flightDetails = inFlightData.find(details => details.airline === flight.airline);

        inFlightDetails.innerHTML = `
          <p>Airline: ${flightDetails.airline}</p>
          <p>Entertainment: ${flightDetails.entertainment}</p>
          <p>Meals: ${flightDetails.meals}</p>
        `;

        lightbox.style.display = 'flex';
      }

      function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
      }