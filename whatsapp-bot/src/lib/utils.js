const utils = {
    formatBytes: (b) => {
        if (b === 0) return '0 Bytes';
        const k = 1024;
        const s = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return (b / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
    },
    sleep: (ms) => new Promise(r => setTimeout(r, ms)),
    isUrl: (s) => {
        try { new URL(s); return true; }
        catch { return false; }
    },
    getRandom: (a) => a[Math.floor(Math.random() * a.length)]
};
module.exports = utils;
