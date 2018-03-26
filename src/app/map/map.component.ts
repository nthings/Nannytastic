import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { } from '@types/googlemaps';
import { Observable } from 'rxjs/Observable';

const mapStyle = require('./map-style.json');
const iconSvg = require('./svg.json');
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('map') gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;

  nannys: Array<any>;
  constructor(private router: Router,
              private db: AngularFirestore) { }

  ngOnInit() {
    const nannyIcon = {
      path: iconSvg.svg,
      fillColor: '#FF0000',
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 0,
      scale: 0.1
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: mapStyle
    });
    this.geolocate();

    // Get nannys from Firebase and randomly put markers in the map
    this.db.collection('/nannys').valueChanges().subscribe(
      nannys => {
        this.nannys = nannys;
        for (const nanny of nannys) {
          const marker = new google.maps.Marker({
            position: this.randomMarker(this.map.getBounds()),
            map: this.map,
            icon: nannyIcon,
            title: (<any>nanny).name
          });
          const infowindow = new google.maps.InfoWindow({
            content: (<any>nanny).name
          });
          marker.addListener('click', function () {
            infowindow.open(this.map, marker);
          });
        }
      }
    );
  }

  geolocate() {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.setCenter();
      });
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    const location = new google.maps.LatLng(this.latitude, this.longitude);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Got you!'
    });
  }

  randomMarker(bounds) {
    const lat_min = bounds.getSouthWest().lat(),
          lat_range = bounds.getNorthEast().lat() - lat_min,
          lng_min = bounds.getSouthWest().lng(),
          lng_range = bounds.getNorthEast().lng() - lng_min;

    return new google.maps.LatLng(lat_min + (Math.random() * lat_range), lng_min + (Math.random() * lng_range));
  }

}
