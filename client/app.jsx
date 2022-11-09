import React from 'react';
import Home from './pages/home';
const colors = [
  'red-background',
  'blue-background',
  'purple-background',
  'green-background',
  'yellow-background',
  'orange-background',
  'pink-background',
  'black-background'];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: []
    };
  }

  componentDidMount() {
    fetch('/api/sounds')
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      });
  }

  render() {
    return (
      <div>
        <Home />
        <div id='button-container' className='display-flex flex-wrap'>
          {this.state.sounds.map((sound, index) => {
            const color = colors[index % colors.length];
            return (
              <div id='button-column' className='column-third margin-top' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button id='sound-button' className={`w-h70px drop-shadow border-radius-50 border-none justify-item-center ${color}`}/>
                  <a className='font-gray lucida-sans text-align-center margin-top' onClick={this.handleClick}>{sound.soundName}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
