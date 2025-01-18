import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;

  loadScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve(); // Script already loaded
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise; // Return the ongoing promise
    }

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-script')) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => {
        this.scriptLoaded = false;
        this.scriptLoadingPromise = null; // Reset the promise
        reject(error);
      };
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }
}
