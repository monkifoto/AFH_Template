
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.css']
})
export class SectionManagerComponent implements OnInit {
    @Input() form!: FormGroup;
    @Input() businessId!: string;

    collapsedSections: boolean[] = [];
    pages = ['home', 'aboutus', 'services', 'faq', 'contactus', 'gallery', 'testimonials'];
    locations = ['', 'left', 'right', 'top', 'bottom'];
    componentTypes = ['center-text', 'left-text', 'right-text', 'item-list', 'why-us','unique-features'];
    fontStyles = ['normal', 'bold', 'italic'];

    uploadProgress: { [key: number]: Observable<number> } = {};

    get sections(): FormArray {
      return this.form.get('sections') as FormArray;
    }

    constructor(private fb: FormBuilder, private businessSectionsService: BusinessSectionsService, private uploadService: UploadService) {}

    ngOnInit(): void {
      this.collapsedSections = this.sections.controls.map(() => true);
      // this.collapsedSections = Array(this.sections.length).fill(false);
      this.loadSections();
    }

    loadSections() {
      if (!this.businessId) return;
      this.businessSectionsService.getAllBusinessSections(this.businessId).subscribe(sections => {
        this.sections.clear();

        sections.forEach((section, index) => {
          console.log(`🔍 Section ${index + 1}:`, section); // Logs each section received
          console.log(`🖼️ Image URL for Section ${index + 1}:`, section.sectionImageUrl); // Specifically logs the image URL

          sections.sort((a, b) => {
            const pageComparison = this.pages.indexOf(a.page) - this.pages.indexOf(b.page);
            return pageComparison !== 0 ? pageComparison : (a.order || 0) - (b.order || 0);
          });

          this.sections.push(this.fb.group({
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
            showLearnMore: [section.showLearnMore || false],
            isMinimal: [section.isMinimal || false],
            isParallax: [section.isParallax || false],
            items: this.fb.array(section.items ? section.items.map(item => this.createItemForm(item)) : [])
          }));
        });
      });
    }

    createItemForm(item: any = { title: '', description: '', icon: '' }): FormGroup {
      return this.fb.group({
        title: [item.title],
        description: [item.description],
        icon: [item.icon]
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
        items: this.fb.array([])
      });
      this.sections.push(newSection);
    }



    removeSection(index: number) {
      const section = this.sections.at(index).value;
      if (this.businessId && section.id) {
        this.businessSectionsService.deleteSection(this.businessId, section.id).then(() => {
          console.log("✅ Section deleted successfully:", section.id);
          this.sections.removeAt(index);
        }).catch(err => {
          console.error("❌ Error deleting section:", err);
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
        console.log("📌 Items for section:", items.value);
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
        console.error("❌ Image upload failed:", error);
      }
    }

    updateSection(index: number) {
      const section = this.sections.at(index).value;
      if (this.businessId) {
        this.businessSectionsService.saveSection(this.businessId, section).then(() => {
          console.log("✅ Section updated successfully:", section);
        }).catch(err => {
          console.error("❌ Error updating section:", err);
        });
      }
    }



    toggleSection(index: number): void {
      this.collapsedSections[index] = !this.collapsedSections[index];
    }


}
