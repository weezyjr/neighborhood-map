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

}

ko.applyBindings(new ViewModel);
