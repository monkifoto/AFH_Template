import { Component, Input, OnInit, OnChanges, SimpleChanges  } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var google: any; // Declare google object for TypeScript
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent implements OnInit, OnChanges {
  @Input() address: string = '';
  @Input() layoutType: string = 'demo';

  private map: any;
  private geocoder: any;

  constructor() {}

  ngOnInit(): void {
    console.log("Google Map Address:", this.address);
    this.loadGoogleMapsScript().then(() => {
      this.initializeMap();
      if (this.address) {
        this.showAddressOnMap(this.address);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && !changes['address'].firstChange) {
      this.showAddressOnMap(changes['address'].currentValue);
    }
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  private initializeMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
    this.geocoder = new google.maps.Geocoder();
  }

  private showAddressOnMap(address: string): void {
    this.geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);

         // Adjust zoom to show a 10-mile area
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(results[0].geometry.location);
        this.map.fitBounds(bounds);
        const scale = 10 * 1609.34; // 10 miles in meters
        this.map.setZoom(this.getZoomLevel(scale));

        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  private getZoomLevel(radiusInMeters: number): number {
    const equatorLength = 40075004; // Earth's circumference in meters
    const widthInPixels = document.getElementById('map')?.offsetWidth || 640; // Default width if unavailable
    const metersPerPixel = equatorLength / (256 * Math.pow(2, this.map.getZoom()));
    return Math.floor(Math.log2(equatorLength / (radiusInMeters * metersPerPixel)));
  }
}
