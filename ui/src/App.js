import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phrase: '',
      description: '',
      url: '',
    }
  }

  componentDidMount() {
    fetch('https://api.morph.io/dneale/phrases/data.json?key=DhldCDcSW12MhIdCH1La&query=SELECT%20*%20FROM%20data%20ORDER%20BY%20RANDOM()%20LIMIT%201')
      .then((response) => response.json())
      .then((responseJsonRaw) => {
        const responseJson = responseJsonRaw[0];
        this.setState({
          phrase: responseJson.name,
          description: responseJson.desc,
          url: responseJson.link,
        })
      })

  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.state.phrase}</h2>
        </div>
        <p className="App-intro">
          {this.state.description}
        </p>
        <p>
          <a href={this.state.url}> Learn more </a>
        </p>
      </div>
    );
  }
}

export default App;
