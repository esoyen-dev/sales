const fs = require("fs");
const PORT = 9333;
(async () => {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find(p => p.type === "page");
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
    await new Promise(r => ws.onopen = r);
    const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send("Page.navigate", { url: process.argv[2] });
    await new Promise(r => setTimeout(r, 4000));
    const before = await send("Runtime.evaluate", { expression: `JSON.stringify({items:citems.length, hidden:document.getElementById('clist').hidden, val:document.getElementById('cs').value, ih:innerHeight, iw:innerWidth})`, returnByValue: true });
    console.log("before", before.result.result.value);
    // tap search input: scaled canvas coords
    const box = await send("Runtime.evaluate", { expression: `(()=>{const r=document.getElementById('cs').getBoundingClientRect();return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height})})()`, returnByValue: true });
    console.log("box", box.result.result.value);
    const b = JSON.parse(box.result.result.value);
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: b.x, y: b.y }] });
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await new Promise(r => setTimeout(r, 1200));
    const after = await send("Runtime.evaluate", { expression: `(()=>{const c=document.getElementById('clist'),r=c.getBoundingClientRect();return JSON.stringify({hidden:c.hidden,items:c.children.length,h:r.height,w:r.width,top:r.top,left:r.left,active:document.activeElement.id,expanded:document.getElementById('cs').getAttribute('aria-expanded')})})()`, returnByValue: true });
    console.log("after", after.result.result.value);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(process.argv[3], Buffer.from(shot.result.data, "base64"));
    ws.close();
})().catch(e => { console.error(e); process.exit(1); });
