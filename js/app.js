var map;
var infoWindow;
var markers = new Map();

// This function is copied from the Udacity's Google Maps APIs course
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		`http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|ffffff|40|_|%E2%80%A2`,
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
	return markerImage;
}

function populateInfoWindow(marker, infoWindow, content) {
	// Show the title when clicking on the marker
	infoWindow.setContent(content);
	infoWindow.open(map, marker);
}

function initMap() {
	//Initialize the map
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
	var bounds = new google.maps.LatLngBounds();
	// Initialize infoWindow
	infoWindow = new google.maps.InfoWindow();
	// Create styled marker icon
	var defaultIcon = makeMarkerIcon();

	for (const place of PLACES) {
		// Get the position and title from PLACES array
		var title = place.title;
		var position = place.location;

		// Create a marker per location.
		var marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: position,
			title: title,
			map: map,
			icon: defaultIcon
		});
		//	marker.setIcon(makeMarkerIcon('FFFF24'));

		// Create Event Listner for each marker using IIFE
		marker.addListener('click', ((marker, infoWindow, title) => {
			return function () {
				// Show the title when clicking on the marker
				populateInfoWindow(marker, infoWindow, title);
			}
		})(marker, infoWindow, title));



		// Fit the map to the new bounds
		bounds.extend(marker.position);
		map.fitBounds(bounds);

		//Add the marker to markers Map
		markers.set(title, marker);
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

		this.menu_items = ko.observableArray();
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

	addItem(str) {
		this.menu_items.push(str);
	}

	removeItem(str) {
		this.menu_items.pop(str);
	}

	emptyItems() {
		this.menu_items([]);
	}
}

class ViewModel {
	constructor() {
		this.menu = new Menu();

		// Add each place to the menu
		for (const place of PLACES) {
			this.menu.addItem(place.title);
		}
	}

	menuItemOnClick(data) {
		if (infoWindow !== undefined)
			populateInfoWindow(markers.get(data), infoWindow, data);
	}
}

ko.applyBindings(new ViewModel());
