export interface CsdSnackbarItem {
  text: string;
  level: CsdSnackbarLevels;
  id: number;
  closeFn: () => void;
}

export enum CsdSnackbarLevels {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
}
