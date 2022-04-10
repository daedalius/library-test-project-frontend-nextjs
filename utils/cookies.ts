export const cookies = {
  get: function (key) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const part = cookies[i].split('=');
      if (part && part[0] === key) return unescape(part[1]);
    }
  },
  set: function (key, value, days) {
    const date = new Date();
    date.setDate(date.getDate() + days || 7);
    return (document.cookie = key + '=' + escape(value) + '; expires=' + date.toGMTString() + '; path=/');
  },
  del: function (key) {
    this.set(key, '', -1);
  },
};
