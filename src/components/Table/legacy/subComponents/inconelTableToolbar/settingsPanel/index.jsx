import { useContext } from 'react';

import InconelSwitch from 'components/Switch';

import { INCONELTABLE_MAIN_CLASSNAME } from '../../constants';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';

import './_settingsPanel.scss';

const SettingsPanel = () => {
  const { tableId, setPinAndDragStates, dragEnabled, pinEnabled, getLanguageText, settingSave } = useContext(InconelTablePropsContext);

  const { settingSaveIsActive, switchAction, enabled: settingSwitchIsVisible } = settingSave;

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-settings-panel`;

  const handleSwitchChanged = (e, type) => {
    setPinAndDragStates(e.target.checked, type);
  };

  const getStatusText = (val) => getLanguageText(val ? 'enabled' : 'disabled');

  const getStatusClass = (val) => `${INCONELTABLE_MAIN_CLASSNAME}-${val ? 'enabled' : 'disabled'}`;

  return (
    <div className={rootClass}>
      <div className={`${rootClass}-item`}>
        <div className={`${rootClass}-item-first-row`}>
          <span>{getLanguageText('columnDrag')}</span>
          <InconelSwitch
            id={`${tableId}-panelDragSwitch`}
            isChecked={dragEnabled}
            sizing="xsmall"
            color="green"
            onChange={(e) => handleSwitchChanged(e, 'drag')}
          />
        </div>
        <div className={`${rootClass}-item-second-row ${getStatusClass(dragEnabled)}`}>{getStatusText(dragEnabled)}</div>
      </div>
      <div className={`${rootClass}-item`}>
        <div className={`${rootClass}-item-first-row`}>
          <span>{getLanguageText('columnPin')}</span>
          <InconelSwitch
            id={`${tableId}-panelPinSwitch`}
            isChecked={pinEnabled}
            sizing="xsmall"
            color="green"
            onChange={(e) => handleSwitchChanged(e, 'pin')}
          />
        </div>
        <div className={`${rootClass}-item-second-row ${getStatusClass(pinEnabled)}`}>{getStatusText(pinEnabled)}</div>
      </div>
      {settingSwitchIsVisible && (
        <div className={`${rootClass}-item`}>
          <div className={`${rootClass}-item-first-row`}>
            <span>{getLanguageText('saveSettings')}</span>
            <InconelSwitch
              id={`${tableId}-panelSettingSaveSwitch`}
              isChecked={settingSaveIsActive}
              sizing="xsmall"
              color="green"
              onChange={(e) => switchAction(e.target.checked)}
            />
          </div>
          <div className={`${rootClass}-item-second-row ${getStatusClass(settingSaveIsActive)}`}>{getStatusText(settingSaveIsActive)}</div>
        </div>
      )}
    </div>
  );
};

SettingsPanel.propTypes = {};

export default SettingsPanel;
