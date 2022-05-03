import * as React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

export type AnnounceKitProps = {
  children?: any;
  className?: string;

  widget: string;
  lang?: string;
  name?: string;

  trackLocationChanges?: boolean;

  onWidgetOpen?: Function;
  onWidgetClose?: Function;
  onWidgetResize?: Function;
  onWidgetUnread?: Function;

  widgetStyle?: React.CSSProperties;
  boosters?: boolean;
  floatWidget?: boolean;
  embedWidget?: boolean;

  user?: {
    id: string;
    [key: string]: any;
  };

  data?: {
    [key: string]: any;
  };

  customConfig?: any;
};

export type Handler = {
  withWidget: (fn: Function) => Promise<any>;
  open: () => void;
  close: () => void;
  instance: () => any;
  unread: () => Promise<number>;
};

function globalAnnouncekit() {
  const win = window as any;

  if (!win.announcekit) {
    win.announcekit = win.announcekit || {
      queue: [],
      push: function (x: any) {
        win.announcekit.queue.push(x);
      },
      on: function (n: string, x: Function) {
        win.announcekit.queue.push([n, x]);
      },
      off: function (name: string, fn: Function) {
        win.announcekit.on("init", function () {
          win.announcekit.off(name, fn);
        });
      }
    };

    let scripttag = document.createElement("script") as HTMLScriptElement;
    scripttag["async"] = true;
    scripttag["src"] = `https://cdn.announcekit.app/widget-v2.js`;
    let scr = document.getElementsByTagName("script")[0];
    scr?.parentNode?.insertBefore(scripttag, scr);
  }

  return win.announcekit;
}

function AnnounceKit(props: AnnounceKitProps, ref: any) {
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const widgetHandlers = useRef<any>([]);

  useImperativeHandle<any, Handler>(ref, () => ({
    withWidget(fn: Function): any {
      return new Promise((res) => {
        if (widgetRef.current) {
          return res(fn(widgetRef.current));
        } else {
          widgetHandlers.current.push((widget: any) => {
            res(fn(widget));
          });
        }
      });
    },

    open() {
      this.withWidget((widget: any) => widget.open());
    },

    close() {
      this.withWidget((widget: any) => widget.close());
    },

    instance(): Promise<any> {
      return this.withWidget((widget: any) => widget);
    },

    unread(): Promise<number> {
      return this.withWidget((widget: any) => widget.state.ui.unreadCount);
    }
  }));

  const { onWidgetOpen, onWidgetClose, onWidgetResize, onWidgetUnread } = props;

  // Wire event handlers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const announcekit = globalAnnouncekit();
    const wrapCheck = (handler?: Function) => (event: any) =>
      event.widget === widgetRef.current ? handler?.(event) : null;

    const openHandler = wrapCheck(onWidgetOpen);
    const closeHandler = wrapCheck(onWidgetClose);
    const resizeHandler = wrapCheck(onWidgetResize);
    const unreadHandler = wrapCheck(onWidgetUnread);

    announcekit.on("widget-open", openHandler);
    announcekit.on("widget-close", closeHandler);
    announcekit.on("widget-resize", resizeHandler);
    announcekit.on("widget-unread", unreadHandler);

    return () => {
      announcekit.off("widget-open", openHandler);
      announcekit.off("widget-close", closeHandler);
      announcekit.off("widget-resize", resizeHandler);
      announcekit.off("widget-unread", unreadHandler);
    };
  }, [onWidgetOpen, onWidgetClose, onWidgetResize, onWidgetUnread]);

  const {
    customConfig,
    widget,
    floatWidget,
    embedWidget,
    boosters = true,
    widgetStyle,
    lang,
    name,
    user,
    data
  } = props;

  const [loc, setLoc] = React.useState(window.location.href);

  useEffect(() => {
    if (!props.trackLocationChanges) {
      return;
    }

    let timer = setInterval(() => {
      if (loc !== window.location.href) {
        setLoc(window.location.href);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [props.trackLocationChanges, loc]);

  // Push new widget config
  useDeepCompareEffect(() => {
    if (typeof window === "undefined") return;

    const announcekit = globalAnnouncekit();
    const widgetSymbol = Math.random().toString(36).substring(10);

    widgetRef.current?.destroy();
    widgetRef.current = null;

    announcekit.push({
      ...customConfig,

      selector: elementRef.current,
      version: 2,
      framework: "react",
      framework_version: "2.0.0",

      react_symbol: widgetSymbol,

      line: {
        style: floatWidget ? {} : { ...widgetStyle } 
      },

      badge: {
        style: floatWidget ? {} : { ...widgetStyle } 
      },

      float: {
        style: { ...widgetStyle } 
      },

      onInit: (w: any) => {
        if (w.conf.react_symbol !== widgetSymbol) {
          return w.destroy();
        }

        widgetHandlers.current.forEach((x: any) => x(w));
        widgetHandlers.current = [];

        widgetRef.current?.destroy();
        widgetRef.current = w;
      },

      boosters,
      widget,
      lang,
      name,
      user,
      data
    });

    return () => {
      widgetRef.current?.destroy();
      widgetRef.current = null;
    };
  }, [
    { user, data, lang },
    customConfig,
    widget,
    name,
    floatWidget,
    embedWidget,
    boosters,
    loc
  ]);

  return (
    <div
      ref={elementRef}
      style={{ display: "inline" }}
      className={props.className ?? ""}
    >
      {props.children}
    </div>
  );
}

export default forwardRef(AnnounceKit);
