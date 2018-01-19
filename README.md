# waygate

You probably want [react-router] instead.

Leveraging `redux` to power your react routing needs. The API very closely resembles [react-router] because familiarity is good.

## Usage

```js
import React from 'react';
import {Provider} from 'react-redux';
import {Match, Switch} from 'waygate';

const App = ({store}) => (
  <Provider store={store}>
    <Switch>
      <Match path='/' exact>
        <div>Something</div>
      </Match>
      <Match path='/' key='notFound'>
        <div>Not found</div>
      </Match>
    </Switch>
  </Provider>
);

export default App;
```

### web

Connect `waygate` to the HTML5 history API:

```js
import {createStore as baseCreateStore, applyMiddleware} from 'redux';
import {createMiddleware as waygate} from 'waygate';
import reducer from '...';

const createStore = (initialState) => {
  const middleware = applyMiddleware(
    waygate(),
  );
  return baseCreateStore(reducer, initialState, middleware);
};

export default createStore;
```

### node

Manually dispatch `navigate()` actions.

```js
import ReactDOMServer from 'react-dom/server';
import {navigate} from 'waygate';
import createStore from '...';
import App from '...';

const render = (path) => {
  const store = createStore();
  store.dispatch(navigate(path));
  return ReactDOMServer.renderToString(
    <App store={store}/>
  );
};

export default render;
```

## API

### Switch

Render the first match-compatible component in a list of children. Switch does not render child `Match` nodes in the react tree – only their children. This allows you to perform animations and transitions with tools like `react-motion`.

```js
const Transition = (children) => (
  <MotionTransition>
    {children}
  </MotionTransition>
);

<Switch component={Transition}>
  <Match/>
  <Match/>
</Switch>
```

### Match

Simple match component that allows path and selector based matching.

```js
<Match path='/foo'>
  I will render when at `/foo`
</Match>
```

```js
const isAuthenticated = (state) => state.isAuthenticated;

<Match selector={isAuthenticated}>
  I will render when the user is authenticated.
</Match>
```

[react-router]: https://github.com/ReactTraining/react-router
