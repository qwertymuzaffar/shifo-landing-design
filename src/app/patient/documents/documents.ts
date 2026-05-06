import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  FolderOpen,
  FileText,
  Download,
  Eye,
  TestTube,
  ScanLine,
  ClipboardList,
  Stethoscope,
  Search,
  X
} from 'lucide-angular';
import { DocumentsService, PatientDocument, DocumentCategory } from '../../core/services/documents.service';

interface CategoryMeta {
  id: DocumentCategory | 'all';
  label: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './documents.html',
  styleUrls: ['./documents.scss']
})
export class DocumentsComponent implements OnInit {
  readonly FolderOpen = FolderOpen;
  readonly FileText = FileText;
  readonly Download = Download;
  readonly Eye = Eye;
  readonly TestTube = TestTube;
  readonly ScanLine = ScanLine;
  readonly ClipboardList = ClipboardList;
  readonly Stethoscope = Stethoscope;
  readonly Search = Search;
  readonly X = X;

  private documentsService = inject(DocumentsService);

  documents = this.documentsService.documents;
  isLoading = signal(false);

  selectedCategory = signal<DocumentCategory | 'all'>('all');
  searchQuery = signal('');
  selectedDoctor = signal('');

  private readonly PAGE_SIZE = 12;
  visibleCount = signal(this.PAGE_SIZE);

  doctors = computed(() => {
    const set = new Set<string>();
    this.documents().forEach(d => set.add(d.appointment.doctor));
    return Array.from(set).sort();
  });

  hasActiveFilters = computed(() => !!this.searchQuery().trim() || !!this.selectedDoctor());

  categories: CategoryMeta[] = [
    { id: 'all', label: 'Все' },
    { id: 'tests', label: 'Анализы' },
    { id: 'reports', label: 'Заключения' },
    { id: 'imaging', label: 'Снимки' }
  ];

  filteredDocuments = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    const doctor = this.selectedDoctor();
    const list = this.documents().filter(d => {
      if (cat !== 'all' && d.category !== cat) return false;
      if (doctor && d.appointment.doctor !== doctor) return false;
      if (query) {
        const hay = `${d.type} ${d.appointment.doctor} ${d.appointment.specialization}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  });

  displayedDocuments = computed(() =>
    this.filteredDocuments().slice(0, this.visibleCount())
  );

  hasMore = computed(() =>
    this.visibleCount() < this.filteredDocuments().length
  );

  remainingCount = computed(() =>
    this.filteredDocuments().length - this.visibleCount()
  );

  setCategory(cat: DocumentCategory | 'all'): void {
    this.selectedCategory.set(cat);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  setDoctor(value: string): void {
    this.selectedDoctor.set(value);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedDoctor.set('');
    this.visibleCount.set(this.PAGE_SIZE);
  }

  loadMore(): void {
    this.visibleCount.update(n => n + this.PAGE_SIZE);
  }

  countFor(cat: DocumentCategory | 'all'): number {
    if (cat === 'all') return this.documents().length;
    return this.documents().filter(d => d.category === cat).length;
  }

  ngOnInit(): void {}

  formatShortDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  iconFor(category: DocumentCategory) {
    if (category === 'tests') return this.TestTube;
    if (category === 'imaging') return this.ScanLine;
    return this.ClipboardList;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  downloadDocument(doc: PatientDocument): void {
    alert(`Скачивание документа: ${doc.name}`);
  }
}
