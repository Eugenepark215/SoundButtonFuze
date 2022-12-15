import React from 'react';
import Home from './pages/home';
import ParseRoute from './lib/parse-route';
import SoundButtonDetail from './pages/sound-button-detail';
import Recording from './pages/record';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import Bookmark from './pages/bookmark';

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
      sounds: [],
      route: ParseRoute(window.location.hash),
      user: '',
      logOut: null
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    fetch('/api/sounds')
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      })
      .catch(err => {
        console.error(err);
        this.setState({ error: true });
      });
    window.addEventListener('hashchange', () => {
      this.setState({ route: ParseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  signOut(event) {
    window.localStorage.removeItem('react-context-jwt');
    // if (this.state.route.path.includes('bookmark') || this.state.route.path === 'record') {
    //   this.setState({ user: null });
    // }
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home colors = {colors} />;
    }
    if (route.path === 'sound') {
      const soundId = route.params.get('soundId');
      return <SoundButtonDetail colors = {colors} soundId = {soundId}/>;
    }
    if (route.path === 'record') {
      return <Recording />;
    }
    if (route.path === 'bookmarks') {
      return <Bookmark colors={colors}/>;
    }
    if (route.path === 'bookmark') {
      const soundId = route.params.get('soundId');
      return <SoundButtonDetail colors={colors} soundId={soundId} />;
    }
  }

  render() {
    const { user } = this.state;
    const { handleSignIn } = this;
    const contextValue = { user, handleSignIn };
    return (
      <div>
        <AppContext.Provider value={contextValue}>
          {this.renderPage()}
        </AppContext.Provider>
        {this.state.user !== null && <div className='display-flex justify-content-center'>
          <button onClick={event => this.signOut(event)} className='sign-out drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Sign-Out</button>
        </div>}
      </div>
    );
  }
}
