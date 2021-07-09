import React from 'react';
import LanguageSelector from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';

interface Props {
  output: string;
}

interface State {

}

class TranslateComponent extends React.Component<Props, State> {
  static defaultProps: Props = {
    output: ""
  }

  render() {
    return (
      <div className="translate-component">
        <LanguageSelector />
        <TermInput />

        <LanguageSelector />
        <TranslateOutput
          output={this.props.output}
        />
      </div>
    );
  }
}

export default TranslateComponent;
