// TranslateWith.Wiki - A web app to translate terms using Wikipedia
// language links

// Copyright (C) 2022 Marien Raat - mail@marienraat.nl

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
