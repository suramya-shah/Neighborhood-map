function myfunc() {
    var map;

    // Create a new blank array for all the listing markers.
    var markers = [];

    // Create a styles array to use with the map.
    var styles = [{
        featureType: 'road',
        stylers: [{
            color: '#777a84'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#ffffff'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'landscape',
        elementType: 'labels',
        stylers: [{
            color: '#42a557'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'off'
            },
            {
                color: '#c2e8c6'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#ffffff'
            },
            {
                lightness: -25
            }
        ]
    }];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 29.59726,
            lng: 79.66088
        },
        zoom: 16,
        styles: styles,
        mapTypeControl: false
    });



    // Title,lat,lon,street address,cityaddress manually defined.

    var locations = [{
            title: 'Nanda Devi Temple',
            location: {
                lat: 29.598678,
                lng: 79.6610302
            },
            streetAddress: '',
            cityAddress: 'Almora,Uttrakhand, 263601'
        },
        {
            title: 'Army Public School',
            location: {
                lat: 29.5900418,
                lng: 79.6478373
            },
            streetAddress: '',
            cityAddress: 'Almora Uttrakhand, 263601'
        },
        {
            title: 'Sai Baba", "Temple',
            location: {
                lat: 29.6020427,
                lng: 79.6628052
            },
            streetAddress: '',
            cityAddress: 'Almora Uttrakhand,263601'
        },
        {
            title: 'Bright End Cafe Almora',
            location: {
                lat: 29.5890916,
                lng: 79.6379949
            },
            streetAddress: '',
            cityAddress: 'Almora Uttrakhand ,263601'
        },
        {
            title: 'Kailash Hotel',
            location: {
                lat: 29.5938733,
                lng: 79.6520306
            },
            streetAddress: '',
            cityAddress: 'Almora Uttrakhand,263601'
        },
        {
            title: 'Kasar Devi Temple',
            location: {
                lat: 29.5892407,
                lng: 79.6444773
            },
            streetAddress: '',
            cityAddress: 'Almora Uttrakhand ,263601'
        },
        {
            title: 'Hanuman Mandir',
            location: {
                lat: 29.5928682,
                lng: 79.6506384
            },
            streetAddress: '',
            cityAddress: 'Alora Uttrakhand ,263601'
        }
    ];
    var largeInfowindow = new google.maps.InfoWindow();
    var infowindow = new google.maps.InfoWindow();

    m = ko.observableArray();
    myArray = ko.observableArray();
    myFunction = function () {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
            infowindow.close(map, this);
        } else {
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                this.setAnimation(null);
            }.bind(this), 3000);

            infowindow.setContent(this.contentString);
            infowindow.open(map, this);

        }


    };

    v = function (x, m) {
        $.getJSON("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170616T101056Z.bcc5a7953d80ca28.36274764bbf518eb5c92b26464dbbc6e19fae9bb&text=" + x.title + "&lang=hi&callback=", function (a) {


                //Binds infoWindow content to each marker
                m.contentString = x.title + '<strong><br><p>' +
                    x.streetAddress + '<br>' +
                    x.cityAddress + '</strong></p>' + a.text;



                infowindow = new google.maps.InfoWindow({
                    content: m.contentString
                });
            })
            .fail(function () {
                alert("error translating to hindi");
            });
    };



    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var cityAddress = locations[i].cityAddress;
        var streetAddress = locations[i].streetAddress;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            latitude: position.lat,
            longitude: position.lng,
            streetAddress: streetAddress,
            cityAddress: cityAddress,
            animation: google.maps.Animation.DROP,
            id: i,
            visible: true,
            boolTest: true,

        });

        m.push(marker);
        // Push the marker to our array of markers.
        markers.push(marker);
        this.v(locations[i], markers[i]);
        // Create an onclick event to open the large infowindow at each marker.
        google.maps.event.addListener(marker, 'click', this.myFunction);
    }


    query = ko.observable("");


    // Filtering markers array
    self.showMarkers = ko.computed(function () {
        return ko.utils.arrayFilter(m(), function (marker) {
            if (marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0)
                marker.show = true;
            else
                marker.show = false;
            return marker.show;
        });
    });
    self.bounce = function (name) {
        google.maps.event.trigger(markers[name], 'click');
    };
    // Shows the suggestions list
    showList = ko.observable(true);

    // Hides the suggestions list
    hideList = function () {
        showList(false);
    };

    // creates a infoWindow to display marker details
    // Hide/show markers based on search query
    self.showMarkers.subscribe(function () {
        showList(true);
        for (var i = 0; i < m().length; i++) {
            if (m()[i].show === false)
                m()[i].setVisible(false);
            else
                m()[i].setVisible(true);
        }
    });

    // This will loop through the markers array and display them all.
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);

    ko.applyBindings();


}
var k =function(){
    alert("map not working");
};