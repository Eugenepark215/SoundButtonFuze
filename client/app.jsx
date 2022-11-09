import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: []
    };
  }

  componentDidMount() {
    const req = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/sounds', req)
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      });
  }

  render() {
    const copy = this.state.sounds.slice();
    return (
      <div>
        <Home />
        <div id='button-container' className='display-flex flex-wrap'>
          {copy.map((sound, index) => {
            const slice = sound.fileUrl.slice(22);
            const colors = [
              'red-background',
              'blue-background',
              'purple-background',
              'green-background',
              'yellow-background',
              'orange-background',
              'pink-background',
              'black-background'];
            const color = colors[index % colors.length];
            return (
              <div id='button-column' className='column-third margin-top' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button id='sound-button' className={`w-h70px drop-shadow border-radius-50 border-none justify-item-center ${color}`}/>
                  <a className='font-gray lucida-sans text-align-center margin-top' onClick={this.handleClick}>{slice}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
