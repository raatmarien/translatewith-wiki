import React from 'react';
import Form from 'react-bootstrap/Form'

interface Props {
  value: string;
  onChange: (val: string) => void;
}

function LanguageSelector(props: Props) {
  return (
    <div className="term-input">
      <Form.Control name="term-input" id="term-input" type="text"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

export default LanguageSelector;
