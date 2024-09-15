import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-map-iframe',
  templateUrl: './map-iframe.component.html',
  styleUrls: ['./map-iframe.component.css']
})
export class MapIframeComponent implements OnInit {
  mapIframeUrl: SafeHtml | null = null;
  businessId !: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
        this.businessId = params['id'];

        this.loadMapIframe();
        });
  }

  // Method to load map iframe URL from Firestore
  loadMapIframe(): void {
    this.firestore.collection('businesses').doc(this.businessId).valueChanges().subscribe((business: any) => {
      this.mapIframeUrl = this.sanitizer.bypassSecurityTrustHtml(business?.mapIframeUrl ?? null);
      console.log(this.mapIframeUrl);
    });
  }
}


