import React from 'react';
import Select from 'react-select';
import {Language, languages} from './Language';


interface Props {
  language: Language;
  onChange: (val: Language) => void;
}

interface State {

}

export class LanguageSelector extends React.Component<Props, State> {
  render() {
    return (
      <div className="language-selector">
        <Select
          options={languages}
          value={this.props.language}
          onChange={(v, e) => v && this.props.onChange(v)} />
      </div>
    );
  }
}

export default LanguageSelector;
