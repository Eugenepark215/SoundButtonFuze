import React from 'react';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';
import LoadSpinner from '../components/load-spinner';
import ConnectionError from '../components/connection-error';
import SignOut from '../components/sign-out';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      current: null,
      modal: null,
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    fetch('/api/sounds')
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          this.setState({ error: true });
        }
      })
      .then(sound => {
        this.setState({ sounds: sound, loading: false });
      });
  }

  audioPlay(event) {
    const sound = new Audio();
    if (this.state.current) {
      this.state.current.pause();
    }
    for (let i = 0; i < this.state.sounds.length; i++) {
      if (parseInt(event.target.id) === i) {
        sound.src = this.state.sounds[i].fileUrl;
        sound.play();
        this.setState({ current: sound });
      }
    }
  }

  modal(event) {
    if (this.state.modal) {
      return this.setState({ modal: null });
    }
    this.setState({ modal: true });
  }

  modalAudioPlay(event) {
    this.audioPlay(event);
    this.modal(event);
  }

  handleModalClose(event) {
    this.setState({ modal: null });
  }

  render() {
    if (this.state.error === true) {
      return <ConnectionError />;
    }
    return (
      <div>
        <div>
          <div className="container drop-shadow">
            <div className="row cyan-background">
              <div className="nav-header-column column-half">
                <a href='#' onClick={event => this.audioPlay(event)} className='text-decoration-none'>
                  <h2 className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
                </a>
              </div>
              <div className="icon-container row align-center justify-content-center">
                <div className="column-third text-align-center">
                  <a onClick={event => this.audioPlay(event)} href='#'>
                    <i className="fa-solid fa-house white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  {this.context.user && <a onClick={event => this.audioPlay(event)} href='#record'>
                    <i className="fa-solid fa-microphone white" />
                  </a>}
                  {!this.context.user && <i className="fa-solid fa-microphone white" onClick={event => this.modalAudioPlay(event)} />}
                </div>
                <div className="column-third text-align-center">
                  {!this.context.user && <i onClick={event => this.modalAudioPlay(event)} className="fa-solid fa-bookmark white" />}
                  {this.context.user &&
                  <a onClick={event => this.audioPlay(event)} href='#bookmarks'>
                    <i className="fa-solid fa-bookmark white" />
                  </a>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='sound-button-header text-align-center lucida-sans font-gray'>Sound Buttons</h2>
        </div>
        <div className='button-container display-flex flex-wrap'>
          {this.state.sounds.map((sound, index) => {
            const color = this.props.colors[sound.soundId % this.props.colors.length];
            return (
              <div className='button-column' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button id={index} onClick={event => this.audioPlay(event)} className={`sound-button drop-shadow border-radius-50 border-none justify-item-center ${color}`} />
                  <a href={`#sound?soundId=${sound.soundId}`} onClick={event => this.audioPlay(event)} className='font-gray lucida-sans text-align-center margin-top'>{sound.soundName}</a>
                </div>
              </div>
            );
          })}
        </div>
        {this.state.modal && <AuthForm onClose={event => this.handleModalClose(event)}/>}
        {this.state.loading && <LoadSpinner />}
        <SignOut/>
      </div>
    );
  }
}

Home.contextType = AppContext;
