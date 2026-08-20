import json
import os
import time
import urllib.request
import websocket

CDP_BASE = os.environ.get("CDP_BASE", "http://127.0.0.1:9225")
APP_BASE = os.environ.get("APP_BASE", "https://8090-ikg1sbofblxbn3j7yfhru-42e1d900.sg1.manus.computer")
ROUTES = [
    "/",
    "/collections",
    "/collections/new-arrivals",
    "/collections/essentials",
    "/collections/outerwear",
    "/collections/knitwear",
    "/collections/accessories",
    "/products/leather-bucket-bag",
    "/products/oversized-merino-coat",
    "/cart",
    "/checkout",
    "/search",
    "/about",
    "/lookbook",
    "/account",
    "/account/orders",
    "/account/wishlist",
    "/sign-in",
    "/sign-up",
    "/admin/login",
    "/admin",
    "/admin/products",
    "/admin/collections",
    "/admin/orders",
    "/admin/settings",
    "/admin/content",
    "/admin/analytics",
    "/admin/reviews",
    "/admin/stock-alerts",
]
CASES = [("en", "light"), ("ar", "dark")]

class Browser:
    def __init__(self, ws):
        self.ws = ws
        self.counter = 0
        self.events = []

    def command(self, method, params=None, timeout=20):
        self.counter += 1
        ident = self.counter
        self.ws.send(json.dumps({"id": ident, "method": method, "params": params or {}}))
        deadline = time.time() + timeout
        while time.time() < deadline:
            message = json.loads(self.ws.recv())
            if message.get("id") == ident:
                return message
            self.events.append(message)
        raise TimeoutError(f"CDP timeout waiting for {method}")

    def drain(self, seconds=1.8):
        deadline = time.time() + seconds
        self.ws.settimeout(0.15)
        while time.time() < deadline:
            try:
                self.events.append(json.loads(self.ws.recv()))
            except Exception:
                pass
        self.ws.settimeout(20)

    def evaluate(self, expression):
        result = self.command("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        return result.get("result", {}).get("result", {}).get("value")


def page_target():
    with urllib.request.urlopen(CDP_BASE + "/json/list") as response:
        targets = json.load(response)
    return next(target for target in targets if target.get("type") == "page")


def extract_errors(events):
    errors, failures = [], []
    for event in events:
        method = event.get("method")
        params = event.get("params", {})
        if method == "Runtime.exceptionThrown":
            detail = params.get("exceptionDetails", {})
            errors.append(detail.get("text") or detail.get("exception", {}).get("description") or "Runtime exception")
        elif method == "Runtime.consoleAPICalled" and params.get("type") in {"error", "assert"}:
            args = params.get("args", [])
            errors.append(" ".join(str(arg.get("value", arg.get("description", ""))) for arg in args).strip() or "console error")
        elif method == "Log.entryAdded" and params.get("entry", {}).get("level") == "error":
            errors.append(params.get("entry", {}).get("text", "log error"))
        elif method == "Network.loadingFailed":
            failures.append({"url": params.get("url", ""), "error": params.get("errorText", "")})
        elif method == "Network.responseReceived":
            response = params.get("response", {})
            if response.get("status", 0) >= 400:
                failures.append({"url": response.get("url", ""), "status": response.get("status")})
    return errors, failures


def main():
    target = page_target()
    ws = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=20, origin="http://localhost")
    browser = Browser(ws)
    for method in ("Page.enable", "Runtime.enable", "Log.enable", "Network.enable"):
        browser.command(method)
    results = []
    for lang, theme in CASES:
        browser.command("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 3, "mobile": True})
        browser.command("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
        browser.command("Page.navigate", {"url": APP_BASE + "/"})
        browser.drain(2.0)
        browser.evaluate(f"localStorage.setItem('sk-lang', {json.dumps(lang)}); localStorage.setItem('sk-theme', {json.dumps(theme)});")
        browser.command("Page.reload", {"ignoreCache": True})
        browser.drain(2.0)
        for route in ROUTES:
            browser.events = []
            browser.command("Page.navigate", {"url": APP_BASE + route})
            browser.drain(1.8)
            probe = browser.evaluate("""(() => {
              const root = document.getElementById('root');
              const body = document.body;
              const rects = [...document.querySelectorAll('button,a,input,select,textarea')].map(el => el.getBoundingClientRect());
              const tooSmall = [...document.querySelectorAll('button,a')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44); }).length;
              return {
                route: location.pathname,
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                dark: document.documentElement.classList.contains('dark'),
                viewport: document.documentElement.clientWidth,
                scrollWidth: document.documentElement.scrollWidth,
                overflowX: getComputedStyle(document.documentElement).overflowX,
                bodyText: (body.innerText || '').trim().length,
                rootChildren: root ? root.children.length : 0,
                title: document.title,
                loading: [...document.querySelectorAll('[aria-busy="true"]')].length,
                interactiveCount: rects.length,
                smallInteractiveCount: tooSmall,
                missingLabels: [...document.querySelectorAll('button')].filter(el => !el.getAttribute('aria-label') && !(el.innerText || '').trim()).length,
              };
            })()""") or {}
            errors, failures = extract_errors(browser.events)
            results.append({"case": {"lang": lang, "theme": theme, "width": 390, "height": 844, "mobile": True}, "route": route, "probe": probe, "errors": errors, "network_failures": failures})
    print(json.dumps(results, ensure_ascii=False, indent=2))
    ws.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"fatal": str(exc)}, ensure_ascii=False))
        raise
