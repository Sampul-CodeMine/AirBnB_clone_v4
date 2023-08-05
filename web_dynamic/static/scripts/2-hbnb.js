$('document').ready(() => {
  const checkedAmenities = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
        checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
        delete checkedAmenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
    console.log(checkedAmenities);
  });
  
  const url = 'http://localhost:5001/api/v1/status/';
  alert(url);
  $.get(url, (data) => {
    if (data.status === 'OK') {
      $('header div#api_status').addClass('available');
    } else {
      $('header div#api_status').removeClass('available');
    }
  });
});