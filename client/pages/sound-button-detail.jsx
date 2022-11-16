import React from 'react';

export default class SoundButtonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      playing: null,
      account: null,
      username: '',
      password: ''
    };
    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleSubmitAuth = this.handleSubmitAuth.bind(this);
  }

  componentDidMount() {
    fetch(`api/sounds/${this.props.soundId}`)
      .then(res => res.json())
      .then(sound => {
        this.setState({ current: sound });
      });
  }

  audioPlay(event) {
    const sound = new Audio();
    if (this.state.playing && event.target.tagName === 'BUTTON') {
      this.state.playing.pause();
      this.setState({ playing: null });
    }
    sound.src = this.state.current.fileUrl;
    sound.play();
    this.setState({ playing: sound });
  }

  stop(event) {
    if (this.state.playing) {
      this.state.playing.pause();
    }
  }

  modal(event) {
    if (this.state.account && event.target.className === 'modal') {
      this.setState({ account: null });
    } else if (!this.state.account) {
      this.setState({ account: true });
    }
    this.stop(event);
  }

  handleChangeAuth(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmitAuth(event) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    };
    fetch('/api/users/', req);
    this.setState({ account: null, username: '', password: '' });
  }

  render() {
    if (!this.state.current) return null;
    const color = this.props.colors[(this.props.soundId) % this.props.colors.length];
    const view = this.state.account ? '' : 'hidden';
    return (
      <div>
        <div>
          <div className="container drop-shadow">
            <div className="row cyan-background">
              <div className="nav-header-column column-half">
                <a href='#' className='text-decoration-none'>
                  <h2 onClick={event => this.stop(event)} className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
                </a>
              </div>
              <div className="icon-container row align-center justify-content-center">
                <div className="column-third text-align-center">
                  <a href='#'>
                    <i onClick={event => this.stop(event)} className="fa-solid fa-house white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <a href='#record'>
                    <i onClick={event => this.stop(event)} className="fa-solid fa-microphone white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <i onClick={event => this.modal(event)} className="fa-solid fa-bookmark white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-direction-column'>
          <h2 className='single-button-header lucida-sans font-gray text-align-center'>{this.state.current.soundName}</h2>
          <div className='align-center display-flex flex-direction-column'>
            <button onClick={event => this.audioPlay(event)} className={`single-button drop-shadow margin-top border-radius-50 border-none ${color}`} />
            <button onClick={event => this.modal(event)} className='add-to-bookmarks drop-shadow border-radius-5px white lucida-sans w200px-h40px cyan-background border-none'>Add to Bookmarks</button>
          </div>
        </div>
        <div onClick={event => this.modal(event)} className={`transparent lucida-sans ${view}`}>
          <form className='modal' onSubmit={this.handleSubmitAuth}>
            <div className='modal-row'>
              <h2 className='auth-header font-gray'>Sign-Up</h2>
              <input onChange={this.handleChangeAuth} className='auth-input' type='text' placeholder='Username' name="username" value={this.state.username} />
              <input onChange={this.handleChangeAuth} className='auth-input' type='password' placeholder='Password' name="password" value={this.state.password} />
              <button type="submit" className='submit-auth cyan-background white'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
