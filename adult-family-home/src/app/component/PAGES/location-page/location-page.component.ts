import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Business } from 'src/app/model/business-questions.model';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { switchMap } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit {
  business: Business | null = null;
  location: any = null;
  layoutType: string | undefined = 'demo';
  locationIndex: number | null = null;
  private map: any;
  private geocoder: any;

  constructor(
    private route: ActivatedRoute,
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.locationIndex = Number(params['locationIndex']);

      //console.log("🔢 Location Index from URL:", this.locationIndex);

      if (this.locationIndex !== null) {
        this.businessDataService.getBusinessId().pipe(
          switchMap((businessId) => {
            if (businessId) {
             // console.log("✅ Business ID Found:", businessId);
              return this.businessDataService.loadBusinessData(businessId);
            }
            return [];
          })
        ).subscribe((business) => {
          if (business) {
           // console.log("✅ Business Data Ready:", business);
            this.business = business;
            this.loadBusinessData(); // 🔥 Now call loadBusinessData AFTER ensuring business data is available
          }
        });
      }
    });
  }


  private loadBusinessData(): void {
    this.businessDataService.getBusinessId().pipe(
      switchMap((businessId) => {
        if (businessId) {
          return this.businessDataService.loadBusinessData(businessId);
        }
        return [];
      })
    ).subscribe((business) => {
      if (!business) {
        console.error("❌ Business data is null.");
        return;
      }

      console.log("✅ Business Data Loaded:", business);

      this.business = business;
      this.layoutType = business.theme?.themeType;

      // 🔥 Debug: Log locations BEFORE using locationIndex
      //console.log("📍 Locations in Business Data:", business.locations);
      //console.log("🔢 Requested Location Index:", this.locationIndex);
      this.businessDataService.getLocations().subscribe((locations) => {
       // console.log("📍 Firestore Locations Retrieved:", locations);

        if (locations && this.locationIndex! < locations.length) {
          this.location = locations[this.locationIndex!];
          //console.log("✅ Loaded Firestore Location:", this.location);
          this.loadMap();
        } else {
          console.error("❌ Location index is out of range. Available Firestore locations:", locations.length);
        }
      });

    });
  }


  private loadMap(): void {
    this.googleMapsLoader.loadScript().then(() => {
      this.initializeMap();
      this.showAddressOnMap(`${this.location.street}, ${this.location.city}, ${this.location.state} ${this.location.zipcode}`);
    }).catch(error => {
      console.error('Error loading Google Maps script:', error);
    });
  }

  private initializeMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
    this.geocoder = new google.maps.Geocoder();
  }

  private showAddressOnMap(address: string): void {
    this.geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(12);
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        console.error('Geocode was not successful: ' + status);
      }
    });
  }
}
