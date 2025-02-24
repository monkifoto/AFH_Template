import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
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
      this.loadComponents();  // Ensure components load only after ViewChild is initialized
    }
  }

  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'aboutus').subscribe((sections) => {
      console.log("📌 Retrieved Sections:", sections);
      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the service.");
        return;
      }
      this.sections = sections.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.loadComponents();
    });
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef (container) is undefined.");
      return;
    }

    this.container.clear(); // ✅ Safe to clear now

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    this.sections.forEach((section) => {
      const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;
      if (!componentType) {
        console.error(`❌ Component Not Found:`, section.component);
        return;
      }

      const factory = this.resolver.resolveComponentFactory(componentType);
      const componentRef = this.container.createComponent(factory, undefined, this.injector);

      Object.assign(componentRef.instance, {
        title: this.applyReplaceKeyword(section.sectionTitle || ''),
        subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
        content: this.applyReplaceKeyword(section.sectionContent || ''),
        imageURL: section.sectionImageUrl || '',
        showBtn: section.showLearnMore || false,
        _businessName: this.business?.businessName || '',
        showImage: !!section.sectionImageUrl,
        themeType: this.business?.theme?.themeType,
        items: section.items || [],
        isMinimal: section.isMinimal || false,
        isParallax: section.isParallax ?? true
      });
    });
  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;

    // Match {{businessName}} instead of {businessName}
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

}
