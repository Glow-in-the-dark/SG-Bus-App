// const getBusStopInBatch = async function () {
//   fetch("http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=0", {
//     method: "GET", // or 'PUT'
//     headers: {
//       AccountKey: "LFMjNkdUT+WA0y4rAU2zjA==",
//       accept: "application/json",
//     },
//   })
//     .then((response) => response.json()) // converting the response from "String" to "Json" format
//     .then((json) => {
//       console.log("Success:", json);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };

// getBusStopInBatch(0);
//--------------------------------------------------------------------

// -------------------------------------------
// reload webpage every 3 seconds
// setTimeout(() => {
//   document.location.reload();
// }, 3000);

// // reload the page every 30 seconds.
// setTimeout("history.go(0);", 30000);

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
document.querySelector(
  "#dateTime"
).innerText = `Today is: ${convertReadableTime}`;

function timeDifference(timestamp1, timestamp2) {
  var difference = timestamp1 - timestamp2;
  var minutesDifference = Math.floor(difference / 1000 / 60);

  return minutesDifference;
}

// //----------------

// /////////////   Current location    ////////////////////////////// My Latitude: 1.2952565 ; Longtitude: 103.8284428
// (() => {
//   const message = document.querySelector("#message");

//   // check if the Geolocation API is supported
//   if (!navigator.geolocation) {
//     message.textContent = `Your browser doesn't support Geolocation`;
//     message.classList.add("error");
//     return;
//   }

//   // handle click event
//   const btn = document.querySelector("#show");
//   btn.addEventListener("click", function () {
//     // get the current position
//     navigator.geolocation.getCurrentPosition(onSuccess, onError);
//   });

//   // handle success case
//   function onSuccess(position) {
//     const { latitude, longitude } = position.coords;

//     message.classList.add("success");
//     message.textContent = `Your location: (${latitude},${longitude})`;
//   }

//   // handle error case
//   function onError() {
//     message.classList.add("error");
//     message.textContent = `Failed to get your location!`;
//   }
// })();
//-------------
// const successCallback = (position) => {
//   console.log(position);
// };

// const errorCallback = (error) => {
//   console.log(error);
// };

// Navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
//----------------

async function getBusFromBusStop() {
  const element = document.getElementById("buscode");
  const _buscode = element.value;

  // clear upon every refresh
  document.getElementById("location").innerHTML = "";
  document.getElementById("display").innerHTML = "";

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
        AccountKey: "LFMjNkdUT+WA0y4rAU2zjA==",
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
        li.innerText = json.Services[i].ServiceNo;
        //create bus arrival timing list
        const ul_inner = document.createElement("ul");
        ul_inner.setAttribute("id", "busArrival");

        const li_inner1 = document.createElement("li");
        li_inner1.setAttribute("class", "busArrivalList");
        li_inner1.innerText = json.Services[i].NextBus.EstimatedArrival;
        ul_inner.append(li_inner1);

        const li_inner2 = document.createElement("li");
        li_inner2.setAttribute("class", "busArrivalList");
        li_inner2.innerText = json.Services[i].NextBus2.EstimatedArrival;
        ul_inner.append(li_inner2);

        const li_inner3 = document.createElement("li");
        li_inner3.setAttribute("class", "busArrivalList");
        li_inner3.innerText = json.Services[i].NextBus3.EstimatedArrival;
        ul_inner.append(li_inner3);

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

// getBusFromBusStop("13062");

////// --- Park aside
// async function clickBusCode() {
//   const element = document.getElementById("buscode");
//   console.log(element.value);
//   console.log(typeof element.value);
//   // const result = await Promise.resolve(getBusFromBusStop(element.value));
//   // console.log(result);
// }

/// --------------------- Search BusStops from Road Name

async function getBusStopsFromRoad() {
  // to clear previous screen
  document.getElementById("location").innerHTML = "";
  document.getElementById("display").innerHTML = "";

  // to get the input value
  const element = document.getElementById("RoadInput");
  const roadNameInput = element.value;

  // create a div container to hold all the <ul> and <il> inside
  const stopsAlongRoad = document.createElement("div");
  stopsAlongRoad.setAttribute("id", "stopsAlongRoad");

  const ul = document.createElement("ul");
  ul.setAttribute("id", "stopsAlongRoadList");

  for (i = 0; i < allBusStops.length; i++) {
    if (allBusStops[i].RoadName == roadNameInput) {
      const li = document.createElement("li");
      li.setAttribute("class", "rdDesc");
      li.innerText = allBusStops[i].Description;
      ul.append(li);
    }
  }
  stopsAlongRoad.append(ul);
  document.querySelector("#display").append(stopsAlongRoad);
}
