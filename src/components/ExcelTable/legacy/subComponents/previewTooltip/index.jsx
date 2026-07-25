import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { isValidVariable } from 'utils/helpers';
import './_index.scss';

const PreviewTooltip = forwardRef(({ text = null, styleObject = null }, ref) => {
  if (!isValidVariable(text)) {
    return null;
  }

  return createPortal(
    <div className="inconel-excel-table-cell-preview-text" style={styleObject ?? null}>
      <span>{text}</span>
    </div>,
    ref.current
  );
});

PreviewTooltip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  styleObject: PropTypes.shape({})
};

export default PreviewTooltip;
