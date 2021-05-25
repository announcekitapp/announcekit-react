![](https://announcekit.app/images/logo@2x.png)

The easiest way to use AnnounceKit widgets in your React App.

**Visit [https://announcekit.app](https://announcekit.app) to get started with AnnounceKit.**

[CodeSandBox Demo](https://codesandbox.io/s/announcekit-react-demo-kejgj)

[Documentation](https://announcekit.app/docs/reactjs)

## Installation

```sh
yarn add announcekit-react
```

## Usage

```js
import React from "react";
import AnnounceKit from "announcekit-react";

class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <AnnounceKit widget="https://announcekit.app/widgets/v2/34MmKA">
                <span>Whats new</span>
              </AnnounceKit>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
```

## Props

- **`widget`** - The url of the widget. You can obtain it while creating or editing widget in AnnounceKit Dashboard.
- `widgetStyle` - You can apply CSS rules to modify / tune the position of the widget launcher.
- `floatWidget` - Set true if the widget is a Float widget.
- `embedWidget` - Set true if the widget is a Embed widget.
- `boosters` - In case you don't want to boosters appear on the page the widget is placed.
- `lang` - Language selector
- `user` - User properties (for [user tracking](https://announcekit.app/docs#user-tracking))
- `data` - [Segmentation data](https://announcekit.app/docs#segmentation)
- `onWidgetOpen` - Called when the widget is opened.
- `onWidgetClose` - Called when the widget is closed.
- `onWidgetResize` - Called when the widget is resized.
- `onWidgetUnread` - Called when unread post count of widget has been updated.

## API

You can use `ref` property to access the widget instance and call control functions

- `open()`
- `close()`
- `unread()`
- `instance()`

```js
function App() {
  const ref = React.createRef<AnnounceKit>();

  React.useEffect(() => {
    ref.current.unread().then(an => console.log("unread", an));
  });

  return (
    <div>
        <button onClick={async() => await ref.current.open()}>
            Click to open widget
        </button>
        <AnnounceKit ref={ref} widget="https://announcekit.app/widgets/v2/3739N6">
            <span>Whats new</span>
        </AnnounceKit>
    </div>
    )
}
```
