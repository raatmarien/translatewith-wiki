import React from 'react';


class LanguageSelector extends React.Component {
  render() {
    return (
      <div className="language-selector">
        <label htmlFor="language">Language</label>
        <input name="language" id="language" type="text"
          value="English" />
      </div>
    );
  }
}

export default LanguageSelector;
