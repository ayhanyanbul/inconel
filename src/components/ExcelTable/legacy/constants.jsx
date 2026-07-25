export const DEFAULT_COPY_PROPS = {
  enabled: false,
  setData: null,
  copyAction: null,
  onPasteAction: null,
  disabledRowCountFromTop: 0,
  disabledRowCountFromBottom: 0,
  passiveColumns: [],
  showPreviewLabel: true
};

export const DEFAULT_BORDER_LIST = ['border-right', 'border-bottom'];

export const DATA_SELECTION_TYPES = {
  NONE: 'none',
  EXTEND_BOTH: 'extendBoth',
  EXTEND_RIGHT: 'extendRight',
  EXTEND_LEFT: 'extendLeft',
  EXTEND_BOTTOM: 'extendBottom',
  EXTEND_TOP: 'extendTop',
  DELETE_HORIZONTAL: 'deleteHorizontal',
  DELETE_VERTICAL: 'deleteVertical'
};

export const CLIPBOARD_MODES = {
  CUT: 'cut',
  COPY: 'copy'
};
