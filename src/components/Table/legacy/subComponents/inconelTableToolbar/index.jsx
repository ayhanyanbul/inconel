import { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';

import InconelSelect from 'components/Select';

import CloseIcon from 'assets/icons/close-2.svg';
import ExportIcon from 'assets/icons/export.svg';
import CogIcon from 'assets/icons/cog.svg';
import TableIcon from 'assets/icons/table.svg';

import InconelSvg from 'components/Svg';

import { INCONELTABLE_MAIN_CLASSNAME, INCONELTABLE_AUTO } from '../constants';
import { getJsxFromParam } from '../utils';
import { InconelTablePropsContext } from '../contexts/InconelTablePropsContext';

import ExportPanel from './exportPanel';
import SettingsPanel from './settingsPanel';
import HidePanel from './hidePanel';

import { useInconelEffect } from '../hooks/useInconelEffect';
import './inconelTableToolbar.scss';

const InconelTableToolbar = ({ toolbarObject }) => {
  const {
    pageSize,
    headerHeight,
    cellHeight,
    maxLevel,
    getLanguageText,
    filtering,
    fullData,
    showedDataLength,
    totalDataLength,
    settingSave,
  } = useContext(InconelTablePropsContext);

  const {
    enabled,
    title,
    showDataCountText,
    exportButton,
    hideButton,
    settingsButton,
    fileExtensions,
    exportFunction,
    panelHeight,
    titleAreaLeftJsx,
    titleAreaRightJsx,
    buttonAreaLeftJsx,
    buttonAreaRightJsx,
  } = toolbarObject ?? {};

  const { settingSaveIsActive } = settingSave;
  const { rowCount, updateRowCount, showCombobox: pageSizeShowCombobox, options: pageSizeOptions, comboPosition } = pageSize;
  const { customFilterFunction, enabled: filteringEnabled } = filtering;

  const [windowType, setWindowType] = useState(null); // export, settings, hide, null

  const componentRef = useRef();
  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-toolbar`;

  let panelTotalHeight = panelHeight === INCONELTABLE_AUTO ? rowCount * cellHeight + maxLevel * headerHeight : panelHeight;
  panelTotalHeight = panelTotalHeight < 180 ? 180 : panelTotalHeight;

  const exportIsDisabled = totalDataLength === 0;
  const exportDisabledClass = exportIsDisabled ? ` ${INCONELTABLE_MAIN_CLASSNAME}-button-disabled` : '';

  const getDataCountString = () => {
    if (totalDataLength > 0 && filteringEnabled && fullData && customFilterFunction === null) {
      return `${showedDataLength} / ${totalDataLength} ${getLanguageText('filteredRecordCount')}`;
    }

    return `${totalDataLength} ${getLanguageText('recordCount')}`;
  };

  const getPanelTitle = () => {
    let strKey = '';

    switch (windowType) {
      case 'export':
        strKey = 'exportData';
        break;
      case 'settings':
        strKey = 'tableSettings';
        break;
      case 'hide':
        strKey = 'hideColumns';
        break;

      default:
        strKey = '';
    }

    return getLanguageText(strKey);
  };

  useOnClickOutside(componentRef, () => setWindowType(() => null));

  useInconelEffect(() => {
    if (exportIsDisabled && windowType === 'export') {
      setWindowType(() => null);
    }
  }, [exportIsDisabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`${rootClass}-container`} ref={componentRef}>
      <div className={`${rootClass}-content`}>
        {getJsxFromParam(titleAreaLeftJsx)}
        <div className={`${rootClass}-left-side`}>
          {title !== null && (
            <div className={`${rootClass}-left-side-title`} title={title}>
              {title}
            </div>
          )}
          {showDataCountText && <div className={`${rootClass}-left-side-count`}>{getDataCountString()}</div>}
        </div>
        {getJsxFromParam(titleAreaRightJsx)}
        <div className={`${rootClass}-right-side`}>
          {getJsxFromParam(buttonAreaLeftJsx)}
          {pageSizeShowCombobox && comboPosition === 'top' && (
            <div className={`${rootClass}-page-size`}>
              <InconelSelect
                label=""
                className={`${rootClass}-page-size-combo xs-select`}
                options={pageSizeOptions}
                onChange={(e) => {
                  if (e !== null) {
                    updateRowCount(e.value, true);
                  }
                }}
                value={rowCount}
                menuPlacement="bottom"
                isSearchable={false}
                singleValue
              />
            </div>
          )}
          {(exportButton || settingsButton || hideButton) && (
            <div className={`${rootClass}-right-side-buttons`}>
              {exportButton && (
                <div
                  className={`${rootClass}-right-side-export${exportDisabledClass}`}
                  role="button"
                  onClick={exportIsDisabled ? null : () => setWindowType(() => 'export')}
                >
                  <InconelSvg src={ExportIcon} />
                </div>
              )}
              {settingsButton && (
                <div
                  className={`${rootClass}-right-side-settings${settingSaveIsActive ? ` ${rootClass}-active` : ''}`}
                  role="button"
                  onClick={() => {
                    setWindowType(() => 'settings');
                  }}
                >
                  <InconelSvg src={CogIcon} />
                </div>
              )}
              {hideButton && (
                <div
                  className={`${rootClass}-right-side-hide`}
                  role="button"
                  onClick={() => {
                    setWindowType(() => 'hide');
                  }}
                >
                  <InconelSvg src={TableIcon} />
                </div>
              )}
            </div>
          )}

          {getJsxFromParam(buttonAreaRightJsx)}
        </div>
      </div>
      {windowType !== null && (
        <div className={`${rootClass}-panel`} style={{ height: `${panelTotalHeight}px` }}>
          <div className={`${rootClass}-panel-header`} style={{ height: `${30}px` }}>
            <span className={`${rootClass}-panel-header-title`}>{getPanelTitle()}</span>
            <div
              className={`${rootClass}-panel-header-close`}
              role="button"
              onClick={() => {
                setWindowType(() => null);
              }}
            >
              <InconelSvg src={CloseIcon} />
            </div>
          </div>
          <div className={`${rootClass}-panel-body`} style={{ height: `${panelTotalHeight - 30}px` }} key={`inconelTablePanel-${windowType}`}>
            {windowType === 'export' && <ExportPanel fileExtensions={fileExtensions} exportFunction={exportFunction} />}
            {windowType === 'settings' && <SettingsPanel />}
            {windowType === 'hide' && <HidePanel />}
          </div>
        </div>
      )}
    </div>
  );
};

InconelTableToolbar.propTypes = {
  toolbarObject: PropTypes.object,
};

export default InconelTableToolbar;
