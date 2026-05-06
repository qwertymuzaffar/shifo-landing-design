import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideAngularModule,
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  HardDrive,
  Tag,
  TestTube,
  ScanLine,
  ClipboardList,
  Stethoscope,
  AlertTriangle,
  ChevronRight
} from 'lucide-angular';
import { DocumentsService, PatientDocument, DocumentCategory } from '../../core/services/documents.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.scss']
})
export class DocumentDetailComponent implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly Download = Download;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly HardDrive = HardDrive;
  readonly Tag = Tag;
  readonly TestTube = TestTube;
  readonly ScanLine = ScanLine;
  readonly ClipboardList = ClipboardList;
  readonly Stethoscope = Stethoscope;
  readonly AlertTriangle = AlertTriangle;
  readonly ChevronRight = ChevronRight;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentsService = inject(DocumentsService);
  private sanitizer = inject(DomSanitizer);

  documentId = signal<string>('');

  document = computed<PatientDocument | null>(() => {
    const id = this.documentId();
    if (!id) return null;
    return this.documentsService.getById(id) ?? null;
  });

  previewUrl = computed<SafeResourceUrl | null>(() => {
    const d = this.document();
    if (!d) return null;
    const raw = this.documentsService.previewUrlFor(d);
    // #toolbar=0&navpanes=0 hides the built-in PDF UI on Chromium for a cleaner embed
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${raw}#toolbar=0&navpanes=0`);
  });

  rawPreviewHref(): string {
    const d = this.document();
    return d ? this.documentsService.previewUrlFor(d) : '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.documentId.set(id);
  }

  goBack(): void {
    this.router.navigate(['/patient/documents']);
  }

  download(): void {
    const d = this.document();
    if (!d) return;
    const url = this.documentsService.previewUrlFor(d);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = d.name;
    a.target = '_blank';
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatShortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  iconFor(category: DocumentCategory) {
    if (category === 'tests') return this.TestTube;
    if (category === 'imaging') return this.ScanLine;
    return this.ClipboardList;
  }

  categoryLabel(category: DocumentCategory): string {
    if (category === 'tests') return 'Анализы';
    if (category === 'imaging') return 'Снимки';
    return 'Заключения';
  }
}
