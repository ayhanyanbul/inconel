import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import useSessionActions from 'store/session/useSessionActions';

import InconelTable from './index';

const InconelTableIIP = forwardRef((props, ref) => {
  const { selectedLocale, selectedTheme } = useSessionActions();

  const newProps = {
    ...props,
    theme: selectedTheme,
    lang: selectedLocale
  };

  return <InconelTable ref={ref} {...newProps} />;
});

InconelTableIIP.propTypes = {
  id: PropTypes.string.isRequired
};

export default InconelTableIIP;
