import React from 'react';
import Select from 'react-select';
import Language from './Language';
import {languages} from './LanguageList';


interface Props {
  language: Language;
  onChange: (val: Language) => void;
  addAuto?: boolean;
}

interface State {

}

const autoLanguage : Language = {
  value: 'auto',
  label: 'Detect language',
}


export class LanguageSelector extends React.Component<Props, State> {
  render() {
  let options = this.props.addAuto
  ? [autoLanguage].concat(languages)
  : languages;
  return (
    <div className="language-selector">
      <Select
        options={options}
        value={this.props.language}
        theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#8f3b9b',
              primary25: '#fdefff'
            }
          })}
        onChange={(v, e) => v && this.props.onChange(v)} />
    </div>
  );
  }
}

export default LanguageSelector;
