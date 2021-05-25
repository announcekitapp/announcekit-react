import * as React from "react";
import isEqual from "react-fast-compare";

interface Props {
  widget: string;
  lang?: string;
  catchClick?: string;
  widgetStyle?: React.CSSProperties;
  boosters?: boolean;
  floatWidget?: boolean;
  embedWidget?: boolean;
  onWidgetOpen?: Function;
  onWidgetClose?: Function;
  onWidgetResize?: Function;

  onWidgetUnread?: Function;
  user?: {
    id: string;
    [key: string]: any;
  };
  data?: {
    [key: string]: any;
  };
}

export default class AnnounceKit extends React.Component<Props, {}> {
  private selector: string;
  private name: string;
  private widgetInstance: any;
  private widgetHandlers: any[];

  constructor(props: Props) {
    super(props);
    this.selector = `.ak-${Math.random().toString(36).substring(10)}`;

    this.widgetHandlers = [];
  }

  shouldComponentUpdate(props: Props) {
    const oldProps = {
      data: this.props.data,
      user: this.props.user,
      lang: this.props.lang,
    };
    const newProps = {
      data: props.data,
      user: props.user,
      lang: props.lang,
    };

    return !isEqual(oldProps, newProps);
  }

  componentDidUpdate(prevProps: Props) {
    const oldProps = {
      data: this.props.data,
      user: this.props.user,
      lang: this.props.lang,
    };
    const newProps = {
      data: prevProps.data,
      user: prevProps.user,
      lang: prevProps.lang,
    };
    if (!isEqual(oldProps, newProps)) {
      if (this.widgetInstance) {
        this.widgetInstance.destroy();
        this.loaded();
      }
    }
  }

  componentDidMount() {
    if (typeof window === "undefined") return;

    if (!window["announcekit"]) {
      window["announcekit"] = window["announcekit"] || {
        queue: [],
        push: function (x) {
          window["announcekit"].queue.push(x);
        },
        on: function (n, x) {
          window["announcekit"].queue.push([n, x]);
        },
      };

      let scripttag = document.createElement("script") as HTMLScriptElement;
      scripttag["async"] = true;
      scripttag["src"] = `https://cdn.announcekit.app/widget-v2.js`;
      let scr = document.getElementsByTagName("script")[0];
      scr?.parentNode?.insertBefore(scripttag, scr);
    }

    this.loaded();
  }

  private loaded() {
    let style = this.props.widgetStyle;

    let styleParams = {
      badge: {
        style,
      },
      line: {
        style,
      },
      float: {
        style,
      },
    };

    if (this.props.floatWidget) {
      delete styleParams.badge;
      delete styleParams.line;
      this.selector = null;
    }

    this.name = Math.random().toString(36).substring(10);

    window["announcekit"].push({
      widget: this.props.widget,
      name: this.name,
      version: 2,
      framework: "react",
      framework_version: "2.0.0",
      selector: this.selector,
      embed: this.props.embedWidget,
      boosters:
        typeof this.props.boosters === "undefined" ? true : this.props.boosters,
      ...styleParams,
      onInit: (_widget) => {
        if (_widget.conf.name !== this.name) {
          return _widget.destroy();
        }

        const ann = window["announcekit"];

        this.widgetInstance = _widget;

        if (this.props.catchClick) {
          const elem = document.querySelector(this.props.catchClick);
          if (elem) elem.addEventListener("click", () => _widget.open());
        }

        this.widgetHandlers.forEach((h) => h(_widget));
        this.widgetHandlers = [];

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
      data: this.props.data,
      user: this.props.user,
      lang: this.props.lang,
    });
  }

  private withWidget(fn) {
    return new Promise((res) => {
      if (this.widgetInstance) {
        return res(fn(this.widgetInstance));
      } else {
        this.widgetHandlers.push((widget) => {
          res(fn(widget));
        });
      }
    });
  }

  open() {
    return this.withWidget((widget) => widget.open());
  }

  close() {
    return this.withWidget((widget) => widget.close());
  }

  instance() {
    return this.withWidget((widget) => widget);
  }

  unread() {
    return this.withWidget((widget) => widget.state.ui.unreadCount);
  }

  render() {
    return (
      <div
        style={{ display: "inline" }}
        className={this.selector ? this.selector.slice(1) : ``}
      >
        {this.props.children}
      </div>
    );
  }
}
