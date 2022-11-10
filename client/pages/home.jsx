import React from 'react';
import NavBar from '../components/nav-bar';

export default class Home extends React.Component {
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
        <div>
          <NavBar />
        </div>
        <div>
          <h2 id='sound-button-header' className='text-align-center lucida-sans font-gray'>Sound Buttons</h2>
        </div>
        <div id='button-container' className='display-flex flex-wrap'>
          {this.state.sounds.map((sound, index) => {
            const color = this.props.colors[index % this.props.colors.length];
            return (
              <div id='button-column' className='column-third margin-top' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button id='sound-button' className={`w-h70px drop-shadow border-radius-50 border-none justify-item-center ${color}`} />
                  <a href={`#sound?soundId=${sound.soundId}`} className='font-gray lucida-sans text-align-center margin-top' onClick={this.handleClick}>{sound.soundName}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

}
