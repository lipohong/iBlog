import { Component } from 'react';
import Button from '@material-ui/core/Button';

const style = {
  value: {
    marginTop: 20
  },
  test: {
    marginTop: 30,
    color: 'blue',
    background: '#eee'
  }
}

export class TestComponent extends Component<{ props: object }, { value: string, test: string }> {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Value',
      test: 'Test'
    };
  }

  componentDidMount() {
    this.setState({
      test: 'test component'
    })
  }

  componentWillUnmount() {
  }

  onButtonClick = () => {
    this.setState({
      value: 'value component'
    })
  }

  render() {
    const value = this.state.value;
    const test = this.state.test;

    return (
      <div className={'test'}>
        <div style={style.value}>{value}</div>
        <div style={style.test}>{test}</div>
        <div style={{marginTop: 10}}>
          <Button variant="contained" color="primary" onClick={this.onButtonClick}>
            Change Value
          </Button>
        </div>
      </div>
    )
  }
}