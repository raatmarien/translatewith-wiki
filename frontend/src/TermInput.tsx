import React from 'react';

function LanguageSelector() {
  return (
    <div className="term-input">
      <label htmlFor="term-input">Term to translate:</label>
      <input name="term-input" id="term-input" type="text" />
    </div>
  );
}

export default LanguageSelector;
