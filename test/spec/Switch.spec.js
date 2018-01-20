import React from 'react';
import TestRenderer from 'react-test-renderer';
import Switch from '../../src/Switch';
import Match from '../../src/Match';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import baseReducer from '../../src/reducer';
import {navigate} from '../../src/action';

const reducer = combineReducers({
  waygate: baseReducer,
});

describe('Switch', () => {
  it('should render the matching element', () => {
    const store = createStore(reducer);
    store.dispatch(navigate('/foo'));
    const element = (
      <Provider store={store}>
        <Switch>
          <Match path='/foo'>
            <div>a</div>
          </Match>
          <Match path='/bar'>
            <div>b</div>
          </Match>
        </Switch>
      </Provider>
    );
    const renderer = TestRenderer.create(element);
    expect(
      renderer,
      'to have rendered',
      <div>a</div>
    );
  });
  it('should only render the first matching element', () => {
    const store = createStore(reducer);
    store.dispatch(navigate('/foo'));
    const element = (
      <Provider store={store}>
        <Switch>
          <Match path='/foo'>
            <div>a</div>
          </Match>
          <Match path='/foo'>
            <div>b</div>
          </Match>
        </Switch>
      </Provider>
    );
    const renderer = TestRenderer.create(element);
    expect(
      renderer,
      'to have rendered',
      <div>a</div>
    );
  });
  it('should render null if nothing matches', () => {
    const store = createStore(reducer);
    store.dispatch(navigate('/baz'));
    const element = (
      <Provider store={store}>
        <Switch>
          <Match path='/foo'>
            <div>a</div>
          </Match>
        </Switch>
      </Provider>
    );
    const renderer = TestRenderer.create(element);
    // FIXME: Kind of a hack cause `unexpected` doesn't work well with render
    // returning non-elements.
    expect(
      renderer.toJSON(),
      'to equal',
      null
    );
  });
});
