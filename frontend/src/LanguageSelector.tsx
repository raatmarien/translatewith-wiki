import React from 'react';

interface Props {
  language: string;
  onChange: (val: string) => void;
}

interface State {

}


class LanguageSelector extends React.Component<Props, State> {
  render() {
    return (
      <div className="language-selector">
        <label htmlFor="language">Language</label>
        <input name="language" id="language" type="text"
          value={this.props.language}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </div>
    );
  }
}

export default LanguageSelector;
