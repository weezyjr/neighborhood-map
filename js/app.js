//map related variables
var map;
var bounds;
var infoWindow;

//an array that holds each marker associated with its Place data
var markers = ko.observableArray();

//Error Context
const ERROR_TEXT = `<p class="alert alert-danger" role="alert">
Ooops.. an error has occured while loading <br>
Please check your connection and try refreshing the page :) </p>`;

// In case that the map didn't load
function handleMapError() {
	document.getElementById('map').innerHTML = ERROR_TEXT;
}

// This function is copied from the Udacity's Google Maps APIs course
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		`http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|ffffff|40|_|%E2%80%A2`,
		new google.maps.Size(31, 48),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 48),
		new google.maps.Size(31, 48));
	return markerImage;
}

// Animate the marker for 2.8 sec
function bounceAnimation(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function () {
		marker.setAnimation(null);
	}, 2800);
}

// Pops the info window out of the marker, holding Image and info about the place
function populateInfoWindow(marker, infoWindow, place) {
	// Fetch Image from unsplash based on place title and type
	fetch(`https://api.unsplash.com/search/photos?page=1&per_page=1&query=${place.title}+${place.type}`, {
			headers: {
				Authorization: 'Client-ID 131a5b2f6dc9100da8fd3466bd93e4bd1eeaac8d5f2f021ca0efc8bd54b82b40',
			}
		})

		//Convert responce to json
		.then(res => res.json())

		// Pop Error + Some information related to the place
		.catch(error => {
			bounceAnimation(marker);
			infoWindow.setContent(`
			${ERROR_TEXT}
			<p>
				<b>${place.title}</b>
				/${place.type}/
			</p>`);
			infoWindow.open(map, marker);
		})

		// Pop the infoWindow with an image related to the palace and show some info
		.then(res => {
			bounceAnimation(marker);
			infoWindow.setContent(`<img src = ${res.results[0].urls.small} alt= ${place.title} width="250">
			<p>
				<b>${place.title}</b>
				/${place.type}/
			</p>`);
			infoWindow.open(map, marker);
		});
}

//Initialize the map
function initMap() {
	map = new google.maps.Map(
		$('#map')[0], {
			center: {
				lat: 31.190215,
				lng: 29.913796
			},
			zoom: 13,
			styles: style
		}
	);

	// Initialize the current bounds of the map
	bounds = new google.maps.LatLngBounds();
	// Initialize infoWindow
	infoWindow = new google.maps.InfoWindow();
	// Create styled marker icon
	let defaultIcon = makeMarkerIcon();

	for (const place of PLACES) {
		// Create a marker per location.
		let marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: place.location,
			title: place.title,
			icon: defaultIcon
		});

		// Create Event Listner for each marker using IIFE
		marker.addListener('click', ((marker, infoWindow, place) => {
			return function () {
				// Show the title when clicking on the marker
				populateInfoWindow(marker, infoWindow, place);
			}
		})(marker, infoWindow, place));

		// bounce on mouse hover
		marker.addListener('mouseover', ((marker) => {
			return function () {
				bounceAnimation(marker);
			}
		})(marker));

		// Fit the map to the new bounds
		bounds.extend(marker.position);
		map.fitBounds(bounds);

		//Add the marker to markers array assoiacted with place info
		markers.push({
			place: place,
			marker: marker
		});
	}
}

class Menu {
	constructor() {
		//Flag to checkout the current state of the menu
		this.menu_opened = false;
		//defualt menu-icon is burger-icon
		this.menu_Icon = ko.observable('menu');
		//hide the menu by defualt
		this.menu_visibility = ko.observable('hide menu');
		//set the map container width to 100%
		this.map_width = ko.observable('map-container-fluid');
	}

	openMenu() {
		//change the burger icon to X-icon
		this.menu_Icon('close');
		//show the menu
		this.menu_visibility('show menu');
		//remove the menu-width from the map container width
		this.map_width('map-container');
		//flag that the menu is opened
		this.menu_opened = true;
	}

	closeMenu() {
		//change the X-icon to Burger-icon
		this.menu_Icon('menu');
		//hide the menu
		this.menu_visibility('hide menu');
		//set the map container width to 100%
		this.map_width('map-container-fluid');
		//flag that the menu is closed
		this.menu_opened = false;
	}

	toggleMenu() {
		this.menu_opened ?
			this.closeMenu() : this.openMenu();
	}
}

class ViewModel {
	constructor() {
		//create the menu
		this.menu = new Menu();
		//the input query observable
		this.query = ko.observable('');
		//filter the results depending on the query
		this.filter = ko.computed(() => {
			return ko.utils.arrayFilter(markers(), (item) => {
				//filter for place title or type
				if (item.place.title.toLowerCase().includes(this.query().toLowerCase()) ||
					item.place.type.toLowerCase().includes(this.query().toLowerCase())) {
					//show the filtered markers
					item.marker.setMap(map);
					//return the titles to be displayed in the menu
					return item.place.title;
				} else {
					// Hide the unfiltered markers
					item.marker.setMap(null);
				}
			});
		})
	}

	menuItemOnClick(data) {
		if (map && infoWindow) {
			populateInfoWindow(data.marker, infoWindow, data.place);
		}
	}
}
ko.applyBindings(new ViewModel());
