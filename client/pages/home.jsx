import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      current: null,
      account: null
    };
    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleSubmitAuth = this.handleSubmitAuth.bind(this);
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
    if (this.state.account && event.target.className === 'modal') {
      this.setState({ account: null });
    } else if (!this.state.account) {
      this.setState({ account: true });
    }
  }

  modalAudioPlay(event) {
    this.audioPlay(event);
    this.modal(event);
  }

  handleChangeAuth(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmitAuth(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      body: JSON.stringify(this.state)
    };
    fetch('/api/users/', req);
  }

  render() {
    const view = this.state.account ? '' : 'hidden';
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
                  <a onClick={event => this.audioPlay(event)} href='#record'>
                    <i className="fa-solid fa-microphone white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <i onClick={event => this.modalAudioPlay(event)} className="fa-solid fa-bookmark white" />
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
        <div onClick={event => this.modal(event)} className={`transparent lucida-sans ${view}`}>
          <div className='modal'>
            <div className='modal-row'>
              <h2 className='auth-header font-gray'>Sign-Up</h2>
              <input onChange={this.handleChangeAuth} className='auth-input' type='text' placeholder='Username' value={this.state.username} />
              <input onChange={this.handleChangeAuth} className='auth-input' type='text' placeholder='Password' value={this.state.password} />
              <div className='submit-auth-column cyan-background'>
                <a onSubmit={this.handleSubmitAuth} className='submit-auth  white'>Submit</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
