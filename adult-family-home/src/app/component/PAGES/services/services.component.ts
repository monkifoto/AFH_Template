import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
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
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {
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

  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'services').subscribe((sections) => {
      console.log("📌 Retrieved Sections:", sections);
      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the service.");
        return;
      }
      this.sections = sections.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTimeout(() => {
        this.loadComponents();
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.container) {
        console.error("❌ ViewContainerRef (container) is still undefined after ViewInit.");
        return;
      }
      if (this.business && this.sections.length) {
        console.log("✅ View and Sections Ready – Loading Components...");
        this.loadComponents();
      } else {
        console.warn("❗ Sections are not loaded yet, retrying...");
        setTimeout(() => {
          if (this.sections.length) {
            console.log("✅ Sections loaded after retry – Loading Components...");
            this.loadComponents();
          }
        }, 500);
      }
    }, 500);
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef (container) is undefined.");
      return;
    }

    this.container.clear();

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    console.log("✅ Loading Components for Sections:", this.sections);

    this.sections.forEach((section) => {
      console.log("🔄 Processing Section:", section);
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
