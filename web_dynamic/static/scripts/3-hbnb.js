/* Function to get user using the user ID */
function get_user(uid) {
  if (uid.length > 0) {
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

$('document').ready(() => {
  const checkedAmenities = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
        checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
        delete checkedAmenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });

  /* Checking if the AirBnB Clone API is ready and online */
  const url = 'http://localhost:5001/api/v1/status/';
  $.get(url, (data) => {
    if (data.status === 'OK') {
      $('header div#api_status').addClass('available');
    } else {
      $('header div#api_status').removeClass('available');
    }
  });

  /* Fetching the places from the database using jQuery's ajax function */
  $.ajax({
    type: "POST",
    url: "http://localhost:5001/api/v1/places_search/",
    dataType: "json",
    data: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json"
    },
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
