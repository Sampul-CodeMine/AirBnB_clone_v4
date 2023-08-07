/* Function to get user using the user ID */
function get_user(uid) {
  if (uid.length > 0 && uid !== '') {
    const ajaxObj = new XMLHttpRequest();
    ajaxObj.open("GET", `http://localhost:5001/api/v1/users/${uid}`, true);
    ajaxObj.onload = function () {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        return `${data.first_name} ${data.last_name}`;
      }
    };
    ajaxObj.send();
  }
}

$(document).ready(function () {
  const amenities = {};
  $('.amenities INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities H4').text(Object.values(amenities).join(', '));
  });

  const cities = {};
  $('.locations INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    $('.locations H4').text(Object.values(cities).join(', '));
  });

  const states = {};
  $('.locations INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    $('.locations H4').text(Object.values(states).join(', '));
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    dataType: 'json',
    headers: {
      "Content-Type": "application/json"
    },
    data: '{}',
    success: (response) => {
      for (let itr = 0; itr < response.length; itr++) {
        let html = `<article>
          <div class="title_box">
            <h2>${response[itr].name}</h2>
            <div class="price_by_night">$${response[itr].price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${response[itr].max_guest} Guest${response[itr].max_guest <= 1 ? '' : 's'}</div>
            <div class="number_rooms">${response[itr].number_rooms} Bedroom${response[itr].number_rooms <= 1 ? '' : 's'}</div>
            <div class="number_bathrooms">${response[itr].number_bathrooms} Bathroom${response[itr].number_bathrooms <= 1 ? '' : 's'}</div>
          </div>
          <div class="user">
            <b>Owner: </b>${get_user(response[itr].user_id)}
          </div>
          <div class="description">
          ${response[itr].description}
          </div>
        </article>`;
        $('section.places').append(html);      
      }
    },
    error: (error) => {
      console.log(error.statusText);
    }
  });
  
  $('button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search/',
      dataType: 'json',
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({ 'amenities': Object.keys(amenities), 'cities': Object.keys(cities), 'states': Object.keys(states) }),
      success: (response) => {
        for (let itr = 0; itr < response.length; itr++) {
          let html = `<article>
            <div class="title_box">
              <h2>${response[itr].name}</h2>
              <div class="price_by_night">$${response[itr].price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${response[itr].max_guest} Guest${response[itr].max_guest <= 1 ? '' : 's'}</div>
              <div class="number_rooms">${response[itr].number_rooms} Bedroom${response[itr].number_rooms <= 1 ? '' : 's'}</div>
              <div class="number_bathrooms">${response[itr].number_bathrooms} Bathroom${response[itr].number_bathrooms <= 1 ? '' : 's'}</div>
            </div>
            <div class="user">
              <b>Owner: </b>${get_user(response[itr].user_id)}
            </div>
            <div class="description">
            ${response[itr].description}
            </div>
          </article>`;
          $('section.places').append(html);      
        }
      },
      error: (error) => {
        console.log(error.statusText);
      }
    });
  });
});