var map;

function initMap() {
	map = new google.maps.Map(
		$('#map')[0], {
			center: {
				lat: 0,
				lng: 0
			},
			zoom: 2,
			//styles: style
		}
	);
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
		this.menu.addItem('Item 1');
		this.menu.addItem('Item 2');
		this.menu.addItem('Item 3');
	}

	menuItemOnClick(data) {
		console.log(data);
	}
}

ko.applyBindings(new ViewModel());
