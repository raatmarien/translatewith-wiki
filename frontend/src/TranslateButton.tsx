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
import Button from 'react-bootstrap/Button';

interface Props {
  onClick: () => void;
}

function TranslateButton(props: Props) {
  return (
    <Button variant="primary" onClick={props.onClick}>Translate</Button>
  );
}

export default TranslateButton;
