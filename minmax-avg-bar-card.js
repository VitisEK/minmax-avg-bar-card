const MMAB_VERSION="1.3.0";let Lit,__litFromCDN=!1;try{Lit=await import("lit")}catch{Lit=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm"),__litFromCDN=!0}const{LitElement:e,html:t,css:a,svg:r,nothing:o}=Lit;console.info(`[MMAB] v1.3.0 loaded (Lit: ${__litFromCDN?"CDN":"local"})`);const getEnergyDataCollection=e=>{if(!e.connection)return null;if(e.connection._energy)return e.connection._energy;let t="_energy_minmax_subscription";return e.connection[t]||(e.connection[t]=e.connection.createCollection({key:"energy",fetch:e=>e.sendMessagePromise({type:"energy/get_prefs"}).catch(()=>null),subscribe:(e,t)=>e.subscribeMessage(t,{type:"energy/subscribe"}).catch(()=>null)})),e.connection[t]},STRINGS={cs:{missing:"Chyb\xed konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevn\xe9 rozsahy",thresholds_by:"podle",add:"Přidat",remove:"Odebrat",lt:"m\xe9ně než",color:"barva",months:"Měs\xedce",weeks:"T\xfddny",preset:"Přednastaven\xfd styl",color_by:"Barva podle",color_by_max:"Maximum",color_by_average:"Průměr",color_by_min:"Minimum",use_trailing:"Posuvn\xe9 obdob\xed",trailing_periods:"Počet obdob\xed"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges",thresholds_by:"by",add:"Add",remove:"Remove",lt:"less than",color:"color",months:"Months",weeks:"Weeks",preset:"Style Preset",color_by:"Color by",color_by_max:"Maximum",color_by_average:"Average",color_by_min:"Minimum",use_trailing:"Trailing period",trailing_periods:"Number of periods"}},PRESETS={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],temperature_f:[{lt:5,color:"#b968f4"},{lt:32,color:"#039be5"},{lt:68,color:"#43a047"},{lt:77,color:"#fdd835"},{lt:86,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},pad2=e=>String(e).padStart(2,"0"),clamp=(e,t,a)=>Math.min(a,Math.max(t,e)),startOfDay=e=>new Date(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0,0),addHours=(e,t)=>{let a=new Date(e);return a.setTime(a.getTime()+36e5*t),a},addDays=(e,t)=>{let a=new Date(e);return a.setDate(a.getDate()+t),a},addMonths=(e,t)=>{let a=new Date(e);return a.setMonth(a.getMonth()+t),a},MONTH_ABBR=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function formatDateDM(e,t="eu"){return"intl"===t?`${e.getDate()}-${MONTH_ABBR[e.getMonth()]}`:`${e.getDate()}. ${e.getMonth()+1}.`}function formatDateDMY(e,t="eu"){return"intl"===t?`${e.getDate()}-${MONTH_ABBR[e.getMonth()]}-${e.getFullYear()}`:`${e.getDate()}. ${e.getMonth()+1}. ${e.getFullYear()}`}function formatTimeHM(e){return`${pad2(e.getHours())}:${pad2(e.getMinutes())}`}function niceTicks(e,t,a=6){if(!isFinite(e)||!isFinite(t)||e===t){let r=isFinite(e)?e:0;return{min:r-1,max:r+1,step:1,ticks:[r-1,r,r+1]}}let o=(t-e)/Math.max(1,a-1),i=Math.pow(10,Math.floor(Math.log10(o))),s=o/i,n;n=s>=7.5?10*i:s>=3.5?5*i:s>=1.5?2*i:1*i;let l=Math.floor(e/n)*n,d=Math.ceil(t/n)*n,c=[];for(let h=l;h<=d+.5*n;h+=n)c.push(h);return{min:l,max:d,step:n,ticks:c}}function colorForValue(e,t){if(!isFinite(e))return"var(--disabled-text-color)";let a=Array.isArray(t)&&t.length?t:PRESETS.temperature,r=a.map(e=>({lt:Number(e.lt),color:String(e.color??"")})).filter(e=>isFinite(e.lt)&&e.color).sort((e,t)=>e.lt-t.lt);for(let o of r)if(e<o.lt)return o.color;return r.length?r[r.length-1].color:"var(--primary-color)"}function normalizeIso(e){return e?e instanceof Date?e.toISOString():String(e):""}function normalizeRange(e,t){let a=normalizeIso(e),r=normalizeIso(t);if(!a||!r)return null;let o=new Date(a),i=new Date(r);return isNaN(o)||isNaN(i)?null:{startIso:a,endIso:r,start:o,end:i}}function extractCompareRange(e){let t=e?.compare||e?.compare_range||e?.compareRange||e?.compare_period||e?.comparePeriod,a=t?.start??t?.start_time??t?.startTime??e?.compare_start??e?.compareStart??e?.startCompare??e?.compare_from??e?.compareFrom,r=t?.end??t?.end_time??t?.endTime??e?.compare_end??e?.compareEnd??e?.endCompare??e?.compare_to??e?.compareTo,o=normalizeRange(a,r);return o?{startIso:o.startIso,endIso:o.endIso}:null}function estimateBinEnd(e,t,a){let r=e[t];if(!r?.start)return null;if(t<e.length-1&&e[t+1]?.start)return e[t+1].start;let o=r.start;return"hour"===a?addHours(o,1):"day"===a?addDays(o,1):"week"===a?addDays(o,7):"month"===a?addMonths(o,1):addDays(o,1)}function formatRangeTitle(e,t,a,r="eu",o="en"){if(!e)return"";if(!t)return formatDateDMY(e,r);if("hour"===a){let i=e.toDateString()===t.toDateString();return i?`${formatDateDM(e,r)} ${formatTimeHM(e)}–${formatTimeHM(t)}`:`${formatDateDMY(e,r)} ${formatTimeHM(e)} – ${formatDateDMY(t,r)} ${formatTimeHM(t)}`}if("day"===a)return formatDateDMY(e,r);if("month"===a)try{return new Intl.DateTimeFormat(o,{month:"long",year:"numeric"}).format(e)}catch{return formatDateDMY(e,r)}let s=e.toDateString()===t.toDateString();return s?formatDateDMY(e,r):`${formatDateDM(e,r)}–${formatDateDM(t,r)}`}function isoWeekYear(e){let t=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())),a=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-a);let r=new Date(Date.UTC(t.getUTCFullYear(),0,1));return{year:t.getUTCFullYear(),week:Math.ceil(((t-r)/864e5+1)/7)}}function formatHoverHeader(e,t,a,r="eu"){if(!e)return{top:"",bottom:""};if("week"===a){let o=isoWeekYear(e);return{top:`${o.year} / W${pad2(o.week)}`,bottom:formatRangeTitle(e,t,a,r)}}return"month"===a?{top:String(e.getFullYear()),bottom:formatRangeTitle(e,t,a,r)}:{top:formatRangeTitle(e,t,a,r),bottom:""}}function formatXLabel(e,t,a,r="cs",o="eu"){if(!e)return"";if("month"===t){let i=0===a||0===e.getMonth();try{if(i)return new Intl.DateTimeFormat(r,{month:"long",year:"numeric"}).format(e);return new Intl.DateTimeFormat(r,{month:"long"}).format(e)}catch(s){return`${pad2(e.getMonth()+1)}/${String(e.getFullYear()).slice(-2)}`}}return"hour"===t?`${pad2(e.getHours())}:00`:formatDateDM(e,o)}class MinMaxAvgBarCard extends e{static get properties(){return{hass:{},_config:{},_data:{state:!0},_loading:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_compareSelection:{state:!0},_compareData:{state:!0},_periodMode:{state:!0},__lastFetchKey:{state:!0},__lastCompareFetchKey:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._compareSelection={startIso:"",endIso:"",wsPeriod:""},this._compareData=null,this._periodMode="month",this.__ro=null,this._energySubscription=null,this.__lastCompareFetchKey="",this.__sharedPeriodHandler=null}static get styles(){return a`
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
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:PRESETS.temperature,preset:"temperature",color_by:"max",listen_energy_date_selection:!0,default_ws_period:"day",shared_period_mode:!1,debug:!1}}setConfig(e){if(!e||!e.entity)throw Error("entity is required");if(this._config={...MinMaxAvgBarCard.getStubConfig(),...e},!this._selection?.wsPeriod){let t=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(t)?t:"day"}}this._data=null,this._compareData=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.__lastCompareFetchKey="",this.hass&&this._subscribeToEnergy(),this._setupSharedPeriodMode(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(e){return e?this.hass?.states?.[e]:null}_unit(e){return this._stateObj(e)?.attributes?.unit_of_measurement||""}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{let e=this.renderRoot?.querySelector(".chart");e&&!this.__ro&&(this.__ro=new ResizeObserver(e=>{let t=e?.[0]?.contentRect;if(!t)return;let a=Math.max(320,Math.round(t.width)),r=Math.max(240,Math.round(t.height));(a!==this._size.w||r!==this._size.h)&&(this._size={w:a,h:r})}),this.__ro.observe(e))}),this.hass&&this._subscribeToEnergy(),this._setupSharedPeriodMode()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null,this._energySubscription&&(this._energySubscription.then(e=>{"function"==typeof e&&e()}),this._energySubscription=null),this._teardownSharedPeriodMode(),super.disconnectedCallback()}updated(e){super.updated(e),(e.has("hass")||e.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.hass&&this._config?.listen_energy_date_selection&&!this._energySubscription)try{let e=getEnergyDataCollection(this.hass);if(!e)return;this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=e.subscribe(e=>this._handleEnergyChange(e))}catch(t){console.warn("[MMAB] Failed to subscribe:",t)}}_handleEnergyChange(e){if(!e)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",e);let t=normalizeRange(e.start,e.end);if(!t)return;let a=(t.end-t.start)/36e5,r="day";r=a<=48?"hour":a<=840?"day":"month";let o={startIso:t.startIso,endIso:t.endIso,wsPeriod:r},i=o.startIso===(this._selection?.startIso||"")&&o.endIso===(this._selection?.endIso||"")&&o.wsPeriod===(this._selection?.wsPeriod||""),s=extractCompareRange(e),n=s?{startIso:s.startIso,endIso:s.endIso,wsPeriod:r}:{startIso:"",endIso:"",wsPeriod:""},l=n.startIso===(this._compareSelection?.startIso||"")&&n.endIso===(this._compareSelection?.endIso||"")&&n.wsPeriod===(this._compareSelection?.wsPeriod||"");i&&l||(this._selection=o,this._compareSelection=n,this.__lastFetchKey="",this.__lastCompareFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(e){this._periodMode!==e&&(this._periodMode=e,this._broadcastSharedPeriodMode(e),this.__lastFetchKey="",this._fetchStatsIfNeeded())}_setupSharedPeriodMode(){if(!this._config?.shared_period_mode||this.__sharedPeriodHandler)return;let e=e=>{let t=e?.detail?.mode;("month"===t||"week"===t)&&this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())};this.__sharedPeriodHandler=e,window.addEventListener("mmab:period-mode",e);try{let t=localStorage.getItem("mmab_shared_period_mode");("month"===t||"week"===t)&&this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}catch{}}_teardownSharedPeriodMode(){this.__sharedPeriodHandler&&(window.removeEventListener("mmab:period-mode",this.__sharedPeriodHandler),this.__sharedPeriodHandler=null)}_broadcastSharedPeriodMode(e){if(this._config?.shared_period_mode){try{localStorage.setItem("mmab_shared_period_mode",e)}catch{}window.dispatchEvent(new CustomEvent("mmab:period-mode",{detail:{mode:e}}))}}_generateTimeline(e,t,a,r){let o=[],i=new Date(e),s=new Date(t),n=[...r].sort((e,t)=>e.start-t.start),l=0,d=0;for(;i<s&&d<1e3;){d++;let c;c="hour"===a?addHours(i,1):"month"===a?addMonths(i,1):"week"===a?addDays(i,7):addDays(i,1);let h=null;for(;l<n.length&&n[l].start<i;)l++;if(l<n.length){let m=n[l];m.start<c&&(h=m,l++)}h?o.push({...h,start:new Date(i),isEmpty:!1}):o.push({start:new Date(i),min:null,max:null,mean:null,isEmpty:!0}),i=c}return o}async _fetchStatsForRange(e,t,a,r,o){o?.debug&&console.info(`[MMAB] Fetching ${r} for ${t} -> ${a}`);let i=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:t,end_time:a,statistic_ids:[e],period:r,types:["mean","min","max"]}),s=i?.[e]||[],n=s.map(e=>({start:new Date(e.start),min:isFinite(e.min)?Number(e.min):null,max:isFinite(e.max)?Number(e.max):null,mean:isFinite(e.mean)?Number(e.mean):null,isEmpty:!1})).filter(e=>e.start instanceof Date&&!isNaN(e.start)),l=new Date(t);return this._generateTimeline(l,a,r,n)}async _fetchStatsIfNeeded(){let e=this._config||{},t=e.entity;if(!this.hass||!t)return;let a=String(this._selection?.wsPeriod||e.default_ws_period||"day").toLowerCase(),r=a;"month"===a&&(r="week"===this._periodMode?"week":"month"),["hour","day","week","month"].includes(r)||(r="day");let o=String(this._selection?.startIso||""),i=String(this._selection?.endIso||""),s=!0===e.use_trailing;if(s||!o||!i){let n=new Date,l,d;if(s){let c=Number(e.trailing_periods)||({hour:24,day:7,week:4,month:12})[r]||7;if("hour"===r)d=new Date(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),0,0,0),l=addHours(d,-c);else if("month"===r)d=new Date(n.getFullYear(),n.getMonth(),1),l=addMonths(d,-c);else if("week"===r){let h=n.getDay();d=startOfDay(addDays(n,-(0===h?6:h-1))),l=addDays(d,-(7*c))}else d=startOfDay(n),l=addDays(d,-c);d=n,o=l.toISOString(),i=d.toISOString()}else o=(l=new Date(n.getFullYear(),n.getMonth(),1)).toISOString(),i=new Date(n.getFullYear(),n.getMonth()+1,1).toISOString()}let m=`${t}|${r}|${o}|${i}`,p=this._compareSelection?.startIso&&this._compareSelection?.endIso?{startIso:this._compareSelection.startIso,endIso:this._compareSelection.endIso}:null;p&&p.startIso===o&&p.endIso===i&&(p=null);let g=p?`${t}|${r}|${p.startIso}|${p.endIso}`:"",u=!(this.__lastFetchKey===m&&Array.isArray(this._data)&&this._data.length>0),f=!!p&&!(this.__lastCompareFetchKey===g&&Array.isArray(this._compareData)&&this._compareData.length>0);if(!p&&(this._compareData||this.__lastCompareFetchKey)&&(this._compareData=null,this.__lastCompareFetchKey="",this.requestUpdate()),u||f){this._loading=!0,this._err=null;try{if(u){let b=await this._fetchStatsForRange(t,o,i,r,e);this._data=b,this.__lastFetchKey=m}if(p&&p.startIso===o&&p.endIso===i)this._compareData=null,this.__lastCompareFetchKey="";else if(p&&f)try{let y=await this._fetchStatsForRange(t,p.startIso,p.endIso,r,e);this._compareData=y,this.__lastCompareFetchKey=g}catch(v){this._compareData=null,this.__lastCompareFetchKey="",console.warn("[MMAB] compare fetch error",v)}else p||(this._compareData=null,this.__lastCompareFetchKey="");this._loading=!1,this.requestUpdate()}catch($){this._loading=!1,this._err=String($?.message||$),console.warn("[MMAB] fetch error",$),this.requestUpdate()}}}_computePlotGeometry(e,t){let a=Math.max(10,e-40-10),r=Math.max(1,(this._data||[]).length),o=a/r,i=.65;r>40&&(i=.8);let s=Math.max(1,o*i);return{x0:40,y0:10,plotW:a,plotH:Math.max(10,t-10-30),n:r,barStep:o,barW:s,barXPad:(o-s)/2}}_onMove(e,t){if(!t||!Array.isArray(this._data)||!this._data.length)return;let a=e.clientX-t.left,r=e.clientY-t.top,o=Math.max(500,this._size?.w||t.width),i=o/t.width,s=a*i,n=this._computePlotGeometry(o,Math.max(240,this._size?.h||t.height)),{x0:l,plotW:d,n:c,barStep:h}=n;if(s<l||s>l+d){this._hover=null;return}let m=clamp(Math.floor((s-l)/h),0,c-1);this._hover={idx:m,px:a,py:r}}_onLeave(){this._hover=null}render(){let e=this._config||{},a=(e.language||"cs").toLowerCase(),i=(e.date_format||"eu").toLowerCase(),s=STRINGS[a]||STRINGS.cs;if(!e.entity)return t`<ha-card><div class="wrap"><div class="err">${s.missing}</div></div></ha-card>`;let n=this._stateObj(e.entity),l=this._unit(e.entity),d=e.name||(n?.attributes?.friendly_name??e.entity),c=Number(e.height||320),h=Number.isFinite(Number(e.decimals))?Number(e.decimals):1,m=Array.isArray(this._data)?this._data:[],p=Array.isArray(this._compareData)?this._compareData:[],g=p.some(e=>!e.isEmpty&&isFinite(e.min)&&isFinite(e.max)),u=String(this._selection?.wsPeriod||e.default_ws_period||"day").toLowerCase(),f=u;"month"===u&&(f="week"===this._periodMode?"week":"month");let b=1/0,y=-1/0,v=!1,$=e=>{b=Math.min(b,e.min),y=Math.max(y,e.max),v=!0};for(let x of m)!x.isEmpty&&isFinite(x.min)&&isFinite(x.max)&&$(x);for(let w of p)!w.isEmpty&&isFinite(w.min)&&isFinite(w.max)&&$(w);v||(b=0,y=1);let _=Number(e.y_padding_ratio??.08),M=y-b||1;b-=M*_,y+=M*_;let k=Math.max(500,this._size?.w||900),S=Math.max(240,this._size?.h||320),D=this._computePlotGeometry(k,S),{x0:C,y0:T,plotW:F,plotH:E,n:I,barStep:P,barW:R,barXPad:A}=D,H=g?Math.max(1,Math.round(.08*R)):0,B=g?Math.max(1,Math.floor((R-H)/2)):R,z=e=>C+e*P+A+(g?B+H:0),L=e=>C+e*P+A,N=clamp(Math.round(E/50)+1,4,8),Y=niceTicks(b,y,N),K=e=>T+(Y.max-e)*(E/(Y.max-Y.min)),O=(()=>{let e=Y.step;return isFinite(e)?1e-9>Math.abs(e-Math.round(e))?0:e>=.5?1:Math.min(3,h):h})(),U=!1!==e.show_x_labels,j=!1!==e.show_y_labels,q=!1!==e.show_y_unit,G="hour"===f||"day"===f?4:"month"===f?1:"week"===f?I>20?4:1:4,V=this._hover,W=V&&m[V.idx]?m[V.idx]:null,J=V&&p[V.idx]?p[V.idx]:null,X=W&&!W.isEmpty,Q=J&&!J.isEmpty,Z=X?estimateBinEnd(m,V.idx,f):null,ee=Q?estimateBinEnd(p,V.idx,f):null,et=X?formatHoverHeader(W.start,Z,f,i):{top:"",bottom:""},ea=Q?formatHoverHeader(J.start,ee,f,i):{top:"",bottom:""},er=e=>isFinite(e)?Number(e).toFixed(h):"–",eo=Array.isArray(e.thresholds)?e.thresholds:PRESETS.temperature,ei=["max","average","min"].includes(e.color_by)?e.color_by:"max";return t`
      <ha-card>
        <div class="wrap" style="--mmab-height:${c}px;">
          <div class="head">
            <div class="title" title="${d}">${d}</div>
            
            ${"month"===u?t`
              <div class="toggles">
                <div class="toggle-btn ${"month"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("month")}>${s.months}</div>
                <div class="toggle-btn ${"week"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("week")}>${s.weeks}</div>
              </div>
            `:t`<div></div>`}
          </div>
          
          ${this._err?t`<div class="err">${this._err}</div>`:o}
          
          <div class="chart"
               @mousemove=${e=>this._onMove(e,e.currentTarget.getBoundingClientRect())}
               @mouseleave=${()=>this._onLeave()}>
            <svg viewBox="0 0 ${k} ${S}" role="img" aria-label="Min max avg bar chart">
              ${q&&l?r`<text class="yUnit" x="${C-5}" y="${T-6}" text-anchor="end">${l}</text>`:o}
              
              ${Y.ticks.map((e,t)=>{let a=K(e),i=0===t||t===Y.ticks.length-1;return r`
                  <line class="${i?"gridHStrong":"gridH"}" x1="${C}" y1="${a}" x2="${C+F}" y2="${a}"></line>
                  ${j?r`<text class="tickText" x="${C-8}" y="${a+4}" text-anchor="end">${Number(e).toFixed(O)}</text>`:o}
                `})}
              ${(()=>{let e=[];for(let t=0;t<=I;t++)if(t%G==0){let a=C+t*P+P/2;e.push(r`<line class="gridV" x1="${a}" y1="${T}" x2="${a}" y2="${T+E}"></line>`)}return e})()}
              
              ${g?m.map((t,a)=>{let i=p[a];if(!i||i.isEmpty)return o;let s=isFinite(i.min)?i.min:null,n=isFinite(i.max)?i.max:null,l=isFinite(i.mean)?i.mean:null;if(null==s||null==n)return o;let d=L(a),c=colorForValue("min"===ei?s:"average"===ei?l??n:n,eo),h=K(n),m=K(s),g=Math.max(2,m-h),u=Number(e.bar_radius??4),f=null==l?null:K(l);return r`
                  <rect class="compareFill" x="${d}" y="${h}" width="${B}" height="${g}" fill="${c}" rx="${u}" ry="${u}"></rect>
                  <rect class="compareStroke" x="${d}" y="${h}" width="${B}" height="${g}" stroke="${c}" rx="${u}" ry="${u}"></rect>
                  ${null==f?o:r`
                    <line class="avgShadowCompare" x1="${d+2}" y1="${f}" x2="${d+B-2}" y2="${f}"></line>
                    <line class="avgLineCompare" x1="${d+2}" y1="${f}" x2="${d+B-2}" y2="${f}"></line>
                  `}
                `}):o}

              ${m.map((t,a)=>{if(t.isEmpty)return o;let i=isFinite(t.min)?t.min:null,s=isFinite(t.max)?t.max:null,n=isFinite(t.mean)?t.mean:null;if(null==i||null==s)return o;let l=z(a),d=colorForValue("min"===ei?i:"average"===ei?n??s:s,eo),c=K(s),h=K(i),m=Math.max(2,h-c),p=Number(e.bar_radius??4),g=null==n?null:K(n),u=V&&V.idx===a;return r`
                  <rect class="barFill ${u?"active":""}" x="${l}" y="${c}" width="${B}" height="${m}" fill="${d}" rx="${p}" ry="${p}"></rect>
                  <rect class="barStroke" x="${l}" y="${c}" width="${B}" height="${m}" fill="none" stroke="${d}" rx="${p}" ry="${p}"></rect>
                  ${null==g?o:r`
                    <line class="avgShadow" x1="${l+2}" y1="${g}" x2="${l+B-2}" y2="${g}"></line>
                    <line class="avgLine" x1="${l+2}" y1="${g}" x2="${l+B-2}" y2="${g}"></line>
                  `}
                `})}

              ${U?m.map((e,t)=>t%G!=0?o:r`<text class="xText" x="${C+t*P+P/2}" y="${T+E+16}" text-anchor="middle">${formatXLabel(e.start,f,t,a,i)}</text>`):o}
              
              ${V?(()=>{let e=C+V.idx*P+P/2;return r`<line class="hoverLine" x1="${e}" y1="${T}" x2="${e}" y2="${T+E}"></line>`})():o}

              <rect class="overlay" x="${C}" y="${T}" width="${F}" height="${E}"></rect>
            </svg>

            ${X||g&&Q?t`
              <div class="tooltip" style="left:${V.px}px; top:${V.py}px">
                ${g&&Q?t`
                  <div class="tt-grid">
                    <div></div>
                    <div class="tt-head">${et.top||""}</div>
                    <div class="tt-head">${ea.top||""}</div>
                    ${et.bottom||ea.bottom?t`
                      <div></div>
                      <div class="tt-sub">${et.bottom||""}</div>
                      <div class="tt-sub">${ea.bottom||""}</div>
                    `:o}
                    <div class="tt-label">${s.max}</div>
                    <div class="tt-val">${er(W?.max)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${er(J?.max)}${l?` ${l}`:""}</div>
                    <div class="tt-label">${s.avg}</div>
                    <div class="tt-val">${er(W?.mean)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${er(J?.mean)}${l?` ${l}`:""}</div>
                    <div class="tt-label">${s.min}</div>
                    <div class="tt-val">${er(W?.min)}${l?` ${l}`:""}</div>
                    <div class="tt-val">${er(J?.min)}${l?` ${l}`:""}</div>
                  </div>
                `:t`
                  <div class="tt-title">${et.top||""}</div>
                  ${et.bottom?t`<div class="tt-row"><span class="k">${et.bottom}</span></div>`:o}
                  <div class="tt-row"><span class="k">${s.max}</span><span class="v">${er(W.max)}${l?` ${l}`:""}</span></div>
                  <div class="tt-row"><span class="k">${s.avg}</span><span class="v">${er(W.mean)}${l?` ${l}`:""}</span></div>
                  <div class="tt-row"><span class="k">${s.min}</span><span class="v">${er(W.min)}${l?` ${l}`:""}</span></div>
                `}
              </div>
            `:o}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}function cssColorToHex(e,t){try{let a=document.createElement("span");a.style.position="absolute",a.style.left="-9999px",a.style.top="-9999px",a.style.opacity="0",a.style.color=String(e||""),(t?.shadowRoot||document.body).appendChild(a);let r=getComputedStyle(a).color;a.remove();let o=r.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!o)return"";let i=e=>String(e.toString(16)).padStart(2,"0");return`#${i(Number(o[1]))}${i(Number(o[2]))}${i(Number(o[3]))}`}catch{return""}}class MinMaxAvgBarCardEditor extends e{static get properties(){return{hass:{},_config:{}}}setConfig(e){this._config={...e||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=PRESETS.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(e){e.stopPropagation();let t=e.detail.value,a=this._config?.preset,r=t?.preset;if(r&&r!==a){let o=PRESETS[r]||PRESETS.temperature;t={...t,thresholds:o.map(e=>({...e}))}}this._config=t,fireEvent(this,"config-changed",{config:t})}_setThresholds(e){let t=(e||[]).map(e=>({lt:Number(e.lt),color:String(e.color??"")})).filter(e=>isFinite(e.lt)&&e.color).sort((e,t)=>e.lt-t.lt),a={...this._config||{}};a.thresholds=t.length?t:PRESETS.temperature,this._config=a,fireEvent(this,"config-changed",{config:a})}_updateThreshold(e,t){let a=(this._config.thresholds||[]).map(e=>({...e}));a[e]={...a[e]||{},...t||{}},this._setThresholds(a)}_addThreshold(){let e=(this._config.thresholds||[]).map(e=>({...e}));e.push({lt:(Number(e[e.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(e)}_removeThreshold(e){let t=(this._config.thresholds||[]).map(e=>({...e}));t.splice(e,1),this._setThresholds(t.length?t:PRESETS.temperature)}static get styles(){return a`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Temperature (C)"},{value:"temperature_f",label:"Temperature (F)"},{value:"beaufort",label:"Wind (Beaufort)"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"max",label:"Maximum"},{value:"average",label:"Average"},{value:"min",label:"Minimum"}]}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"date_format",selector:{select:{mode:"dropdown",options:[{value:"eu",label:"European (26. 1.)"},{value:"intl",label:"International (26-Jan)"}]}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"shared_period_mode",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"use_trailing",selector:{boolean:{}}},{name:"trailing_periods",selector:{number:{min:1,max:365,step:1,mode:"box"}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass||!this._config)return o;let e=STRINGS[this._config.language||"cs"]||STRINGS.cs,a=this._config.thresholds||PRESETS.temperature,r=!!customElements.get("ha-color-picker"),i=this._config.color_by||"max",s="min"===i?e.color_by_min:"average"===i?e.color_by_average:e.color_by_max;return t`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${e.thresholds} (${e.thresholds_by} ${s})</div><mwc-button @click=${()=>this._addThreshold()}>${e.add}</mwc-button></div>
            <div class="rows">
                ${a.map((a,o)=>{let i=a.color||"",s=cssColorToHex(i,this)||"#3f51b5";return t`
                        <div class="row">
                            <ha-textfield label="${e.lt}" type="number" .value=${String(a.lt)} @change=${e=>this._updateThreshold(o,{lt:Number(e.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${i};"></div>
                                ${r?t`<ha-color-picker .value=${s} @value-changed=${e=>this._updateThreshold(o,{color:e.detail?.value||s})}></ha-color-picker>`:t`<input type="color" .value=${s} @input=${e=>this._updateThreshold(o,{color:e.target.value})} />`}
                                <ha-textfield label="${e.color}" .value=${i} @change=${e=>this._updateThreshold(o,{color:e.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(o)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}}customElements.define("minmax-avg-bar-card-editor",MinMaxAvgBarCardEditor);const fireEvent=(e,t,a={},r={})=>{let o=new Event(t,{bubbles:r?.bubbles??!0,cancelable:r?.cancelable??!1,composed:r?.composed??!0});return o.detail=a,e.dispatchEvent(o),o};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",MinMaxAvgBarCard);