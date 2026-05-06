import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  documentId = signal<string>('');

  document = computed<PatientDocument | null>(() => {
    const id = this.documentId();
    if (!id) return null;
    return this.documentsService.getById(id) ?? null;
  });

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
    alert(`Скачивание документа: ${d.name}`);
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
