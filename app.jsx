// App dependancies
import React from 'react';
import ReactDOM from 'react-dom';

// Import custom dependancies
import Test from './components/test/test';

export class App extends React.Component {
  render() {
    return (
      <Test />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
