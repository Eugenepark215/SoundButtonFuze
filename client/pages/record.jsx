import React from 'react';
import NavBar from '../components/nav-bar';

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingStatus: null,
      audios: '',
      name: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleCaptionChange.bind(this);
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.chunks = [];
    this.mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };
  }

  start(event) {
    event.preventDefault();
    this.mediaRecorder.start(10);
    this.setState({ recordingStatus: true });
  }

  stop(event) {
    event.preventDefault();
    this.mediaRecorder.stop();
    this.setState({ recordingStatus: false });
    this.playAudio();
  }

  playAudio() {
    const blob = new Blob(this.chunks, { type: 'audio/mp3' });
    const audioURL = window.URL.createObjectURL(blob);
    const audios = audioURL;
    this.setState({ audios });
  }

  handleSubmit(event) {
    const formData = new FormData();
    const file = new File(this.chunks, 'sound.mp3', { type: 'audio/mp3' });
    formData.append('fileUrl', file);
    formData.append('soundName', this.state.name);
    const req = {
      method: 'POST',
      body: formData
    };
    fetch('/api/sounds', req)
      .then(res => res.json())
      .then(data => {
        this.setState({ name: '' });
      });
  }

  handleCaptionChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div />
        <div className='flex-direction-column'>
          <h2 className='record-header text-align-center lucida-sans font-gray'>Record Your Sound</h2>
          <div className='align-center display-flex flex-direction-column'>
            {!this.state.recordingStatus && <button onClick={event => this.start(event)} className='single-button drop-shadow margin-top border-radius-50 border-none cyan-background'>
              <i className= 'icon-recording fa-solid fa-microphone white' />
            </button>}
            {this.state.recordingStatus && <button onClick={event => this.stop(event)} className='single-button drop-shadow margin-top border-radius-50 border-none cyan-background'>
              <i className='icon-recording fa-solid fa-square red' />
            </button>}
          </div>
          <div className='audio-player-column justify-content-center display-flex'>
            <audio ref={a => {
              this.audio = a;
            }} />
            {this.state.audios !== '' && <audio className='audio-player' src={this.state.audios} controls />}
          </div>
          <div className='justify-content-center display-flex'>
            <div className='record-input-container lucida-sans font-gray  display-flex flex-direction-column'>
              {this.state.audios && <label className='record-input-label lucida-sans gray'>Sound Name</label>}
              {this.state.audios && <input className='record-input lucida-sans' type='text' placeholder='New Name' value={this.state.name}
              onChange={this.handleNameChange} />}
            </div>
          </div>
          <div className='submit-button-container'>
            {this.state.audios && <a className='submit-button lucida-sans white cyan-background' href='#' onClick={event => this.handleSubmit(event)}>Submit</a>}
          </div>
        </div>
      </div>
    );
  }
}
