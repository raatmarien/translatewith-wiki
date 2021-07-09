import React from 'react';

interface Props {
  onClick: () => void;
}

function TranslateButton(props: Props) {
  return (
    <button onClick={props.onClick}>Translate</button>
  );
}

export default TranslateButton;
