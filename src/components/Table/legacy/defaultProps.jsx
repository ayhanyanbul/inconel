import {
  INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
  INCONELTABLE_PIN_ACCESS_BOTH,
  INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
  INCONELTABLE_AUTO
} from './subComponents/constants';

export const defaultColumnItemProps = {
  id: null,
  title: '',
  tooltip: null,
  dataKey: null,
  cellClassName: null,
  headerClassName: null,
  drag: true,
  locked: false,
  pinAccess: INCONELTABLE_PIN_ACCESS_BOTH,
  minWidth: null,
  maxWidth: null,
  cell: null,
  footer: null,
  hideMenuSelectable: true,
  hideMenuVisible: true,
  cellHorizontalAlign: INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
  cellVerticalAlign: INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
  headerJsx: null,
  editCellValue: null,
  renderAsHTML: false
};

export const defaultMergedColumnItemProps = {
  id: null,
  title: '',
  tooltip: null,
  cols: [],
  headerClassName: null,
  drag: true,
  locked: false,
  pinAccess: INCONELTABLE_PIN_ACCESS_BOTH,
  headerJsx: null,
  maxWidth: null
};
export const defaultSettingSaveProps = {
  enabled: true,
  isActive: false,
  storageId: null
};

export const defaultToolbarProps = {
  enabled: true,
  title: null,
  showDataCountText: true,
  exportButton: true,
  hideButton: true,
  settingsButton: true,
  fileExtensions: ['xlsx', 'pdf', 'csv'],
  exportFunction: null,
  panelHeight: INCONELTABLE_AUTO,
  titleAreaLeftJsx: null,
  titleAreaRightJsx: null,
  buttonAreaLeftJsx: null,
  buttonAreaRightJsx: null
};

export const defaultPageSizeProps = {
  rowCount: 10,
  displayedRowCount: null,
  showCombobox: false,
  options: [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ],
  pageSizeChange: null,
  dynamicRowCount: false,
  addMissingRows: true,
  comboPosition: 'top'
};

export const defaultInitialOptions = { columnOrder: [], pinLeft: [], pinRight: [], hide: [], hideOnChange: null };

export const defaultCellPaddingProps = { horizontal: 10, vertical: 2 };
export const defaultHeaderPaddingProps = { horizontal: 10, vertical: 0 };

export const defaultPaginationProps = {
  activePage: null,
  enabled: true,
  disabled: false,
  dataCount: null, // 200
  onPageChange: null // pageNo => {}
};

export const defaultScrollableProps = {
  enabled: false,
  loadMoreShow: false,
  loadMoreAction: null
};

export const defaultSelectionProps = {
  enabled: false,
  selectedRows: null,
  showCheckboxColumn: true,
  showSelectAll: true,
  activeCols: [],
  passiveCols: null,
  multipleRowSelect: true,
  preventDeselect: false,
  allPageSelect: null,
  onChange: null,
  selectActiveAction: null
};

export const defaultSortingProps = {
  enabled: false,
  sortingAction: null,
  activeCols: [],
  passiveCols: null,
  columnId: null,
  sortType: null,
  isClearable: false
};

export const defaultRowSpanProps = {
  enabled: false,
  activeCols: [],
  passiveCols: null,
  customFnc: null
};

export const defaultFilteringProps = {
  enabled: false,
  activeCols: [],
  passiveCols: null,
  onChange: null,
  dataProviderObject: null,
  customFilterFunction: null,
  showBubbles: true,
  filterButtonShow: false,
  customBubbleCountsObject: null,
  windowHeight: 300,
  showFilterIconsOnStart: false
};

export const defaultAccordionProps = {
  enabled: false,
  subDataKey: 'subData',
  activeCols: [],
  passiveCols: null,
  dataProviderFunction: null,
  customJsxFunction: null,
  customHeight: 150,
  onOpen: null,
  onClose: null
};

export const defaultEventManagementProps = {
  activeCols: [],
  passiveCols: null,
  onCellClick: null,
  onCellDoubleClick: null,
  onCellMouseDown: null,
  onCellMouseUp: null,
  onCellMouseEnter: null,
  onCellMouseLeave: null,
  onCellMouseMove: null,
  onCellContextMenu: null
};
