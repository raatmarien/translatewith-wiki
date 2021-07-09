import React from 'react';

interface Props {
  output: string
}

function TranslateOutput(props: Props) {
  return (
    <div className="translate-output">
      {props.output}
    </div>
  );
}

export default TranslateOutput;
