import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { CenterTextComponent } from '../UI/center-text/center-text.component';
import { RightTextComponent } from '../UI/right-text/right-text.component';
import { LeftTextComponent } from '../UI/left-text/left-text.component';
import { HeroSliderComponent } from '../UI/hero-slider/hero-slider.component';
import { ItemListComponent } from '../UI/item-list/item-list.component';
import { FeaturesComponent } from '../UI/features/features.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { TestimonialCarouselComponent } from '../UI/testimonial-carousel/testimonial-carousel.component';
import { ConsultationComponent } from '../UI/consultation/consultation.component';
import { WhyUsComponent } from '../UI/why-us/why-us.component';
import { GoogleMapsComponent } from '../UI/google-maps/google-maps.component';
import { Business } from 'src/app/model/business-questions.model';
import { switchMap } from 'rxjs';
import { IconListComponent } from '../UI/icon-list/icon-list.component';
import { LatestProductsComponent } from '../UI/latest-products/latest-products.component';
import { CallToActionComponent } from '../UI/call-to-action/call-to-action.component';
import { FaqComponent } from '../UI/faq/faq.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$ = this.businessDataService.businessData$;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'hero-slider': HeroSliderComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    'icon-list': IconListComponent,
    'unique-features': FeaturesComponent,
    'testimonials': TestimonialsComponent,
    'testimonials-carousel': TestimonialCarouselComponent,
    'why-us': WhyUsComponent,
    'google-map': GoogleMapsComponent,
    'latest-products':LatestProductsComponent,
    'cta': CallToActionComponent,
    'consultation': ConsultationComponent
  };

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(
    private sectionService: BusinessSectionsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private businessDataService: BusinessDataService
  ) {}

  ngOnInit(): void {
    this.businessDataService.getBusinessId().pipe(
      switchMap((businessId) => {
       // console.log("Business ID Retrieved:", businessId); // Debugging output
        if (businessId) {
          this.businessId = businessId;
          this.metaService.loadAndApplyMeta(businessId);
          return this.businessDataService.loadBusinessData(businessId);
        }
        return [];
      })
    ).subscribe((business) => {
      console.log("Business Data Retrieved:", business); // Debugging output
      if (business) {
        this.business = business;
        this.loadSections();
      }
    });
  }


  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'home').subscribe((sections) => {
     // console.log("📌 Sections Retrieved:", sections);

      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the database");
        return;
      }

      // ✅ Apply filtering to remove inactive sections BEFORE using them
      this.sections = sections
        .filter(section => section.isActive !== false) // ❌ Remove inactive sections
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // ✅ Sort by order

      console.log("✅ Final Active Sections to Load:", this.sections);

      this.loadComponents(); // ✅ Now load components ONLY for active sections
    });
}


loadComponents() {
  this.container.clear();
  console.log("✅ Starting to Load Components");

  // ✅ Load HeroSliderComponent First
  console.log("✅ Adding HeroSliderComponent");
  this.container.createComponent(HeroSliderComponent);

  if (!this.sections.length) {
    console.warn("❗ No sections available to load.");
    return;
  }

  let consultationSection: any = null; // ✅ Store consultation section to load last

  // ✅ Load all sections except 'consultation'
  this.sections.forEach((section, index) => {
    console.log(`🔄 Loading Component for Section ${index + 1}:`, section.component);

    const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;

    if (!componentType) {
      console.error(`❌ Component Not Found:`, section.component);
      return;
    }

    // ✅ Store consultation section to load after everything else
    if (section.component === 'consultation') {
      consultationSection = section;
      return;
    }

    const componentRef = this.container.createComponent(componentType);
    this.assignComponentProperties(componentRef.instance, section);
  });

  // ✅ Now inject manually added components
  this.loadManualComponents();

  // ✅ Finally, inject ConsultationComponent at the very end
  if (consultationSection) {
    console.log("🟢 Loading Consultation Section LAST");

    const consultationComponentType = this.componentsMap['consultation'] as Type<any>;

    if (consultationComponentType) {
      const consultationRef = this.container.createComponent(consultationComponentType);
      this.assignComponentProperties(consultationRef.instance, consultationSection);
    } else {
      console.error(`❌ Consultation Component Not Found!`);
    }
  }
}


loadManualComponents() {
  // Manually Load TestimonialsComponent if Business Has Testimonials and No Google Place ID
  if (this.business?.testimonials?.length && !this.business?.placeId && this.business?.theme?.themeType !== 'sb') {
    const testimonialsFactory = this.resolver.resolveComponentFactory(TestimonialsComponent);
    const testimonialsRef = this.container.createComponent(TestimonialsComponent,{
      index: undefined,
      injector: this.injector
    });
  }

  // Manually Load TestimonialCarouselComponent if Business Has a Google Place ID
  if (this.business?.placeId) {
    const testimonialCarouselFactory = this.resolver.resolveComponentFactory(TestimonialCarouselComponent);
    const testimonialCarouselRef = this.container.createComponent(TestimonialCarouselComponent, {
      index: undefined,
      injector: this.injector});

      testimonialCarouselRef.instance.placeId = this.business.placeId;
  }

  if (this.business?.placeId && this.business?.theme?.themeType === 'clemo') {
    const gmapFactory = this.resolver.resolveComponentFactory(GoogleMapsComponent);
    const gmapRef = this.container.createComponent(GoogleMapsComponent,{
      index: undefined,
      injector: this.injector

    });
    gmapRef.instance.layoutType =  this.business?.theme?.themeType || 'demo';
    gmapRef.instance.address = this.business?.address || '';
  }

  if (this.business?.placeId && this.business?.theme?.themeType === 'clemo') {
    const gmapFactory = this.resolver.resolveComponentFactory(GoogleMapsComponent);
    const gmapRef = this.container.createComponent(GoogleMapsComponent,{
      index: undefined,
      injector: this.injector

    });
    gmapRef.instance.layoutType =  this.business?.theme?.themeType || 'demo';
    gmapRef.instance.address = this.business?.address || '';
  }

if(this.business?.theme?.themeType ==='clemo'){

    const faqRef = this.container.createComponent(FaqComponent,{
      index: undefined,
      injector: this.injector

    });
    // faqRef.instance.layoutType =  this.business?.theme?.themeType || 'demo';
    // faqRef.instance.address = this.business?.address || '';
}

  if (this.business?.theme?.themeType == 'sb') {
    const latestProductsFactory = this.resolver.resolveComponentFactory(LatestProductsComponent);
    const latestProductsRef = this.container.createComponent(LatestProductsComponent, {
      index: undefined, // You can specify an index if needed
      injector: this.injector,
    });
    latestProductsRef.instance.layoutType = this.business?.theme?.themeType;
    latestProductsRef.changeDetectorRef.detectChanges();
  }
}


assignComponentProperties(componentInstance: any, section: any) {
  if (componentInstance && typeof componentInstance === 'object') {
    Object.assign(componentInstance, {
      title: this.applyReplaceKeyword(section.sectionTitle || ''),
      subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
      content: this.applyReplaceKeyword(section.sectionContent || ''),
      sectionImageUrl: section.sectionImageUrl || '',
      showButton: section.showButton || false,
      buttonText: section.buttonText || 'Learn More',
      buttonLink: section.buttonLink || '',
      _businessName: this.business?.businessName || '',
      showImage: section.showImage,
      themeType: this.business?.theme?.themeType,
      items: section.items || [],
      isMinimal: section.isMinimal || false,
      isParallax: section.isParallax ?? true,
      backgroundColor: section.backgroundColor || '#ffffff',
      textColor: section.textColor || '#000000',
      titleColor: section.titleColor || '#000000',
      titleFontSize: section.titleFontSize || '36',
      subtitleColor: section.subtitleColor || '#000000',
      subtitleFontSize: section.subtitleFontSize || '14',
      fullWidth: section.fullWidth || false,
      alignText: section.alignText || 'left',
      boxShadow: section.boxShadow || false,
      borderRadius: section.borderRadius ?? 10,
      page: section.page,
      location: section.location,
      businessId: this.business?.id
    });

    // ✅ Ensure UI updates after setting properties
    if (componentInstance.changeDetectorRef) {
      componentInstance.changeDetectorRef.detectChanges();
    }

    console.log(`✅ Component Data for ${section.component}:`, componentInstance);
  }
}

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;

    // Match {{businessName}} instead of {businessName}
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

}
