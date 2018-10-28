<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>

          <h1 style="position: relative" class="display-2">Merchants
          <router-link to="/merchants/add">
            <v-btn color="pink" fab dark small>
              <v-icon>add</v-icon>
            </v-btn>
          </router-link>
            </h1>
        <v-divider class="mb-3"></v-divider>
          <v-alert :value="success" type="success" class="mb-4">Please save this key: {{success}} and keep it secure</v-alert>
          <div v-if="loading">    
            <v-progress-circular :width="3" color="green" indeterminate></v-progress-circular>
          </div>
        <v-data-table v-else
          v-model="selected"
          :headers="headers"
          :items="records"
          :pagination.sync="pagination"
          select-all
          item-key="pubkey"
          class="elevation-1"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>{{ moment(props.item.created_at).format('MMMM Do YYYY, h:mm:ss a') }}</td>
              <td class="text-center">{{ props.item.title }}</td>
              <td class="text-center">{{ props.item.pubkey }}</td>
              <td class="text-center">{{ props.item.asset_code }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import Moment from 'moment';

  export default {
    components: {
      'navigation': Navigation,
    },
    data: () => ({
       pagination: {
        sortBy: 'date'
      },
      moment: Moment,
      loading: true,
      selected: [],
      headers: [
        {
          text: 'Created At',
          align: 'left',
          value: 'created_at'
        },
        { text: 'Title', value: 'title' },
        { text: 'Address', value: 'pubkey' },
        { text: 'Asset', value: 'asset_code' },
      ],
      records: [],
      success: false,
    }),
    methods: {
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    mounted : function() {
      this.success = this.$route.query.success;

      this.$middleware.getMerchants()
        .then(r => {
          this.loading = false;
          this.records = r
        })
        .catch(e => {
          console.log(e)
          this.loading = false;
        })
    }
  }
</script>