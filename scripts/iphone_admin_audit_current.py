import json
import os
import time
import urllib.request
import websocket

CDP_BASE = os.environ.get("CDP_BASE", "http://127.0.0.1:9225")
APP_BASE = os.environ.get("APP_BASE", "https://8090-ikg1sbofblxbn3j7yfhru-42e1d900.sg1.manus.computer")
ROUTES = [
    "/admin",
    "/admin/products",
    "/admin/collections",
    "/admin/orders",
    "/admin/settings",
    "/admin/content",
    "/admin/analytics",
    "/admin/lookbook",
    "/admin/promo-codes",
    "/admin/reviews",
    "/admin/stock-alerts",
]

class CDP:
    def __init__(self, ws):
        self.ws = ws
        self.ident = 0
        self.events = []
    def call(self, method, params=None):
        self.ident += 1
        ident = self.ident
        self.ws.send(json.dumps({"id": ident, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == ident:
                return message
            self.events.append(message)
    def drain(self, seconds=1.8):
        end = time.time() + seconds
        self.ws.settimeout(0.15)
        while time.time() < end:
            try:
                self.events.append(json.loads(self.ws.recv()))
            except Exception:
                pass
        self.ws.settimeout(20)
    def eval(self, expression):
        response = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        return response.get("result", {}).get("result", {}).get("value")

def target():
    with urllib.request.urlopen(CDP_BASE + "/json/list") as response:
        return next(item for item in json.load(response) if item.get("type") == "page")

def errors_and_failures(events):
    errors, failures = [], []
    for event in events:
        method = event.get("method")
        params = event.get("params", {})
        if method == "Runtime.exceptionThrown":
            detail = params.get("exceptionDetails", {})
            errors.append(detail.get("text") or detail.get("exception", {}).get("description") or "Runtime exception")
        elif method == "Runtime.consoleAPICalled" and params.get("type") in {"error", "assert"}:
            errors.append("console " + params.get("type", "error"))
        elif method == "Network.loadingFailed":
            failures.append({"url": params.get("url", ""), "error": params.get("errorText", "")})
        elif method == "Network.responseReceived":
            response = params.get("response", {})
            if response.get("status", 0) >= 400:
                failures.append({"url": response.get("url", ""), "status": response.get("status")})
    return errors, failures

def main():
    ws = websocket.create_connection(target()["webSocketDebuggerUrl"], timeout=20, origin="http://localhost")
    c = CDP(ws)
    for method in ("Page.enable", "Runtime.enable", "Network.enable", "Log.enable"):
        c.call(method)
    c.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 3, "mobile": True})
    c.call("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
    c.call("Page.navigate", {"url": APP_BASE + "/admin/login"})
    c.drain(1.4)
    login = c.eval("""(() => { const input=document.querySelector('input[type=password]'); const btn=[...document.querySelectorAll('button')].find(x=>/sign in|login|دخول|تسجيل/i.test(x.innerText||'')); if(!input||!btn) return false; const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'storekit2024'); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); btn.click(); return true; })()""")
    time.sleep(1.2)
    results = {"login_submit_found": login, "records": []}
    for route in ROUTES:
        c.events = []
        c.call("Page.navigate", {"url": APP_BASE + route})
        c.drain(1.8)
        probe = c.eval("""(() => ({
          route: location.pathname,
          bodyText: (document.body.innerText||'').trim().length,
          rootChildren: document.getElementById('root')?.children.length || 0,
          viewport: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflowX: getComputedStyle(document.documentElement).overflowX,
          buttons: [...document.querySelectorAll('button')].map(x=>({aria:x.getAttribute('aria-label'),text:(x.innerText||'').trim(),disabled:x.disabled})).filter(x=>x.aria||x.text).slice(0,80),
          inputs: [...document.querySelectorAll('input,textarea,select')].map(x=>({type:x.type,placeholder:x.placeholder,aria:x.getAttribute('aria-label')})),
        }))()""") or {}
        errors, failures = errors_and_failures(c.events)
        results["records"].append({"route": route, "probe": probe, "errors": errors, "network_failures": failures})
    print(json.dumps(results, ensure_ascii=False, indent=2))
    ws.close()

if __name__ == "__main__":
    main()
