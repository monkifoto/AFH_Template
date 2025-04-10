<<<<<<< HEAD

import { environment } from 'src/environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
=======
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;
<<<<<<< HEAD
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  loadScript(): Promise<void> {
    if (!this.isBrowser) return Promise.resolve(); // SSR-safe guard

    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
=======

  loadScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve(); // Script already loaded
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise; // Return the ongoing promise
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
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
<<<<<<< HEAD

=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
<<<<<<< HEAD

      script.onerror = (error) => {
        this.scriptLoaded = false;
        this.scriptLoadingPromise = null;
        reject(error);
      };

=======
      script.onerror = (error) => {
        this.scriptLoaded = false;
        this.scriptLoadingPromise = null; // Reset the promise
        reject(error);
      };
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }
}
