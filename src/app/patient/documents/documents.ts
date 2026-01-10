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
          name: 'analiz_krovi_obshiy_2025_12_10.pdf',
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
          type: 'Заключение терапевта',
          name: 'zaklyuchenie_terapevta_karimov.pdf',
          date: '2025-11-15',
          size: '89 KB'
        },
        {
          id: '4',
          type: 'ЭКГ',
          name: 'ekg_rezultaty_2025_10_20.pdf',
          date: '2025-10-20',
          size: '156 KB'
        },
        {
          id: '5',
          type: 'УЗИ брюшной полости',
          name: 'uzi_bryushnoy_polosti.pdf',
          date: '2025-10-05',
          size: '890 KB'
        },
        {
          id: '6',
          type: 'Анализ мочи',
          name: 'analiz_mochi_2025_09_28.pdf',
          date: '2025-09-28',
          size: '178 KB'
        },
        {
          id: '7',
          type: 'Флюорография',
          name: 'flyuorografiya_2025_09_15.pdf',
          date: '2025-09-15',
          size: '2.1 MB'
        },
        {
          id: '8',
          type: 'Заключение кардиолога',
          name: 'zaklyuchenie_kardiologa_rashidova.pdf',
          date: '2025-09-01',
          size: '112 KB'
        }
      ]);
      this.isLoading.set(false);
    }, 300);
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
