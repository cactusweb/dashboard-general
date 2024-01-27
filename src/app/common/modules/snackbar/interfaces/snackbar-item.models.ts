export interface CsdSnackbarItem {
  text: string;
  level: CsdSnackbarLevels;
  id: number;
  closeFn: () => void;
}

export const enum CsdSnackbarLevels {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
}
