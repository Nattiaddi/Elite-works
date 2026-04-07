import React, { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    // Tawk.to Script Integration
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69d58c020d1c3f1c37998017/1jll2lr7d';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Cleanup function: ገጹ ሲቀየር ቻቱ እንዲጠፋ ከፈለግክ (አማራጭ ነው)
    return () => {
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  return null; // ይህ ኮምፖነንት በራሱ ምንም አይታይም (UI የለውም)
};

export default LiveChat;