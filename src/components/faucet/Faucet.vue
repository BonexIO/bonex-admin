<template>
    <v-app id="faucet">
        <navigation></navigation>
        <v-content>
            <v-container>
                <h1 class="display-2"><span class="font-weight-light">Faucet</span></h1>
                <v-divider class="mb-4"></v-divider>
                <div v-if="loading">
                    <v-progress-circular :width="3" color="green" indeterminate></v-progress-circular>
                </div>
                <v-form v-else ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="address" label="Address" :rules="addressRules" prepend-icon='account_circle'></v-text-field>
                    <v-text-field v-model="amount" label="Amount" :rules="amountRules" prepend-icon='attach_money'></v-text-field>

                    <v-btn :disabled="!valid" @click="submit">submit</v-btn>
                    <v-btn @click="clear">reset</v-btn>
                </v-form>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  import Navigation from '../Navigation.vue'
  //import StellarSdk from 'stellar-sdk'

  export default {
    components: {
      'navigation': Navigation,
    },
    data: () => ({
      valid: true,
      loading: false,

      address: '',
      addressRules: [
        v => !!v || 'Please add some information',
      ],

      amount: '',
      amountRules: [
        v => !!v || 'Please add some information',
      ],
    }),
    methods: {
      submit() {
        this.loading = true;

        if (this.$refs.form.validate()) {
          this.$middleware.requestFromFaucet(this.address, this.amount)
          .then((resp) => {
            // stop spinner
            this.loading = false;
            console.log(resp);

            alert(this.amount + " bonexes sent to "+this.address);
            this.address = '';
            this.amount = '';
            //this.$router.push({ path: '/merchants', query: { success: keypair.secret() } });
          })
          .catch(err => {
            // stop spinner
            this.loading = false;
            alert(err)
          })
        }
      },
      clear() {
        this.$refs.form.reset()
      },
    },
  }
</script>