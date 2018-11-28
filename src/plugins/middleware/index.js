import Config from '../../config'
import Axios from 'axios';
import StellarSdk from 'stellar-sdk';

const Middleware = {
    install(Vue) {
        const axios = Axios.create({
            baseURL: Config.middlewareHost,
              headers: {
                'Content-Type': 'application/json'
              }
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

            airdrop(account, asset, secret) {
                var kp = StellarSdk.Keypair.fromSecret(secret);

                return horizon.loadAccount(kp.publicKey())
                    .then(function(source) {
                        var tx = new StellarSdk.TransactionBuilder(source)
                            .addOperation(StellarSdk.Operation.payment({
                                destination: account,
                                asset: new StellarSdk.Asset(asset, kp.publicKey()),
                                amount: "100"
                              }))
                            .build();

                        tx.sign(kp);

                        return horizon.submitTransaction(tx);
                    })
            },

            getMerchants: function() {
                return axios.get("/merchants").then(resp => {
                    return resp.data
                })
            },


            getSubscribers: function(pubkey) {
                return axios.get("/subscribers/" + pubkey).then(resp => {
                    return resp.data
                })
            },

            requestFromFaucet: function(address, amount) {
              return axios.get("/faucet/"+address, {
                params: {
                  amount
                }
              }).then(resp => {
                return resp.data
              })
            },
        }
    }
};

export default Middleware;