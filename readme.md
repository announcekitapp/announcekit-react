![](https://announcekit.app/images/logo@2x.png)

The easiest way to use AnnounceKit widgets in your React App.

**Visit [https://announcekit.app](https://announcekit.app) to get started with AnnounceKit.**

[Live demo](https://codesandbox.io/s/announcekit-react-demo-gfrt1)

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
            <li>Home</li>
            <li>Product</li>
            <li>
              News <AnnounceKit widget="https://announcekit.app/widget/eL8Lm" />
            </li>
            <li>
              <a className="click-trigger" href="#">
                Click here
              </a>
              <AnnounceKit catchClick=".click-trigger" widget="https://announcekit.app/widget/eL8Lm" />
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
```

## Props

Common props you may want to specify include:

- **`widget`** - The url of the widget. You can obtain it while creating or editing widget in AnnounceKit Dashboard.
- `style` - You can apply CSS rules to modify / tune the position of the widget.
- `catchClick` - Element selector to catch clicks and open the widget.
- `floatWidget` - Set true if the widget is a Float widget.
- `widgetOpen` - Called when the widget is opened.
- `widgetClose` - Called when the widget is closed.
- `widgetResize` - Called when the widget is resized.
- `widgetUnread` - Called when unread post count of widget has been updated.
