import { Component, Input, OnInit, OnChanges, SimpleChanges  } from '@angular/core';

declare var google: any; // Declare google object for TypeScript
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent implements OnInit, OnChanges {
  @Input() address: string = '';

  private map: any;
  private geocoder: any;

  constructor() {}

  ngOnInit(): void {
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCz4F7dRDEir2krVB8HvALNq-HhRdqqvK4`;
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
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
