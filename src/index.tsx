import * as React from "react";

interface Props {
  widget: string;
  catchClick?: string;
  style?: React.CSSProperties;
  floatWidget?: boolean;
  onWidgetInit?: Function;
  onWidgetOpen?: Function;
  onWidgetClose?: Function;
  onWidgetResize?: Function;
  onWidgetUnread?: Function;
}

export default function({
  widget,
  catchClick,
  style,
  floatWidget,
  onWidgetInit,
  onWidgetClose,
  onWidgetOpen,
  onWidgetResize,
  onWidgetUnread
}: Props) {
  let [loaded, setLoaded] = React.useState(false);
  let selector = catchClick;
  let name = Math.random()
    .toString(36)
    .substring(10);

  if (!catchClick) selector = `.ak-${name}`;

  React.useEffect(() => {
    if (!window["announcekit"]) {
      window["announcekit"] = window["announcekit"] || {
        queue: [],
        on: function(n, x) {
          window["announcekit"].queue.push([n, x]);
        },
        push: function(x) {
          window["announcekit"].queue.push(x);
        }
      };

      window["announcekit"].on("init", () => setLoaded(true));

      let scripttag = document.createElement("script") as HTMLScriptElement;
      scripttag["async"] = true;
      scripttag["src"] = `https://cdn.announcekit.app/widget.js`;
      let scr = document.getElementsByTagName("script")[0];
      scr.parentNode.insertBefore(scripttag, scr);
    } else {
      setLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (!loaded) {
      return;
    }

    let widgetInstance;
    let destroyed = false;

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

    if (floatWidget) selector = null;

    window["announcekit"].push({
      widget: widget,
      name,
      version: 2,
      selector,
      ...styleParams,
      onWidgetInit: _widget => {
        if (onWidgetInit) {
          onWidgetInit(_widget);
        }
      },
      onWidgetOpen: _widget => {
        if (onWidgetOpen) {
          onWidgetOpen(_widget);
        }
      },
      onWidgetClose: _widget => {
        if (onWidgetClose) {
          onWidgetClose(_widget);
        }
      },
      onWidgetResize: _widget => {
        if (onWidgetResize) {
          onWidgetResize(_widget);
        }
      },
      onWidgetUnread: _widget => {
        if (onWidgetUnread) {
          onWidgetUnread(_widget);
        }
      },
      onInit: _widget => {
        widgetInstance = _widget;

        if (destroyed) {
          widgetInstance.destroy();
        }
      }
    });

    return () => {
      if (widgetInstance) {
        widgetInstance.destroy();
      } else {
        destroyed = true;
      }
    };
  }, [loaded]);

  return <a href="#" style={{ display: "inline" }} className={selector ? selector.slice(1) : ``} />;
}
