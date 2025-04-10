import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  imports: [NgIf],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  totalFiles: number = 0;
  uploadedFiles: number = 0;
  isLoading: boolean = false;

  private currentUser: string | null;
  constructor() {
    this.currentUser = sessionStorage.getItem('user');
    if (this.currentUser == null) {
      this.router.navigate(['/', 'login']);
    }
  }

  onFilesSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.isLoading = true;
    this.totalFiles = 0;
    this.uploadedFiles = 0;
    const files = Array.from(input.files);
    for (let img of files) {
      console.log('posting');
      this.totalFiles += 1;
      from(this.convertFileToBase64(img))
        .pipe(
          switchMap((c: string) => {
            return this.sendToServer(c);
          })
        )
        .subscribe({
          next: (x) => (this.uploadedFiles += 1),
          error: (err) => (this.isLoading = false),
          complete: () => {
            if (this.totalFiles === this.uploadedFiles) {
              this.isLoading = false;
            }
          },
        });
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
      { filesData, folderName: this.currentUser },
      options
    );
  }
}
