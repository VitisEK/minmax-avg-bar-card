const MMAB_VERSION="1.1.0";let Lit,__litFromCDN=!1;try{Lit=await import("lit")}catch{Lit=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm"),__litFromCDN=!0}const{LitElement:e,html:t,css:r,svg:a,nothing:o}=Lit;console.info(`[MMAB] v1.1.0 loaded (Lit: ${__litFromCDN?"CDN":"local"})`);const getEnergyDataCollection=i=>{if(!i.connection)return null;if(i.connection._energy)return i.connection._energy;let s="_energy_minmax_subscription";return i.connection[s]||(i.connection[s]=i.connection.createCollection({key:"energy",fetch:i=>i.sendMessagePromise({type:"energy/get_prefs"}).catch(()=>null),subscribe:(i,s)=>i.subscribeMessage(s,{type:"energy/subscribe"}).catch(()=>null)})),i.connection[s]},STRINGS={cs:{missing:"Chyb\xed konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevn\xe9 rozsahy",thresholds_by:"podle",add:"Přidat",remove:"Odebrat",lt:"m\xe9ně než",color:"barva",months:"Měs\xedce",weeks:"T\xfddny",preset:"Přednastaven\xfd styl",color_by:"Barva podle",color_by_max:"Maximum",color_by_average:"Průměr",color_by_min:"Minimum"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges",thresholds_by:"by",add:"Add",remove:"Remove",lt:"less than",color:"color",months:"Months",weeks:"Weeks",preset:"Style Preset",color_by:"Color by",color_by_max:"Maximum",color_by_average:"Average",color_by_min:"Minimum"}},PRESETS={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],temperature_f:[{lt:5,color:"#b968f4"},{lt:32,color:"#039be5"},{lt:68,color:"#43a047"},{lt:77,color:"#fdd835"},{lt:86,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},pad2=i=>String(i).padStart(2,"0"),clamp=(i,s,n)=>Math.min(n,Math.max(s,i)),startOfDay=i=>new Date(i.getFullYear(),i.getMonth(),i.getDate(),0,0,0,0),addHours=(i,s)=>{let n=new Date(i);return n.setTime(n.getTime()+36e5*s),n},addDays=(i,s)=>{let n=new Date(i);return n.setDate(n.getDate()+s),n},addMonths=(i,s)=>{let n=new Date(i);return n.setMonth(n.getMonth()+s),n},MONTH_ABBR=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function formatDateDM(i,s="eu"){return"intl"===s?`${i.getDate()}-${MONTH_ABBR[i.getMonth()]}`:`${i.getDate()}. ${i.getMonth()+1}.`}function formatDateDMY(i,s="eu"){return"intl"===s?`${i.getDate()}-${MONTH_ABBR[i.getMonth()]}-${i.getFullYear()}`:`${i.getDate()}. ${i.getMonth()+1}. ${i.getFullYear()}`}function formatTimeHM(i){return`${pad2(i.getHours())}:${pad2(i.getMinutes())}`}function niceTicks(i,s,n=6){if(!isFinite(i)||!isFinite(s)||i===s){let l=isFinite(i)?i:0;return{min:l-1,max:l+1,step:1,ticks:[l-1,l,l+1]}}let d=(s-i)/Math.max(1,n-1),c=Math.pow(10,Math.floor(Math.log10(d))),h=d/c,m,g=Math.floor(i/(m=h>=7.5?10*c:h>=3.5?5*c:h>=1.5?2*c:1*c))*m,p=Math.ceil(s/m)*m,u=[];for(let f=g;f<=p+.5*m;f+=m)u.push(f);return{min:g,max:p,step:m,ticks:u}}function colorForValue(i,s){if(!isFinite(i))return"var(--disabled-text-color)";let n=(Array.isArray(s)&&s.length?s:PRESETS.temperature).map(i=>({lt:Number(i.lt),color:String(i.color??"")})).filter(i=>isFinite(i.lt)&&i.color).sort((i,s)=>i.lt-s.lt);for(let l of n)if(i<l.lt)return l.color;return n.length?n[n.length-1].color:"var(--primary-color)"}function estimateBinEnd(i,s,n){let l=i[s];if(!l?.start)return null;if(s<i.length-1&&i[s+1]?.start)return i[s+1].start;let d=l.start;return"hour"===n?addHours(d,1):"day"===n?addDays(d,1):"week"===n?addDays(d,7):"month"===n?addMonths(d,1):addDays(d,1)}function formatRangeTitle(i,s,n,l="eu"){return i?s?"hour"===n?i.toDateString()===s.toDateString()?`${formatDateDM(i,l)} ${formatTimeHM(i)}–${formatTimeHM(s)}`:`${formatDateDMY(i,l)} ${formatTimeHM(i)} – ${formatDateDMY(s,l)} ${formatTimeHM(s)}`:i.toDateString()===s.toDateString()?formatDateDMY(i,l):`${formatDateDM(i,l)}–${formatDateDM(s,l)}`:formatDateDMY(i,l):""}function formatXLabel(i,s,n,l="cs",d="eu"){if(!i)return"";if("month"===s){let c=0===n||0===i.getMonth();try{if(c)return new Intl.DateTimeFormat(l,{month:"long",year:"numeric"}).format(i);return new Intl.DateTimeFormat(l,{month:"long"}).format(i)}catch(h){return`${pad2(i.getMonth()+1)}/${String(i.getFullYear()).slice(-2)}`}}return"hour"===s?`${pad2(i.getHours())}:00`:formatDateDM(i,d)}class MinMaxAvgBarCard extends e{static get properties(){return{hass:{},_config:{},_data:{state:!0},_loading:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_periodMode:{state:!0},__lastFetchKey:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._periodMode="month",this.__ro=null,this._energySubscription=null}static get styles(){return r`
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
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:PRESETS.temperature,preset:"temperature",color_by:"max",listen_energy_date_selection:!0,default_ws_period:"day",debug:!1}}setConfig(i){if(!i||!i.entity)throw Error("entity is required");if(this._config={...MinMaxAvgBarCard.getStubConfig(),...i},!this._selection?.wsPeriod){let s=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(s)?s:"day"}}this._data=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.hass&&this._subscribeToEnergy(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(i){return i?this.hass?.states?.[i]:null}_unit(i){return this._stateObj(i)?.attributes?.unit_of_measurement||""}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{let i=this.renderRoot?.querySelector(".chart");i&&!this.__ro&&(this.__ro=new ResizeObserver(i=>{let s=i?.[0]?.contentRect;if(!s)return;let n=Math.max(320,Math.round(s.width)),l=Math.max(240,Math.round(s.height));(n!==this._size.w||l!==this._size.h)&&(this._size={w:n,h:l})}),this.__ro.observe(i))}),this.hass&&this._subscribeToEnergy()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null,this._energySubscription&&(this._energySubscription.then(i=>{"function"==typeof i&&i()}),this._energySubscription=null),super.disconnectedCallback()}updated(i){super.updated(i),(i.has("hass")||i.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.hass&&this._config?.listen_energy_date_selection&&!this._energySubscription)try{let i=getEnergyDataCollection(this.hass);if(!i)return;this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=i.subscribe(i=>this._handleEnergyChange(i))}catch(s){console.warn("[MMAB] Failed to subscribe:",s)}}_handleEnergyChange(i){if(!i)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",i);let s=null,n=null;if(i.start&&(s=i.start instanceof Date?i.start.toISOString():String(i.start)),i.end&&(n=i.end instanceof Date?i.end.toISOString():String(i.end)),!s||!n)return;let l=new Date(s),d=(new Date(n)-l)/36e5,c="day",h={startIso:s,endIso:n,wsPeriod:c=d<=48?"hour":d<=840?"day":"month"};h.startIso===(this._selection?.startIso||"")&&h.endIso===(this._selection?.endIso||"")&&h.wsPeriod===(this._selection?.wsPeriod||"")||(this._selection=h,this.__lastFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(i){this._periodMode!==i&&(this._periodMode=i,this.__lastFetchKey="",this._fetchStatsIfNeeded())}_generateTimeline(i,s,n,l){let d=[],c=new Date(i),h=new Date(s),m=[...l].sort((i,s)=>i.start-s.start),g=0,p=0;for(;c<h&&p<1e3;){p++;let u;u="hour"===n?addHours(c,1):"month"===n?addMonths(c,1):"week"===n?addDays(c,7):addDays(c,1);let f=null;for(;g<m.length&&m[g].start<c;)g++;if(g<m.length){let b=m[g];b.start<u&&(f=b,g++)}f?d.push({...f,start:new Date(c),isEmpty:!1}):d.push({start:new Date(c),min:null,max:null,mean:null,isEmpty:!0}),c=u}return d}async _fetchStatsIfNeeded(){let i=this._config||{},s=i.entity;if(!this.hass||!s)return;let n=String(this._selection?.wsPeriod||i.default_ws_period||"day").toLowerCase(),l=n;"month"===n&&(l="week"===this._periodMode?"week":"month"),["hour","day","week","month"].includes(l)||(l="day");let d=String(this._selection?.startIso||""),c=String(this._selection?.endIso||"");if(!d||!c){let h=new Date;d=new Date(h.getFullYear(),h.getMonth(),1).toISOString(),c=new Date(h.getFullYear(),h.getMonth()+1,1).toISOString()}let m=`${s}|${l}|${d}|${c}`;if(!(this.__lastFetchKey===m&&Array.isArray(this._data))||!(this._data.length>0)){this.__lastFetchKey=m,this._loading=!0,this._err=null;try{i.debug&&console.info(`[MMAB] Fetching ${l} for ${d} -> ${c}`);let g=((await this.hass.callWS({type:"recorder/statistics_during_period",start_time:d,end_time:c,statistic_ids:[s],period:l,types:["mean","min","max"]}))?.[s]||[]).map(i=>({start:new Date(i.start),min:isFinite(i.min)?Number(i.min):null,max:isFinite(i.max)?Number(i.max):null,mean:isFinite(i.mean)?Number(i.mean):null,isEmpty:!1})).filter(i=>i.start instanceof Date&&!isNaN(i.start)),p=new Date(d),u=this._generateTimeline(p,c,l,g);this._data=u,this._loading=!1,this.requestUpdate()}catch(f){this._loading=!1,this._err=String(f?.message||f),console.warn("[MMAB] fetch error",f),this.requestUpdate()}}}_computePlotGeometry(i,s){let n=Math.max(10,i-40-10),l=Math.max(1,(this._data||[]).length),d=n/l,c=.65;l>40&&(c=.8);let h=Math.max(1,d*c);return{x0:40,y0:10,plotW:n,plotH:Math.max(10,s-10-30),n:l,barStep:d,barW:h,barXPad:(d-h)/2}}_onMove(i,s){if(!s||!Array.isArray(this._data)||!this._data.length)return;let n=i.clientX-s.left,l=i.clientY-s.top,d=Math.max(500,this._size?.w||s.width),c=n*(d/s.width),{x0:h,plotW:m,n:g,barStep:p}=this._computePlotGeometry(d,Math.max(240,this._size?.h||s.height));if(c<h||c>h+m){this._hover=null;return}let u=clamp(Math.floor((c-h)/p),0,g-1);this._hover={idx:u,px:n,py:l}}_onLeave(){this._hover=null}render(){let i=this._config||{},s=(i.language||"cs").toLowerCase(),n=(i.date_format||"eu").toLowerCase(),l=STRINGS[s]||STRINGS.cs;if(!i.entity)return t`<ha-card><div class="wrap"><div class="err">${l.missing}</div></div></ha-card>`;let d=this._stateObj(i.entity),c=this._unit(i.entity),h=i.name||(d?.attributes?.friendly_name??i.entity),m=Number(i.height||320),g=Number.isFinite(Number(i.decimals))?Number(i.decimals):1,p=Array.isArray(this._data)?this._data:[],u=String(this._selection?.wsPeriod||i.default_ws_period||"day").toLowerCase(),f=u;"month"===u&&(f="week"===this._periodMode?"week":"month");let b=1/0,y=-1/0,x=!1;for(let v of p)!v.isEmpty&&isFinite(v.min)&&isFinite(v.max)&&(b=Math.min(b,v.min),y=Math.max(y,v.max),x=!0);x||(b=0,y=1);let $=Number(i.y_padding_ratio??.08),_=y-b||1;b-=_*$,y+=_*$;let w,M=Math.max(500,this._size?.w||900),k=Math.max(240,this._size?.h||320),{x0:S,y0:T,plotW:E,plotH:C,n:D,barStep:F,barW:P,barXPad:A}=this._computePlotGeometry(M,k),B=clamp(Math.round(C/50)+1,4,8),R=niceTicks(b,y,B),I=i=>T+(R.max-i)*(C/(R.max-R.min)),z=isFinite(w=R.step)?1e-9>Math.abs(w-Math.round(w))?0:w>=.5?1:Math.min(3,g):g,H=!1!==i.show_x_labels,L=!1!==i.show_y_labels,N=!1!==i.show_y_unit,O="hour"===f||"day"===f?4:"month"===f?1:"week"===f?D>20?4:1:4,Y=this._hover,j=Y&&p[Y.idx]?p[Y.idx]:null,G=j&&!j.isEmpty,W=G?estimateBinEnd(p,Y.idx,f):null,K=G?formatRangeTitle(j.start,W,f,n):"",q=i=>isFinite(i)?Number(i).toFixed(g):"–",U=Array.isArray(i.thresholds)?i.thresholds:PRESETS.temperature,V=["max","average","min"].includes(i.color_by)?i.color_by:"max",X;return t`
      <ha-card>
        <div class="wrap" style="--mmab-height:${m}px;">
          <div class="head">
            <div class="title" title="${h}">${h}</div>
            
            ${"month"===u?t`
              <div class="toggles">
                <div class="toggle-btn ${"month"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("month")}>${l.months}</div>
                <div class="toggle-btn ${"week"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("week")}>${l.weeks}</div>
              </div>
            `:t`<div></div>`}
          </div>
          
          ${this._err?t`<div class="err">${this._err}</div>`:o}
          
          <div class="chart"
               @mousemove=${i=>this._onMove(i,i.currentTarget.getBoundingClientRect())}
               @mouseleave=${()=>this._onLeave()}>
            <svg viewBox="0 0 ${M} ${k}" role="img" aria-label="Min max avg bar chart">
              ${N&&c?a`<text class="yUnit" x="${S-5}" y="${T-6}" text-anchor="end">${c}</text>`:o}
              
              ${R.ticks.map((i,s)=>{let n=I(i);return a`
                  <line class="${0===s||s===R.ticks.length-1?"gridHStrong":"gridH"}" x1="${S}" y1="${n}" x2="${S+E}" y2="${n}"></line>
                  ${L?a`<text class="tickText" x="${S-8}" y="${n+4}" text-anchor="end">${Number(i).toFixed(z)}</text>`:o}
                `})}
              ${(()=>{let i=[];for(let s=0;s<=D;s++)if(s%O==0){let n=S+s*F+F/2;i.push(a`<line class="gridV" x1="${n}" y1="${T}" x2="${n}" y2="${T+C}"></line>`)}return i})()}
              
              ${p.map((s,n)=>{if(s.isEmpty)return o;let l=isFinite(s.min)?s.min:null,d=isFinite(s.max)?s.max:null,c=isFinite(s.mean)?s.mean:null;if(null==l||null==d)return o;let h=S+n*F+A,m=colorForValue("min"===V?l:"average"===V?c??d:d,U),g=I(d),p=Math.max(2,I(l)-g),u=Number(i.bar_radius??4),f=null==c?null:I(c);return a`
                  <rect class="barFill ${Y&&Y.idx===n?"active":""}" x="${h}" y="${g}" width="${P}" height="${p}" fill="${m}" rx="${u}" ry="${u}"></rect>
                  <rect class="barStroke" x="${h}" y="${g}" width="${P}" height="${p}" fill="none" stroke="${m}" rx="${u}" ry="${u}"></rect>
                  ${null==f?o:a`
                    <line class="avgShadow" x1="${h+2}" y1="${f}" x2="${h+P-2}" y2="${f}"></line>
                    <line class="avgLine" x1="${h+2}" y1="${f}" x2="${h+P-2}" y2="${f}"></line>
                  `}
                `})}

              ${H?p.map((i,l)=>l%O!=0?o:a`<text class="xText" x="${S+l*F+F/2}" y="${T+C+16}" text-anchor="middle">${formatXLabel(i.start,f,l,s,n)}</text>`):o}
              
              ${Y?(X=S+Y.idx*F+F/2,a`<line class="hoverLine" x1="${X}" y1="${T}" x2="${X}" y2="${T+C}"></line>`):o}

              <rect class="overlay" x="${S}" y="${T}" width="${E}" height="${C}"></rect>
            </svg>

            ${G?t`
              <div class="tooltip" style="left:${Y.px}px; top:${Y.py}px">
                <div class="tt-title">${K}</div>
                <div class="tt-row"><span class="k">${l.max}</span><span class="v">${q(j.max)}${c?` ${c}`:""}</span></div>
                <div class="tt-row"><span class="k">${l.avg}</span><span class="v">${q(j.mean)}${c?` ${c}`:""}</span></div>
                <div class="tt-row"><span class="k">${l.min}</span><span class="v">${q(j.min)}${c?` ${c}`:""}</span></div>
              </div>
            `:o}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}function cssColorToHex(i,s){try{let n=document.createElement("span");n.style.position="absolute",n.style.left="-9999px",n.style.top="-9999px",n.style.opacity="0",n.style.color=String(i||""),(s?.shadowRoot||document.body).appendChild(n);let l=getComputedStyle(n).color;n.remove();let d=l.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!d)return"";let c=i=>String(i.toString(16)).padStart(2,"0");return`#${c(Number(d[1]))}${c(Number(d[2]))}${c(Number(d[3]))}`}catch{return""}}class MinMaxAvgBarCardEditor extends e{static get properties(){return{hass:{},_config:{}}}setConfig(i){this._config={...i||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=PRESETS.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(i){i.stopPropagation();let s=i.detail.value,n=this._config?.preset,l=s?.preset;if(l&&l!==n){let d=PRESETS[l]||PRESETS.temperature;s={...s,thresholds:d.map(i=>({...i}))}}this._config=s,fireEvent(this,"config-changed",{config:s})}_setThresholds(i){let s=(i||[]).map(i=>({lt:Number(i.lt),color:String(i.color??"")})).filter(i=>isFinite(i.lt)&&i.color).sort((i,s)=>i.lt-s.lt),n={...this._config||{}};n.thresholds=s.length?s:PRESETS.temperature,this._config=n,fireEvent(this,"config-changed",{config:n})}_updateThreshold(i,s){let n=(this._config.thresholds||[]).map(i=>({...i}));n[i]={...n[i]||{},...s||{}},this._setThresholds(n)}_addThreshold(){let i=(this._config.thresholds||[]).map(i=>({...i}));i.push({lt:(Number(i[i.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(i)}_removeThreshold(i){let s=(this._config.thresholds||[]).map(i=>({...i}));s.splice(i,1),this._setThresholds(s.length?s:PRESETS.temperature)}static get styles(){return r`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Temperature (C)"},{value:"temperature_f",label:"Temperature (F)"},{value:"beaufort",label:"Wind (Beaufort)"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"max",label:"Maximum"},{value:"average",label:"Average"},{value:"min",label:"Minimum"}]}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"date_format",selector:{select:{mode:"dropdown",options:[{value:"eu",label:"European (26. 1.)"},{value:"intl",label:"International (26-Jan)"}]}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass)return o;let i=STRINGS[this._config?.language||"cs"]||STRINGS.cs,s=this._config.thresholds||PRESETS.temperature,n=!!customElements.get("ha-color-picker"),l=this._config.color_by||"max";return t`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${i.thresholds} (${i.thresholds_by} ${"min"===l?i.color_by_min:"average"===l?i.color_by_average:i.color_by_max})</div><mwc-button @click=${()=>this._addThreshold()}>${i.add}</mwc-button></div>
            <div class="rows">
                ${s.map((s,l)=>{let d=s.color||"",c=cssColorToHex(d,this)||"#3f51b5";return t`
                        <div class="row">
                            <ha-textfield label="${i.lt}" type="number" .value=${String(s.lt)} @change=${i=>this._updateThreshold(l,{lt:Number(i.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${d};"></div>
                                ${n?t`<ha-color-picker .value=${c} @value-changed=${i=>this._updateThreshold(l,{color:i.detail?.value||c})}></ha-color-picker>`:t`<input type="color" .value=${c} @input=${i=>this._updateThreshold(l,{color:i.target.value})} />`}
                                <ha-textfield label="${i.color}" .value=${d} @change=${i=>this._updateThreshold(l,{color:i.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(l)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}}customElements.define("minmax-avg-bar-card-editor",MinMaxAvgBarCardEditor);const fireEvent=(i,s,n={},l={})=>{let d=new Event(s,{bubbles:l?.bubbles??!0,cancelable:l?.cancelable??!1,composed:l?.composed??!0});return d.detail=n,i.dispatchEvent(d),d};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",MinMaxAvgBarCard);