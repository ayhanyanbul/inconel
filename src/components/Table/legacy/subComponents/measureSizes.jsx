export const measureSizes = ({
  cellString = '',
  renderAsHTML = false,
  fontFamily = '',
  fontSize = 12,
  minWidth = null,
  maxWidth = null,
} = {}) => {
  const cssObject = {
    position: 'relative',
    display: 'inline-block',
    width: 'auto',
    height: 'auto',
    fontSize: `${fontSize}px`,
    fontFamily,
    minWidth,
    maxWidth,
  };

  if (maxWidth === null) {
    cssObject.whiteSpace = 'nowrap';
  } else {
    cssObject.wordBreak = 'break-word';
  }

  let cssText = `position:absolute; display:inline-block; width:auto; height:auto; visibility:hidden; z-index:-1; font-family:${fontFamily}; font-size:${fontSize}px; min-width:${minWidth}px; max-width:${maxWidth}px;`;
  cssText += maxWidth === null ? ' white-space:nowrap;' : 'word-break:break-all;';

  const element = document.createElement('span');
  let contentElement;

  if (renderAsHTML) {
    contentElement = document.createElement('div');
    contentElement.insertAdjacentHTML('afterbegin', cellString);
  } else {
    contentElement = document.createTextNode(cellString);
  }

  element.appendChild(contentElement);

  const container = document.createElement('div');
  container.style.cssText = cssText;

  container.appendChild(element);

  document.body.appendChild(container);
  const rect = element.getBoundingClientRect();
  document.body.removeChild(container);

  return { elmWidth: Math.ceil(rect.width) + 5, elmHeight: Math.ceil(rect.height) };
};
