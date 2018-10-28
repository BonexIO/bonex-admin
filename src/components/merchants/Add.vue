<template>
    <v-app id="keep">
        <navigation></navigation>
        <v-content>
            <v-container>
                <h1 class="display-2">Add <span class="font-weight-light">Merchant</span></h1>
                <v-divider class="mb-4"></v-divider>
                <div v-if="loading">    
                    <v-progress-circular :width="3" color="green" indeterminate></v-progress-circular>
                </div>
                <v-form v-else ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="title" label="Merchant title" :rules="titleRules" prepend-icon='account_circle'></v-text-field>
                    <v-text-field v-model="asset" label="Asset" :rules="assetRules" prepend-icon='credit_card'></v-text-field>

                    <v-text-field label="Select Image" @focusin='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
                    <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">

                    <v-btn :disabled="!valid" @click="submit">submit</v-btn>
                    <v-btn @click="clear">reset</v-btn>
                </v-form>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Navigation from '../Navigation.vue'
import StellarSdk from 'stellar-sdk'

export default {
    components: {
        'navigation': Navigation,
    },
    data: () => ({
        imageName: '',
        imageFile: '',
        imageData: '',

        valid: true,
        loading: false,

        title: '',
        titleRules: [
            v => !!v || 'Please add some information',
        ],

        asset: '',
        assetRules: [
            v => !!v || 'Please add some information',
        ],
    }),
    methods: {
        submit() {
            this.loading = true;

            var keypair = StellarSdk.Keypair.random();

            if (this.$refs.form.validate()) {
                this.$middleware.addMerchant({
                        title: this.title,
                        pubkey: keypair.publicKey(),
                        asset_code: this.asset,
                        logo: this.imageData,
                    })
                    .then(() => {
                        // stop spinner
                        this.loading = false;
                        this.$router.push({ path: '/merchants', query: { success: keypair.secret() } });
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

        pickFile() {
            this.$refs.image.click()
        },

        onFilePicked(e) {
            this.loading = true;

            const files = e.target.files
            if (files[0] !== undefined) {
                this.imageName = files[0].name
                if (this.imageName.lastIndexOf('.') <= 0) {
                    return
                }

                const fr = new FileReader()
                fr.readAsBinaryString(files[0])
                fr.addEventListener('loadend', (f) => {
                    this.loading = false;
                    this.imageFile = files[0];
                    this.imageData = btoa(f.target.result);
                })
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageData = '';
            }
        }
    },
}
</script>