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

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.css'],
})
export class SectionManagerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() businessId!: string;

  collapsedSections: boolean[] = [];
  pages = [
    'home',
    'aboutus',
    'services',
    'faq',
    'contactus',
    'gallery',
    'testimonials',
  ];
  locations = ['', 'left', 'right', 'top', 'bottom'];
  componentTypes = [
    'center-text',
    'left-text',
    'right-text',
    'item-list',
    'why-us',
    'unique-features',
  ];
  fontStyles = ['normal', 'bold', 'italic'];

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
  ];

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private businessSectionsService: BusinessSectionsService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.collapsedSections = this.sections.controls.map(() => true);
    // this.collapsedSections = Array(this.sections.length).fill(false);
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

        sections.forEach((section, index) => {
          console.log(`🔍 Section ${index + 1}:`, section); // Logs each section received
          console.log(
            `🖼️ Image URL for Section ${index + 1}:`,
            section.sectionImageUrl
          ); // Specifically logs the image URL

          this.sections.push(
            this.fb.group({
              id: [section.id],
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
              showLearnMore: [section.showLearnMore || false],
              isMinimal: [section.isMinimal || false],
              isParallax: [section.isParallax || false],
              imageSource: ['upload'],
              items: this.fb.array(
                section.items
                  ? section.items.map((item) => this.createItemForm(item))
                  : []
              ),
            })
          );
        });
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
    const newSection = this.fb.group({
      id: [null],
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
      items: this.fb.array([]),
    });
    this.sections.push(newSection);
  }

  removeSection(index: number) {
    const section = this.sections.at(index).value;
    if (this.businessId && section.id) {
      this.businessSectionsService
        .deleteSection(this.businessId, section.id)
        .then(() => {
          console.log('✅ Section deleted successfully:', section.id);
          this.sections.removeAt(index);
        })
        .catch((err) => {
          console.error('❌ Error deleting section:', err);
        });
    }
  }

  addItem(sectionIndex: number) {
    const section = this.sections.at(sectionIndex) as FormGroup;
    const items = section.get('items') as FormArray;
    items.push(this.createItemForm());
  }

  removeItem(sectionIndex: number, itemIndex: number) {
    const section = this.sections.at(sectionIndex) as FormGroup;
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

  async uploadImage(event: Event, index: number): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.businessId) return;

    const section = this.sections.at(index) as FormGroup;

    try {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        'sectionsImages'
      );

      this.uploadProgress[index] = uploadProgress; // Track progress

      downloadUrl.subscribe((url) => {
        if (url) {
          section.patchValue({ sectionImageUrl: url }); // Update form with image URL
          section.get('sectionImageUrl')?.updateValueAndValidity(); // Ensure Angular detects the change
          console.log(`✅ Image uploaded successfully: ${url}`);
        }
      });
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  }

  clearImage(index: number): void {
    const section = this.sections.at(index);
    section.get('sectionImageUrl')?.setValue('');
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
  selectCheckboxImage(sectionIndex: number, url: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const section = this.sections.at(sectionIndex);

    if (checkbox.checked) {
      // When checking an image, set the sectionImageUrl to the selected url.
      section.get('sectionImageUrl')?.setValue(url);
    } else {
      // When unchecking, clear the value only if it currently matches the image.
      if (section.get('sectionImageUrl')?.value === url) {
        section.get('sectionImageUrl')?.setValue('');
      }
    }
  }

  updateSection(index: number) {
    const section = this.sections.at(index).value;
    if (this.businessId) {

      if(!section.sectionImageUrl)
      {
        section.sectionImageUrl = null;
      }

      this.businessSectionsService
        .saveSection(this.businessId, section)
        .then(() => {
          console.log('✅ Section updated successfully:', section);
        })
        .catch((err) => {
          console.error('❌ Error updating section:', err);
        });
    }
  }

  toggleSection(index: number): void {
    this.collapsedSections[index] = !this.collapsedSections[index];
  }
}
