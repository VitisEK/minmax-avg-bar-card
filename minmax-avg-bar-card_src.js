/* eslint-disable no-console */

const MMAB_VERSION = "1.1.0";

// --- Lit loader ---
let Lit, __litFromCDN = false;
try { Lit = await import("lit"); }
catch {
  Lit = await import("https://cdn.jsdelivr.net/npm/lit@3/+esm");
  __litFromCDN = true;
}
const { LitElement, html, css, svg, nothing } = Lit;

console.info(`[MMAB] v${MMAB_VERSION} loaded (Lit: ${__litFromCDN ? "CDN" : "local"})`);

// ---- Helper: Get Energy Data Collection ----
const getEnergyDataCollection = (hass) => {
  if (!hass.connection) return null;
  if (hass.connection["_energy"]) return hass.connection["_energy"];
  const myKey = "_energy_minmax_subscription";
  if (!hass.connection[myKey]) {
    hass.connection[myKey] = hass.connection.createCollection({
      key: "energy",
      fetch: (conn) => conn.sendMessagePromise({ type: "energy/get_prefs" }).catch(() => null),
      subscribe: (conn, onChange) =>
        conn.subscribeMessage(onChange, { type: "energy/subscribe" }).catch(() => null),
    });
  }
  return hass.connection[myKey];
};

const STRINGS = {
  cs: { missing: "Chybí konfigurace – zadej entitu.", min: "Min", max: "Max", avg: "Průměr", thresholds: "Barevné rozsahy", thresholds_by: "podle", add: "Přidat", remove: "Odebrat", lt: "méně než", color: "barva", months: "Měsíce", weeks: "Týdny", preset: "Přednastavený styl", color_by: "Barva podle", color_by_max: "Maximum", color_by_average: "Průměr", color_by_min: "Minimum" },
  en: { missing: "Missing config – provide an entity.", min: "Min", max: "Max", avg: "Avg", thresholds: "Color ranges", thresholds_by: "by", add: "Add", remove: "Remove", lt: "less than", color: "color", months: "Months", weeks: "Weeks", preset: "Style Preset", color_by: "Color by", color_by_max: "Maximum", color_by_average: "Average", color_by_min: "Minimum" },
};

// -------------------- PRESETS DEFINITION --------------------
const PRESETS = {
  temperature: [
    { lt: -15, color: "#b968f4" }, // purple
    { lt: 0,   color: "#039be5" }, // blue
    { lt: 20,  color: "#43a047" }, // green
    { lt: 25,  color: "#fdd835" }, // yellow
    { lt: 30,  color: "#fb8c00" }, // orange
    { lt: 999, color: "#e53935" }, // red
  ],
  temperature_f: [
    { lt: 5,   color: "#b968f4" }, // purple (very cold)
    { lt: 32,  color: "#039be5" }, // blue (freezing)
    { lt: 68,  color: "#43a047" }, // green (comfortable)
    { lt: 77,  color: "#fdd835" }, // yellow (warm)
    { lt: 86,  color: "#fb8c00" }, // orange (hot)
    { lt: 999, color: "#e53935" }, // red (very hot)
  ],
  beaufort: [
    { lt: 1,   color: "#2196F3" }, // 0: Calm
    { lt: 5,   color: "#64B5F6" }, // 1: Light Air
    { lt: 11,  color: "#4DD0E1" }, // 2: Light Breeze
    { lt: 19,  color: "#4CAF50" }, // 3: Gentle Breeze
    { lt: 28,  color: "#8BC34A" }, // 4: Moderate Breeze
    { lt: 38,  color: "#CDDC39" }, // 5: Fresh Breeze
    { lt: 49,  color: "#FFEB3B" }, // 6: Strong Breeze
    { lt: 61,  color: "#FFC107" }, // 7: Near Gale
    { lt: 74,  color: "#FF9800" }, // 8: Gale
    { lt: 88,  color: "#FF5722" }, // 9: Strong Gale
    { lt: 102, color: "#F44336" }, // 10: Storm
    { lt: 117, color: "#D32F2F" }, // 11: Violent Storm
    { lt: 999, color: "#B71C1C" }, // 12: Hurricane
  ]
};

// -------------------- Helpers & Date Math --------------------
const pad2 = (n) => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// DST-SAFE DATE MATH
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);

const addHours = (d, n) => {
    const copy = new Date(d);
    copy.setTime(copy.getTime() + n * 3600 * 1000);
    return copy;
};

const addDays = (d, n) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
};

const addMonths = (d, n) => {
    const copy = new Date(d);
    copy.setMonth(copy.getMonth() + n);
    return copy;
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDateDM(d, fmt = 'eu') {
  if (fmt === 'intl') return `${d.getDate()}-${MONTH_ABBR[d.getMonth()]}`;
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}
function formatDateDMY(d, fmt = 'eu') {
  if (fmt === 'intl') return `${d.getDate()}-${MONTH_ABBR[d.getMonth()]}-${d.getFullYear()}`;
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}
function formatTimeHM(d) { return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }

function niceTicks(minV, maxV, tickCount = 6) {
  if (!isFinite(minV) || !isFinite(maxV) || minV === maxV) {
    const v = isFinite(minV) ? minV : 0;
    return { min: v - 1, max: v + 1, step: 1, ticks: [v - 1, v, v + 1] };
  }
  const span = maxV - minV;
  const rawStep = span / Math.max(1, (tickCount - 1));
  const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const err = rawStep / pow10;
  let step;
  if (err >= 7.5) step = 10 * pow10;
  else if (err >= 3.5) step = 5 * pow10;
  else if (err >= 1.5) step = 2 * pow10;
  else step = 1 * pow10;
  const niceMin = Math.floor(minV / step) * step;
  const niceMax = Math.ceil(maxV / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) ticks.push(v);
  return { min: niceMin, max: niceMax, step, ticks };
}

function colorForValue(v, thresholds) {
  if (!isFinite(v)) return "var(--disabled-text-color)";
  const th = Array.isArray(thresholds) && thresholds.length ? thresholds : PRESETS.temperature;
  const sorted = th
    .map(t => ({ lt: Number(t.lt), color: String(t.color ?? "") }))
    .filter(t => isFinite(t.lt) && t.color)
    .sort((a, b) => a.lt - b.lt);
  for (const t of sorted) if (v < t.lt) return t.color;
  return sorted.length ? sorted[sorted.length - 1].color : "var(--primary-color)";
}

// --- Tooltip bin end calculation ---
function estimateBinEnd(points, idx, wsPeriod) {
  const p = points[idx];
  if (!p?.start) return null;
  if (idx < points.length - 1 && points[idx + 1]?.start) return points[idx + 1].start;
  const s = p.start;
  if (wsPeriod === "hour") return addHours(s, 1);
  if (wsPeriod === "day") return addDays(s, 1);
  if (wsPeriod === "week") return addDays(s, 7);
  if (wsPeriod === "month") return addMonths(s, 1);
  return addDays(s, 1);
}

function formatRangeTitle(start, end, wsPeriod, fmt = 'eu') {
  if (!start) return "";
  if (!end) return formatDateDMY(start, fmt);
  if (wsPeriod === "hour") {
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) return `${formatDateDM(start, fmt)} ${formatTimeHM(start)}–${formatTimeHM(end)}`;
    return `${formatDateDMY(start, fmt)} ${formatTimeHM(start)} – ${formatDateDMY(end, fmt)} ${formatTimeHM(end)}`;
  }
  const sameDate = start.toDateString() === end.toDateString();
  return sameDate ? formatDateDMY(start, fmt) : `${formatDateDM(start, fmt)}–${formatDateDM(end, fmt)}`;
}

// --- X-LABEL FORMATTER (Localized) ---
function formatXLabel(start, wsPeriod, idx, lang = 'cs', fmt = 'eu') {
  if (!start) return "";

  if (wsPeriod === "month") {
    const isYearStart = idx === 0 || start.getMonth() === 0;
    try {
        if (isYearStart) {
            return new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(start);
        } else {
            return new Intl.DateTimeFormat(lang, { month: 'long' }).format(start);
        }
    } catch (e) {
        return `${pad2(start.getMonth() + 1)}/${String(start.getFullYear()).slice(-2)}`;
    }
  }

  if (wsPeriod === "hour") return `${pad2(start.getHours())}:00`;
  if (wsPeriod === "day") return formatDateDM(start, fmt);
  if (wsPeriod === "week") return formatDateDM(start, fmt);

  return formatDateDM(start, fmt);
}

// ------------------ MAIN CARD CLASS ------------------
class MinMaxAvgBarCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _data: { state: true },
      _loading: { state: true },
      _err: { state: true },
      _hover: { state: true },
      _size: { state: true },
      _selection: { state: true },
      _periodMode: { state: true },
      __lastFetchKey: { state: true },
    };
  }

  constructor() {
    super();
    this._size = { w: 900, h: 320 };
    this._selection = { startIso: "", endIso: "", wsPeriod: "" };
    this._periodMode = "month"; 
    this.__ro = null;
    this._energySubscription = null;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--primary-text-color);
        --mmab-padding: 16px;
        --mmab-height: 320px;
        --mmab-grid: rgba(255, 255, 255, 0.1);
        --mmab-grid-strong: rgba(255, 255, 255, 0.2);
        --mmab-axis: var(--secondary-text-color);
        --mmab-fill-opacity: 0.3;
        --mmab-stroke-opacity: 1;
        --mmab-stroke-width: 2;
        --mmab-avg-stroke: #ffffff;
        --mmab-avg-shadow: rgba(0, 0, 0, 0.5);
        --mmab-bar-radius: 4;
        --mmab-font-tick: 11px;
        --mmab-font-x: 11px;
        --mmab-font-unit: 11px;
        --mmab-tooltip-bg: var(--card-background-color);
        --mmab-tooltip-border: var(--divider-color);
        --mmab-hover-line: var(--primary-color, #039be5); 
        --mdc-typography-font-family: var(--font-family, Roboto, sans-serif);
      }
      ha-card { height: 100%; display: flex; flex-direction: column; }
      .wrap { padding: var(--mmab-padding); flex: 1; box-sizing: border-box; }
      
      .head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 20px; }
      .title { font-weight: 500; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      
      .toggles { display: flex; background: rgba(120,120,120,0.2); border-radius: 16px; padding: 2px; }
      .toggle-btn { 
        padding: 4px 12px; 
        font-size: 12px; 
        font-weight: 500; 
        cursor: pointer; 
        border-radius: 14px; 
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
      }
      .toggle-btn.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }

      .chart { position: relative; height: var(--mmab-height); width: 100%; }
      
      svg { width: 100%; height: 100%; display: block; overflow: visible; }
      svg text, svg line, svg rect.barFill, svg rect.barStroke { pointer-events: none; }
      
      .tickText { fill: var(--mmab-axis); font-size: var(--mmab-font-tick); font-family: var(--mdc-typography-font-family); }
      .xText { fill: var(--mmab-axis); font-size: var(--mmab-font-x); font-family: var(--mdc-typography-font-family); }
      
      .gridH { stroke: var(--mmab-grid); stroke-width: 1px; shape-rendering: crispEdges; }
      .gridHStrong { stroke: var(--mmab-grid-strong); stroke-width: 1px; shape-rendering: crispEdges; }
      .gridV { stroke: var(--mmab-grid); stroke-width: 1px; shape-rendering: crispEdges; stroke-dasharray: 2 2; }
      
      .hoverLine {
        stroke: var(--mmab-hover-line);
        stroke-width: 1px;
        stroke-dasharray: 4 3;
        shape-rendering: crispEdges;
        opacity: 0.9;
      }

      .barFill { fill-opacity: var(--mmab-fill-opacity); transition: fill-opacity 0.2s; }
      .barStroke { stroke-opacity: var(--mmab-stroke-opacity); stroke-width: var(--mmab-stroke-width); }
      .barFill.active { fill-opacity: 0.5; } 
      
      .avgShadow { stroke: var(--mmab-avg-shadow); stroke-width: 3; opacity: 0.5; }
      .avgLine { stroke: var(--mmab-avg-stroke); stroke-width: 1.5; }
      
      .overlay { fill: transparent; cursor: crosshair; } 
      
      .yUnit { fill: var(--mmab-axis); font-size: var(--mmab-font-unit); font-weight: 500; }
      
      .tooltip {
        position: absolute;
        pointer-events: none;
        background: rgba(45, 45, 45, 0.95);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        border-radius: 4px;
        padding: 8px;
        min-width: 150px;
        transform: translate(-50%, -115%);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-size: 12px;
        z-index: 10;
      }
      .tt-title { font-weight: 500; margin-bottom: 4px; font-size: 13px; opacity: 0.9; }
      .tt-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 2px; }
      .tt-row .v { font-weight: 700; }
      .err { color: var(--error-color, #db4437); font-size: 14px; }
    `;
  }

  static getStubConfig() {
    return {
      name: "Min/Max/Avg",
      entity: "sensor.temperature",
      height: 320,
      decimals: 1,
      y_padding_ratio: 0.08,
      show_x_labels: true,
      show_y_labels: true,
      show_y_unit: true,
      thresholds: PRESETS.temperature,
      preset: "temperature",
      color_by: "max",
      listen_energy_date_selection: true,
      default_ws_period: "day",
      debug: false,
    };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error("entity is required");
    this._config = { ...MinMaxAvgBarCard.getStubConfig(), ...config };
    if (!this._selection?.wsPeriod) {
      const p = String(this._config.default_ws_period || "day").toLowerCase();
      this._selection = { ...(this._selection || {}), wsPeriod: (["hour","day","week","month"].includes(p) ? p : "day") };
    }
    this._data = null;
    this._err = null;
    this._loading = false;
    this.__lastFetchKey = "";
    if (this.hass) this._subscribeToEnergy(); 
    this._fetchStatsIfNeeded();
  }

  getCardSize() { return 4; }
  _stateObj(entityId) { return entityId ? this.hass?.states?.[entityId] : null; }
  _unit(entityId) { return this._stateObj(entityId)?.attributes?.unit_of_measurement || ""; }

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      const el = this.renderRoot?.querySelector(".chart");
      if (!el || this.__ro) return;
      this.__ro = new ResizeObserver((entries) => {
        const r = entries?.[0]?.contentRect;
        if (!r) return;
        const w = Math.max(320, Math.round(r.width));
        const h = Math.max(240, Math.round(r.height));
        if (w !== this._size.w || h !== this._size.h) this._size = { w, h };
      });
      this.__ro.observe(el);
    });
    if (this.hass) this._subscribeToEnergy();
  }

  disconnectedCallback() {
    try { this.__ro?.disconnect(); } catch {}
    this.__ro = null;
    if (this._energySubscription) {
        this._energySubscription.then((unsub) => { if(typeof unsub === 'function') unsub(); });
        this._energySubscription = null;
    }
    super.disconnectedCallback();
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") || changedProps.has("_config")) {
        this._subscribeToEnergy();
        if (!this._data && !this._loading) this._fetchStatsIfNeeded();
    }
  }

  async _subscribeToEnergy() {
    if (!this.hass || !this._config?.listen_energy_date_selection) return;
    if (this._energySubscription) return;
    try {
        const collection = getEnergyDataCollection(this.hass);
        if (!collection) return;
        if (this._config.debug) console.info("[MMAB] Subscribing to Energy Collection...");
        this._energySubscription = collection.subscribe((data) => this._handleEnergyChange(data));
    } catch (e) { console.warn("[MMAB] Failed to subscribe:", e); }
  }

  _handleEnergyChange(data) {
    if (!data) return;
    if (this._config.debug) console.info("[MMAB] Energy Collection changed:", data);
    let startIso = null;
    let endIso = null;
    if (data.start) startIso = data.start instanceof Date ? data.start.toISOString() : String(data.start);
    if (data.end) endIso = data.end instanceof Date ? data.end.toISOString() : String(data.end);
    if (!startIso || !endIso) return;
    
    const s = new Date(startIso);
    const e = new Date(endIso);
    const diffHours = (e - s) / (1000 * 3600);
    let inferredPeriod = "day";

    if (diffHours <= 48) inferredPeriod = "hour";     
    else if (diffHours <= 35 * 24) inferredPeriod = "day"; 
    else inferredPeriod = "month"; 
    
    const nextSel = { startIso: startIso, endIso: endIso, wsPeriod: inferredPeriod };
    const same = nextSel.startIso === (this._selection?.startIso || "") && nextSel.endIso === (this._selection?.endIso || "") && nextSel.wsPeriod === (this._selection?.wsPeriod || "");
    
    if (!same) {
      this._selection = nextSel;
      this.__lastFetchKey = "";
      this._fetchStatsIfNeeded();
      this.requestUpdate();
    }
  }

  _setPeriodMode(mode) {
      if(this._periodMode === mode) return;
      this._periodMode = mode;
      this.__lastFetchKey = ""; // Force refetch
      this._fetchStatsIfNeeded();
  }

  _generateTimeline(start, end, period, fetchedData) {
    const timeline = [];
    let current = new Date(start);
    const endDate = new Date(end);
    
    const points = [...fetchedData].sort((a,b) => a.start - b.start);
    let dataIdx = 0;

    let safety = 0;
    while (current < endDate && safety < 1000) {
        safety++;
        
        let nextBinStart;
        if (period === "hour") nextBinStart = addHours(current, 1);
        else if (period === "month") nextBinStart = addMonths(current, 1);
        else if (period === "week") nextBinStart = addDays(current, 7);
        else nextBinStart = addDays(current, 1);
        
        let foundPoint = null;
        while(dataIdx < points.length && points[dataIdx].start < current) {
             dataIdx++;
        }

        if (dataIdx < points.length) {
            const p = points[dataIdx];
            if (p.start < nextBinStart) {
                foundPoint = p;
                dataIdx++; 
            }
        }

        if (foundPoint) {
            timeline.push({ ...foundPoint, start: new Date(current), isEmpty: false });
        } else {
            timeline.push({
                start: new Date(current),
                min: null, max: null, mean: null,
                isEmpty: true
            });
        }
        
        current = nextBinStart;
    }
    return timeline;
  }

  async _fetchStatsIfNeeded() {
    const cfg = this._config || {};
    const entity = cfg.entity;
    if (!this.hass || !entity) return;
    
    let basePeriod = String(this._selection?.wsPeriod || cfg.default_ws_period || "day").toLowerCase();
    
    let fetchPeriod = basePeriod;
    if (basePeriod === "month") {
        if (this._periodMode === "week") fetchPeriod = "week";
        else fetchPeriod = "month";
    }

    if (!["hour","day","week","month"].includes(fetchPeriod)) fetchPeriod = "day";

    let startIso = String(this._selection?.startIso || "");
    let endIso = String(this._selection?.endIso || "");
    
    if (!startIso || !endIso) {
      const now = new Date();
      let startDt = new Date(now.getFullYear(), now.getMonth(), 1);
      startIso = startDt.toISOString();
      endIso = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
    }

    const key = `${entity}|${fetchPeriod}|${startIso}|${endIso}`;
    if (this.__lastFetchKey === key && Array.isArray(this._data) && this._data.length > 0) return;
    this.__lastFetchKey = key;
    this._loading = true;
    this._err = null;
    
    try {
      if (cfg.debug) console.info(`[MMAB] Fetching ${fetchPeriod} for ${startIso} -> ${endIso}`);
      const resp = await this.hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: startIso,
        end_time: endIso,
        statistic_ids: [entity],
        period: fetchPeriod,
        types: ["mean", "min", "max"],
      });
      const series = resp?.[entity] || [];
      const fetchedPoints = series
        .map((p) => ({
          start: new Date(p.start),
          min: isFinite(p.min) ? Number(p.min) : null,
          max: isFinite(p.max) ? Number(p.max) : null,
          mean: isFinite(p.mean) ? Number(p.mean) : null,
          isEmpty: false
        }))
        .filter((p) => p.start instanceof Date && !isNaN(p.start));
      
      let genStart = new Date(startIso);
      
      const fullTimeline = this._generateTimeline(genStart, endIso, fetchPeriod, fetchedPoints);
      this._data = fullTimeline;
      this._loading = false;
      this.requestUpdate();
    } catch (e) {
      this._loading = false;
      this._err = String(e?.message || e);
      console.warn("[MMAB] fetch error", e);
      this.requestUpdate();
    }
  }

  _computePlotGeometry(W, H) {
    const mL = 40; 
    const mR = 10; 
    const mT = 10;
    const mB = 30; 
    const x0 = mL, y0 = mT;
    const plotW = Math.max(10, W - mL - mR);
    const plotH = Math.max(10, H - mT - mB);
    const n = Math.max(1, (this._data || []).length);
    const barStep = plotW / n;
    
    let barRatio = 0.65;
    if (n > 40) barRatio = 0.8; 
    
    const barW = Math.max(1, barStep * barRatio); 
    const barXPad = (barStep - barW) / 2;
    return { x0, y0, plotW, plotH, n, barStep, barW, barXPad };
  }

  _onMove(ev, geom) {
    if (!geom || !Array.isArray(this._data) || !this._data.length) return;
    const x = ev.clientX - geom.left;
    const y = ev.clientY - geom.top;
    const W = Math.max(500, this._size?.w || geom.width);
    const sx = (W / geom.width);
    const X = x * sx;
    const plot = this._computePlotGeometry(W, Math.max(240, this._size?.h || geom.height));
    const { x0, plotW, n, barStep } = plot;
    if (X < x0 || X > x0 + plotW) { this._hover = null; return; }
    const idx = clamp(Math.floor((X - x0) / barStep), 0, n - 1);
    this._hover = { idx, px: x, py: y };
  }
  _onLeave() { this._hover = null; }

  render() {
    const cfg = this._config || {};
    const lang = (cfg.language || "cs").toLowerCase();
    const dateFmt = (cfg.date_format || "eu").toLowerCase();
    const i18n = STRINGS[lang] || STRINGS.cs;
    if (!cfg.entity) return html`<ha-card><div class="wrap"><div class="err">${i18n.missing}</div></div></ha-card>`;
    const st = this._stateObj(cfg.entity);
    const unit = this._unit(cfg.entity);
    const title = cfg.name || (st?.attributes?.friendly_name ?? cfg.entity);
    const height = Number(cfg.height || 320);
    const decimals = Number.isFinite(Number(cfg.decimals)) ? Number(cfg.decimals) : 1;
    
    const data = Array.isArray(this._data) ? this._data : [];
    
    const basePeriod = String(this._selection?.wsPeriod || cfg.default_ws_period || "day").toLowerCase();
    let displayPeriod = basePeriod;
    if (basePeriod === "month") {
        displayPeriod = this._periodMode === "week" ? "week" : "month";
    }

    const showToggle = basePeriod === "month";

    let vMin = Infinity, vMax = -Infinity;
    let hasValid = false;
    for (const p of data) {
      if (!p.isEmpty && isFinite(p.min) && isFinite(p.max)) {
          vMin = Math.min(vMin, p.min);
          vMax = Math.max(vMax, p.max);
          hasValid = true;
      }
    }
    if (!hasValid) { vMin = 0; vMax = 1; }

    const padRatio = Number(cfg.y_padding_ratio ?? 0.08);
    const span = (vMax - vMin) || 1;
    vMin -= span * padRatio;
    vMax += span * padRatio;

    const W = Math.max(500, this._size?.w || 900);
    const H = Math.max(240, this._size?.h || 320);
    const plot = this._computePlotGeometry(W, H);
    const { x0, y0, plotW, plotH, n, barStep, barW, barXPad } = plot;
    
    const tickCount = clamp(Math.round(plotH / 50) + 1, 4, 8);
    const ticksInfo = niceTicks(vMin, vMax, tickCount);
    const yFor = (v) => y0 + (ticksInfo.max - v) * (plotH / (ticksInfo.max - ticksInfo.min));
    const stepDecimals = (() => {
      const s = ticksInfo.step;
      if (!isFinite(s)) return decimals;
      if (Math.abs(s - Math.round(s)) < 1e-9) return 0;
      if (s >= 0.5) return 1;
      return Math.min(3, decimals);
    })();

    const wantXLabels = cfg.show_x_labels !== false;
    const wantYLabels = cfg.show_y_labels !== false;
    const showYUnit = cfg.show_y_unit !== false;
    
    const xLabelEvery = (() => {
      if (displayPeriod === "hour") return 4;
      if (displayPeriod === "day") return 4; 
      if (displayPeriod === "month") return 1; 
      if (displayPeriod === "week") {
          if (n > 20) return 4; 
          return 1; 
      }
      return 4;
    })();

    const hover = this._hover;
    const hoverPoint = (hover && data[hover.idx]) ? data[hover.idx] : null;
    const isHoverValid = hoverPoint && !hoverPoint.isEmpty;
    const binEnd = isHoverValid ? estimateBinEnd(data, hover.idx, displayPeriod) : null;
    const ttTitle = isHoverValid ? formatRangeTitle(hoverPoint.start, binEnd, displayPeriod, dateFmt) : "";
    const fmtVal = (v) => (isFinite(v) ? Number(v).toFixed(decimals) : "–");

    // Pass explicit thresholds and color_by setting
    const activeThresholds = Array.isArray(cfg.thresholds) ? cfg.thresholds : PRESETS.temperature;
    const colorBy = ["max", "average", "min"].includes(cfg.color_by) ? cfg.color_by : "max";

    return html`
      <ha-card>
        <div class="wrap" style="--mmab-height:${height}px;">
          <div class="head">
            <div class="title" title="${title}">${title}</div>
            
            ${showToggle ? html`
              <div class="toggles">
                <div class="toggle-btn ${this._periodMode === 'month' ? 'active' : ''}" 
                     @click=${() => this._setPeriodMode('month')}>${i18n.months}</div>
                <div class="toggle-btn ${this._periodMode === 'week' ? 'active' : ''}" 
                     @click=${() => this._setPeriodMode('week')}>${i18n.weeks}</div>
              </div>
            ` : html`<div></div>`}
          </div>
          
          ${this._err ? html`<div class="err">${this._err}</div>` : nothing}
          
          <div class="chart"
               @mousemove=${(e) => this._onMove(e, e.currentTarget.getBoundingClientRect())}
               @mouseleave=${() => this._onLeave()}>
            <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Min max avg bar chart">
              ${showYUnit && unit ? svg`<text class="yUnit" x="${x0 - 5}" y="${y0 - 6}" text-anchor="end">${unit}</text>` : nothing}
              
              ${ticksInfo.ticks.map((t, idx) => {
                const y = yFor(t);
                const strong = (idx === 0 || idx === ticksInfo.ticks.length - 1);
                return svg`
                  <line class="${strong ? "gridHStrong" : "gridH"}" x1="${x0}" y1="${y}" x2="${x0 + plotW}" y2="${y}"></line>
                  ${wantYLabels ? svg`<text class="tickText" x="${x0 - 8}" y="${y + 4}" text-anchor="end">${Number(t).toFixed(stepDecimals)}</text>` : nothing}
                `;
              })}
              ${(() => {
                const lines = [];
                for (let i = 0; i <= n; i++) {
                   if (i % xLabelEvery === 0) {
                     const x = x0 + i * barStep + barStep/2; 
                     lines.push(svg`<line class="gridV" x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + plotH}"></line>`);
                   }
                }
                return lines;
              })()}
              
              ${data.map((p, i) => {
                if (p.isEmpty) return nothing;
                const minV = isFinite(p.min) ? p.min : null;
                const maxV = isFinite(p.max) ? p.max : null;
                const avgV = isFinite(p.mean) ? p.mean : null;
                if (minV == null || maxV == null) return nothing;

                const bx = x0 + i * barStep + barXPad;
                // Determine which value to use for color based on config
                const colorValue = colorBy === "min" ? minV : (colorBy === "average" ? (avgV ?? maxV) : maxV);
                const color = colorForValue(colorValue, activeThresholds);
                const yTop = yFor(maxV);
                const yBot = yFor(minV);
                const h = Math.max(2, yBot - yTop);
                const rx = Number(cfg.bar_radius ?? 4);
                const avgY = (avgV == null) ? null : yFor(avgV);
                const isActive = hover && hover.idx === i;
                
                return svg`
                  <rect class="barFill ${isActive ? 'active' : ''}" x="${bx}" y="${yTop}" width="${barW}" height="${h}" fill="${color}" rx="${rx}" ry="${rx}"></rect>
                  <rect class="barStroke" x="${bx}" y="${yTop}" width="${barW}" height="${h}" fill="none" stroke="${color}" rx="${rx}" ry="${rx}"></rect>
                  ${avgY == null ? nothing : svg`
                    <line class="avgShadow" x1="${bx + 2}" y1="${avgY}" x2="${bx + barW - 2}" y2="${avgY}"></line>
                    <line class="avgLine" x1="${bx + 2}" y1="${avgY}" x2="${bx + barW - 2}" y2="${avgY}"></line>
                  `}
                `;
              })}

              ${wantXLabels ? data.map((p, i) => {
                if (i % xLabelEvery !== 0) return nothing;
                const bxCenter = x0 + i * barStep + barStep / 2;
                return svg`<text class="xText" x="${bxCenter}" y="${y0 + plotH + 16}" text-anchor="middle">${formatXLabel(p.start, displayPeriod, i, lang, dateFmt)}</text>`;
              }) : nothing}
              
              ${hover ? (() => {
                 const hx = x0 + hover.idx * barStep + barStep / 2;
                 return svg`<line class="hoverLine" x1="${hx}" y1="${y0}" x2="${hx}" y2="${y0 + plotH}"></line>`;
              })() : nothing}

              <rect class="overlay" x="${x0}" y="${y0}" width="${plotW}" height="${plotH}"></rect>
            </svg>

            ${isHoverValid ? html`
              <div class="tooltip" style="left:${hover.px}px; top:${hover.py}px">
                <div class="tt-title">${ttTitle}</div>
                <div class="tt-row"><span class="k">${i18n.max}</span><span class="v">${fmtVal(hoverPoint.max)}${unit ? ` ${unit}` : ""}</span></div>
                <div class="tt-row"><span class="k">${i18n.avg}</span><span class="v">${fmtVal(hoverPoint.mean)}${unit ? ` ${unit}` : ""}</span></div>
                <div class="tt-row"><span class="k">${i18n.min}</span><span class="v">${fmtVal(hoverPoint.min)}${unit ? ` ${unit}` : ""}</span></div>
              </div>
            ` : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }
  static getConfigElement() { return document.createElement("minmax-avg-bar-card-editor"); }
}
function cssColorToHex(colorStr, scopeEl) { try { const probe = document.createElement("span"); probe.style.position = "absolute"; probe.style.left = "-9999px"; probe.style.top = "-9999px"; probe.style.opacity = "0"; probe.style.color = String(colorStr || ""); (scopeEl?.shadowRoot || document.body).appendChild(probe); const cs = getComputedStyle(probe).color; probe.remove(); const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i); if (!m) return ""; const toHex = (n) => String(n.toString(16)).padStart(2, "0"); return `#${toHex(Number(m[1]))}${toHex(Number(m[2]))}${toHex(Number(m[3]))}`; } catch { return ""; } }
class MinMaxAvgBarCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = { ...(config || {}) }; if (!Array.isArray(this._config.thresholds)) this._config.thresholds = PRESETS.temperature; if (this._config.listen_energy_date_selection === undefined) this._config.listen_energy_date_selection = true; }
  
  _valueChanged(ev) { 
    ev.stopPropagation(); 
    let newConfig = ev.detail.value; 
    
    // --- TEMPLATE LOADER LOGIC ---
    const oldPreset = this._config?.preset;
    const newPreset = newConfig?.preset;
    
    if (newPreset && newPreset !== oldPreset) {
        const template = PRESETS[newPreset] || PRESETS.temperature;
        newConfig = { ...newConfig, thresholds: template.map(t => ({...t})) };
    }
    // -----------------------------

    this._config = newConfig; 
    fireEvent(this, "config-changed", { config: newConfig }); 
  }
  
  _setThresholds(arr) { const cleaned = (arr || []).map(t => ({ lt: Number(t.lt), color: String(t.color ?? "") })).filter(t => isFinite(t.lt) && t.color).sort((a, b) => a.lt - b.lt); const cfg = { ...(this._config || {}) }; cfg.thresholds = cleaned.length ? cleaned : PRESETS.temperature; this._config = cfg; fireEvent(this, "config-changed", { config: cfg }); }
  _updateThreshold(idx, patch) { const arr = (this._config.thresholds || []).map(t => ({...t})); arr[idx] = { ...(arr[idx] || {}), ...(patch || {}) }; this._setThresholds(arr); }
  _addThreshold() { const arr = (this._config.thresholds || []).map(t => ({...t})); arr.push({ lt: (Number(arr[arr.length - 1]?.lt) || 0) + 10, color: "#ffffff" }); this._setThresholds(arr); }
  _removeThreshold(idx) { const arr = (this._config.thresholds || []).map(t => ({...t})); arr.splice(idx, 1); this._setThresholds(arr.length ? arr : PRESETS.temperature); }
  
  static get styles() { return css`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`; }
  
  get _schema() {
      return [
          { name: "name", selector: { text: {} } },
          { name: "entity", selector: { entity: { domain: "sensor" } } },
          { name: "height", selector: { number: { min: 240, max: 600, step: 10, mode: "box" } } },
          { name: "preset", selector: { select: { mode: "dropdown", options: [{ value: "temperature", label: "Temperature (C)" }, { value: "temperature_f", label: "Temperature (F)" }, { value: "beaufort", label: "Wind (Beaufort)" }] } } },
          { name: "color_by", selector: { select: { mode: "dropdown", options: [{ value: "max", label: "Maximum" }, { value: "average", label: "Average" }, { value: "min", label: "Minimum" }] } } },
          { name: "decimals", selector: { number: { min: 0, max: 3, step: 1, mode: "box" } } },
          { name: "y_padding_ratio", selector: { number: { min: 0.00, max: 0.25, step: 0.01, mode: "box" } } },
          { name: "date_format", selector: { select: { mode: "dropdown", options: [{ value: "eu", label: "European (26. 1.)" }, { value: "intl", label: "International (26-Jan)" }] } } },
          { name: "show_x_labels", selector: { boolean: {} } },
          { name: "show_y_labels", selector: { boolean: {} } },
          { name: "show_y_unit", selector: { boolean: {} } },
          { name: "listen_energy_date_selection", selector: { boolean: {} } },
          { name: "default_ws_period", selector: { select: { mode: "dropdown", options: [{ value: "hour", label: "hourly bins" }, { value: "day", label: "daily bins" }, { value: "week", label: "weekly bins" }, { value: "month", label: "monthly bins" }] } } },
          { name: "debug", selector: { boolean: {} } }
      ];
  }
  
  render() {
      if (!this.hass) return nothing;
      const i18n = STRINGS[this._config?.language || "cs"] || STRINGS.cs;
      const thresholds = this._config.thresholds || PRESETS.temperature;
      const hasHaColorPicker = !!customElements.get("ha-color-picker");
      const colorBy = this._config.color_by || "max";
      const colorByLabel = colorBy === "min" ? i18n.color_by_min : (colorBy === "average" ? i18n.color_by_average : i18n.color_by_max);

      return html`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${i18n.thresholds} (${i18n.thresholds_by} ${colorByLabel})</div><mwc-button @click=${() => this._addThreshold()}>${i18n.add}</mwc-button></div>
            <div class="rows">
                ${thresholds.map((t, idx) => { 
                    const col = t.color || ""; 
                    const hexLike = cssColorToHex(col, this) || "#3f51b5"; 
                    return html`
                        <div class="row">
                            <ha-textfield label="${i18n.lt}" type="number" .value=${String(t.lt)} @change=${(e) => this._updateThreshold(idx, { lt: Number(e.target.value) })}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${col};"></div>
                                ${hasHaColorPicker 
                                    ? html`<ha-color-picker .value=${hexLike} @value-changed=${(e) => this._updateThreshold(idx, { color: e.detail?.value || hexLike })}></ha-color-picker>` 
                                    : html`<input type="color" .value=${hexLike} @input=${(e) => this._updateThreshold(idx, { color: e.target.value })} />`}
                                <ha-textfield label="${i18n.color}" .value=${col} @change=${(e) => this._updateThreshold(idx, { color: e.target.value })}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${() => this._removeThreshold(idx)}></ha-icon-button>
                        </div>`; 
                })}
            </div>
        </div>`; 
  }
}
customElements.define("minmax-avg-bar-card-editor", MinMaxAvgBarCardEditor);
const fireEvent = (node, type, detail = {}, options = {}) => { const event = new Event(type, { bubbles: options?.bubbles ?? true, cancelable: options?.cancelable ?? false, composed: options?.composed ?? true }); event.detail = detail; node.dispatchEvent(event); return event; };
window.customCards = window.customCards || [];
window.customCards.push({ type: "minmax-avg-bar-card", name: "Min/Max/Avg Bar Card (Energy-style)", preview: true, description: "Matches HA Energy Dashboard look." });
if (!customElements.get("minmax-avg-bar-card")) { customElements.define("minmax-avg-bar-card", MinMaxAvgBarCard); }