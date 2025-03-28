import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { Business } from 'src/app/model/business-questions.model';
import { switchMap } from 'rxjs';
import { CenterTextComponent } from '../../UI/center-text/center-text.component';
import { RightTextComponent } from '../../UI/right-text/right-text.component';
import { LeftTextComponent } from '../../UI/left-text/left-text.component';
import { ItemListComponent } from '../../UI/item-list/item-list.component';
import { CallToActionComponent } from '../../UI/call-to-action/call-to-action.component';
import { ConsultationComponent } from '../../UI/consultation/consultation.component';
import { LatestProductsComponent } from '../../UI/latest-products/latest-products.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$ = this.businessDataService.businessData$;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    'cta': CallToActionComponent,
    'consultation': ConsultationComponent
  };

  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

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
        if (businessId) {
          this.businessId = businessId;
          this.metaService.loadAndApplyMeta(businessId);
          return this.businessDataService.loadBusinessData(businessId);
        }
        return [];
      })
    ).subscribe((business) => {
      if (business) {
        this.business = business;
        this.loadSections();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.business) {
      this.loadComponents();
    }
  }

  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'aboutus').subscribe((sections) => {
      //console.log("📌 Retrieved Sections:", sections);
      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the service.");
        return;
      }
      this.sections = sections.filter(section => section.isActive !== false) .sort((a, b) => (a.order || 0) - (b.order || 0));
      this.loadComponents();
    });
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef (container) is undefined.");
      return;
    }

    this.container.clear(); // ✅ Clear previous components

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    // ✅ Sort sections based on 'order' from the database
    this.sections.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (this.business?.theme?.themeType === 'hh') {

    let leftRightSections: any[] = [];
    let firstCenterText: any = null;
    let secondCenterText: any = null;
    let ctaSection: any = null;
    let otherSections: any[] = [];
    let wrapperElement: HTMLElement;

    // ✅ Identify `center-text`, `left-text/right-text` groups, and `cta`
    this.sections.forEach((section) => {
      if (section.component === 'center-text') {
        if (!firstCenterText) {
          firstCenterText = section;
        } else {
          secondCenterText = section;
        }
      } else if (section.component === 'left-text' || section.component === 'right-text') {
        leftRightSections.push(section);
      } else if (section.component === 'cta') {
        ctaSection = section;
      } else {
        otherSections.push(section);
      }
    });

    // ✅ 1️⃣ Render first `center-text` before wrapper
    if (firstCenterText) {
      //console.log("✅ Rendering first center-text BEFORE wrapper...");
      this.createComponent(firstCenterText);
    }

    // ✅ 2️⃣ Create wrapper but DO NOT append it yet
    if (leftRightSections.length > 0) {
      //console.log("✅ Creating wrapper...");
      wrapperElement = document.createElement('div');
      wrapperElement.className = 'text-wrapper';

      // ✅ Sort left-text before right-text
      leftRightSections.sort((a, b) => (a.component === 'left-text' ? -1 : 1));

      // ✅ Insert left-text and right-text into wrapper
      leftRightSections.forEach((section) => {
        const componentRef = this.createComponent(section);
        if (componentRef) {
          wrapperElement.appendChild(componentRef.location.nativeElement);
        }
      });

      // ✅ Now insert wrapper AFTER first center-text
      this.container.element.nativeElement.appendChild(wrapperElement);
    }

    // ✅ 3️⃣ Render second `center-text` AFTER wrapper
    if (secondCenterText) {
      //console.log("✅ Rendering second center-text...");
      this.createComponent(secondCenterText);
    }

    // ✅ 4️⃣ Render all other sections normally
    otherSections.forEach((section) => {
      this.createComponent(section);
    });

    // ✅ 5️⃣ Ensure CTA is always last
    if (ctaSection) {
      //console.log("✅ Rendering CTA at last position...");
      this.createComponent(ctaSection);
    }
  }else{
      // Load components based on the 'order' property
      this.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.sections.forEach((section) => {
          this.createComponent(section);
      });
      this.loadManualComponents();
  }
  }


  loadManualComponents() {
    if (this.business?.theme?.themeType == 'clemo') {
      const latestProductsFactory = this.resolver.resolveComponentFactory(
        LatestProductsComponent
      );
      const latestProductsRef = this.container.createComponent(
        LatestProductsComponent,
        {
          index: undefined,
          injector: this.injector,
        }
      );
      latestProductsRef.instance.layoutType = this.business?.theme?.themeType;
      latestProductsRef.changeDetectorRef.detectChanges();
    }
  }


  createWrapper(group: any[]) {
    if (!group.length) return;

    // ✅ Create wrapper div dynamically
    const wrapperElement = document.createElement('div');
    wrapperElement.className = 'text-wrapper'; // ✅ Apply CSS styles

    // ✅ Ensure left-text is inserted FIRST before right-text
    group.sort((a, b) => (a.component === 'left-text' ? -1 : 1));

    // ✅ Insert left-text and right-text immediately inside the wrapper
    group.forEach((section) => {
      const componentRef = this.createComponent(section);
      if (componentRef !== null) { // ✅ Ensures valid component
        wrapperElement.appendChild(componentRef.location.nativeElement);
      }
    });

    // ✅ Append the wrapper to the container AFTER inserting left-text and right-text
    this.container.element.nativeElement.appendChild(wrapperElement);
  }

  createComponent(section: any, insertBeforeElement?: HTMLElement): ComponentRef<any> | null {
    const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;
    if (!componentType) {
      console.error(`❌ Component Not Found:`, section.component);
      return null; // Prevent errors if the component is not found
    }

    const factory = this.resolver.resolveComponentFactory(componentType);
    const componentRef = this.container.createComponent(factory);

    this.applyComponentProperties(componentRef.instance, section);

    // ✅ If we need to insert before the wrapper, do it manually
    if (insertBeforeElement) {
      this.container.element.nativeElement.insertBefore(
        componentRef.location.nativeElement,
        insertBeforeElement
      );
    } else {
      this.container.element.nativeElement.appendChild(componentRef.location.nativeElement);
    }

    return componentRef;
  }




  applyComponentProperties(componentInstance: any, section: any) {

    const isActive = section.isActive !== undefined ? section.isActive : true;
    Object.assign(componentInstance, {
      isActive : [isActive],
        title: this.applyReplaceKeyword(section.sectionTitle || ''),
        subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
        content: this.applyReplaceKeyword(section.sectionContent || ''),
        sectionImageUrl: section.sectionImageUrl || '',
        showBtn: section.showLearnMore || false,
        _businessName: this.business?.businessName || '',
        showImage: !!section.sectionImageUrl,
        themeType: this.business?.theme?.themeType,
        items: section.items || [],
        isMinimal: section.isMinimal || false,
        isParallax: section.isParallax ?? true,
        backgroundColor: section.backgroundColor || '#ffffff',
        textColor: section.textColor || '#000000',
        titleColor: section.titleColor || '#000000',
        subtitleColor: section.subtitleColor || '#000000',
        fullWidth: section.fullWidth || false,
        showButton: section.showButton || false,
        buttonText: section.buttonText || 'Learn More',
        buttonLink: section.buttonLink || '',
        titleFontSize: section.titleFontSize || '36',
        subtitleFontSize: section.subtitleFontSize || '14',
        alignText: section.alignText || 'left',
        boxShadow: section.boxShadow || false,
        borderRadius: section.borderRadius ?? 10,
        page: section.page,
        location: section.location
    });
  }

  applyReplaceKeyword(value: string): string {
    return value.replace(/{{\s*businessName\s*}}/g, this.business?.businessName || '');
  }
}
