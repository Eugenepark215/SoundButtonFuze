import React from 'react';
import NavBar from '../components/nav-bar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      current: null
    };
  }

  componentDidMount() {
    fetch('/api/sounds')
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      });
  }

  audioPlay(event) {
    const sound = new Audio();
    for (let i = 0; i < this.state.sounds.length; i++) {
      if (parseInt(event.target.id) === i) {
        sound.src = this.state.sounds[i].fileUrl;
        sound.play();
        this.setState({ current: true });
      }
    }
  }
  // can store the new audio in state
  // then call the play and stop

  render() {
    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div>
          <h2 className='sound-button-header text-align-center lucida-sans font-gray'>Sound Buttons</h2>
        </div>
        <div className='button-container display-flex flex-wrap'>
          {this.state.sounds.map((sound, index) => {
            const color = this.props.colors[index % this.props.colors.length];
            return (
              <div className='button-column' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button className={`sound-button drop-shadow border-radius-50 border-none justify-item-center ${color}`} id={index} onClick={event => this.audioPlay(event)} />
                  <a href={`#sound?soundId=${sound.soundId}`} className='font-gray lucida-sans text-align-center margin-top'>{sound.soundName}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

}
