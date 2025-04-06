import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  EMPTY,
  from,
  merge,
  Observable,
  of,
  ReplaySubject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private http: HttpClient = inject(HttpClient);

  title = 'web-app';
  folderName = '';
  selectedFiles: File[] = [];
  uploadStatus = '';

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadFiles() {
    if (!this.folderName || this.selectedFiles.length === 0) {
      this.uploadStatus =
        'Please provide a folder name and at least one photo.';
      return;
    }
    for (let img of this.selectedFiles) {
      from(this.convertFileToBase64(img))
        .pipe(
          switchMap((c: string) => {
            return this.sendToServer(c);
          })
        )
        .subscribe();
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // The onload event fires when the file has been successfully read
      reader.onload = () => {
        const base64String = reader.result as string; // Get the base64 string from the result
        resolve(base64String.split(',')[1]); // Remove the data URL prefix
      };

      // The onerror event fires if there is an error reading the file
      reader.onerror = (error) => {
        reject(error);
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    });
  }

  sendToServer(filesData: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const options = { headers: headers };

    return this.http.post<{ success: boolean; message: string }>(
      'https://wedding-server.netlify.app/.netlify/functions/api/upload',
      { filesData, folderName: this.folderName },
      options
    );
  }
}
