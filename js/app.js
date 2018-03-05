var map;

function initMap() {
	map = new google.maps.Map(
		$('#map')[0], {
			center: {
				lat: 0,
				lng: 0
			},
			zoom: 2
		}
	);
}

class ViewModel {
	constructor() {
		//Flag to check out the current state of the menu
		this.menu_opened = true;
		//menu -> burger icon , close-> X icon
		this.menu_Icon = ko.observable('menu');
	}

	openMenu() {
		this.menu_Icon('menu');
		this.menu_opened = true;
	}
	closeMenu() {
		this.menu_Icon('close');
		this.menu_opened = false;
	}
	toggleMenu() {
		this.menu_opened ?
			this.closeMenu() : this.openMenu();
	}
}

ko.applyBindings(new ViewModel());
