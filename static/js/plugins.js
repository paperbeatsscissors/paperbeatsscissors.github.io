function CountDownTimer(n,t){this.duration=n,this.granularity=t||1e3,this.tickFtns=[],this.running=!1}CountDownTimer.prototype.start=function(){var t,i,o,r;this.running||(this.running=!0,t=Date.now(),i=this,function n(){0<(o=i.duration-((Date.now()-t)/1e3|0))?setTimeout(n,i.granularity):(o=0,i.running=!1),r=CountDownTimer.parse(o),i.tickFtns.forEach(function(n){n.call(this,r.minutes,r.seconds)},i)}())},CountDownTimer.prototype.onTick=function(n){return"function"==typeof n&&this.tickFtns.push(n),this},CountDownTimer.prototype.expired=function(){return!this.running},CountDownTimer.parse=function(n){return{minutes:n/60|0,seconds:n%60|0}};