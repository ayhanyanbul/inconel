import { useContext } from 'react';
import PropTypes from 'prop-types';

import { INCONELTABLE_MAIN_CLASSNAME } from '../../constants';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';

import './_exportPanel.scss';

const ExportPanel = ({ fileExtensions, exportFunction }) => {
  const { getLanguageText, convertUpperCase } = useContext(InconelTablePropsContext);

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-export-panel`;

  return (
    <div className={rootClass}>
      {fileExtensions.map((ext, index) => {
        const handleExtensionClick = typeof exportFunction === 'function' ? () => exportFunction(ext) : null;

        return (
          <div className={`${rootClass}-item`} key={index} role="button" onClick={handleExtensionClick}>
            <span>{`${convertUpperCase(ext)} ${getLanguageText('fileFormat')}`}</span>
          </div>
        );
      })}
    </div>
  );
};

ExportPanel.propTypes = {
  fileExtensions: PropTypes.array,
  exportFunction: PropTypes.func,
};

export default ExportPanel;
