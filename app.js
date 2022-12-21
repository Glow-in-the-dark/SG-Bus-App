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
