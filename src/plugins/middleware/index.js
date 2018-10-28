import Config from '../../config'
import Axios from 'axios';

const Middleware = {
    install(Vue) {
        const axios = Axios.create({
          baseURL: Config.middlewareHost,
        });

        Vue.middleware = Vue.prototype.$middleware = {
            addMerchant: function(data) {
                return axios.post("/merchant", data);
            },

            getMerchants: function() {
                return axios.get("/merchants").then(resp => {
                    return resp.data
                })
            }
        }
    }
};

export default Middleware;