export interface ConfirmDialogData {
  leftBtn: ConfirmDialogBtnData;
  rightBtn: ConfirmDialogBtnData;
  primaryColor?: string;
  title: string;
  description?: string;
}

export interface ConfirmDialogBtnData {
  class: ConfirmDialogBtnClasses;
  color: ConfirmDialogBtnColors;
  text: string;
}

export enum ConfirmDialogBtnClasses {
  FLAT = 'csd-button_flat',
  STROKED = 'csd-button_stroked',
}

export enum ConfirmDialogBtnColors {
  WARN = 'warn',
  SUCCESS = 'success',
  PRIMARY = 'primary',
}

export enum ConfirmDialogOptions {
  LEFT = 'left',
  RIGHT = 'right',
}
