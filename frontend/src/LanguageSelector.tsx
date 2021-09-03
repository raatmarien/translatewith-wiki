import React from 'react';
import Select from 'react-select';

interface Props {
  language: Language;
  onChange: (val: Language) => void;
}

interface State {

}

export interface Language {
  label: string;
  value: string;
}

const languageOptions = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Dutch',
    value: 'nl',
  },
  {
    label: 'German',
    value: 'de',
  }
];

export class LanguageSelector extends React.Component<Props, State> {
  render() {
    return (
      <div className="language-selector">
        <label htmlFor="language">Language</label>
        <Select
          options={languageOptions}
          value={this.props.language}
          onChange={(v, e) => v && this.props.onChange(v)} />
      </div>
    );
  }
}

export default LanguageSelector;
