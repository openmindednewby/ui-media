import { ImagePickerStatus } from './ImagePickerStatus';

/** An opt-in secondary action beside the uploaded image, e.g. "Remove background". */
export interface ImagePickerSideAction<TFile = File> {
  label: string;
  hint: string;
  /** Receives the last uploaded file, or `null` when the image came from a URL only. */
  onPress: (file: TFile | null) => void;
  disabled?: boolean;
  loading?: boolean;
  /** When set and no file is held, the action is disabled and this hint is read instead. */
  noFileHint?: string;
}

export interface SideActionState {
  disabled: boolean;
  hint: string;
}

export const showsSideAction = <TFile>(
  status: ImagePickerStatus,
  action: ImagePickerSideAction<TFile> | undefined,
): boolean => action !== undefined && status === ImagePickerStatus.Done;

/** Disabled + hint for the side action given whether the picker holds a file. */
export const resolveSideAction = <TFile>(action: ImagePickerSideAction<TFile>, hasFile: boolean): SideActionState => {
  const blockedForNoFile = !hasFile && action.noFileHint !== undefined;
  return {
    disabled: action.disabled === true || blockedForNoFile,
    hint: blockedForNoFile && action.noFileHint !== undefined ? action.noFileHint : action.hint,
  };
};
