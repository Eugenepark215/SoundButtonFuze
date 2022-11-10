import React from 'react';
import Home from './pages/home';
import ParseRoute from './lib/parse-route';
import Hi from './pages/hi';
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
      route: ParseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    fetch('/api/sounds')
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      });
    window.addEventListener('hashchange', () => {
      this.setState({ route: ParseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home colors = {colors} />;
    }
    if (route.path === 'sound') {
      const soundId = route.params.get('soundId');
      return <Hi colors = {colors} soundId = {soundId}/>;
    }
  }

  render() {
    return (
      <div>
        {this.renderPage()}
      </div>
    );
  }
}
