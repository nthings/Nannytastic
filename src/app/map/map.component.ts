import { Component, ComponentFactoryResolver, Injector, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { } from '@types/googlemaps';
import { Observable } from 'rxjs/Observable';
import { NannyInfoWindowComponent } from '../nanny-info-window/nanny-info-window.component';
import { LoaderService } from '../services/loader.service';

const mapStyle = require('./map-style.json');
const iconSvg = require('./svg.json');
const nannyIcon = {
  path: iconSvg.svg,
  fillColor: '#ff94cc',
  fillOpacity: 1,
  anchor: new google.maps.Point(0, 0),
  strokeWeight: 0,
  scale: 0.1
};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('map') gmapElement: any;
  map: google.maps.Map;

  position: any;

  nannys: Array<any>;
  markersArray = [];
  userMarker;

  constructor(private router: Router,
              private db: AngularFirestore,
              private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    // Initialize google map
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: mapStyle
    });

    // Get nannys from Firebase and randomly put markers in the map
    this.db.collection('/nannys').valueChanges().subscribe(
      nannys => {
        this.nannys = nannys;
        this.geolocate();
        this.loaderService.hideLoader();
      }
    );
  }

  // Sets random coordinates to nannys markers and open the closest
  randomizeNannys() {
    this.clearOverlays();
    const distances = [];
    let closest = -1;
    let i = 0;
    for (const nanny of this.nannys) {
      const marker = new google.maps.Marker({
        position: this.randomMarker(this.map.getBounds()),
        map: this.map,
        icon: nannyIcon,
        title: (<any>nanny).name
      });

      // Dynamic component for InfoWindow
      const factory = this.resolver.resolveComponentFactory(NannyInfoWindowComponent);
      const component = factory.create(this.injector);
      component.instance.nanny = nanny;
      component.changeDetectorRef.detectChanges();
      const infowindow = new google.maps.InfoWindow({
        content: component.location.nativeElement,
        maxWidth: 500
      });
      this.markersArray.push({ marker, component});
      // Get closest nanny and open her Info
      distances[i] = google.maps.geometry.spherical.computeDistanceBetween(
        this.markersArray[i].marker.position, this.userMarker.getPosition()
      );
      if (closest === -1 || distances[i] < distances[closest]) {
        closest = i;
      }
      marker.addListener('click', function () {
        infowindow.open(this.map, marker);
      });
      i++;
    }
    google.maps.event.trigger(this.markersArray[closest].marker, 'click');
  }

  // Remove all nannys markers from map
  clearOverlays() {
    for (const marker of this.markersArray) {
      marker.marker.setMap(null);
      marker.component.destroy();
    }
    this.markersArray.length = 0;
  }

  // Get user location and get nannys around him
  geolocate() {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(JSON.stringify(this.position));
        this.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(this.position);

        this.userMarker = new google.maps.Marker({
          position: this.position,
          map: this.map,
          title: 'Got you!'
        });
        this.randomizeNannys();
      },
      (error) => {
        alert(JSON.stringify(error));
      });
  }

  // Random coords within map bounds
  randomMarker(bounds) {
    const lat_min = bounds.getSouthWest().lat(),
          lat_range = bounds.getNorthEast().lat() - lat_min,
          lng_min = bounds.getSouthWest().lng(),
          lng_range = bounds.getNorthEast().lng() - lng_min;

    return new google.maps.LatLng(lat_min + (Math.random() * lat_range), lng_min + (Math.random() * lng_range));
  }

  // Set user position in the center of map and get nannys
  searchInThisArea() {
    this.userMarker.setPosition(this.map.getBounds().getCenter());
    this.randomizeNannys();
  }
}
