import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { UploadService } from 'src/app/services/upload.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.css'],
})
export class SectionManagerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() businessId!: string;
  showInactiveSections: boolean = false;

  collapsedSections: { [sectionId: string]: boolean } = {};
  sectionGroups: { [key: string]: FormGroup[] } = {};
  pages = [
    'home',
    'aboutus',
    'services',
    'faq',
    'contactus',
    'gallery',
    'testimonials',
  ];
  pageGroups = [
    'home',
    'aboutus',
    'services',
    'gallery',
    'location',
    'testimonials',
    'faq',
    'contactus',
    'uncategorized',
  ];

  locations = ['', 'left', 'right', 'top', 'bottom'];
  componentTypes = [
    'center-text',
    'left-text',
    'right-text',
    'item-list',
    'why-us',
    'unique-features',
    'cta',
    'consultation'
  ];
  fontStyles = ['normal', 'bold', 'italic'];

  predefinedColors = [
    { name: 'Primary', value: 'var(--primary-color)' },
    { name: 'Secondary', value: 'var(--secondary-color)' },
    { name: 'Accent', value: 'var(--accent-color)' },
    { name: 'Background', value: 'var(--background-color)' },
    { name: 'Dark Background', value: 'var(--dark-background-color)' },
    { name: 'Text', value: 'var(--text-color)' },
    { name: 'Nav Background', value: 'var(--nav-background-color)' },
    { name: 'Nav Text', value: 'var(--nav-text-color)' },
    { name: 'Nav Active Background', value: 'var(--nav-active-background)' },
    { name: 'Nav Active Text', value: 'var(--nav-active-text)' },
    { name: 'Button', value: 'var(--button-color)' },
    { name: 'Button Hover', value: 'var(--button-hover-color)' },
    { name: 'Button Text', value: 'var(--button-text-color)' },
    { name: 'Border', value: 'var(--border-color)' }
  ]

  uploadProgress: { [key: number]: Observable<number> } = {};

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
    { url: 'assets/sharedAssets/istockphoto-478915838-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-480743801-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-502998071-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-613308420-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-655931804-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-804432288-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-912405752-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-918529390-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-941789670-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1097353864-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1335866199-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1432890664-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2032240867-2048x2048.jpg' },
    { url: 'assets/sharedAssets/5388429572_df9a403081_k.jpg' },
    { url: 'assets/sharedAssets/9676303919_32372bf834_o.jpg' },
    { url: 'assets/sharedAssets/istockphoto-590615058-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1145276617-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1296176596-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1321691755-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1389452512-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1629902196-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1860450584-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2163609093-2048x2048.jpg' },
  ];

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private businessSectionsService: BusinessSectionsService,
    private uploadService: UploadService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections() {
    if (!this.businessId) return;

    this.businessSectionsService
      .getAllBusinessSections(this.businessId)
      .subscribe((sections) => {
        this.sections.clear();

        sections.sort((a, b) => {
          const pageComparison =
            this.pages.indexOf(a.page) - this.pages.indexOf(b.page);
          return pageComparison !== 0
            ? pageComparison
            : (a.order || 0) - (b.order || 0);
        });

        this.sectionGroups = {};
        this.pageGroups.forEach((page) => (this.sectionGroups[page] = []));

        sections.forEach((section, index) => {
          console.log(`🔍 Section ${index + 1}:`, section); // Logs each section received
          console.log(`🖼️ Image URL for Section ${index + 1}:`,section.sectionImageUrl ); // Specifically logs the image URL

          if (!section.id) {
            section.id = this.businessSectionsService.generateNewId(); // Ensure each section has an ID
          }


          const sectionForm = this.fb.group({
            id: [section.id],
            isActive: [section.isActive !== undefined ? section.isActive : true],
            component: [section.component || 'center-text'],
            order: [section.order || 0],
            sectionTitle: [section.sectionTitle],
            titleFontSize: [section.titleFontSize || 16],
            titleFontStyle: [section.titleFontStyle || 'normal'],
            sectionSubTitle: [section.sectionSubTitle],
            subtitleFontSize: [section.subtitleFontSize || 14],
            subtitleFontStyle: [section.subtitleFontStyle || 'normal'],
            page: [section.page],
            location: [section.location],
            sectionContent: [section.sectionContent],
            sectionImageUrl: [section.sectionImageUrl],
            showImage: [section.showImage],
            showButton: [section.showButton || false],
            buttonText:[section.buttonText || 'Learn More'],
            buttonLink: [section.buttonLink || 'contact-us'],
            alignText: [section.alignText || 'left'],
            boxShadow:[section.boxShadow|| false],
            borderRadius: [section.borderRadius || 10],
            isMinimal: [section.isMinimal || false],
            isParallax: [section.isParallax || false],
            backgroundColor: [section.backgroundColor],
            textColor: [section.textColor],
            titleColor: [section.titleColor],
            subtitleColor: [section.subtitleColor],
            fullWidth:[section.fullWidth],
            imageSource: ['upload'],
            items: this.fb.array(
              section.items
                ? section.items.map((item) => this.createItemForm(item))
                : []
            ),
          });

          const pageKey = this.pageGroups.includes(section.page) ? section.page : 'uncategorized';
          this.sectionGroups[pageKey].push(sectionForm);

          this.collapsedSections[section.id] = true;

        });
        this.cdRef.detectChanges();
      });
  }

  createItemForm(
    item: any = { title: '', description: '', icon: '' }
  ): FormGroup {
    return this.fb.group({
      title: [item.title],
      description: [item.description],
      icon: [item.icon],
    });
  }

  addSection() {
    const newSectionId = this.businessSectionsService.generateNewId(); // Generate a unique ID
    const defaultPage = 'home'; // Default section placement
    const newSection = this.fb.group({
      id: [null],
      isActive: [true],
      component: ['center-text'],
      order: [0],
      sectionTitle: [''],
      titleFontSize: [16],
      titleFontStyle: ['normal'],
      sectionSubTitle: [''],
      subtitleFontSize: [14],
      subtitleFontStyle: ['normal'],
      page: ['home'],
      location: ['center'],
      sectionImageUrl: [''],
      sectionContent: [''],
      showLearnMore: [false],
      showImage: [false],
      imageSource: ['upload'],
      showButton: [false],
      buttonText:['Learn More'],
      buttonLink: ['contact-us'],
      alignText: [ 'left'],
      boxShadow:[false],
      borderRadius: [0],
      backgroundColor: ['#ffffff'],
      textColor: ['#000000'],
      titleColor: ['#000000'],
      subtitleColor: ['#000000'],
      items: this.fb.array([]),
    });


  // ✅ Ensure the section group exists before adding the section
  if (!this.sectionGroups[defaultPage]) {
    this.sectionGroups[defaultPage] = [];
  }

  // ✅ Add the new section to the correct group
  this.sectionGroups[defaultPage].push(newSection);

  // ✅ Collapse the new section by default
  this.collapsedSections[newSectionId] = true;

  // ✅ Trigger UI update
  this.cdRef.detectChanges();

  console.log('✅ New section added:', newSection.value);
  }

  removeSection(sectionId: string) {
    Object.keys(this.sectionGroups).forEach((page) => {
      this.sectionGroups[page] = this.sectionGroups[page].filter(
        (s) => s.get('id')?.value !== sectionId
      );
    });
    this.cdRef.detectChanges();
  }

  addItem(sectionId: string) {
    const section = this.findSectionById(sectionId);
    if (!section) return;

    const items = section.get('items') as FormArray;
    items.push(this.createItemForm());
  }

  removeItem(sectionId: string, itemIndex: number) {
    const section = this.findSectionById(sectionId);
    if (!section) return;

    const items = section.get('items') as FormArray;
    items.removeAt(itemIndex);
  }
  getItems(section: AbstractControl | null): FormArray | null {
    if (section instanceof FormGroup) {
      const items = section.get('items') as FormArray;
      console.log('📌 Items for section:', items.value);
      return items;
    }
    return null;
  }
  async uploadImage(event: Event, sectionId: string): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.businessId) return;

    const section = this.findSectionById(sectionId);
    if (!section) return;

    try {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        'sectionsImages'
      );

      downloadUrl.subscribe((url) => {
        if (url) {
          section.patchValue({ sectionImageUrl: url });
          section.get('sectionImageUrl')?.updateValueAndValidity();
          console.log(`✅ Image uploaded successfully: ${url}`);
        }
      });
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  }

  clearImage(sectionId: string): void {
    const section = this.findSectionById(sectionId);
    if (section) {
      section.get('sectionImageUrl')?.setValue('');
    }
  }
  // Sets the image source (either 'upload' or 'predefined').
  setImageSource(index: number, source: string): void {
    const section = this.sections.at(index);
    section.get('imageSource')?.setValue(source);
    // Optionally clear the current image if switching to upload.
    if (source === 'upload') {
      section.get('sectionImageUrl')?.setValue('');
    }
  }

  // When a predefined image is clicked, update the section's image URL.
  selectPreferredImage(index: number, url: string): void {
    const section = this.sections.at(index);
    section.get('sectionImageUrl')?.setValue(url);
  }

  // Called when a checkbox for a predefined image is toggled.
  selectCheckboxImage(sectionId: string, url: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const section = this.findSectionById(sectionId);

    if (!section) return;

    if (checkbox.checked) {
      section.get('sectionImageUrl')?.setValue(url);
    } else {
      if (section.get('sectionImageUrl')?.value === url) {
        section.get('sectionImageUrl')?.setValue('');
      }
    }
  }
  updateSection(section: FormGroup) {
    if (!this.businessId) return;

    const sectionData = section.value;
    this.businessSectionsService
      .saveSection(this.businessId, sectionData)
      .then(() => console.log('✅ Section updated:', sectionData))
      .catch((err) => console.error('❌ Error updating section:', err));
  }

  duplicateSection(sectionId: string) {
    const originalSection = this.findSectionById(sectionId);
    if (!originalSection) return;

    const duplicatedSection = {
      ...originalSection.value,
      id: this.businessSectionsService.generateNewId(), // Assign new ID
      sectionTitle: originalSection.value.sectionTitle + " (Copy)",
    };

    const newSectionForm = this.fb.group(duplicatedSection);
    const pageKey = duplicatedSection.page || 'uncategorized';

    this.sectionGroups[pageKey].push(newSectionForm);
    this.cdRef.detectChanges();
  }

  toggleSection(sectionId: string): void {
    if (!sectionId) return;

    // Toggle section's collapsed state
    this.collapsedSections[sectionId] = !this.collapsedSections[sectionId];

    this.cdRef.detectChanges(); // ✅ Ensure UI updates immediately
  }

  toggleShowInactive(): void {
    console.log("🔄 Toggling Show Inactive Sections:", this.showInactiveSections);
    this.cdRef.detectChanges(); // ✅ Force UI update
  }

  findSectionById(sectionId: string): FormGroup | null {
    for (const page of Object.keys(this.sectionGroups)) {
      const section = this.sectionGroups[page].find(
        (s) => s.get('id')?.value === sectionId
      );
      if (section) return section;
    }
    return null;
  }
}
