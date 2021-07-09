import React from 'react';
import LanguageSelector from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';
import TranslateButton from './TranslateButton';

interface Props {
}

interface State {
  output: string;
}

class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = { output: '' };
  }

  translate() {
    this.setState({output : 'hallo'});
  }

  render() {
    return (
      <div className="translate-component">
        <LanguageSelector />
        <TermInput />
        <TranslateButton
          onClick={this.translate.bind(this)}
        />

        <LanguageSelector />
        <TranslateOutput
          output={this.state.output}
        />
      </div>
    );
  }
}

export default TranslateComponent;
