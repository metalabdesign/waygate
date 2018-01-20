# waygate

You probably want [react-router] instead.

Leveraging `redux` to power your react routing needs. The API very closely resembles [react-router] because familiarity is good and I personally like the declarative syntax. This exists mostly as an experiment to have _all_ the routing state controlled by `redux`. For people who lean more towards the purist side of functional programming this may be appealing. Works with [react-hot-loader] too.

## Usage

```js
import React from 'react';
import {Provider} from 'react-redux';
import {Match, Switch, navigate} from 'waygate';

// Create a `Link` component for your app.
const Link = connect(null, {navigate})(({navigate, to, ...rest}) => (
  <a
    onClick={(ev) => {
      ev.preventDefault();
      navigate(to);
    }}
    {...rest}
  />
));

// Create a navigation tree.
const App = ({store}) => (
  <Provider store={store}>
    <Switch>
      <Match path='/' exact>
        <div>
          Foo
          <Link to='/bar'>
            Go to /bar
          </Link>
        </div>
      </Match>
      <Match path='/bar'>
        <div>Bar</div>
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
const willLeave = () => ({opacity: 0});

const styles = (children) => React.Children.map(children, (child) => {
  return {
    key: child.key,
    style: {opacity: 1},
    data: child,
  }
});

const Transition = ({children}) => (
  <TransitionMotion
    willLeave={willLeave}
    styles={styles(children)}
    children={(styles) => {
      <div>
        {styles.map(({style: {opacity}, data: child, key}) => (
          <div style={{opacity}} key={key}>
            {child}
          </div>
        ))}
      </div>
    }}
  />
);

<Switch component={Transition}>
  <Match path='/foo' key='a' children='foo'/>
  <Match path='/bar' key='b' children='bar'/>
</Switch>
```

### Match

Simple match component that allows path and selector based matching.

```js
<Match path='/foo'>
  I will render when at `/foo`
</Match>
```

You can also pull out params from the path:

```js
<Match path='/user/:name'>
  {({name}) => (
    <div>Hello {name}</div>
  )}
</Match>
```

[react-router]: https://github.com/ReactTraining/react-router
[react-motion]: https://github.com/chenglou/react-motion
[react-hot-loader]: https://github.com/gaearon/react-hot-loader
