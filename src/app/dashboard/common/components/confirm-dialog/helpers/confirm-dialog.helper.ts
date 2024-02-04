import {
  ConfirmDialogBtnClasses,
  ConfirmDialogBtnColors,
  ConfirmDialogBtnData,
} from '../models/confirm-dialog.model';

export function buildConfirmBtn(
  text: string,
  btnClass: ConfirmDialogBtnClasses,
  color: ConfirmDialogBtnColors
) {
  return { text, color, class: btnClass } as ConfirmDialogBtnData;
}
