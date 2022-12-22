Explanations of the technologies used
A couple paragraphs about the general approach you took
Link to your wireframes – sketches of major views / interfaces in your application
Descriptions of any unsolved problems or major hurdles your team had to overcome

# SG Bus App (_Reflections_)

## Technologies used.

### 1) API

used two different methods to get APIs

- header (API keys in header) - LTA Datamall
- URL ( passing API keys through URL) - MapBox, to get static map images

Learning Points:

1. async function, returns a promise, and would need to await on the promise to retrieve the infomation.
2. use another async function to call another async function ( although in my case it doesn't work). So in order to retrive my variables i ended up putting all my other calculation/computation and variables inside the async function.

combining different objects returned from API,

### 2) Geolocations / Mapping As google maps API, only have limited free use, i used:

- HTML5's javascript geolocation ( to find my current location)

after i get the location, I am able to find the distance between my current location and bus stops.
Then i can sort it to show the top 10 nearest Busstops.

### 3) Canvas

used canvas to put map image in it, so that we could draw item (cross-hair) on target location.

### 4) DOM + Event targeting

- Object manipulation using Javascript on HTML elements
- grabbing elements , setting attributes, using attributes like 'value' to store value and then accessing it later.

Event targeting:

- ".addEventListener(<Action>,<Function>);" the Function that in input cannot be "function()" , but rather only "function" (only the name such that it only runs the function when it is triggered)
- the actual function(e){ code inside }, e.target will select the current selected element, to run the function.

## General Approach

1. started off with trying to obtain all the infomation with APIs
2. start to use the data retrived using the API, and used Javascript to piece relational data together.
3. Do the most easy and direct functionalities first, then build on it.
   For example :

- 1. create a function which is able to Obtain the bus services & timing from a busstop
- 2. the next function which allows user to search by Road name, will then shows the different busstops, in which it will then trigger the first function which i wrote ( Used autocompleted functionality here)
- 3. After that, adding on Geolocation Functionality, where i managed to get my current geolocations. Then used it to find the nearest buststop, then Sort it, slice the first 10 closes stops, and used DOM to display it in HTML.

## Hurdles / Where it could have been improved on.

### UIUX

CSS, and displaying of contents can be displayed in better formatting.

## Functionality

For the mapping functions, besides showing the crosshair, on my location, i could also have added points of the nearest buststop and display it on the map.
two way i could have done it:

1. use the lat/long to find the difference in terms of distance, and also angle difference, and then map it out on static image
2. use a direct API like OneMap API, can put it on the site directly. (save more trouble)
