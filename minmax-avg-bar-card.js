const MMAB_VERSION="1.0.0";let Lit,__litFromCDN=!1;try{Lit=await import("lit")}catch{Lit=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm"),__litFromCDN=!0}const{LitElement:t,html:e,css:r,svg:a,nothing:i}=Lit;console.info(`[MMAB] v1.0.0 loaded (Lit: ${__litFromCDN?"CDN":"local"})`);const getEnergyDataCollection=t=>{if(!t.connection)return null;if(t.connection._energy)return t.connection._energy;let e="_energy_minmax_subscription";return t.connection[e]||(t.connection[e]=t.connection.createCollection({key:"energy",fetch:t=>t.sendMessagePromise({type:"energy/get_prefs"}).catch(()=>null),subscribe:(t,e)=>t.subscribeMessage(e,{type:"energy/subscribe"}).catch(()=>null)})),t.connection[e]},STRINGS={cs:{missing:"Chyb\xed konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevn\xe9 rozsahy (MAX)",add:"Přidat",remove:"Odebrat",lt:"m\xe9ně než",color:"barva",months:"Měs\xedce",weeks:"T\xfddny",preset:"Přednastaven\xfd styl"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges (MAX)",add:"Add",remove:"Remove",lt:"less than",color:"color",months:"Months",weeks:"Weeks",preset:"Style Preset"}},PRESETS={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},pad2=t=>String(t).padStart(2,"0"),clamp=(t,e,r)=>Math.min(r,Math.max(e,t)),startOfDay=t=>new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),addHours=(t,e)=>{let r=new Date(t);return r.setTime(r.getTime()+36e5*e),r},addDays=(t,e)=>{let r=new Date(t);return r.setDate(r.getDate()+e),r},addMonths=(t,e)=>{let r=new Date(t);return r.setMonth(r.getMonth()+e),r};function formatDateDM(t){return`${t.getDate()}. ${t.getMonth()+1}.`}function formatDateDMY(t){return`${t.getDate()}. ${t.getMonth()+1}. ${t.getFullYear()}`}function formatTimeHM(t){return`${pad2(t.getHours())}:${pad2(t.getMinutes())}`}function niceTicks(t,e,r=6){if(!isFinite(t)||!isFinite(e)||t===e){let a=isFinite(t)?t:0;return{min:a-1,max:a+1,step:1,ticks:[a-1,a,a+1]}}let i=(e-t)/Math.max(1,r-1),s=Math.pow(10,Math.floor(Math.log10(i))),o=i/s,n;n=o>=7.5?10*s:o>=3.5?5*s:o>=1.5?2*s:1*s;let l=Math.floor(t/n)*n,d=Math.ceil(e/n)*n,h=[];for(let c=l;c<=d+.5*n;c+=n)h.push(c);return{min:l,max:d,step:n,ticks:h}}function colorForMax(t,e){if(!isFinite(t))return"var(--disabled-text-color)";let r=Array.isArray(e)&&e.length?e:PRESETS.temperature,a=r.map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt);for(let i of a)if(t<i.lt)return i.color;return a.length?a[a.length-1].color:"var(--primary-color)"}function estimateBinEnd(t,e,r){let a=t[e];if(!a?.start)return null;if(e<t.length-1&&t[e+1]?.start)return t[e+1].start;let i=a.start;return"hour"===r?addHours(i,1):"day"===r?addDays(i,1):"week"===r?addDays(i,7):"month"===r?addMonths(i,1):addDays(i,1)}function formatRangeTitle(t,e,r){if(!t)return"";if(!e)return formatDateDMY(t);if("hour"===r){let a=t.toDateString()===e.toDateString();return a?`${formatDateDM(t)} ${formatTimeHM(t)}–${formatTimeHM(e)}`:`${formatDateDMY(t)} ${formatTimeHM(t)} – ${formatDateDMY(e)} ${formatTimeHM(e)}`}let i=t.toDateString()===e.toDateString();return i?formatDateDMY(t):`${formatDateDM(t)}–${formatDateDM(e)}`}function formatXLabel(t,e,r,a="cs"){if(!t)return"";if("month"===e){let i=0===r||0===t.getMonth();try{if(i)return new Intl.DateTimeFormat(a,{month:"long",year:"numeric"}).format(t);return new Intl.DateTimeFormat(a,{month:"long"}).format(t)}catch(s){return`${pad2(t.getMonth()+1)}/${String(t.getFullYear()).slice(-2)}`}}return"hour"===e?`${pad2(t.getHours())}:00`:formatDateDM(t)}class MinMaxAvgBarCard extends t{static get properties(){return{hass:{},_config:{},_data:{state:!0},_loading:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_periodMode:{state:!0},__lastFetchKey:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._periodMode="month",this.__ro=null,this._energySubscription=null}static get styles(){return r`
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
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:PRESETS.temperature,preset:"temperature",listen_energy_date_selection:!0,default_ws_period:"day",debug:!1}}setConfig(t){if(!t||!t.entity)throw Error("entity is required");if(this._config={...MinMaxAvgBarCard.getStubConfig(),...t},!this._selection?.wsPeriod){let e=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(e)?e:"day"}}this._data=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.hass&&this._subscribeToEnergy(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(t){return t?this.hass?.states?.[t]:null}_unit(t){return this._stateObj(t)?.attributes?.unit_of_measurement||""}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{let t=this.renderRoot?.querySelector(".chart");t&&!this.__ro&&(this.__ro=new ResizeObserver(t=>{let e=t?.[0]?.contentRect;if(!e)return;let r=Math.max(320,Math.round(e.width)),a=Math.max(240,Math.round(e.height));(r!==this._size.w||a!==this._size.h)&&(this._size={w:r,h:a})}),this.__ro.observe(t))}),this.hass&&this._subscribeToEnergy()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null,this._energySubscription&&(this._energySubscription.then(t=>{"function"==typeof t&&t()}),this._energySubscription=null),super.disconnectedCallback()}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.hass&&this._config?.listen_energy_date_selection&&!this._energySubscription)try{let t=getEnergyDataCollection(this.hass);if(!t)return;this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=t.subscribe(t=>this._handleEnergyChange(t))}catch(e){console.warn("[MMAB] Failed to subscribe:",e)}}_handleEnergyChange(t){if(!t)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",t);let e=null,r=null;if(t.start&&(e=t.start instanceof Date?t.start.toISOString():String(t.start)),t.end&&(r=t.end instanceof Date?t.end.toISOString():String(t.end)),!e||!r)return;let a=new Date(e),i=new Date(r),s=(i-a)/36e5,o="day";o=s<=48?"hour":s<=840?"day":"month";let n={startIso:e,endIso:r,wsPeriod:o},l=n.startIso===(this._selection?.startIso||"")&&n.endIso===(this._selection?.endIso||"")&&n.wsPeriod===(this._selection?.wsPeriod||"");l||(this._selection=n,this.__lastFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(t){this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this._fetchStatsIfNeeded())}_generateTimeline(t,e,r,a){let i=[],s=new Date(t),o=new Date(e),n=[...a].sort((t,e)=>t.start-e.start),l=0,d=0;for(;s<o&&d<1e3;){d++;let h;h="hour"===r?addHours(s,1):"month"===r?addMonths(s,1):"week"===r?addDays(s,7):addDays(s,1);let c=null;for(;l<n.length&&n[l].start<s;)l++;if(l<n.length){let m=n[l];m.start<h&&(c=m,l++)}c?i.push({...c,start:new Date(s),isEmpty:!1}):i.push({start:new Date(s),min:null,max:null,mean:null,isEmpty:!0}),s=h}return i}async _fetchStatsIfNeeded(){let t=this._config||{},e=t.entity;if(!this.hass||!e)return;let r=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase(),a=r;"month"===r&&(a="week"===this._periodMode?"week":"month"),["hour","day","week","month"].includes(a)||(a="day");let i=String(this._selection?.startIso||""),s=String(this._selection?.endIso||"");if(!i||!s){let o=new Date;i=new Date(o.getFullYear(),o.getMonth(),1).toISOString(),s=new Date(o.getFullYear(),o.getMonth()+1,1).toISOString()}let n=`${e}|${a}|${i}|${s}`;if(!(this.__lastFetchKey===n&&Array.isArray(this._data))||!(this._data.length>0)){this.__lastFetchKey=n,this._loading=!0,this._err=null;try{t.debug&&console.info(`[MMAB] Fetching ${a} for ${i} -> ${s}`);let l=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:i,end_time:s,statistic_ids:[e],period:a,types:["mean","min","max"]}),d=l?.[e]||[],h=d.map(t=>({start:new Date(t.start),min:isFinite(t.min)?Number(t.min):null,max:isFinite(t.max)?Number(t.max):null,mean:isFinite(t.mean)?Number(t.mean):null,isEmpty:!1})).filter(t=>t.start instanceof Date&&!isNaN(t.start)),c=new Date(i),m=this._generateTimeline(c,s,a,h);this._data=m,this._loading=!1,this.requestUpdate()}catch(g){this._loading=!1,this._err=String(g?.message||g),console.warn("[MMAB] fetch error",g),this.requestUpdate()}}}_computePlotGeometry(t,e){let r=Math.max(10,t-40-10),a=Math.max(1,(this._data||[]).length),i=r/a,s=.65;a>40&&(s=.8);let o=Math.max(1,i*s);return{x0:40,y0:10,plotW:r,plotH:Math.max(10,e-10-30),n:a,barStep:i,barW:o,barXPad:(i-o)/2}}_onMove(t,e){if(!e||!Array.isArray(this._data)||!this._data.length)return;let r=t.clientX-e.left,a=t.clientY-e.top,i=Math.max(500,this._size?.w||e.width),s=i/e.width,o=r*s,n=this._computePlotGeometry(i,Math.max(240,this._size?.h||e.height)),{x0:l,plotW:d,n:h,barStep:c}=n;if(o<l||o>l+d){this._hover=null;return}let m=clamp(Math.floor((o-l)/c),0,h-1);this._hover={idx:m,px:r,py:a}}_onLeave(){this._hover=null}render(){let t=this._config||{},r=(t.language||"cs").toLowerCase(),s=STRINGS[r]||STRINGS.cs;if(!t.entity)return e`<ha-card><div class="wrap"><div class="err">${s.missing}</div></div></ha-card>`;let o=this._stateObj(t.entity),n=this._unit(t.entity),l=t.name||(o?.attributes?.friendly_name??t.entity),d=Number(t.height||320),h=Number.isFinite(Number(t.decimals))?Number(t.decimals):1,c=Array.isArray(this._data)?this._data:[],m=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase(),g=m;"month"===m&&(g="week"===this._periodMode?"week":"month");let p=1/0,u=-1/0,f=!1;for(let b of c)!b.isEmpty&&isFinite(b.min)&&isFinite(b.max)&&(p=Math.min(p,b.min),u=Math.max(u,b.max),f=!0);f||(p=0,u=1);let y=Number(t.y_padding_ratio??.08),$=u-p||1;p-=$*y,u+=$*y;let x=Math.max(500,this._size?.w||900),v=Math.max(240,this._size?.h||320),_=this._computePlotGeometry(x,v),{x0:w,y0:M,plotW:k,plotH:S,n:T,barStep:E,barW:C,barXPad:D}=_,F=clamp(Math.round(S/50)+1,4,8),P=niceTicks(p,u,F),A=t=>M+(P.max-t)*(S/(P.max-P.min)),I=(()=>{let t=P.step;return isFinite(t)?1e-9>Math.abs(t-Math.round(t))?0:t>=.5?1:Math.min(3,h):h})(),B=!1!==t.show_x_labels,R=!1!==t.show_y_labels,z=!1!==t.show_y_unit,H="hour"===g||"day"===g?4:"month"===g?1:"week"===g?T>20?4:1:4,L=this._hover,N=L&&c[L.idx]?c[L.idx]:null,Y=N&&!N.isEmpty,O=Y?estimateBinEnd(c,L.idx,g):null,j=Y?formatRangeTitle(N.start,O,g):"",G=t=>isFinite(t)?Number(t).toFixed(h):"–",K=Array.isArray(t.thresholds)?t.thresholds:PRESETS.temperature;return e`
      <ha-card>
        <div class="wrap" style="--mmab-height:${d}px;">
          <div class="head">
            <div class="title" title="${l}">${l}</div>
            
            ${"month"===m?e`
              <div class="toggles">
                <div class="toggle-btn ${"month"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("month")}>${s.months}</div>
                <div class="toggle-btn ${"week"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("week")}>${s.weeks}</div>
              </div>
            `:e`<div></div>`}
          </div>
          
          ${this._err?e`<div class="err">${this._err}</div>`:i}
          
          <div class="chart"
               @mousemove=${t=>this._onMove(t,t.currentTarget.getBoundingClientRect())}
               @mouseleave=${()=>this._onLeave()}>
            <svg viewBox="0 0 ${x} ${v}" role="img" aria-label="Min max avg bar chart">
              ${z&&n?a`<text class="yUnit" x="${w-5}" y="${M-6}" text-anchor="end">${n}</text>`:i}
              
              ${P.ticks.map((t,e)=>{let r=A(t),s=0===e||e===P.ticks.length-1;return a`
                  <line class="${s?"gridHStrong":"gridH"}" x1="${w}" y1="${r}" x2="${w+k}" y2="${r}"></line>
                  ${R?a`<text class="tickText" x="${w-8}" y="${r+4}" text-anchor="end">${Number(t).toFixed(I)}</text>`:i}
                `})}
              ${(()=>{let t=[];for(let e=0;e<=T;e++)if(e%H==0){let r=w+e*E+E/2;t.push(a`<line class="gridV" x1="${r}" y1="${M}" x2="${r}" y2="${M+S}"></line>`)}return t})()}
              
              ${c.map((e,r)=>{if(e.isEmpty)return i;let s=isFinite(e.min)?e.min:null,o=isFinite(e.max)?e.max:null,n=isFinite(e.mean)?e.mean:null;if(null==s||null==o)return i;let l=w+r*E+D,d=colorForMax(o,K),h=A(o),c=A(s),m=Math.max(2,c-h),g=Number(t.bar_radius??4),p=null==n?null:A(n),u=L&&L.idx===r;return a`
                  <rect class="barFill ${u?"active":""}" x="${l}" y="${h}" width="${C}" height="${m}" fill="${d}" rx="${g}" ry="${g}"></rect>
                  <rect class="barStroke" x="${l}" y="${h}" width="${C}" height="${m}" fill="none" stroke="${d}" rx="${g}" ry="${g}"></rect>
                  ${null==p?i:a`
                    <line class="avgShadow" x1="${l+2}" y1="${p}" x2="${l+C-2}" y2="${p}"></line>
                    <line class="avgLine" x1="${l+2}" y1="${p}" x2="${l+C-2}" y2="${p}"></line>
                  `}
                `})}

              ${B?c.map((t,e)=>e%H!=0?i:a`<text class="xText" x="${w+e*E+E/2}" y="${M+S+16}" text-anchor="middle">${formatXLabel(t.start,g,e,r)}</text>`):i}
              
              ${L?(()=>{let t=w+L.idx*E+E/2;return a`<line class="hoverLine" x1="${t}" y1="${M}" x2="${t}" y2="${M+S}"></line>`})():i}

              <rect class="overlay" x="${w}" y="${M}" width="${k}" height="${S}"></rect>
            </svg>

            ${Y?e`
              <div class="tooltip" style="left:${L.px}px; top:${L.py}px">
                <div class="tt-title">${j}</div>
                <div class="tt-row"><span class="k">${s.min}</span><span class="v">${G(N.min)}${n?` ${n}`:""}</span></div>
                <div class="tt-row"><span class="k">${s.avg}</span><span class="v">${G(N.mean)}${n?` ${n}`:""}</span></div>
                <div class="tt-row"><span class="k">${s.max}</span><span class="v">${G(N.max)}${n?` ${n}`:""}</span></div>
              </div>
            `:i}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}function cssColorToHex(t,e){try{let r=document.createElement("span");r.style.position="absolute",r.style.left="-9999px",r.style.top="-9999px",r.style.opacity="0",r.style.color=String(t||""),(e?.shadowRoot||document.body).appendChild(r);let a=getComputedStyle(r).color;r.remove();let i=a.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!i)return"";let s=t=>String(t.toString(16)).padStart(2,"0");return`#${s(Number(i[1]))}${s(Number(i[2]))}${s(Number(i[3]))}`}catch{return""}}class MinMaxAvgBarCardEditor extends t{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config={...t||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=PRESETS.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(t){t.stopPropagation();let e=t.detail.value,r=this._config?.preset,a=e?.preset;if(a&&a!==r){let i=PRESETS[a]||PRESETS.temperature;e={...e,thresholds:i.map(t=>({...t}))}}this._config=e,fireEvent(this,"config-changed",{config:e})}_setThresholds(t){let e=(t||[]).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt),r={...this._config||{}};r.thresholds=e.length?e:PRESETS.temperature,this._config=r,fireEvent(this,"config-changed",{config:r})}_updateThreshold(t,e){let r=(this._config.thresholds||[]).map(t=>({...t}));r[t]={...r[t]||{},...e||{}},this._setThresholds(r)}_addThreshold(){let t=(this._config.thresholds||[]).map(t=>({...t}));t.push({lt:(Number(t[t.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(t)}_removeThreshold(t){let e=(this._config.thresholds||[]).map(t=>({...t}));e.splice(t,1),this._setThresholds(e.length?e:PRESETS.temperature)}static get styles(){return r`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Teplota (Temperature)"},{value:"beaufort",label:"V\xedtr (Beaufort)"}]}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass)return i;let t=STRINGS[this._config?.language||"cs"]||STRINGS.cs,r=this._config.thresholds||PRESETS.temperature,a=!!customElements.get("ha-color-picker");return e`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${t.thresholds}</div><mwc-button @click=${()=>this._addThreshold()}>${t.add}</mwc-button></div>
            <div class="rows">
                ${r.map((r,i)=>{let s=r.color||"",o=cssColorToHex(s,this)||"#3f51b5";return e`
                        <div class="row">
                            <ha-textfield label="${t.lt}" type="number" .value=${String(r.lt)} @change=${t=>this._updateThreshold(i,{lt:Number(t.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${s};"></div>
                                ${a?e`<ha-color-picker .value=${o} @value-changed=${t=>this._updateThreshold(i,{color:t.detail?.value||o})}></ha-color-picker>`:e`<input type="color" .value=${o} @input=${t=>this._updateThreshold(i,{color:t.target.value})} />`}
                                <ha-textfield label="${t.color}" .value=${s} @change=${t=>this._updateThreshold(i,{color:t.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(i)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}}customElements.define("minmax-avg-bar-card-editor",MinMaxAvgBarCardEditor);const fireEvent=(t,e,r={},a={})=>{let i=new Event(e,{bubbles:a?.bubbles??!0,cancelable:a?.cancelable??!1,composed:a?.composed??!0});return i.detail=r,t.dispatchEvent(i),i};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",MinMaxAvgBarCard);