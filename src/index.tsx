import * as React from "react";

interface Props {
  widget: string;
  catchClick?: string;
  style?: React.CSSProperties;
  floatWidget?: boolean;
  onWidgetOpen?: Function;
  onWidgetClose?: Function;
  onWidgetResize?: Function;
  onWidgetUnread?: Function;
  userData?: {
    user_id: string;
    [key: string]: any;
  };
}

export default class AnnounceKit extends React.Component<Props, {}> {
  selector: string;
  name: string;
  widgetInstance: any;

  constructor(props) {
    super(props);
    this.name = Math.random()
      .toString(36)
      .substring(10);

    this.selector = `.ak-${this.name}`;
  }

  isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  }

  shouldComponentUpdate(props) {
    return !this.isEquivalent(this.props, props);
  }

  componentDidUpdate(prevProps) {
    if (!this.isEquivalent(this.props, prevProps)) {
      if (this.widgetInstance) {
        this.widgetInstance.destroy();
        this.loaded();
      }
    }
  }

  componentDidMount() {
    if (!window["announcekit"]) {
      window["announcekit"] = window["announcekit"] || {
        queue: [],
        push: function(x) {
          window["announcekit"].queue.push(x);
        },
        on: function(n, x) {
          window["announcekit"].queue.push([n, x]);
        }
      };

      let scripttag = document.createElement("script") as HTMLScriptElement;
      scripttag["async"] = true;
      scripttag["src"] = `https://cdn.announcekit.app/widget.js`;
      let scr = document.getElementsByTagName("script")[0];
      scr.parentNode.insertBefore(scripttag, scr);
    }

    this.loaded();
  }

  loaded() {
    let style = this.props.style;

    let styleParams = {
      badge: {
        style
      },
      line: {
        style
      },
      float: {
        style
      }
    };

    if (this.props.floatWidget) this.selector = null;

    window["announcekit"].push({
      widget: this.props.widget,
      name: this.name,
      version: 2,
      selector: this.selector,
      ...styleParams,
      onInit: _widget => {
        const ann = window["announcekit"];

        this.widgetInstance = _widget;

        if (this.props.catchClick) {
          const elem = document.querySelector(this.props.catchClick);
          if (elem) elem.addEventListener("click", () => _widget.open());
        }

        ann.on("widget-open", ({ widget }) => {
          if (widget === _widget && this.props.onWidgetOpen) {
            this.props.onWidgetOpen({ widget });
          }
        });

        ann.on("widget-close", ({ widget }) => {
          if (widget === _widget && this.props.onWidgetClose) {
            this.props.onWidgetClose({ widget });
          }
        });

        ann.on("widget-resize", ({ widget, size }) => {
          if (widget === _widget && this.props.onWidgetResize) {
            this.props.onWidgetResize({ widget, size });
          }
        });

        ann.on("widget-unread", ({ widget, unread }) => {
          if (widget === _widget && this.props.onWidgetUnread) {
            this.props.onWidgetUnread({ widget, unread });
          }
        });
      },
      data: this.props.userData
    });
  }

  render() {
    return (
      <a
        href="#"
        style={{ display: "inline" }}
        className={this.selector ? this.selector.slice(1) : ``}
      />
    );
  }
}
