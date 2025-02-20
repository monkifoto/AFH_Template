import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { CenterTextComponent } from '../UI/center-text/center-text.component';
import { HeroSliderComponent } from '../UI/hero-slider/hero-slider.component';
import { ItemListComponent } from '../UI/item-list/item-list.component';
import { FeaturesComponent } from '../features/features.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { TestimonialCarouselComponent } from '../UI/testimonial-carousel/testimonial-carousel.component';
import { ConsultationComponent } from '../consultation/consultation.component';
import { WhyUsComponent } from '../why-us/why-us.component';
import { Business } from 'src/app/model/business-questions.model';
import { switchMap } from 'rxjs';

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
    'item-list': ItemListComponent,
    'features': FeaturesComponent,
    'testimonials': TestimonialsComponent,
    'why-us': WhyUsComponent
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
        this.loadSections(business.theme?.themeType || 'default');
      }
    });
  }


  loadSections(themeType: string) {
    this.sectionService.getBusinessSections(this.businessId, 'Home').subscribe((sections) => {
      console.log("Sections Retrieved:", sections); // Debugging output
      this.sections = this.getFilteredSections(themeType, sections);
      console.log("Filtered Sections:", this.sections); // Debugging output
      this.loadComponents();
    });
  }

  getFilteredSections(themeType: string, sections: any[]): any[] {
    console.log(`Filtering sections for themeType: ${themeType}`, sections);

    // Map sectionType values to the expected component names
    const sectionTypeToComponentMap: Record<string, string> = {
      "Welcome": "center-text",
      "Gallery": "gallery",
      "Story": "center-text",
      "Mission": "center-text",
      "Vision": "center-text",
      "Other": "features" // Default for unknown types
    };

    const themeSectionsMap: Record<string, string[]> = {
      hh: ["center-text", "item-list"],
      demo: ["center-text", "item-list"],
      ae: ["center-text", "testimonials"],
      clemo: ["features", "testimonials"],
      sb: ["center-text", "item-list"],
      prestige: []
    };

    const allowedComponents = themeSectionsMap[themeType] || [];

    // Convert sectionType to component before filtering
    const filteredSections = sections.map(section => {
      const mappedComponent = sectionTypeToComponentMap[section.sectionType] || "features"; // Default fallback
      return { ...section, component: mappedComponent };
    }).filter(section => allowedComponents.includes(section.component));

    console.log("Allowed Components for Theme:", allowedComponents);
    console.log("Final Filtered Sections:", filteredSections);

    return filteredSections.sort((a, b) => a.order - b.order);
  }


  loadComponents() {
    this.container.clear();

    // Always Load HeroSliderComponent First
    console.log("Adding HeroSliderComponent");
    const heroSliderFactory = this.resolver.resolveComponentFactory(HeroSliderComponent);
    const heroSliderRef = this.container.createComponent(heroSliderFactory, undefined, this.injector);

    if (!this.sections.length) {
      console.warn("No sections to load.");
      return;
    }



    this.sections.forEach((section) => {
      console.log("Loading Component:", section.component);
      const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;

      if (!componentType) {
        console.error("Component Not Found:", section.component);
        return;
      }

      const factory = this.resolver.resolveComponentFactory(componentType);
      const componentRef = this.container.createComponent(factory, undefined, this.injector);

      if (componentRef.instance && typeof componentRef.instance === 'object') {
        // Assign section properties dynamically
        Object.assign(componentRef.instance, {
          title: this.applyReplaceKeyword(section.sectionTitle || ''),
          subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
          content: this.applyReplaceKeyword(section.sectionContent || ''),
          imageURL: section.sectionImageUrl,
          themeType: this.business?.theme?.themeType || '',
          showBtn: true, // Adjust based on need
          _businessName: this.business?.businessName || '',
          showImage: !!section.sectionImageUrl, // Show image if URL exists
        });
      }
    });

     // Manually Load ItemListComponent if Business Has Services
  if (this.business?.services?.length) {
    console.log("Loading ItemListComponent with Business Services");

    const itemListFactory = this.resolver.resolveComponentFactory(ItemListComponent);
    const itemListRef = this.container.createComponent(itemListFactory, undefined, this.injector);

    Object.assign(itemListRef.instance, {
      services: this.business?.services || [],
      layoutType: this.business?.theme?.themeType || '',
      minimal: true
    });
  }

  // Manually Load WhyUsComponent if Business Has "Why Choose Us" Data
  if (this.business?.whyChoose?.length) {
    console.log("Loading WhyUsComponent");

    const whyUsFactory = this.resolver.resolveComponentFactory(WhyUsComponent);
    const whyUsRef = this.container.createComponent(whyUsFactory, undefined, this.injector);

    Object.assign(whyUsRef.instance, {
      whyChooseUs: this.business?.whyChoose || [],
      layoutType: this.business?.theme?.themeType || 'demo',
      businessName: this.business?.businessName || 'Demo'
    });
  }

  // Manually Load FeaturesComponent if Business Has Unique Services
  if (this.business?.uniqueService?.length) {
    console.log("Loading FeaturesComponent");

    const featuresFactory = this.resolver.resolveComponentFactory(FeaturesComponent);
    const featuresRef = this.container.createComponent(featuresFactory, undefined, this.injector);

    Object.assign(featuresRef.instance, {
      uniqueService: this.business?.uniqueService || [],
      layoutType: this.business?.theme?.themeType || 'demo'
    });
  }

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

  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;

    // Match {{businessName}} instead of {businessName}
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

}
