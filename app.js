// -------------------------------------------
// reload webpage every 3 seconds
// setTimeout(() => {
//   document.location.reload();
// }, 3000);

// // reload the page every 30 seconds.
// setTimeout("history.go(0);", 30000);
//--------------------------------------------

///////////////////////
//// Geolocation
///////////////////////
let latitude;
let longitude;

function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");

  mapLink.href = "";
  mapLink.textContent = "";

  // This parts runs to check if browswer can get geolocation, and if possible, getCurrentPosistion()
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    // getCurrentPosition() returns faster result, but if you want a more accurate result, use navigator.geolocation.watchPosition()
    navigator.geolocation.getCurrentPosition(success, error);
  }

  // This part parse the posistion into Lat & Long if it is successful.
  function success(position) {
    // clear previous results
    document.getElementById("location").innerHTML = "";
    document.getElementById("display").innerHTML = "";
    document.getElementById("map").innerHTML = "";

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

    //calculate distance between my current posistion with all the other posistions of the bustop
    for (i = 0; i < allBusStops.length; i++) {
      allBusStops[i].distance = calculateDistance(
        latitude,
        longitude,
        allBusStops[i].Latitude,
        allBusStops[i].Longitude,
        "K"
      );
      //console.log(allBusStops[i].distance);
    }

    const sortedArray = allBusStops.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const top10Neartest = sortedArray.slice(0, 10);

    nearestList = document.createElement("ul");
    for (i = 0; i < top10Neartest.length; i++) {
      eachNearest = document.createElement("li");
      let Nearest_BusCode = top10Neartest[i].BusStopCode;
      let Nearest_Dist = Math.ceil(top10Neartest[i].distance * 1000);
      eachNearest.setAttribute("value", `${Nearest_BusCode}`);
      eachNearest.setAttribute("class", `nearest`);
      eachNearest.innerHTML = `Bus Stop: ${Nearest_BusCode}, Located ${Nearest_Dist}m away, at ${top10Neartest[i].Description} (${top10Neartest[i].RoadName}),  `;
      //Add a listener, to make it clickable for events.
      eachNearest.addEventListener("click", getBusFromBusStop);
      // Add individual item into the <ul>
      nearestList.append(eachNearest);
    }
    document.getElementById("display").append(nearestList);

    //create canvas element
    let canva = document.createElement("canvas");
    const map = document.getElementById("map");
    map.append(canva);
    canva.setAttribute("id", "canvas");
    canva.setAttribute("width", "400");
    canva.setAttribute("height", "400");
    //grabbing the canvas element to manipulate it
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    //create image
    let img = document.createElement("img");
    const MapBox_API_Key =
      "pk.eyJ1IjoiZ2F2aW5sb3ciLCJhIjoiY2xieHRpMjVlMGptaDNybzV3eHcwNDhzaSJ9.13u2ErBeqIR7ghaNAcKVJA";
    const zoom_factor = "15"; // larger number means higher Zoom

    img.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${longitude},${latitude},${zoom_factor}/400x400?access_token=${MapBox_API_Key}`;
    //img.src = "www.openstreetmap.org/#map=18/1.29525/103.82845";
    // img.src =
    //   "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png?lat=" +
    //   position.coords.latitude +
    //   "&lon=" +
    //   position.coords.longitude +
    //   "&zoom=13";

    img.onload = () => {
      // Draw the image onto the context
      ctx.drawImage(img, 0, 0, 400, 400);
      ctx.beginPath();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.strokeStyle = "red";
      //Draw the Circle
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
      ctx.stroke();
      // ctx.fillStyle = "red";
      // ctx.fill();

      // Draw the vertical lines
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX, centerY + 10);
      ctx.stroke();

      // Draw the horizontal lines
      ctx.moveTo(centerX - 10, centerY);
      ctx.lineTo(centerX + 10, centerY);
      ctx.stroke();
    };

    document.getElementById("map").append(canvas);
  }

  // if fail, shows the error.
  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  // Math Function to calculate Distance between two Lat/Long (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var radlon1 = (Math.PI * lon1) / 180;
    var radlon2 = (Math.PI * lon2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

document.querySelector("#find-me").addEventListener("click", geoFindMe);

// ---------------------------------
// Displaying Current Date & Time
// ---------------------------------
const currentDateTime = new Date(); //new Date for Readable format
let options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
};
const convertReadableTime = currentDateTime.toLocaleTimeString(
  "en-us",
  options
);
console.log(convertReadableTime);

// This part not sure why showing... ReferenceError: document is not defined
// This function to show ( CURRENT DATE & TIME )

document.querySelector(
  "#dateTime"
).innerText = `Today is: ${convertReadableTime}`;

//-------------------------

function convertToAmPm(dateTimeString) {
  // Create a new JavaScript Date object from the date time string
  let date = new Date(dateTimeString);

  // Get the hours and minutes from the date object
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Convert the hours to AM/PM format
  let amPm = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12;

  // Convert the minutes to a string with leading zeros if necessary
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Return the formatted string
  return hours + ":" + minutes + " " + amPm;
}

// //----------------

//---------- Using Busstop Code, trigger event listener's function.

// event trigger
document
  .getElementById("buscodeButton")
  .addEventListener("click", getBusFromBusStop);

////////////////////////////////////////
// //   Search BusStops from Road Name
////////////////////////////////////////

async function getBusStopsFromRoad() {
  // to clear previous screen
  document.getElementById("location").innerHTML = "";
  document.getElementById("display").innerHTML = "";

  // to get the input value
  const element = document.getElementById("RoadInput");
  const roadNameInput = element.value;

  if (b64EncodeUnicode(element.value) == "UEVURVI=") {
    let new_window = UnicodeDecodeB64(
      "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=="
    );
    window.open(new_window, "_blank");
  } else {
    // create a div container to hold all the <ul> and <il> inside
    const stopsAlongRoad = document.createElement("div");
    stopsAlongRoad.setAttribute("id", "stopsAlongRoad");

    const ul = document.createElement("ul");
    ul.setAttribute("id", "stopsAlongRoadList");

    for (i = 0; i < allBusStops.length; i++) {
      if (allBusStops[i].RoadName == roadNameInput) {
        const li = document.createElement("li");
        li.setAttribute("class", "rdDesc");
        li.setAttribute("value", `${allBusStops[i].BusStopCode}`);
        li.innerText = allBusStops[i].Description;
        // li.addEventListener(
        //   "click",
        //   getBusFromBusStop(allBusStops[i].BusStopCode)
        // );
        li.addEventListener("click", getBusFromBusStop);
        ul.append(li);
      }
    }
    stopsAlongRoad.append(ul);
    document.querySelector("#display").append(stopsAlongRoad);
  }
}

////////////////////////////////////////////////////
// //   Function to get Bus Services from Bus Stop
////////////////////////////////////////////////////

async function getBusFromBusStop(e) {
  let _buscode;
  if (e.target.id == "buscodeButton") {
    // check if the target i choose, if the id, is buscode, then assign _buscode to the the input value
    _buscode = document.getElementById("buscode").value;
  } else {
    // else, instantiate _buscode to be the item which is the "value" of the target element.
    _buscode = e.target.value;
  }

  // clear upon every refresh
  document.getElementById("location").innerHTML = "";
  document.getElementById("display").innerHTML = "";
  document.getElementById("map").innerHTML = "";

  // Find the location/Description from the BusStop Code
  for (i = 0; i < allBusStops.length; i++) {
    if (allBusStops[i].BusStopCode == _buscode) {
      const road = allBusStops[i].RoadName;
      const roadDes = allBusStops[i].Description;
      const lat = allBusStops[i].Latitude;
      const long = allBusStops[i].Longitude;

      // Display it on the HTML
      document.querySelector(
        "#location"
      ).innerText = `Location: ${roadDes}(${road})`;
    }
  }

  fetch(
    `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${_buscode}`,
    {
      method: "GET", // or 'PUT'
      headers: {
        AccountKey: "LFMjNkdUT+WA0y4rAU2zjA==", // API_Keys of LTA DataMall
        accept: "application/json",
      },
    }
  )
    .then((response) => response.json()) // converting the response from "String" to "Json" format
    .then((json) => {
      // create the <ul> first
      const ul = document.createElement("ul");
      ul.setAttribute("id", "busServices");

      //console.log(json);

      // Loop through all the Objects inside the JSON
      totalDiffBusServices = json.Services.length;
      for (let i = 0; i < totalDiffBusServices; i++) {
        //create bus service list
        const li = document.createElement("li");
        li.setAttribute("class", "busList");
        li.innerText = ` Bus Services number: #${json.Services[i].ServiceNo}`;
        //create bus arrival timing list
        const ul_inner = document.createElement("ul");
        ul_inner.setAttribute("id", "busArrival");

        // loops through and Add subsequent 3 bus timings
        const li_inner1 = document.createElement("li");
        li_inner1.setAttribute("class", "busArrivalList");
        const busTime1 = json.Services[i].NextBus.EstimatedArrival;
        li_inner1.innerText = convertToAmPm(busTime1);
        ul_inner.append(li_inner1);

        const li_inner2 = document.createElement("li");
        li_inner2.setAttribute("class", "busArrivalList");
        const busTime2 = json.Services[i].NextBus2.EstimatedArrival;
        li_inner2.innerText = convertToAmPm(busTime2);
        // li_inner2.innerText = json.Services[i].NextBus2.EstimatedArrival;
        ul_inner.append(li_inner2);

        const li_inner3 = document.createElement("li");
        li_inner3.setAttribute("class", "busArrivalList");
        const busTime3 = json.Services[i].NextBus3.EstimatedArrival;
        li_inner3.innerText = convertToAmPm(busTime3);
        ul_inner.append(li_inner3);

        // after looping, add the data into html format, and appending it to the existing "containers" to display contents
        li.append(ul_inner);
        ul.appendChild(li);
      }
      document.querySelector("#display").append(ul);
      // return json;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str));
}

function UnicodeDecodeB64(str) {
  return decodeURIComponent(atob(str));
}
