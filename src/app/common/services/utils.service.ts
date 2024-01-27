import { Injectable } from '@angular/core';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private snackbarService: CsdSnackbarService) {}

  scrollTo(id: string, e?: any) {
    e?.preventDefault();

    document.getElementById(id)?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  copy(data: string, notification: boolean = true, text: string = 'Copied') {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    if (notification)
      this.snackbarService.createItem(text, CsdSnackbarLevels.INFO);
  }

  getFormData(event: Event): FormData | null {
    let target = (event.target || event.srcElement) as HTMLInputElement;
    let files = target.files as FileList;
    let file = files[0];

    let formData: FormData = new FormData();

    formData.set('file', file);

    return file ? formData : null;
  }
}
