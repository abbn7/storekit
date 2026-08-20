import json
import os
import time
import urllib.request
import websocket

CDP_BASE = os.environ.get("CDP_BASE", "http://127.0.0.1:9225")
APP_BASE = os.environ.get("APP_BASE", "https://8090-ikg1sbofblxbn3j7yfhru-42e1d900.sg1.manus.computer")

class CDP:
    def __init__(self, ws):
        self.ws = ws
        self.ident = 0
    def call(self, method, params=None):
        self.ident += 1
        ident = self.ident
        self.ws.send(json.dumps({"id": ident, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == ident:
                return message
    def eval(self, expression):
        response = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        return response.get("result", {}).get("result", {}).get("value")
    def nav(self, path):
        self.call("Page.navigate", {"url": APP_BASE + path})
        time.sleep(1.6)

def get_target():
    with urllib.request.urlopen(CDP_BASE + "/json/list") as response:
        targets = json.load(response)
    return next(target for target in targets if target.get("type") == "page")

def click_js(expression):
    return f"(() => {{ const el = {expression}; if (!el) return {{found:false}}; el.click(); return {{found:true, text:(el.innerText||'').trim(), aria:el.getAttribute('aria-label')}}; }})()"

def main():
    target = get_target()
    ws = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=20, origin="http://localhost")
    c = CDP(ws)
    c.call("Page.enable")
    c.call("Runtime.enable")
    c.call("Network.enable")
    c.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 3, "mobile": True})
    c.call("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
    c.eval("localStorage.clear(); sessionStorage.clear(); localStorage.setItem('sk-lang','en'); localStorage.setItem('sk-theme','light');")
    results = {}

    c.nav("/")
    results["home_initial"] = c.eval("""(() => ({path:location.pathname, text:(document.body.innerText||'').length, width:innerWidth, scrollWidth:document.documentElement.scrollWidth, buttons:[...document.querySelectorAll('button')].map(x=>({aria:x.getAttribute('aria-label'),text:(x.innerText||'').trim()})).filter(x=>x.aria||x.text).slice(0,40)}))()""")
    results["theme_click"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /dark mode|light mode/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.3)
    results["theme_state"] = c.eval("({dark:document.documentElement.classList.contains('dark'),saved:localStorage.getItem('sk-theme')})")
    results["menu_click"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /menu|navigation/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.4)
    results["menu_state"] = c.eval("""(() => ({open:[...document.querySelectorAll('[role=dialog],[data-state=open],nav')].some(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0}), overflow:document.documentElement.scrollWidth-innerWidth, text:(document.body.innerText||'').slice(0,500)}))()""")
    results["menu_close"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /close navigation|إغلاق القائمة/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.3)
    results["quick_view_click"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /quick view|معاينة/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.5)
    results["quick_view_state"] = c.eval("""(() => ({open:[...document.querySelectorAll('[role=dialog],.quick-view-modal,.mobile-quickview')].some(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0}), overflow:document.documentElement.scrollWidth-innerWidth, text:(document.body.innerText||'').slice(-700)}))()""")
    results["quick_view_close"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /close|إغلاق/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.3)
    results["wishlist_click"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /add to wishlist|إضافة للمفضلة/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.3)
    results["wishlist_state"] = c.eval("({saved:localStorage.getItem('sk-wishlist'),wishlistLabels:[...document.querySelectorAll('button')].map(x=>x.getAttribute('aria-label')).filter(Boolean).filter(x=>/wishlist|المفضلة/i.test(x))})")
    results["language_open"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /language|اللغة/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.3)
    results["language_ar_click"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /العربية/.test(x.innerText||''))"))
    time.sleep(0.5)
    results["language_state"] = c.eval("({lang:document.documentElement.lang,dir:document.documentElement.dir,stored:localStorage.getItem('sk-lang')})")

    c.eval("localStorage.setItem('sk-lang','en'); localStorage.setItem('sk-theme','light');")
    c.nav("/products/leather-bucket-bag")
    results["product_initial"] = c.eval("""(() => ({path:location.pathname,text:(document.body.innerText||'').length,buttons:[...document.querySelectorAll('button')].map(x=>({aria:x.getAttribute('aria-label'),text:(x.innerText||'').trim(),disabled:x.disabled})).filter(x=>x.aria||x.text).slice(-35)}))()""")
    results["variant_color"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /Tan/i.test((x.innerText||'').trim()) || x.getAttribute('aria-label')==='Tan')"))
    results["variant_size"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /One Size/i.test((x.innerText||'').trim()))"))
    results["add_to_bag"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /add to bag|add to cart|إضافة/i.test((x.innerText||'')+' '+(x.getAttribute('aria-label')||'')))"))
    time.sleep(0.8)
    results["cart_after_add"] = c.eval("({cart:localStorage.getItem('storekit-cart'),text:(document.body.innerText||'').slice(-900),overflow:document.documentElement.scrollWidth-innerWidth})")
    results["cart_open"] = c.eval(click_js("[...document.querySelectorAll('button')].find(x => /cart|السلة/i.test(x.getAttribute('aria-label')||''))"))
    time.sleep(0.5)
    results["cart_state"] = c.eval("""(() => ({open:[...document.querySelectorAll('[role=dialog],.mobile-cart-sheet')].some(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0}), text:(document.body.innerText||'').slice(-1200), overflow:document.documentElement.scrollWidth-innerWidth}))()""")
    results["checkout_click"] = c.eval(click_js("[...document.querySelectorAll('button,a')].find(x => /checkout|إتمام الشراء/i.test((x.innerText||'').trim()))"))
    time.sleep(1.0)
    results["checkout_state"] = c.eval("({path:location.pathname,text:(document.body.innerText||'').slice(0,1200),bodyText:(document.body.innerText||'').trim().length,guestId:localStorage.getItem('sk-guest-id'),overflow:document.documentElement.scrollWidth-innerWidth})")

    c.nav("/admin/login")
    results["admin_login_initial"] = c.eval("""(() => ({path:location.pathname,text:(document.body.innerText||'').slice(0,700),inputs:[...document.querySelectorAll('input')].map(x=>({type:x.type,placeholder:x.placeholder,aria:x.getAttribute('aria-label')})),buttons:[...document.querySelectorAll('button')].map(x=>(x.innerText||'').trim()).filter(Boolean)}))()""")
    results["admin_login_submit"] = c.eval("""(() => { const input=document.querySelector('input[type=password]'); const btn=[...document.querySelectorAll('button')].find(x=>/login|sign in|دخول|تسجيل/i.test(x.innerText||'')); if(!input||!btn) return {found:false}; const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'storekit2024'); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); btn.click(); return {found:true}; })()""")
    time.sleep(1.5)
    results["admin_after_login"] = c.eval("({path:location.pathname,text:(document.body.innerText||'').slice(0,900),overflow:document.documentElement.scrollWidth-innerWidth,adminLinks:[...document.querySelectorAll('a')].map(x=>x.getAttribute('href')).filter(x=>x&&x.startsWith('/admin')).slice(0,20)})")
    print(json.dumps(results, ensure_ascii=False, indent=2))
    ws.close()

if __name__ == "__main__":
    main()
