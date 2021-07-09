import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

function LanguageSelector(props: Props) {
  return (
    <div className="term-input">
      <label htmlFor="term-input">Term to translate:</label>
      <input name="term-input" id="term-input" type="text"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

export default LanguageSelector;
