import React from 'react';
import Button from 'react-bootstrap/Button';

interface Props {
  onClick: () => void;
}

function TranslateButton(props: Props) {
  return (
    <Button variant="primary" onClick={props.onClick}>Translate</Button>
  );
}

export default TranslateButton;
