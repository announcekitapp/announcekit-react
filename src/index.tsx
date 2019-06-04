import * as React from "react";

interface Props {
  widget: string;
  catchClick?: string;
  style?: React.CSSProperties;
  floatWidget?: boolean;
}

export default function({ widget, catchClick, style, floatWidget }: Props) {
  let [loaded, setLoaded] = React.useState(false);
  let selector = catchClick;

  if (!catchClick)
    selector = `.ak-${Math.random()
      .toString(36)
      .substring(10)}`;

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
      version: 2,
      selector,
      ...styleParams,
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
