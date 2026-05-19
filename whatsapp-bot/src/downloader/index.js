const axios = require('axios');
const dl = {
    tiktok: async(url) => {
        try {
            const { data } = await axios.get('https://api.tiklydown.eu.org/api/download?url=' + url);
            return { success: true, data };
        } catch(e) {
            return { success: false, error: e.message };
        }
    },
    instagram: async(url) => {
        try {
            const { data } = await axios.get('https://api.savefrom.biz/api/convert?url=' + url);
            return { success: true, data };
        } catch(e) {
            return { success: false, error: e.message };
        }
    },
    youtube: async(url) => {
        try {
            const { data } = await axios.post('https://api.y2mate.com/analyze/ajax?url=' + url);
            return { success: true, data };
        } catch(e) {
            return { success: false, error: e.message };
        }
    }
};
module.exports = dl;
