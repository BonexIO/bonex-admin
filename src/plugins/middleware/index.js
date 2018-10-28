import Config from '../../config'
import Axios from 'axios';
import StellarSdk from 'stellar-sdk';

const Middleware = {
    install(Vue) {
        const axios = Axios.create({
            baseURL: Config.middlewareHost,
        });

        StellarSdk.Config.setAllowHttp(true);
        StellarSdk.Network.use(new StellarSdk.Network(Config.stellarNetwork));

        const horizon = new StellarSdk.Server(Config.horizonHost);
        const keypair = StellarSdk.Keypair.fromSecret(Config.masterSeed);

        Vue.middleware = Vue.prototype.$middleware = {
            addMerchant: function(data) {
                return horizon.loadAccount(keypair.publicKey())
                    .then(function(source) {
                        var tx = new StellarSdk.TransactionBuilder(source)
                            .addOperation(StellarSdk.Operation.createAccount({
                                destination: data.pubkey,
                                startingBalance: "200",
                                accountType: StellarSdk.xdr.AccountType.issuer().value,
                            })).build();

                        tx.sign(keypair);

                        return horizon.submitTransaction(tx);
                    })
                    .then(function() {
                        return axios.post("/merchant", data);
                    })
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