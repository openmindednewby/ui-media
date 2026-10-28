import { ImagePickerStatus } from './ImagePickerStatus';

/** An opt-in secondary action beside the uploaded image, e.g. "Remove background". */
export interface ImagePickerSideAction {
  label: string;
  hint: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const showsSideAction = (status: ImagePickerStatus, action: ImagePickerSideAction | undefined): boolean =>
  action !== undefined && status === ImagePickerStatus.Done;
