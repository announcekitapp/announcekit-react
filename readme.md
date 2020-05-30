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
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <AnnounceKit widget="https://announcekit.app/widgets/v2/34MmKA">
                <span>What's new</span>
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

Common props you may want to specify include:

- **`widget`** - The url of the widget. You can obtain it while creating or editing widget in AnnounceKit Dashboard.
- `widgetStyle` - You can apply CSS rules to modify / tune the position of the widget.
- `catchClick` - Element selector to catch clicks and open the widget.
- `floatWidget` - Set true if the widget is a Float widget.
- `embedWidget` - Set true if the widget is a Embed widget.
- `user` - User properties (for user tracking)
- `data` - Segmentation data
- `onWidgetOpen` - Called when the widget is opened.
- `onWidgetClose` - Called when the widget is closed.
- `onWidgetResize` - Called when the widget is resized.
- `onWidgetUnread` - Called when unread post count of widget has been updated.
