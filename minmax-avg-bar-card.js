let t,e=!1;try{t=await(import("lit"))}catch{t=await(import("https://cdn.jsdelivr.net/npm/lit@3/+esm")),e=!0}const{LitElement:i,html:o,css:s,svg:r,nothing:a}=t;console.info(`[MMAB] v1.3.6 loaded (Lit: ${e?"CDN":"local"})`);const n=(t,e)=>{const i=[];e&&i.push(`_${e}`),t?.panelUrl&&i.push(`_energy_${t.panelUrl}`),i.push("_energy");for(const e of Object.keys(t?.connection||{}))e.startsWith("_energy")&&!i.includes(e)&&i.push(e);return i},l=(t,e)=>{if(!t?.connection)return null;for(const i of n(t,e)){const e=t.connection[i];if(e?.start&&e?.end)return e;if(e&&"function"==typeof e.subscribe)return e}return null},c={cs:{missing:"Chybí konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevné rozsahy",thresholds_by:"podle",add:"Přidat",remove:"Odebrat",lt:"méně než",color:"barva",days:"Dny",months:"Měsíce",weeks:"Týdny",preset:"Přednastavený styl",color_by:"Barva podle",color_by_max:"Maximum",color_by_average:"Průměr",color_by_min:"Minimum",color_mode:"Výplň baru",color_mode_solid:"Jedna barva",color_mode_gradient:"Plynulý přechod",use_trailing:"Posuvné období",trailing_periods:"Počet období"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges",thresholds_by:"by",add:"Add",remove:"Remove",lt:"less than",color:"color",days:"Days",months:"Months",weeks:"Weeks",preset:"Style Preset",color_by:"Color by",color_by_max:"Maximum",color_by_average:"Average",color_by_min:"Minimum",color_mode:"Bar fill",color_mode_solid:"Single color",color_mode_gradient:"Smooth gradient",use_trailing:"Trailing period",trailing_periods:"Number of periods"}},d={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],temperature_f:[{lt:5,color:"#b968f4"},{lt:32,color:"#039be5"},{lt:68,color:"#43a047"},{lt:77,color:"#fdd835"},{lt:86,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},h=t=>String(t).padStart(2,"0"),m=(t,e,i)=>Math.min(i,Math.max(e,t)),_=t=>new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),u=(t,e)=>{const i=new Date(t);return i.setTime(i.getTime()+3600*e*1e3),i},p=(t,e)=>{const i=new Date(t);return i.setDate(i.getDate()+e),i},g=(t,e)=>{const i=new Date(t);return i.setMonth(i.getMonth()+e),i},f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function y(t,e="eu"){return"intl"===e?`${t.getDate()}-${f[t.getMonth()]}`:`${t.getDate()}. ${t.getMonth()+1}.`}function b(t,e="eu"){return"intl"===e?`${t.getDate()}-${f[t.getMonth()]}-${t.getFullYear()}`:`${t.getDate()}. ${t.getMonth()+1}. ${t.getFullYear()}`}function v(t){return`${h(t.getHours())}:${h(t.getMinutes())}`}function x(t,e){if(!isFinite(t))return"var(--disabled-text-color)";for(const i of e)if(t<i.lt)return i.color;return e.length?e[e.length-1].color:"var(--primary-color)"}function $(t){if(null==t||""===t)return"";if(t instanceof Date)return t.toISOString();if("function"==typeof t?.toJSDate)try{const e=t.toJSDate();if(e instanceof Date&&!isNaN(e))return e.toISOString()}catch{}if("function"==typeof t?.toISOString)try{return t.toISOString()}catch{}if("number"==typeof t){const e=new Date(t);return isNaN(e)?"":e.toISOString()}if("function"==typeof t?.valueOf){const e=t.valueOf();if("number"==typeof e&&isFinite(e)){const t=new Date(e);if(!isNaN(t))return t.toISOString()}}return String(t)}function w(t,e){const i=$(t),o=$(e);if(!i||!o)return null;const s=new Date(i),r=new Date(o);return isNaN(s)||isNaN(r)?null:{startIso:i,endIso:o,start:s,end:r}}function k(t,e,i){const o=t[e];if(!o?.start)return null;if(e<t.length-1&&t[e+1]?.start)return t[e+1].start;const s=o.start;return"hour"===i?u(s,1):"day"===i?p(s,1):"week"===i?p(s,7):"month"===i?g(s,1):p(s,1)}function M(t,e,i,o="eu",s="en"){if(!t)return"";if(!e)return b(t,o);if("hour"===i){return t.toDateString()===e.toDateString()?`${y(t,o)} ${v(t)}–${v(e)}`:`${b(t,o)} ${v(t)} – ${b(e,o)} ${v(e)}`}if("day"===i)return b(t,o);if("month"===i)try{return new Intl.DateTimeFormat(s,{month:"long",year:"numeric"}).format(t)}catch{return b(t,o)}return t.toDateString()===e.toDateString()?b(t,o):`${y(t,o)}–${y(e,o)}`}function S(t,e,i,o="eu"){if(!t)return{top:"",bottom:""};if("week"===i){const s=function(t){const e=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())),i=e.getUTCDay()||7;e.setUTCDate(e.getUTCDate()+4-i);const o=new Date(Date.UTC(e.getUTCFullYear(),0,1)),s=Math.ceil(((e-o)/864e5+1)/7);return{year:e.getUTCFullYear(),week:s}}(t);return{top:`${s.year} / W${h(s.week)}`,bottom:M(t,e,i,o)}}return"month"===i?{top:String(t.getFullYear()),bottom:M(t,e,i,o)}:{top:M(t,e,i,o),bottom:""}}class F extends i{static get properties(){return{hass:{},_config:{},_data:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_compareSelection:{state:!0},_compareData:{state:!0},_periodMode:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._compareSelection={startIso:"",endIso:"",wsPeriod:""},this._compareData=null,this._periodMode="month",this.__ro=null,this._energySubscription=null,this._energyLookupTimer=null,this.__lastCompareFetchKey="",this.__pendingFetchKey="",this.__fetchRequestId=0,this.__sharedPeriodHandler=null,this.__pointerGeometry=null,this.__tooltipElement=null,this.__activeThresholds=d.temperature,this.__intersectionObserver=null,this.__isVisible="undefined"==typeof IntersectionObserver,this.__visibilityUpdate=!1}static get styles(){return s`
      :host {
        display: block;
        content-visibility: auto;
        contain-intrinsic-size: auto 400px;
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
        --mmab-bar-radius: 4;
        --mmab-compare-fill-opacity: 0.18;
        --mmab-compare-stroke: rgba(200, 200, 200, 0.7);
        --mmab-compare-stroke-opacity: 0.4;
        --mmab-compare-stroke-width: 1;
        --mmab-compare-stroke-dash: 3 3;
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
      .head-actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }

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
      @media (max-width: 520px) {
        .head { align-items: flex-start; }
        .head-actions { max-width: 100%; }
        .toggle-btn { padding: 4px 9px; }
      }

      .chart { position: relative; height: var(--mmab-height); width: 100%; }

      svg { width: 100%; height: 100%; display: block; overflow: visible; }
      svg text, svg line, svg rect { pointer-events: none; }

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

      .bar {
        fill-opacity: var(--mmab-fill-opacity);
        stroke-opacity: var(--mmab-stroke-opacity);
        stroke-width: var(--mmab-stroke-width);
      }
      .bar.active { fill-opacity: 0.5; }

      .compareBar {
        fill-opacity: var(--mmab-compare-fill-opacity);
        stroke-opacity: var(--mmab-compare-stroke-opacity);
        stroke-width: var(--mmab-compare-stroke-width);
        stroke-dasharray: var(--mmab-compare-stroke-dash);
      }

      .avgLine { stroke: var(--mmab-avg-stroke); stroke-width: 1.5; }
      .avgLineCompare { stroke: var(--mmab-avg-stroke); stroke-width: 1.5; opacity: 0.5; }

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
      .tt-grid {
        display: grid;
        grid-template-columns: auto auto auto;
        column-gap: 12px;
        row-gap: 4px;
        align-items: baseline;
      }
      .tt-head {
        font-weight: 600;
        opacity: 0.95;
      }
      .tt-sub {
        opacity: 0.8;
        font-size: 11px;
      }
      .tt-label { opacity: 0.9; }
      .tt-val { font-weight: 700; text-align: right; white-space: nowrap; }
      .tt-title { font-weight: 500; margin-bottom: 4px; font-size: 13px; opacity: 0.9; }
      .tt-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 2px; }
      .tt-row .v { font-weight: 700; }
      .err { color: var(--error-color, #db4437); font-size: 14px; }
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:d.temperature,preset:"temperature",color_by:"max",bar_color_mode:"solid",listen_energy_date_selection:!0,collection_key:void 0,default_ws_period:"day",shared_period_mode:!1,debug:!1}}setConfig(t){if(!t||!t.entity)throw new Error("entity is required");const e=this._config;var i;if(this._config={...F.getStubConfig(),...t},this.__activeThresholds=(i=this._config.thresholds,(Array.isArray(i)&&i.length?i:d.temperature).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt)),!this._selection?.wsPeriod){const t=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(t)?t:"day"}}this._data=null,this._compareData=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.__lastCompareFetchKey="",this.__pendingFetchKey="",this.__fetchRequestId+=1,!e||e.listen_energy_date_selection===this._config.listen_energy_date_selection&&e.collection_key===this._config.collection_key||this._clearEnergySubscription(),this.hass&&this._subscribeToEnergy(),this._config.shared_period_mode?this._setupSharedPeriodMode():this._teardownSharedPeriodMode(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(t){return t?this.hass?.states?.[t]:null}_unit(t){return this._stateObj(t)?.attributes?.unit_of_measurement||""}shouldUpdate(t){if(this.__visibilityUpdate)return this.__visibilityUpdate=!1,!0;if(!this.__isVisible&&this.hasUpdated)return!1;if(1!==t.size||!t.has("hass"))return!0;const e=t.get("hass");if(!e)return!0;if(!this._data&&!this._loading)return!0;const i=this._config?.entity,o=e.states?.[i],s=this.hass?.states?.[i];return o&&s?o.attributes?.unit_of_measurement!==s.attributes?.unit_of_measurement||o.attributes?.friendly_name!==s.attributes?.friendly_name:o!==s}_setupResizeObserver(){this.__ro||this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".chart");t&&!this.__ro&&this.isConnected&&(this.__ro=new ResizeObserver(t=>{const e=t?.[0]?.contentRect;if(!e)return;this.__pointerGeometry=null;const i=Math.max(320,Math.round(e.width)),o=Math.max(240,Math.round(e.height));i===this._size.w&&o===this._size.h||(this._size={w:i,h:o})}),this.__ro.observe(t))})}connectedCallback(){super.connectedCallback(),"undefined"==typeof IntersectionObserver||this.__intersectionObserver||(this.__intersectionObserver=new IntersectionObserver(t=>{const e=t.some(t=>t.isIntersecting);if(e!==this.__isVisible)if(this.__isVisible=e,this.__visibilityUpdate=!0,e)this._subscribeToEnergy(),this._fetchStatsIfNeeded(),this.requestUpdate(),this._setupResizeObserver();else{try{this.__ro?.disconnect()}catch{}this.__ro=null,this._clearEnergySubscription(),this.__fetchRequestId+=1,this.__pendingFetchKey="",this._loading=!1,this._hover=null,this.requestUpdate()}},{rootMargin:"200px 0px"}),this.__intersectionObserver.observe(this)),this._setupResizeObserver(),this.hass&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded()),this._setupSharedPeriodMode()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null;try{this.__intersectionObserver?.disconnect()}catch{}this.__intersectionObserver=null,"undefined"!=typeof IntersectionObserver&&(this.__isVisible=null),this.__pointerGeometry=null,this.__tooltipElement=null,this._clearEnergySubscription(),this.__fetchRequestId+=1,this.__pendingFetchKey="",this._loading=!1,this._teardownSharedPeriodMode(),super.disconnectedCallback()}_clearEnergySubscription(){const t=this._energySubscription;this._energySubscription=null,this._energyLookupTimer&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null);try{"function"==typeof t?t():t&&"function"==typeof t.then&&t.then(t=>{"function"==typeof t&&t()})}catch(t){console.warn("[MMAB] Failed to unsubscribe Energy collection:",t)}}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.__isVisible&&this.hass&&this._config?.listen_energy_date_selection)try{if(!this._energySubscription){const t=l(this.hass,this._config.collection_key);if(t)this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=t.subscribe(t=>this._handleEnergyChange(t)),this._handleEnergyChange(t),this._energyLookupTimer&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null);else if(!this._energyLookupTimer){let t=0;this._energyLookupTimer=setInterval(()=>{t+=1;const e=l(this.hass,this._config?.collection_key);e?(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null,this._energySubscription||(this._config?.debug&&console.info("[MMAB] Energy Collection found after wait."),this._energySubscription=e.subscribe(t=>this._handleEnergyChange(t)),this._handleEnergyChange(e))):t>=30&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null,this._config?.debug&&console.info("[MMAB] Energy Collection not found.",n(this.hass,this._config?.collection_key)))},1e3)}}}catch(t){console.warn("[MMAB] Failed to subscribe:",t)}}_handleEnergyChange(t){if(!t)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",t);const e=function(t){const e=t?.period??t?.range??t?.date_selection??t?.dateSelection??t?.energy_date_selection??t?.energyDateSelection??t,i=w(e?.start??e?.start_time??e?.startTime??e?.start_date??e?.startDate??e?.from??t?.start??t?.start_time??t?.startTime??t?.start_date??t?.startDate??t?.from,e?.end??e?.end_time??e?.endTime??e?.end_date??e?.endDate??e?.to??t?.end??t?.end_time??t?.endTime??t?.end_date??t?.endDate??t?.to);return i?{startIso:i.startIso,endIso:i.endIso,start:i.start,end:i.end}:null}(t);if(!e)return;const i=function(t){if(!t?.start||!t?.end)return"day";const e=(t.end-t.start)/36e5;return e<=48?"hour":e<=840?"day":"month"}(e),o={startIso:e.startIso,endIso:e.endIso,wsPeriod:i},s=o.startIso===(this._selection?.startIso||"")&&o.endIso===(this._selection?.endIso||"")&&o.wsPeriod===(this._selection?.wsPeriod||""),r=function(t){const e=t?.compare||t?.compare_range||t?.compareRange||t?.compare_period||t?.comparePeriod,i=w(e?.start??e?.start_time??e?.startTime??t?.compare_start??t?.compareStart??t?.startCompare??t?.compare_from??t?.compareFrom,e?.end??e?.end_time??e?.endTime??t?.compare_end??t?.compareEnd??t?.endCompare??t?.compare_to??t?.compareTo);return i?{startIso:i.startIso,endIso:i.endIso}:null}(t),a=r?{startIso:r.startIso,endIso:r.endIso,wsPeriod:i}:{startIso:"",endIso:"",wsPeriod:""},n=a.startIso===(this._compareSelection?.startIso||"")&&a.endIso===(this._compareSelection?.endIso||"")&&a.wsPeriod===(this._compareSelection?.wsPeriod||"");s&&n||(this._selection=o,this._compareSelection=a,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(t){this._periodMode!==t&&(this._periodMode=t,this._broadcastSharedPeriodMode(t),this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setColorBy(t){if(!["min","average","max"].includes(t))return;if((this._config?.color_by||"max")===t)return;const e={...this._config||{},color_by:t};this._config=e,I(this,"config-changed",{config:e}),this.requestUpdate()}_setupSharedPeriodMode(){if(!this._config?.shared_period_mode)return;if(this.__sharedPeriodHandler)return;const t=t=>{const e=t?.detail?.mode;"day"!==e&&"month"!==e&&"week"!==e||this._periodMode!==e&&(this._periodMode=e,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())};this.__sharedPeriodHandler=t,window.addEventListener("mmab:period-mode",t);try{const t=localStorage.getItem("mmab_shared_period_mode");"day"!==t&&"month"!==t&&"week"!==t||this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}catch{}}_teardownSharedPeriodMode(){this.__sharedPeriodHandler&&(window.removeEventListener("mmab:period-mode",this.__sharedPeriodHandler),this.__sharedPeriodHandler=null)}_broadcastSharedPeriodMode(t){if(this._config?.shared_period_mode){try{localStorage.setItem("mmab_shared_period_mode",t)}catch{}window.dispatchEvent(new CustomEvent("mmab:period-mode",{detail:{mode:t}}))}}_generateTimeline(t,e,i,o){const s=[];let r=new Date(t);const a=new Date(e),n=[...o].sort((t,e)=>t.start-e.start);let l=0,c=0;for(;r<a&&c<1e3;){let t;c++,t="hour"===i?u(r,1):"month"===i?g(r,1):p(r,"week"===i?7:1);let e=null;for(;l<n.length&&n[l].start<r;)l++;if(l<n.length){const i=n[l];i.start<t&&(e=i,l++)}e?s.push({...e,start:new Date(r),isEmpty:!1}):s.push({start:new Date(r),min:null,max:null,mean:null,isEmpty:!0}),r=t}return s}async _fetchStatsForRange(t,e,i,o,s){s?.debug&&console.info(`[MMAB] Fetching ${o} for ${e} -> ${i}`);const r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:e,end_time:i,statistic_ids:[t],period:o,types:["mean","min","max"]}),a=(r?.[t]||[]).map(t=>({start:new Date(t.start),min:isFinite(t.min)?Number(t.min):null,max:isFinite(t.max)?Number(t.max):null,mean:isFinite(t.mean)?Number(t.mean):null,isEmpty:!1})).filter(t=>t.start instanceof Date&&!isNaN(t.start)),n=new Date(e);return this._generateTimeline(n,i,o,a)}async _fetchStatsIfNeeded(){if(!this.__isVisible)return;const t=this._config||{},e=t.entity;if(!this.hass||!e)return;let i=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase(),o=i;"month"===i?o="week"===this._periodMode?"week":"month":"day"===i&&(o="week"===this._periodMode?"week":"day"),["hour","day","week","month"].includes(o)||(o="day");let s=String(this._selection?.startIso||""),r=String(this._selection?.endIso||"");const a=!0===t.use_trailing;if(a||!s||!r){const e=new Date;let i,n;if(a){const a={hour:24,day:7,week:4,month:12},l=Number(t.trailing_periods)||a[o]||7;if("hour"===o)n=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),0,0,0),i=u(n,-l);else if("month"===o)n=new Date(e.getFullYear(),e.getMonth(),1),i=g(n,-l);else if("week"===o){const t=e.getDay();n=_(p(e,-(0===t?6:t-1))),i=p(n,7*-l)}else n=_(e),i=p(n,-l);n=e,s=i.toISOString(),r=n.toISOString()}else i=new Date(e.getFullYear(),e.getMonth(),1),s=i.toISOString(),r=new Date(e.getFullYear(),e.getMonth()+1,1).toISOString()}const n=`${e}|${o}|${s}|${r}`;let l=this._compareSelection?.startIso&&this._compareSelection?.endIso?{startIso:this._compareSelection.startIso,endIso:this._compareSelection.endIso}:null;l&&l.startIso===s&&l.endIso===r&&(l=null);const c=l?`${e}|${o}|${l.startIso}|${l.endIso}`:"",d=!(this.__lastFetchKey===n&&Array.isArray(this._data)&&this._data.length>0),h=!!l&&!(this.__lastCompareFetchKey===c&&Array.isArray(this._compareData)&&this._compareData.length>0);if(l||!this._compareData&&!this.__lastCompareFetchKey||(this._compareData=null,this.__lastCompareFetchKey="",this.requestUpdate()),!d&&!h)return;const m=`${n}|${c}`;if(this.__pendingFetchKey===m)return;const f=++this.__fetchRequestId;this.__pendingFetchKey=m,this._loading=!0,this._err=null;try{const i=d?this._fetchStatsForRange(e,s,r,o,t):Promise.resolve(null),a=l&&h?this._fetchStatsForRange(e,l.startIso,l.endIso,o,t).then(t=>({data:t,error:null})).catch(t=>({data:null,error:t})):Promise.resolve(null),[m,_]=await Promise.all([i,a]);if(f!==this.__fetchRequestId)return;if(m&&(this._data=m,this.__lastFetchKey=n),_?_.error?(this._compareData=null,this.__lastCompareFetchKey="",console.warn("[MMAB] compare fetch error",_.error)):(this._compareData=_.data,this.__lastCompareFetchKey=c):l||(this._compareData=null,this.__lastCompareFetchKey=""),f!==this.__fetchRequestId)return;this.__pendingFetchKey="",this._loading=!1,this.requestUpdate()}catch(t){if(f!==this.__fetchRequestId)return;this.__pendingFetchKey="",this._loading=!1,this._err=String(t?.message||t),console.warn("[MMAB] fetch error",t),this.requestUpdate()}}_computePlotGeometry(t,e){const i=Math.max(10,t-40-10),o=Math.max(10,e-10-30),s=Math.max(1,(this._data||[]).length),r=i/s;let a=.65;s>40&&(a=.8);const n=Math.max(1,r*a);return{x0:40,y0:10,plotW:i,plotH:o,n:s,barStep:r,barW:n,barXPad:(r-n)/2}}_onMove(t){if(!Array.isArray(this._data)||!this._data.length)return;let e=this.__pointerGeometry;if(!e){const i=t.currentTarget.getBoundingClientRect(),o=Math.max(500,this._size?.w||i.width);e={rect:i,scaleX:o/i.width,plot:this._computePlotGeometry(o,Math.max(240,this._size?.h||i.height))},this.__pointerGeometry=e}const i=e.rect,o=t.clientX-i.left,s=t.clientY-i.top,r=o*e.scaleX,a=e.plot,{x0:n,plotW:l,n:c,barStep:d}=a;if(r<n||r>n+l)return void(this._hover=null);const h=m(Math.floor((r-n)/d),0,c-1);if(this._hover?.idx===h){this._hover.px=o,this._hover.py=s;const t=this.__tooltipElement?.isConnected?this.__tooltipElement:this.__tooltipElement=this.renderRoot?.querySelector(".tooltip");return void(t&&(t.style.left=`${o}px`,t.style.top=`${s}px`))}this._hover={idx:h,px:o,py:s}}_onLeave(){this.__pointerGeometry=null,this.__tooltipElement=null,this._hover=null}render(){const t=this._config||{},e=(t.language||"cs").toLowerCase(),i=(t.date_format||"eu").toLowerCase(),s=c[e]||c.cs;if(!t.entity)return o`<ha-card><div class="wrap"><div class="err">${s.missing}</div></div></ha-card>`;const n=Number(t.height||320);if(!this.__isVisible)return o`<ha-card aria-hidden="true"><div style="height:${n+68}px"></div></ha-card>`;const l=this._stateObj(t.entity),d=this._unit(t.entity),_=t.name||(l?.attributes?.friendly_name??t.entity),u=Number.isFinite(Number(t.decimals))?Number(t.decimals):1,p=Array.isArray(this._data)?this._data:[],g=Array.isArray(this._compareData)?this._compareData:[],f=g.some(t=>!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)),b=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase();let v=b;"month"===b?v="week"===this._periodMode?"week":"month":"day"===b&&(v="week"===this._periodMode?"week":"day");const $="day"===b||"month"===b,w="day"===b?"day":"month",M="day"===b?s.days:s.months;let F=1/0,I=-1/0,C=!1;const D=t=>{F=Math.min(F,t.min),I=Math.max(I,t.max),C=!0};for(const t of p)!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)&&D(t);for(const t of g)!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)&&D(t);C||(F=0,I=1);const T=Number(t.y_padding_ratio??.08),E=I-F||1;F-=E*T,I+=E*T;const P=Math.max(500,this._size?.w||900),N=Math.max(240,this._size?.h||320),A=this._computePlotGeometry(P,N),{x0:O,y0:L,plotW:z,plotH:U,n:B,barStep:K,barW:R,barXPad:q}=A,H=f?Math.max(1,Math.round(.08*R)):0,Y=f?Math.max(1,Math.floor((R-H)/2)):R,G=m(Math.round(U/50)+1,4,8),V=function(t,e,i=6){if(!isFinite(t)||!isFinite(e)||t===e){const e=isFinite(t)?t:0;return{min:e-1,max:e+1,step:1,ticks:[e-1,e,e+1]}}const o=(e-t)/Math.max(1,i-1),s=Math.pow(10,Math.floor(Math.log10(o))),r=o/s;let a;a=r>=7.5?10*s:r>=3.5?5*s:r>=1.5?2*s:1*s;const n=Math.floor(t/a)*a,l=Math.ceil(e/a)*a,c=[];for(let t=n;t<=l+.5*a;t+=a)c.push(t);return{min:n,max:l,step:a,ticks:c}}(F,I,G),j=t=>L+(V.max-t)*(U/(V.max-V.min)),W=(()=>{const t=V.step;return isFinite(t)?Math.abs(t-Math.round(t))<1e-9?0:t>=.5?1:Math.min(3,u):u})(),J=!1!==t.show_x_labels,X=!1!==t.show_y_labels,Q=!1!==t.show_y_unit,Z="hour"===v||"day"===v?4:"month"===v?1:"week"===v?B>20?4:1:4,tt=this._hover,et=tt&&p[tt.idx]?p[tt.idx]:null,it=tt&&g[tt.idx]?g[tt.idx]:null,ot=et&&!et.isEmpty,st=it&&!it.isEmpty,rt=ot?k(p,tt.idx,v):null,at=st?k(g,tt.idx,v):null,nt=ot?S(et.start,rt,v,i):{top:"",bottom:""},lt=st?S(it.start,at,v,i):{top:"",bottom:""},ct=t=>isFinite(t)?Number(t).toFixed(u):"–",dt=this.__activeThresholds,ht=["max","average","min"].includes(t.color_by)?t.color_by:"max",mt="gradient"===t.bar_color_mode?function(t,e,i){if(!isFinite(t)||!isFinite(e))return[];const o=Math.min(t,e),s=Math.max(t,e),r=s-o;if(r<=0)return[];const a=[{offset:0,color:x(o,i)}];for(const t of i)t.lt>o&&t.lt<s&&a.push({offset:(t.lt-o)/r*100,color:t.color});return a.push({offset:100,color:x(s,i)}),a}(V.min,V.max,dt):[],_t=mt.length?"url(#mmab-chart-gradient)":null;return o`
      <ha-card>
        <div class="wrap" style="--mmab-height:${n}px;">
          <div class="head">
            <div class="title" title="${_}">${_}</div>

            <div class="head-actions">
              <div class="toggles">
                <div class="toggle-btn ${"min"===ht?"active":""}"
                     @click=${()=>this._setColorBy("min")}>${s.min}</div>
                <div class="toggle-btn ${"average"===ht?"active":""}"
                     @click=${()=>this._setColorBy("average")}>${s.avg}</div>
                <div class="toggle-btn ${"max"===ht?"active":""}"
                     @click=${()=>this._setColorBy("max")}>${s.max}</div>
              </div>
              ${$?o`
                <div class="toggles">
                  <div class="toggle-btn ${v===w?"active":""}"
                       @click=${()=>this._setPeriodMode(w)}>${M}</div>
                  <div class="toggle-btn ${"week"===this._periodMode?"active":""}"
                       @click=${()=>this._setPeriodMode("week")}>${s.weeks}</div>
                </div>
              `:a}
            </div>
          </div>

          ${this._err?o`<div class="err">${this._err}</div>`:a}

          <div class="chart"
               @mousemove=${this._onMove}
               @mouseleave=${this._onLeave}>
            <svg viewBox="0 0 ${P} ${N}" role="img" aria-label="Min max avg bar chart">
              ${_t?r`
                <defs>
                  <linearGradient id="mmab-chart-gradient" gradientUnits="userSpaceOnUse"
                                  x1="0" y1="${j(V.min)}" x2="0" y2="${j(V.max)}">
                    ${mt.map(t=>r`<stop offset="${t.offset}%" stop-color="${t.color}"></stop>`)}
                  </linearGradient>
                </defs>
              `:a}
              ${Q&&d?r`<text class="yUnit" x="${O-5}" y="${L-6}" text-anchor="end">${d}</text>`:a}

              ${V.ticks.map((t,e)=>{const i=j(t),o=0===e||e===V.ticks.length-1;return r`
                  <line class="${o?"gridHStrong":"gridH"}" x1="${O}" y1="${i}" x2="${O+z}" y2="${i}"></line>
                  ${X?r`<text class="tickText" x="${O-8}" y="${i+4}" text-anchor="end">${Number(t).toFixed(W)}</text>`:a}
                `})}
              ${(()=>{const t=[];for(let e=0;e<=B;e++)if(e%Z===0){const i=O+e*K+K/2;t.push(r`<line class="gridV" x1="${i}" y1="${L}" x2="${i}" y2="${L+U}"></line>`)}return t})()}

              ${f?p.map((e,i)=>{const o=g[i];if(!o||o.isEmpty)return a;const s=isFinite(o.min)?o.min:null,n=isFinite(o.max)?o.max:null,l=isFinite(o.mean)?o.mean:null;if(null==s||null==n)return a;const c=(t=>O+t*K+q)(i),d=x("min"===ht?s:"average"===ht?l??n:n,dt),h=j(n),m=j(s),_=Math.max(2,m-h),u=Number(t.bar_radius??4),p=null==l?null:j(l);return r`
                  <rect class="compareBar" x="${c}" y="${h}" width="${Y}" height="${_}"
                        fill="${_t||d}" stroke="${d}" rx="${u}" ry="${u}"></rect>
                  ${null==p?a:r`
                    <line class="avgLineCompare" x1="${c+2}" y1="${p}" x2="${c+Y-2}" y2="${p}"></line>
                  `}
                `}):a}

              ${p.map((e,i)=>{if(e.isEmpty)return a;const o=isFinite(e.min)?e.min:null,s=isFinite(e.max)?e.max:null,n=isFinite(e.mean)?e.mean:null;if(null==o||null==s)return a;const l=(t=>O+t*K+q+(f?Y+H:0))(i),c=x("min"===ht?o:"average"===ht?n??s:s,dt),d=j(s),h=j(o),m=Math.max(2,h-d),_=Number(t.bar_radius??4),u=null==n?null:j(n),p=tt&&tt.idx===i;return r`
                  <rect class="bar ${p?"active":""}" x="${l}" y="${d}" width="${Y}" height="${m}"
                        fill="${_t||c}" stroke="${c}" rx="${_}" ry="${_}"></rect>
                  ${null==u?a:r`
                    <line class="avgLine" x1="${l+2}" y1="${u}" x2="${l+Y-2}" y2="${u}"></line>
                  `}
                `})}

              ${J?p.map((t,o)=>{if(o%Z!==0)return a;return r`<text class="xText" x="${O+o*K+K/2}" y="${L+U+16}" text-anchor="middle">${function(t,e,i,o="cs",s="eu"){if(!t)return"";if("month"===e){const e=0===i||0===t.getMonth();try{return e?new Intl.DateTimeFormat(o,{month:"long",year:"numeric"}).format(t):new Intl.DateTimeFormat(o,{month:"long"}).format(t)}catch(e){return`${h(t.getMonth()+1)}/${String(t.getFullYear()).slice(-2)}`}}return"hour"===e?`${h(t.getHours())}:00`:y(t,s)}(t.start,v,o,e,i)}</text>`}):a}

              ${tt?(()=>{const t=O+tt.idx*K+K/2;return r`<line class="hoverLine" x1="${t}" y1="${L}" x2="${t}" y2="${L+U}"></line>`})():a}

              <rect class="overlay" x="${O}" y="${L}" width="${z}" height="${U}"></rect>
            </svg>

            ${ot||f&&st?o`
              <div class="tooltip" style="left:${tt.px}px; top:${tt.py}px">
                ${f&&st?o`
                  <div class="tt-grid">
                    <div></div>
                    <div class="tt-head">${nt.top||""}</div>
                    <div class="tt-head">${lt.top||""}</div>
                    ${nt.bottom||lt.bottom?o`
                      <div></div>
                      <div class="tt-sub">${nt.bottom||""}</div>
                      <div class="tt-sub">${lt.bottom||""}</div>
                    `:a}
                    <div class="tt-label">${s.max}</div>
                    <div class="tt-val">${ct(et?.max)}${d?` ${d}`:""}</div>
                    <div class="tt-val">${ct(it?.max)}${d?` ${d}`:""}</div>
                    <div class="tt-label">${s.avg}</div>
                    <div class="tt-val">${ct(et?.mean)}${d?` ${d}`:""}</div>
                    <div class="tt-val">${ct(it?.mean)}${d?` ${d}`:""}</div>
                    <div class="tt-label">${s.min}</div>
                    <div class="tt-val">${ct(et?.min)}${d?` ${d}`:""}</div>
                    <div class="tt-val">${ct(it?.min)}${d?` ${d}`:""}</div>
                  </div>
                `:o`
                  <div class="tt-title">${nt.top||""}</div>
                  ${nt.bottom?o`<div class="tt-row"><span class="k">${nt.bottom}</span></div>`:a}
                  <div class="tt-row"><span class="k">${s.max}</span><span class="v">${ct(et.max)}${d?` ${d}`:""}</span></div>
                  <div class="tt-row"><span class="k">${s.avg}</span><span class="v">${ct(et.mean)}${d?` ${d}`:""}</span></div>
                  <div class="tt-row"><span class="k">${s.min}</span><span class="v">${ct(et.min)}${d?` ${d}`:""}</span></div>
                `}
              </div>
            `:a}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}customElements.define("minmax-avg-bar-card-editor",class extends i{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config={...t||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=d.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(t){t.stopPropagation();let e=t.detail.value;const i=this._config?.preset,o=e?.preset;if(o&&o!==i){const t=d[o]||d.temperature;e={...e,thresholds:t.map(t=>({...t}))}}this._config=e,I(this,"config-changed",{config:e})}_setThresholds(t){const e=(t||[]).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt),i={...this._config||{}};i.thresholds=e.length?e:d.temperature,this._config=i,I(this,"config-changed",{config:i})}_updateThreshold(t,e){const i=(this._config.thresholds||[]).map(t=>({...t}));i[t]={...i[t]||{},...e||{}},this._setThresholds(i)}_addThreshold(){const t=(this._config.thresholds||[]).map(t=>({...t}));t.push({lt:(Number(t[t.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(t)}_removeThreshold(t){const e=(this._config.thresholds||[]).map(t=>({...t}));e.splice(t,1),this._setThresholds(e.length?e:d.temperature)}static get styles(){return s`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){const t=c[this._config?.language||"cs"]||c.cs;return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Temperature (C)"},{value:"temperature_f",label:"Temperature (F)"},{value:"beaufort",label:"Wind (Beaufort)"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"max",label:"Maximum"},{value:"average",label:"Average"},{value:"min",label:"Minimum"}]}}},{name:"bar_color_mode",selector:{select:{mode:"dropdown",options:[{value:"solid",label:t.color_mode_solid},{value:"gradient",label:t.color_mode_gradient}]}},label:t.color_mode},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"date_format",selector:{select:{mode:"dropdown",options:[{value:"eu",label:"European (26. 1.)"},{value:"intl",label:"International (26-Jan)"}]}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"collection_key",selector:{text:{}}},{name:"shared_period_mode",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"use_trailing",selector:{boolean:{}}},{name:"trailing_periods",selector:{number:{min:1,max:365,step:1,mode:"box"}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass||!this._config)return a;const t=c[this._config.language||"cs"]||c.cs,e=this._config.thresholds||d.temperature,i=!!customElements.get("ha-color-picker"),s=this._config.color_by||"max",r="min"===s?t.color_by_min:"average"===s?t.color_by_average:t.color_by_max;return o`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${t.thresholds} (${t.thresholds_by} ${r})</div><mwc-button @click=${()=>this._addThreshold()}>${t.add}</mwc-button></div>
            <div class="rows">
                ${e.map((e,s)=>{const r=e.color||"",a=function(t,e){try{const i=document.createElement("span");i.style.position="absolute",i.style.left="-9999px",i.style.top="-9999px",i.style.opacity="0",i.style.color=String(t||""),(e?.shadowRoot||document.body).appendChild(i);const o=getComputedStyle(i).color;i.remove();const s=o.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!s)return"";const r=t=>String(t.toString(16)).padStart(2,"0");return`#${r(Number(s[1]))}${r(Number(s[2]))}${r(Number(s[3]))}`}catch{return""}}(r,this)||"#3f51b5";return o`
                        <div class="row">
                            <ha-textfield label="${t.lt}" type="number" .value=${String(e.lt)} @change=${t=>this._updateThreshold(s,{lt:Number(t.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${r};"></div>
                                ${i?o`<ha-color-picker .value=${a} @value-changed=${t=>this._updateThreshold(s,{color:t.detail?.value||a})}></ha-color-picker>`:o`<input type="color" .value=${a} @input=${t=>this._updateThreshold(s,{color:t.target.value})} />`}
                                <ha-textfield label="${t.color}" .value=${r} @change=${t=>this._updateThreshold(s,{color:t.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(s)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}});const I=(t,e,i={},o={})=>{const s=new Event(e,{bubbles:o?.bubbles??!0,cancelable:o?.cancelable??!1,composed:o?.composed??!0});return s.detail=i,t.dispatchEvent(s),s};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",F);