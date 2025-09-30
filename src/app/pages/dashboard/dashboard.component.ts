import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DashboardService } from 'src/app/service/dashboard.service';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AppState } from 'src/app/types/auth.types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  store!: AppState;
  tableData = signal<any>(null);
  timeForm!: FormGroup
  @ViewChild('dashboardContent') dashboardContent!: ElementRef;
  exportPDFBtnLoader = signal(false);
  constructor(
    private storeData: Store<AppState>,
    private dashboardService: DashboardService,
    private fb: FormBuilder

  ) {
    this.initStore();
    this.initForm();
  }
  initStore() {
    this.storeData
      .select((d) => ({
        index: d.index,
        auth: d.auth
      }))
      .subscribe((d) => {
        this.store = d;
      });
  }

  initForm() {
    this.timeForm = this.fb.group({
      Month: [new Date().getMonth() + 1],
      Year: [new Date().getFullYear()]
    })
  }

  getYearsOptions() {
    const currentYear = new Date().getFullYear();
    const limit = currentYear + 5;
    const years = [];
    for (let year = currentYear - 3; year <= limit; year++) {
      years.push(year);
    }
    return years;
  }
  toggleLoader() {
    this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
    setTimeout(() => {
      this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
    }, 500);
  }
  onSubmit() {
    this.dashboardService.getDashboardDataApi(this.timeForm.value.Year, this.timeForm.value.Month, this.store.auth.token!).subscribe((res: any) => {
      for (let index = 0; index < res.tree.length; index++) {
        if (res.tree[index].OrgUnitID == 10) {
          this.dashboardService.realEstateSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 1) {
          this.dashboardService.legalAffairsSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 20) {
          this.dashboardService.financialAffairsSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 30) {
          this.dashboardService.legalAndJudicialStudiesSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 40) {
          this.dashboardService.supervisionSectorData.set(res.tree[index]);
        }
      }
      this.dashboardService.dashboardData.set(res);
    });
  }
  async exportDashboard() {
    this.exportPDFBtnLoader.set(true);
    // 1. **CRITICAL STEP: WAIT FOR ALL DOCUMENT FONTS TO LOAD**
    // This waits for all @font-face rules to resolve, ensuring correct metrics for html2canvas.
    await document.fonts.ready;

    // Optional: Add a slight safety delay (e.g., 50ms) just to ensure the DOM is stable
    // after the font ready event. This is often not needed, but can act as a safeguard.
    await new Promise(resolve => setTimeout(resolve, 50));

    const data = this.dashboardContent.nativeElement;

    const canvas = await html2canvas(data, {
      scale: 2, // Keep this for quality
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();    // Get PDF page width dynamically
    const pdfHeight = pdf.internal.pageSize.getHeight();  // Get PDF page height dynamically

    const margin = 25; // 10mm margin on all sides (top, right, bottom, left)
    const contentWidth = pdfWidth - (margin * 2);  // Usable width for content
    const contentHeight = pdfHeight - (margin * 2); // Usable height for content

    // Calculate image height based on contentWidth to maintain aspect ratio
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = imgHeight; // Total height of the captured image
    let currentYPosition = margin; // Start position (Y) on the PDF page, with top margin

    let pageNum = 1;

    // Add the first page
    pdf.addImage(imgData, 'PNG', margin, currentYPosition, contentWidth, imgHeight); // x, y, width, height

    heightLeft -= (contentHeight + margin); // Subtract content height of one page + bottom margin

    // Handle multiple pages
    while (heightLeft > 0) {
      pdf.addPage();
      pageNum++;

      // Calculate the Y position for the next part of the image.
      // This is the negative offset from the top of the *original* image
      // plus the margin for the current page.
      const imgYOffset = (imgHeight - heightLeft); // How much of the image has already been displayed

      // Add the image again, but shift it up by imgYOffset to show the next part
      // currentYPosition is now just the top margin for the new page
      pdf.addImage(imgData, 'PNG', margin, margin - imgYOffset, contentWidth, imgHeight);

      heightLeft -= (contentHeight + margin); // Subtract content height + bottom margin for next iteration
    }

    this.exportPDFBtnLoader.set(false);
    pdf.save('dashboard.pdf');
  }
}