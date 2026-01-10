import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Document {
  id: string;
  type: string;
  name: string;
  date: string;
  size: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './documents.html',
  styleUrls: ['./documents.scss']
})
export class DocumentsComponent implements OnInit {
  documents = signal<Document[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    setTimeout(() => {
      this.documents.set([
        {
          id: '1',
          type: 'Анализ крови',
          name: 'analiz_krovi_2025_12_10.pdf',
          date: '2025-12-10',
          size: '245 KB'
        },
        {
          id: '2',
          type: 'Рентген',
          name: 'rentgen_grudnoy_kletki.pdf',
          date: '2025-11-25',
          size: '1.2 MB'
        },
        {
          id: '3',
          type: 'Заключение врача',
          name: 'zaklyuchenie_terapevta.pdf',
          date: '2025-11-15',
          size: '89 KB'
        }
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  downloadDocument(doc: Document): void {
    alert(`Скачивание документа: ${doc.name}`);
  }
}
