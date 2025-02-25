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
        console.log("Business ID Retrieved:", businessId); // Debugging output
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
      console.log("📌 Sections Retrieved:", sections);

      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the database");
        return;
      }

      // No mapping needed, directly assign sections
      // this.sections = sections;
      this.sections = sections.sort((a, b) => (a.order || 0) - (b.order || 0));

      console.log("✅ Final Sections to Load:", this.sections);

      this.loadComponents();
    });
  }


  getFilteredSections(themeType: string, sections: any[]): any[] {
    console.log(`📌 Filtering sections for themeType: ${themeType}`, sections);

    // Define allowed components per theme
    const themeSectionsMap: Record<string, string[]> = {
      hh: [ "center-text", "item-list", "right-text", "left-text"],
      demo: ["why-us", "unique-features", "center-text", "item-list", "right-text", "left-text"],
      ae: ["center-text", "right-text", "left-text", "testimonials"],
      clemo: ["right-text", "testimonials","google-map"],
      sb: ["center-text", "item-list"],
      prestige: ["why-us", "unique-features", "center-text", "item-list", "right-text", "left-text"]
    };

    // ✅ Sort sections by order before filtering
    const sortedSections = sections.sort((a, b) => (a.order || 0) - (b.order || 0));

    // ✅ Get allowed components for this theme
    const allowedComponents = themeSectionsMap[themeType] || [];

    // ✅ Filter sections that match the allowed components
    const filteredSections = allowedComponents
      .map(componentType => sortedSections.find(section => section.component === componentType))
      .filter(section => section !== undefined);

    console.log("✅ Allowed Components for Theme:", allowedComponents);
    console.log("✅ Final Filtered Sections (Ordered):", filteredSections);

    return filteredSections;
  }



  loadComponents() {
    this.container.clear();

    console.log("✅ Starting to Load Components");

    // Load HeroSliderComponent First
    console.log("✅ Adding HeroSliderComponent");
    const heroSliderFactory = this.resolver.resolveComponentFactory(HeroSliderComponent);
    this.container.createComponent(heroSliderFactory, undefined, this.injector);

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    this.sections.forEach((section, index) => {
      console.log(`🔄 Loading Component for Section ${index + 1}:`, section.component);

      const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;

      if (!componentType) {
        console.error(`❌ Component Not Found:`, section.component);
        return;
      }

      const factory = this.resolver.resolveComponentFactory(componentType);
      const componentRef = this.container.createComponent(factory, undefined, this.injector);

      if (componentRef.instance && typeof componentRef.instance === 'object') {
        Object.assign(componentRef.instance, {
          title: this.applyReplaceKeyword(section.sectionTtitle || ''),
          subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
          content: this.applyReplaceKeyword(section.sectionContent || ''),
          imageURL: section.sectionImageUrl || '',
          showBtn: section.showLearnMore || false,
          _businessName: this.business?.businessName || '',
          showImage: section.showImage,
          themeType: this.business?.theme?.themeType,
          items: section.items || [] ,
          isMinimal: section.isMinimal || false,
          isParallax: section.isParallax ?? true
        });
        console.log(`✅ Component Data for ${section.component}:`, componentRef.instance);
      }
    });

     // Manually Load ItemListComponent if Business Has Services
  // if (this.business?.services?.length) {
  //   console.log("Loading ItemListComponent with Business Services");

  //   const itemListFactory = this.resolver.resolveComponentFactory(ItemListComponent);
  //   const itemListRef = this.container.createComponent(itemListFactory, undefined, this.injector);

  //   Object.assign(itemListRef.instance, {
  //     services: this.business?.services || [],
  //     layoutType: this.business?.theme?.themeType || '',
  //     minimal: true
  //   });
  // }

  // Manually Load WhyUsComponent if Business Has "Why Choose Us" Data
  // if (this.business?.whyChoose?.length) {
  //   console.log("Loading WhyUsComponent");

  //   const whyUsFactory = this.resolver.resolveComponentFactory(WhyUsComponent);
  //   const whyUsRef = this.container.createComponent(whyUsFactory, undefined, this.injector);

  //   Object.assign(whyUsRef.instance, {
  //     whyChooseUs: this.business?.whyChoose || [],
  //     layoutType: this.business?.theme?.themeType || 'demo',
  //     businessName: this.business?.businessName || 'Demo'
  //   });
  // }

  // // Manually Load FeaturesComponent if Business Has Unique Services
  // if (this.business?.uniqueService?.length) {
  //   console.log("Loading FeaturesComponent");

  //   const featuresFactory = this.resolver.resolveComponentFactory(FeaturesComponent);
  //   const featuresRef = this.container.createComponent(featuresFactory, undefined, this.injector);

  //   Object.assign(featuresRef.instance, {
  //     uniqueService: this.business?.uniqueService || [],
  //     layoutType: this.business?.theme?.themeType || 'demo'
  //   });
  // }

  // Manually Load TestimonialsComponent if Business Has Testimonials and No Google Place ID
  if (this.business?.testimonials?.length && !this.business?.placeId) {
    console.log("Loading TestimonialsComponent");

    const testimonialsFactory = this.resolver.resolveComponentFactory(TestimonialsComponent);
    const testimonialsRef = this.container.createComponent(testimonialsFactory, undefined, this.injector);

    Object.assign(testimonialsRef.instance, {
      testimonials: this.business?.testimonials || [],
      layoutType: this.business?.theme?.themeType || 'demo'
    });
  }

  // Manually Load TestimonialCarouselComponent if Business Has a Google Place ID
  if (this.business?.placeId) {
    console.log("Loading TestimonialCarouselComponent");

    const testimonialCarouselFactory = this.resolver.resolveComponentFactory(TestimonialCarouselComponent);
    const testimonialCarouselRef = this.container.createComponent(testimonialCarouselFactory, undefined, this.injector);

    Object.assign(testimonialCarouselRef.instance, {
      placeId: this.business?.placeId || ''
    });
  }
  if (this.business?.theme?.themeType !== 'clemo') {
    console.log("Loading ConsultationComponent");

    const consultationFactory = this.resolver.resolveComponentFactory(ConsultationComponent);
    const consultationRef = this.container.createComponent(consultationFactory, undefined, this.injector);

    Object.assign(consultationRef.instance, {
      id: this.business?.id || '',
      layoutType: this.business?.theme?.themeType || 'demo',
      businessName: this.business?.businessName || 'Demo'
    });
  }

  if (this.business?.placeId && this.business?.theme?.themeType == 'clemo') {
    console.log("Loading GoogleMapComponent");

    const gmapFactory = this.resolver.resolveComponentFactory(GoogleMapsComponent);
    const gmapRef = this.container.createComponent(gmapFactory, undefined, this.injector);

    Object.assign(gmapRef.instance, {
      // id: this.business?.id || '',
      layoutType: this.business?.theme?.themeType || 'demo',
      address: this.business?.address || 'Demo'
    });
  }

  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;

    // Match {{businessName}} instead of {businessName}
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

}
