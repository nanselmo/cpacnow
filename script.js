var map;
var wardInfoUrl = "https://data.cityofchicago.org/resource/htai-wnw4.json";

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 41.8781, lng: -87.6298}
  });

  // Load GeoJSON.
  map.data.loadGeoJson(
      'https://cdn.glitch.com/f3212896-59bb-4464-9222-393efbdc9c11%2Fchicago-boundaries-2015.geojson?v=1591883532909');

  // Set the stroke width, and fill color for each polygon
  map.data.setStyle({
    fillColor: 'green',
    strokeWeight: 1
  });


  map.data.setStyle(function(feature) {
  var ward = feature.getProperty('ward');
  var color = "gray";
  //TODO - move sponsor data to a spreadsheet that CPAC can update
  var cpacSupporters = ['1','5','8','9','10','15','16','20','21','22','24','25',
  '26','31','33','35','37','40','47','49']
  if (!cpacSupporters.includes(ward)) {
    color = "red";
  }
  return {
    fillColor: color,
    strokeWeight: 1
  }
});


  // Set mouseover event for each feature.
  map.data.addListener('click', function(event) {

    //get the ward number of the clicked on shape (feature)
    var ward = event.feature.getProperty('ward');
    document.getElementById('wardNum').textContent = ward;


    var cpacSupporters = ['1','5','8','9','10','15','16','20','21','22','24','25','26','31','33','35','37','40','47','49']
    if (cpacSupporters.includes(ward)) {

     //hide the contact-div
    document.getElementById("contact-div").style.visibility= "hidden";
    }
    else {

    var wardNum = parseInt(ward);

    //fill in the data
    fetch(wardInfoUrl).then(
            function(u){ return u.json();}
          ).then(
            function(json){
              var wardDataJson = json;
              var aldermanEmail = wardDataJson[wardNum-1].email;
              var aldermanPhone = wardDataJson[wardNum-1].city_hall_phone;
              document.getElementById("phoneLink").href = "tel:" + aldermanPhone;
              document.getElementById('phone').textContent = aldermanPhone;
              document.getElementById("emailLink").href = "mailto:" + aldermanEmail +
              "?subject=CPAC Now&body=Police are supposed to protect and serve the community, \
              but right now in Chicago all the power belongs to the mayor and the police union. \
                As a constituent of your ward, I demand CPAC so that Chicagoans have the voice \
                in who polices our communities and how they are policed.";

              document.getElementById('email').textContent = aldermanEmail;


            }
          )


    //unhide the contact-div
    document.getElementById("contact-div").style.visibility= "visible";
    }

  });


  // When the user hovers, tempt them to click by outlining the letters.
        // Call revertStyle() to remove all overrides. This will use the style rules
        // defined in the function passed to setStyle()
        map.data.addListener('mouseover', function(event) {
          map.data.revertStyle();
          map.data.overrideStyle(event.feature, {strokeWeight: 3});
        });

        map.data.addListener('mouseout', function(event) {
          map.data.revertStyle();
        });

}
