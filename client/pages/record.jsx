import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';
const MicRecorder = require('mic-recorder-to-mp3');

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingStatus: null,
      audios: '',
      name: '',
      account: null,
      submit: null
    };
    this.myRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.stream = stream;
    this.mediaRecorder = new MediaRecorder(stream);
    const recorder = new MicRecorder({ bitRate: 128 });
    this.recorder = recorder;
  }

  visualize(stream) {
    const canvas = this.myRef.current;
    const canvasCtx = canvas.getContext('2d');
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    draw();
    function draw() {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(240, 240, 240)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(110, 223, 246)';
      canvasCtx.beginPath();
      const sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }
  }

  start(event) {
    event.preventDefault();
    this.recorder.start(10);
    this.visualize(this.stream);
    this.setState({ recordingStatus: true });
  }

  stop(event) {
    event.preventDefault();
    this.recorder.stop().getMp3().then(([buffer, blob]) => {
      const file = new File(buffer, 'music.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });
      const audioURL = window.URL.createObjectURL(file);
      const audios = audioURL;
      this.setState({ audios });
    });
    this.stream.getAudioTracks().forEach(track => {
      track.stop();
    });
    this.setState({ recordingStatus: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    const file = new File(this.mp3Data, 'sound.mp3', { type: 'audio/mp3' });
    const token = window.localStorage.getItem('react-context-jwt');
    formData.append('fileUrl', file);
    formData.append('soundName', this.state.name);
    formData.append('userId', this.context.user.userId);
    const req = {
      headers: {
        'X-Access-Token': token
      },
      method: 'POST',
      body: formData
    };
    fetch('/api/sounds', req)
      .then(res => {
        this.setState({ submit: true });
      });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  modal(event) {
    if (this.state.account) {
      return this.setState({ account: null });
    }
    this.setState({ account: true });
  }

  handleModalClose(event) {
    this.setState({ account: null });
  }

  render() {
    if (this.state.submit === true) {
      return <Redirect to="#" />;
    }
    const something = !this.state.recordingStatus ? 'hidden' : ' ';
    return (
      <div>
        <div>
          <div className="container drop-shadow">
            <div className="row cyan-background">
              <div className="nav-header-column column-half">
                <a href='#' className='text-decoration-none'>
                  <h2 className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
                </a>
              </div>
              <div className="icon-container row align-center justify-content-center">
                <div className="column-third text-align-center">
                  <a href='#'>
                    <i className="fa-solid fa-house white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <a href='#record'>
                    <i className="fa-solid fa-microphone white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  {!this.context.user && <i onClick={event => this.modalAudioPlay(event)} className="fa-solid fa-bookmark white" />}
                  {this.context.user &&
                    <a href='#bookmark'>
                      <i className="fa-solid fa-bookmark white" />
                      </a>}
                </div>
              </div>
            </div>
          </div>
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
            <canvas ref={this.myRef} className={something}/>
          </div>
          <div className='audio-player-column justify-content-center display-flex'>
            <audio ref={a => {
              this.audio = a;
            }} />
            {this.state.audios !== '' && !this.state.recordingStatus && <audio className='audio-player' src={this.state.audios} controls />}
          </div>
          {this.state.audios && !this.state.recordingStatus && <form onSubmit={this.handleSubmit} className='justify-content-center display-flex flex-direction-column'>
            <div className='record-input-container lucida-sans font-gray display-flex flex-direction-column'>
              <div className='display-flex flex-direction-column'>
                <label className='record-input-label lucida-sans gray' >Sound Name</label>
                <input required className='record-input lucida-sans' type='text' placeholder='New Name' value={this.state.name}
                onChange={this.handleNameChange} />
              </div>
            </div>
            <div className='submit-button-container'>
              <button type='submit' className='submit-button lucida-sans white cyan-background'>Submit</button>
            </div>
          </form>}
          {this.state.account && <AuthForm onClose={event => this.handleModalClose(event)} />}
        </div>
      </div>
    );
  }
}

Recording.contextType = AppContext;
