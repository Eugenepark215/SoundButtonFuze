import React from 'react';
import NavBar from '../components/nav-bar';

export default class SoundButtonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null
    };
  }

  audioPlay(event) {
    const sound = new Audio();
    sound.src = this.state.current.fileUrl;
    sound.play();
  }

  componentDidMount() {
    fetch(`api/sounds/${this.props.soundId}`)
      .then(res => res.json())
      .then(sound => {
        this.setState({ current: sound });
      });
  }

  render() {
    if (!this.state.current) return null;
    const color = this.props.colors[(this.props.soundId) % this.props.colors.length];
    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div className='flex-direction-column'>
          <h2 className='single-button-header lucida-sans font-gray text-align-center'>{this.state.current.soundName}</h2>
          <div className='align-center display-flex flex-direction-column'>
            <button onClick={event => this.audioPlay(event)} className={`single-button drop-shadow margin-top border-radius-50 border-none ${color}`} />
            <button className='add-to-bookmarks drop-shadow border-radius-5px white lucida-sans w200px-h40px cyan-background border-none'>Add to Bookmarks</button>
          </div>
        </div>
      </div>
    );
  }
}
