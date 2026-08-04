let t,e=!1;try{t=await import("lit")}catch{t=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm"),e=!0}const{LitElement:o,html:r,css:a,svg:i,nothing:s}=t;console.info(`[MMAB] v1.3.5 loaded (Lit: ${e?"CDN":"local"})`);const n=(t,e)=>{const o=[];e&&o.push(`_${e}`),t?.panelUrl&&o.push(`_energy_${t.panelUrl}`),o.push("_energy");for(const e of Object.keys(t?.connection||{}))e.startsWith("_energy")&&!o.includes(e)&&o.push(e);return o},l=(t,e)=>{if(!t?.connection)return null;for(const o of n(t,e)){const e=t.connection[o];if(e?.start&&e?.end)return e;if(e&&"function"==typeof e.subscribe)return e}return null},c={cs:{missing:"Chybí konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevné rozsahy",thresholds_by:"podle",add:"Přidat",remove:"Odebrat",lt:"méně než",color:"barva",days:"Dny",months:"Měsíce",weeks:"Týdny",preset:"Přednastavený styl",color_by:"Barva podle",color_by_max:"Maximum",color_by_average:"Průměr",color_by_min:"Minimum",color_mode:"Výplň baru",color_mode_solid:"Jedna barva",color_mode_gradient:"Plynulý přechod",use_trailing:"Posuvné období",trailing_periods:"Počet období"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges",thresholds_by:"by",add:"Add",remove:"Remove",lt:"less than",color:"color",days:"Days",months:"Months",weeks:"Weeks",preset:"Style Preset",color_by:"Color by",color_by_max:"Maximum",color_by_average:"Average",color_by_min:"Minimum",color_mode:"Bar fill",color_mode_solid:"Single color",color_mode_gradient:"Smooth gradient",use_trailing:"Trailing period",trailing_periods:"Number of periods"}},d={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],temperature_f:[{lt:5,color:"#b968f4"},{lt:32,color:"#039be5"},{lt:68,color:"#43a047"},{lt:77,color:"#fdd835"},{lt:86,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},h=t=>String(t).padStart(2,"0"),m=(t,e,o)=>Math.min(o,Math.max(e,t)),p=t=>new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),u=(t,e)=>{const o=new Date(t);return o.setTime(o.getTime()+3600*e*1e3),o},g=(t,e)=>{const o=new Date(t);return o.setDate(o.getDate()+e),o},_=(t,e)=>{const o=new Date(t);return o.setMonth(o.getMonth()+e),o},f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function y(t,e="eu"){return"intl"===e?`${t.getDate()}-${f[t.getMonth()]}`:`${t.getDate()}. ${t.getMonth()+1}.`}function b(t,e="eu"){return"intl"===e?`${t.getDate()}-${f[t.getMonth()]}-${t.getFullYear()}`:`${t.getDate()}. ${t.getMonth()+1}. ${t.getFullYear()}`}function v(t){return`${h(t.getHours())}:${h(t.getMinutes())}`}function x(t,e){if(!isFinite(t))return"var(--disabled-text-color)";const o=(Array.isArray(e)&&e.length?e:d.temperature).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt);for(const e of o)if(t<e.lt)return e.color;return o.length?o[o.length-1].color:"var(--primary-color)"}function $(t,e,o){if(!isFinite(t)||!isFinite(e))return[];const r=Math.min(t,e),a=Math.max(t,e),i=a-r;if(i<=0)return[];const s=(Array.isArray(o)&&o.length?o:d.temperature).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt),n=[{offset:0,color:x(r,s)}];for(const t of s)t.lt>r&&t.lt<a&&n.push({offset:(t.lt-r)/i*100,color:t.color});return n.push({offset:100,color:x(a,s)}),n}function w(t){if(null==t||""===t)return"";if(t instanceof Date)return t.toISOString();if("function"==typeof t?.toJSDate)try{const e=t.toJSDate();if(e instanceof Date&&!isNaN(e))return e.toISOString()}catch{}if("function"==typeof t?.toISOString)try{return t.toISOString()}catch{}if("number"==typeof t){const e=new Date(t);return isNaN(e)?"":e.toISOString()}if("function"==typeof t?.valueOf){const e=t.valueOf();if("number"==typeof e&&isFinite(e)){const t=new Date(e);if(!isNaN(t))return t.toISOString()}}return String(t)}function k(t,e){const o=w(t),r=w(e);if(!o||!r)return null;const a=new Date(o),i=new Date(r);return isNaN(a)||isNaN(i)?null:{startIso:o,endIso:r,start:a,end:i}}function M(t,e,o){const r=t[e];if(!r?.start)return null;if(e<t.length-1&&t[e+1]?.start)return t[e+1].start;const a=r.start;return"hour"===o?u(a,1):"day"===o?g(a,1):"week"===o?g(a,7):"month"===o?_(a,1):g(a,1)}function S(t,e,o,r="eu",a="en"){if(!t)return"";if(!e)return b(t,r);if("hour"===o){return t.toDateString()===e.toDateString()?`${y(t,r)} ${v(t)}–${v(e)}`:`${b(t,r)} ${v(t)} – ${b(e,r)} ${v(e)}`}if("day"===o)return b(t,r);if("month"===o)try{return new Intl.DateTimeFormat(a,{month:"long",year:"numeric"}).format(t)}catch{return b(t,r)}return t.toDateString()===e.toDateString()?b(t,r):`${y(t,r)}–${y(e,r)}`}function F(t,e,o,r="eu"){if(!t)return{top:"",bottom:""};if("week"===o){const a=function(t){const e=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())),o=e.getUTCDay()||7;e.setUTCDate(e.getUTCDate()+4-o);const r=new Date(Date.UTC(e.getUTCFullYear(),0,1)),a=Math.ceil(((e-r)/864e5+1)/7);return{year:e.getUTCFullYear(),week:a}}(t);return{top:`${a.year} / W${h(a.week)}`,bottom:S(t,e,o,r)}}return"month"===o?{top:String(t.getFullYear()),bottom:S(t,e,o,r)}:{top:S(t,e,o,r),bottom:""}}class D extends o{static get properties(){return{hass:{},_config:{},_data:{state:!0},_loading:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_compareSelection:{state:!0},_compareData:{state:!0},_periodMode:{state:!0},__lastFetchKey:{state:!0},__lastCompareFetchKey:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._compareSelection={startIso:"",endIso:"",wsPeriod:""},this._compareData=null,this._periodMode="month",this.__ro=null,this._energySubscription=null,this._energyDirectSubscription=null,this._energyPrefsLoaded=!1,this._energyLookupTimer=null,this.__lastCompareFetchKey="",this.__sharedPeriodHandler=null}static get styles(){return a`
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
        --mmab-compare-fill: rgba(160, 160, 160, 0.3);
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

      .compareFill { fill-opacity: var(--mmab-compare-fill-opacity); }
      .compareStroke {
        stroke-opacity: var(--mmab-compare-stroke-opacity);
        stroke-width: var(--mmab-compare-stroke-width);
        stroke-dasharray: var(--mmab-compare-stroke-dash);
        fill: none;
      }

      .avgShadow { stroke: var(--mmab-avg-shadow); stroke-width: 3; opacity: 0.5; }
      .avgLine { stroke: var(--mmab-avg-stroke); stroke-width: 1.5; }
      .avgShadowCompare { stroke: var(--mmab-avg-shadow); stroke-width: 3; opacity: 0.25; }
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
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:d.temperature,preset:"temperature",color_by:"max",bar_color_mode:"solid",listen_energy_date_selection:!0,collection_key:void 0,default_ws_period:"day",shared_period_mode:!1,debug:!1}}setConfig(t){if(!t||!t.entity)throw new Error("entity is required");if(this._config={...D.getStubConfig(),...t},!this._selection?.wsPeriod){const t=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(t)?t:"day"}}this._data=null,this._compareData=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.__lastCompareFetchKey="",this.hass&&this._subscribeToEnergy(),this._setupSharedPeriodMode(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(t){return t?this.hass?.states?.[t]:null}_unit(t){return this._stateObj(t)?.attributes?.unit_of_measurement||""}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".chart");t&&!this.__ro&&(this.__ro=new ResizeObserver(t=>{const e=t?.[0]?.contentRect;if(!e)return;const o=Math.max(320,Math.round(e.width)),r=Math.max(240,Math.round(e.height));o===this._size.w&&r===this._size.h||(this._size={w:o,h:r})}),this.__ro.observe(t))}),this.hass&&this._subscribeToEnergy(),this._setupSharedPeriodMode()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null;const t=this._energySubscription,e=this._energyDirectSubscription;this._energySubscription=null,this._energyDirectSubscription=null,this._energyPrefsLoaded=!1,this._energyLookupTimer&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null);try{"function"==typeof t?t():t&&"function"==typeof t.then&&t.then(t=>{"function"==typeof t&&t()})}catch(t){console.warn("[MMAB] Failed to unsubscribe Energy collection:",t)}try{"function"==typeof e?e():e&&"function"==typeof e.then&&e.then(t=>{"function"==typeof t&&t()})}catch(t){console.warn("[MMAB] Failed to unsubscribe Energy websocket:",t)}this._teardownSharedPeriodMode(),super.disconnectedCallback()}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.hass&&this._config?.listen_energy_date_selection)try{if(!this._energySubscription){const t=l(this.hass,this._config.collection_key);if(t)this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=t.subscribe(t=>this._handleEnergyChange(t)),this._handleEnergyChange(t),this._energyLookupTimer&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null);else if(!this._energyLookupTimer){let t=0;this._energyLookupTimer=setInterval(()=>{t+=1;const e=l(this.hass,this._config?.collection_key);e?(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null,this._energySubscription||(this._config?.debug&&console.info("[MMAB] Energy Collection found after wait."),this._energySubscription=e.subscribe(t=>this._handleEnergyChange(t)),this._handleEnergyChange(e))):t>=30&&(clearInterval(this._energyLookupTimer),this._energyLookupTimer=null,this._config?.debug&&console.info("[MMAB] Energy Collection not found.",n(this.hass,this._config?.collection_key)))},1e3)}}}catch(t){console.warn("[MMAB] Failed to subscribe:",t)}}_handleEnergyChange(t){if(!t)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",t);const e=function(t){const e=t?.period??t?.range??t?.date_selection??t?.dateSelection??t?.energy_date_selection??t?.energyDateSelection??t,o=k(e?.start??e?.start_time??e?.startTime??e?.start_date??e?.startDate??e?.from??t?.start??t?.start_time??t?.startTime??t?.start_date??t?.startDate??t?.from,e?.end??e?.end_time??e?.endTime??e?.end_date??e?.endDate??e?.to??t?.end??t?.end_time??t?.endTime??t?.end_date??t?.endDate??t?.to);return o?{startIso:o.startIso,endIso:o.endIso,start:o.start,end:o.end}:null}(t);if(!e)return;const o=function(t){if(!t?.start||!t?.end)return"day";const e=(t.end-t.start)/36e5;return e<=48?"hour":e<=840?"day":"month"}(e),r={startIso:e.startIso,endIso:e.endIso,wsPeriod:o},a=r.startIso===(this._selection?.startIso||"")&&r.endIso===(this._selection?.endIso||"")&&r.wsPeriod===(this._selection?.wsPeriod||""),i=function(t){const e=t?.compare||t?.compare_range||t?.compareRange||t?.compare_period||t?.comparePeriod,o=k(e?.start??e?.start_time??e?.startTime??t?.compare_start??t?.compareStart??t?.startCompare??t?.compare_from??t?.compareFrom,e?.end??e?.end_time??e?.endTime??t?.compare_end??t?.compareEnd??t?.endCompare??t?.compare_to??t?.compareTo);return o?{startIso:o.startIso,endIso:o.endIso}:null}(t),s=i?{startIso:i.startIso,endIso:i.endIso,wsPeriod:o}:{startIso:"",endIso:"",wsPeriod:""},n=s.startIso===(this._compareSelection?.startIso||"")&&s.endIso===(this._compareSelection?.endIso||"")&&s.wsPeriod===(this._compareSelection?.wsPeriod||"");a&&n||(this._selection=r,this._compareSelection=s,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(t){this._periodMode!==t&&(this._periodMode=t,this._broadcastSharedPeriodMode(t),this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setColorBy(t){if(!["min","average","max"].includes(t))return;if((this._config?.color_by||"max")===t)return;const e={...this._config||{},color_by:t};this._config=e,C(this,"config-changed",{config:e}),this.requestUpdate()}_setupSharedPeriodMode(){if(!this._config?.shared_period_mode)return;if(this.__sharedPeriodHandler)return;const t=t=>{const e=t?.detail?.mode;"day"!==e&&"month"!==e&&"week"!==e||this._periodMode!==e&&(this._periodMode=e,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())};this.__sharedPeriodHandler=t,window.addEventListener("mmab:period-mode",t);try{const t=localStorage.getItem("mmab_shared_period_mode");"day"!==t&&"month"!==t&&"week"!==t||this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}catch{}}_teardownSharedPeriodMode(){this.__sharedPeriodHandler&&(window.removeEventListener("mmab:period-mode",this.__sharedPeriodHandler),this.__sharedPeriodHandler=null)}_broadcastSharedPeriodMode(t){if(this._config?.shared_period_mode){try{localStorage.setItem("mmab_shared_period_mode",t)}catch{}window.dispatchEvent(new CustomEvent("mmab:period-mode",{detail:{mode:t}}))}}_generateTimeline(t,e,o,r){const a=[];let i=new Date(t);const s=new Date(e),n=[...r].sort((t,e)=>t.start-e.start);let l=0,c=0;for(;i<s&&c<1e3;){let t;c++,t="hour"===o?u(i,1):"month"===o?_(i,1):g(i,"week"===o?7:1);let e=null;for(;l<n.length&&n[l].start<i;)l++;if(l<n.length){const o=n[l];o.start<t&&(e=o,l++)}e?a.push({...e,start:new Date(i),isEmpty:!1}):a.push({start:new Date(i),min:null,max:null,mean:null,isEmpty:!0}),i=t}return a}async _fetchStatsForRange(t,e,o,r,a){a?.debug&&console.info(`[MMAB] Fetching ${r} for ${e} -> ${o}`);const i=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:e,end_time:o,statistic_ids:[t],period:r,types:["mean","min","max"]}),s=(i?.[t]||[]).map(t=>({start:new Date(t.start),min:isFinite(t.min)?Number(t.min):null,max:isFinite(t.max)?Number(t.max):null,mean:isFinite(t.mean)?Number(t.mean):null,isEmpty:!1})).filter(t=>t.start instanceof Date&&!isNaN(t.start)),n=new Date(e);return this._generateTimeline(n,o,r,s)}async _fetchStatsIfNeeded(){const t=this._config||{},e=t.entity;if(!this.hass||!e)return;let o=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase(),r=o;"month"===o?r="week"===this._periodMode?"week":"month":"day"===o&&(r="week"===this._periodMode?"week":"day"),["hour","day","week","month"].includes(r)||(r="day");let a=String(this._selection?.startIso||""),i=String(this._selection?.endIso||"");const s=!0===t.use_trailing;if(s||!a||!i){const e=new Date;let o,n;if(s){const s={hour:24,day:7,week:4,month:12},l=Number(t.trailing_periods)||s[r]||7;if("hour"===r)n=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),0,0,0),o=u(n,-l);else if("month"===r)n=new Date(e.getFullYear(),e.getMonth(),1),o=_(n,-l);else if("week"===r){const t=e.getDay();n=p(g(e,-(0===t?6:t-1))),o=g(n,7*-l)}else n=p(e),o=g(n,-l);n=e,a=o.toISOString(),i=n.toISOString()}else o=new Date(e.getFullYear(),e.getMonth(),1),a=o.toISOString(),i=new Date(e.getFullYear(),e.getMonth()+1,1).toISOString()}const n=`${e}|${r}|${a}|${i}`;let l=this._compareSelection?.startIso&&this._compareSelection?.endIso?{startIso:this._compareSelection.startIso,endIso:this._compareSelection.endIso}:null;l&&l.startIso===a&&l.endIso===i&&(l=null);const c=l?`${e}|${r}|${l.startIso}|${l.endIso}`:"",d=!(this.__lastFetchKey===n&&Array.isArray(this._data)&&this._data.length>0),h=!!l&&!(this.__lastCompareFetchKey===c&&Array.isArray(this._compareData)&&this._compareData.length>0);if(l||!this._compareData&&!this.__lastCompareFetchKey||(this._compareData=null,this.__lastCompareFetchKey="",this.requestUpdate()),d||h){this._loading=!0,this._err=null;try{if(d){const o=await this._fetchStatsForRange(e,a,i,r,t);this._data=o,this.__lastFetchKey=n}if(l&&l.startIso===a&&l.endIso===i)this._compareData=null,this.__lastCompareFetchKey="";else if(l&&h)try{const o=await this._fetchStatsForRange(e,l.startIso,l.endIso,r,t);this._compareData=o,this.__lastCompareFetchKey=c}catch(t){this._compareData=null,this.__lastCompareFetchKey="",console.warn("[MMAB] compare fetch error",t)}else l||(this._compareData=null,this.__lastCompareFetchKey="");this._loading=!1,this.requestUpdate()}catch(t){this._loading=!1,this._err=String(t?.message||t),console.warn("[MMAB] fetch error",t),this.requestUpdate()}}}_computePlotGeometry(t,e){const o=Math.max(10,t-40-10),r=Math.max(10,e-10-30),a=Math.max(1,(this._data||[]).length),i=o/a;let s=.65;a>40&&(s=.8);const n=Math.max(1,i*s);return{x0:40,y0:10,plotW:o,plotH:r,n:a,barStep:i,barW:n,barXPad:(i-n)/2}}_onMove(t,e){if(!e||!Array.isArray(this._data)||!this._data.length)return;const o=t.clientX-e.left,r=t.clientY-e.top,a=Math.max(500,this._size?.w||e.width),i=o*(a/e.width),s=this._computePlotGeometry(a,Math.max(240,this._size?.h||e.height)),{x0:n,plotW:l,n:c,barStep:d}=s;if(i<n||i>n+l)return void(this._hover=null);const h=m(Math.floor((i-n)/d),0,c-1);this._hover={idx:h,px:o,py:r}}_onLeave(){this._hover=null}render(){const t=this._config||{},e=(t.language||"cs").toLowerCase(),o=(t.date_format||"eu").toLowerCase(),a=c[e]||c.cs;if(!t.entity)return r`<ha-card><div class="wrap"><div class="err">${a.missing}</div></div></ha-card>`;const n=this._stateObj(t.entity),l=this._unit(t.entity),p=t.name||(n?.attributes?.friendly_name??t.entity),u=Number(t.height||320),g=Number.isFinite(Number(t.decimals))?Number(t.decimals):1,_=Array.isArray(this._data)?this._data:[],f=Array.isArray(this._compareData)?this._compareData:[],b=f.some(t=>!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)),v=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase();let w=v;"month"===v?w="week"===this._periodMode?"week":"month":"day"===v&&(w="week"===this._periodMode?"week":"day");const k="day"===v||"month"===v,S="day"===v?"day":"month",D="day"===v?a.days:a.months;let C=1/0,I=-1/0,T=!1;const E=t=>{C=Math.min(C,t.min),I=Math.max(I,t.max),T=!0};for(const t of _)!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)&&E(t);for(const t of f)!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)&&E(t);T||(C=0,I=1);const P=Number(t.y_padding_ratio??.08),N=I-C||1;C-=N*P,I+=N*P;const A=Math.max(500,this._size?.w||900),L=Math.max(240,this._size?.h||320),B=this._computePlotGeometry(A,L),{x0:z,y0:U,plotW:K,plotH:O,n:H,barStep:Y,barW:R,barXPad:j}=B,q=b?Math.max(1,Math.round(.08*R)):0,W=b?Math.max(1,Math.floor((R-q)/2)):R,G=m(Math.round(O/50)+1,4,8),J=function(t,e,o=6){if(!isFinite(t)||!isFinite(e)||t===e){const e=isFinite(t)?t:0;return{min:e-1,max:e+1,step:1,ticks:[e-1,e,e+1]}}const r=(e-t)/Math.max(1,o-1),a=Math.pow(10,Math.floor(Math.log10(r))),i=r/a;let s;s=i>=7.5?10*a:i>=3.5?5*a:i>=1.5?2*a:1*a;const n=Math.floor(t/s)*s,l=Math.ceil(e/s)*s,c=[];for(let t=n;t<=l+.5*s;t+=s)c.push(t);return{min:n,max:l,step:s,ticks:c}}(C,I,G),V=t=>U+(J.max-t)*(O/(J.max-J.min)),X=(()=>{const t=J.step;return isFinite(t)?Math.abs(t-Math.round(t))<1e-9?0:t>=.5?1:Math.min(3,g):g})(),Q=!1!==t.show_x_labels,Z=!1!==t.show_y_labels,tt=!1!==t.show_y_unit,et="hour"===w||"day"===w?4:"month"===w?1:"week"===w?H>20?4:1:4,ot=this._hover,rt=ot&&_[ot.idx]?_[ot.idx]:null,at=ot&&f[ot.idx]?f[ot.idx]:null,it=rt&&!rt.isEmpty,st=at&&!at.isEmpty,nt=it?M(_,ot.idx,w):null,lt=st?M(f,ot.idx,w):null,ct=it?F(rt.start,nt,w,o):{top:"",bottom:""},dt=st?F(at.start,lt,w,o):{top:"",bottom:""},ht=t=>isFinite(t)?Number(t).toFixed(g):"–",mt=Array.isArray(t.thresholds)?t.thresholds:d.temperature,pt=["max","average","min"].includes(t.color_by)?t.color_by:"max",ut="gradient"===t.bar_color_mode;return r`
      <ha-card>
        <div class="wrap" style="--mmab-height:${u}px;">
          <div class="head">
            <div class="title" title="${p}">${p}</div>

            <div class="head-actions">
              <div class="toggles">
                <div class="toggle-btn ${"min"===pt?"active":""}"
                     @click=${()=>this._setColorBy("min")}>${a.min}</div>
                <div class="toggle-btn ${"average"===pt?"active":""}"
                     @click=${()=>this._setColorBy("average")}>${a.avg}</div>
                <div class="toggle-btn ${"max"===pt?"active":""}"
                     @click=${()=>this._setColorBy("max")}>${a.max}</div>
              </div>
              ${k?r`
                <div class="toggles">
                  <div class="toggle-btn ${w===S?"active":""}"
                       @click=${()=>this._setPeriodMode(S)}>${D}</div>
                  <div class="toggle-btn ${"week"===this._periodMode?"active":""}"
                       @click=${()=>this._setPeriodMode("week")}>${a.weeks}</div>
                </div>
              `:s}
            </div>
          </div>

          ${this._err?r`<div class="err">${this._err}</div>`:s}

          <div class="chart"
               @mousemove=${t=>this._onMove(t,t.currentTarget.getBoundingClientRect())}
               @mouseleave=${()=>this._onLeave()}>
            <svg viewBox="0 0 ${A} ${L}" role="img" aria-label="Min max avg bar chart">
              ${tt&&l?i`<text class="yUnit" x="${z-5}" y="${U-6}" text-anchor="end">${l}</text>`:s}

              ${J.ticks.map((t,e)=>{const o=V(t),r=0===e||e===J.ticks.length-1;return i`
                  <line class="${r?"gridHStrong":"gridH"}" x1="${z}" y1="${o}" x2="${z+K}" y2="${o}"></line>
                  ${Z?i`<text class="tickText" x="${z-8}" y="${o+4}" text-anchor="end">${Number(t).toFixed(X)}</text>`:s}
                `})}
              ${(()=>{const t=[];for(let e=0;e<=H;e++)if(e%et===0){const o=z+e*Y+Y/2;t.push(i`<line class="gridV" x1="${o}" y1="${U}" x2="${o}" y2="${U+O}"></line>`)}return t})()}

              ${b?_.map((e,o)=>{const r=f[o];if(!r||r.isEmpty)return s;const a=isFinite(r.min)?r.min:null,n=isFinite(r.max)?r.max:null,l=isFinite(r.mean)?r.mean:null;if(null==a||null==n)return s;const c=(t=>z+t*Y+j)(o),d=x("min"===pt?a:"average"===pt?l??n:n,mt),h=V(n),m=V(a),p=Math.max(2,m-h),u=Number(t.bar_radius??4),g=null==l?null:V(l),_=`mmab-compare-grad-${o}`,y=ut?`url(#${_})`:d,b=ut?$(a,n,mt):[];return i`
                  ${ut&&b.length?i`
                    <defs>
                      <linearGradient id="${_}" gradientUnits="userSpaceOnUse" x1="0" y1="${m}" x2="0" y2="${h}">
                        ${b.map(t=>i`<stop offset="${t.offset}%" stop-color="${t.color}"></stop>`)}
                      </linearGradient>
                    </defs>
                  `:s}
                  <rect class="compareFill" x="${c}" y="${h}" width="${W}" height="${p}" fill="${y}" rx="${u}" ry="${u}"></rect>
                  <rect class="compareStroke" x="${c}" y="${h}" width="${W}" height="${p}" stroke="${d}" rx="${u}" ry="${u}"></rect>
                  ${null==g?s:i`
                    <line class="avgShadowCompare" x1="${c+2}" y1="${g}" x2="${c+W-2}" y2="${g}"></line>
                    <line class="avgLineCompare" x1="${c+2}" y1="${g}" x2="${c+W-2}" y2="${g}"></line>
                  `}
                `}):s}

              ${_.map((e,o)=>{if(e.isEmpty)return s;const r=isFinite(e.min)?e.min:null,a=isFinite(e.max)?e.max:null,n=isFinite(e.mean)?e.mean:null;if(null==r||null==a)return s;const l=(t=>z+t*Y+j+(b?W+q:0))(o),c=x("min"===pt?r:"average"===pt?n??a:a,mt),d=V(a),h=V(r),m=Math.max(2,h-d),p=Number(t.bar_radius??4),u=null==n?null:V(n),g=ot&&ot.idx===o,_=`mmab-main-grad-${o}`,f=ut?`url(#${_})`:c,y=ut?$(r,a,mt):[];return i`
                  ${ut&&y.length?i`
                    <defs>
                      <linearGradient id="${_}" gradientUnits="userSpaceOnUse" x1="0" y1="${h}" x2="0" y2="${d}">
                        ${y.map(t=>i`<stop offset="${t.offset}%" stop-color="${t.color}"></stop>`)}
                      </linearGradient>
                    </defs>
                  `:s}
                  <rect class="barFill ${g?"active":""}" x="${l}" y="${d}" width="${W}" height="${m}" fill="${f}" rx="${p}" ry="${p}"></rect>
                  <rect class="barStroke" x="${l}" y="${d}" width="${W}" height="${m}" fill="none" stroke="${c}" rx="${p}" ry="${p}"></rect>
                  ${null==u?s:i`
                    <line class="avgShadow" x1="${l+2}" y1="${u}" x2="${l+W-2}" y2="${u}"></line>
                    <line class="avgLine" x1="${l+2}" y1="${u}" x2="${l+W-2}" y2="${u}"></line>
                  `}
                `})}

              ${Q?_.map((t,r)=>{if(r%et!==0)return s;return i`<text class="xText" x="${z+r*Y+Y/2}" y="${U+O+16}" text-anchor="middle">${function(t,e,o,r="cs",a="eu"){if(!t)return"";if("month"===e){const e=0===o||0===t.getMonth();try{return e?new Intl.DateTimeFormat(r,{month:"long",year:"numeric"}).format(t):new Intl.DateTimeFormat(r,{month:"long"}).format(t)}catch(e){return`${h(t.getMonth()+1)}/${String(t.getFullYear()).slice(-2)}`}}return"hour"===e?`${h(t.getHours())}:00`:y(t,a)}(t.start,w,r,e,o)}</text>`}):s}

              ${ot?(()=>{const t=z+ot.idx*Y+Y/2;return i`<line class="hoverLine" x1="${t}" y1="${U}" x2="${t}" y2="${U+O}"></line>`})():s}

              <rect class="overlay" x="${z}" y="${U}" width="${K}" height="${O}"></rect>
            </svg>

            ${it||b&&st?r`
              <div class="tooltip" style="left:${ot.px}px; top:${ot.py}px">
                ${b&&st?r`
                  <div class="tt-grid">
                    <div></div>
                    <div class="tt-head">${ct.top||""}</div>
                    <div class="tt-head">${dt.top||""}</div>
                    ${ct.bottom||dt.bottom?r`
                      <div></div>
                      <div class="tt-sub">${ct.bottom||""}</div>
                      <div class="tt-sub">${dt.bottom||""}</div>
                    `:s}
                    <div class="tt-label">${a.max}</div>
                    <div class="tt-val">${ht(rt?.max)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${ht(at?.max)}${l?` ${l}`:""}</div>
                    <div class="tt-label">${a.avg}</div>
                    <div class="tt-val">${ht(rt?.mean)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${ht(at?.mean)}${l?` ${l}`:""}</div>
                    <div class="tt-label">${a.min}</div>
                    <div class="tt-val">${ht(rt?.min)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${ht(at?.min)}${l?` ${l}`:""}</div>
                  </div>
                `:r`
                  <div class="tt-title">${ct.top||""}</div>
                  ${ct.bottom?r`<div class="tt-row"><span class="k">${ct.bottom}</span></div>`:s}
                  <div class="tt-row"><span class="k">${a.max}</span><span class="v">${ht(rt.max)}${l?` ${l}`:""}</span></div>
                  <div class="tt-row"><span class="k">${a.avg}</span><span class="v">${ht(rt.mean)}${l?` ${l}`:""}</span></div>
                  <div class="tt-row"><span class="k">${a.min}</span><span class="v">${ht(rt.min)}${l?` ${l}`:""}</span></div>
                `}
              </div>
            `:s}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}customElements.define("minmax-avg-bar-card-editor",class extends o{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config={...t||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=d.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(t){t.stopPropagation();let e=t.detail.value;const o=this._config?.preset,r=e?.preset;if(r&&r!==o){const t=d[r]||d.temperature;e={...e,thresholds:t.map(t=>({...t}))}}this._config=e,C(this,"config-changed",{config:e})}_setThresholds(t){const e=(t||[]).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt),o={...this._config||{}};o.thresholds=e.length?e:d.temperature,this._config=o,C(this,"config-changed",{config:o})}_updateThreshold(t,e){const o=(this._config.thresholds||[]).map(t=>({...t}));o[t]={...o[t]||{},...e||{}},this._setThresholds(o)}_addThreshold(){const t=(this._config.thresholds||[]).map(t=>({...t}));t.push({lt:(Number(t[t.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(t)}_removeThreshold(t){const e=(this._config.thresholds||[]).map(t=>({...t}));e.splice(t,1),this._setThresholds(e.length?e:d.temperature)}static get styles(){return a`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){const t=c[this._config?.language||"cs"]||c.cs;return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Temperature (C)"},{value:"temperature_f",label:"Temperature (F)"},{value:"beaufort",label:"Wind (Beaufort)"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"max",label:"Maximum"},{value:"average",label:"Average"},{value:"min",label:"Minimum"}]}}},{name:"bar_color_mode",selector:{select:{mode:"dropdown",options:[{value:"solid",label:t.color_mode_solid},{value:"gradient",label:t.color_mode_gradient}]}},label:t.color_mode},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"date_format",selector:{select:{mode:"dropdown",options:[{value:"eu",label:"European (26. 1.)"},{value:"intl",label:"International (26-Jan)"}]}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"collection_key",selector:{text:{}}},{name:"shared_period_mode",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"use_trailing",selector:{boolean:{}}},{name:"trailing_periods",selector:{number:{min:1,max:365,step:1,mode:"box"}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass||!this._config)return s;const t=c[this._config.language||"cs"]||c.cs,e=this._config.thresholds||d.temperature,o=!!customElements.get("ha-color-picker"),a=this._config.color_by||"max",i="min"===a?t.color_by_min:"average"===a?t.color_by_average:t.color_by_max;return r`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${t.thresholds} (${t.thresholds_by} ${i})</div><mwc-button @click=${()=>this._addThreshold()}>${t.add}</mwc-button></div>
            <div class="rows">
                ${e.map((e,a)=>{const i=e.color||"",s=function(t,e){try{const o=document.createElement("span");o.style.position="absolute",o.style.left="-9999px",o.style.top="-9999px",o.style.opacity="0",o.style.color=String(t||""),(e?.shadowRoot||document.body).appendChild(o);const r=getComputedStyle(o).color;o.remove();const a=r.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!a)return"";const i=t=>String(t.toString(16)).padStart(2,"0");return`#${i(Number(a[1]))}${i(Number(a[2]))}${i(Number(a[3]))}`}catch{return""}}(i,this)||"#3f51b5";return r`
                        <div class="row">
                            <ha-textfield label="${t.lt}" type="number" .value=${String(e.lt)} @change=${t=>this._updateThreshold(a,{lt:Number(t.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${i};"></div>
                                ${o?r`<ha-color-picker .value=${s} @value-changed=${t=>this._updateThreshold(a,{color:t.detail?.value||s})}></ha-color-picker>`:r`<input type="color" .value=${s} @input=${t=>this._updateThreshold(a,{color:t.target.value})} />`}
                                <ha-textfield label="${t.color}" .value=${i} @change=${t=>this._updateThreshold(a,{color:t.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(a)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}});const C=(t,e,o={},r={})=>{const a=new Event(e,{bubbles:r?.bubbles??!0,cancelable:r?.cancelable??!1,composed:r?.composed??!0});return a.detail=o,t.dispatchEvent(a),a};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",D);