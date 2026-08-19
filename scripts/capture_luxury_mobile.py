import base64
import json
import time
import urllib.request
import websocket

CDP = "http://127.0.0.1:9225"
URL = "http://127.0.0.1:8091/?luxury-refinement=mobile"
OUT = "/home/ubuntu/storekit-correct/iphone-luxury-refined.png"

with urllib.request.urlopen(CDP + "/json/list") as response:
    target = next(item for item in json.load(response) if item.get("type") == "page")

ws = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=20, origin="http://localhost")
message_id = 0

def call(method, params=None):
    global message_id
    message_id += 1
    ws.send(json.dumps({"id": message_id, "method": method, "params": params or {}}))
    while True:
        result = json.loads(ws.recv())
        if result.get("id") == message_id:
            return result

def evaluate(expression):
    result = call("Runtime.evaluate", {"expression": expression, "returnByValue": True})
    return result.get("result", {}).get("result", {}).get("value")

call("Page.enable")
call("Runtime.enable")
call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 3, "mobile": True})
call("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
call("Page.navigate", {"url": URL})
time.sleep(4)
call("Runtime.evaluate", {"expression": "window.scrollTo(0, 820);", "returnByValue": True})
time.sleep(1)
shot = call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
with open(OUT, "wb") as output:
    output.write(base64.b64decode(shot["result"]["data"]))
probe = evaluate("""JSON.stringify({
  scrollY: window.scrollY,
  width: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  glassPanels: document.querySelectorAll('.glass-dark').length,
  cards: [...document.querySelectorAll('h3')].slice(0, 8).map(x => x.textContent?.trim()),
})""")
print(probe or "{}")
ws.close()
