<template>
  <nav id="navbar">
    <v-app-bar class="white" flat app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold"
        ><router-link to="/" class="black--text" style="text-decoration: none"
          >VueTube</router-link
        ></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-text-field
        flat
        hide-details
        append-icon="mdi-magnify"
        placeholder="Search"
        outlined
        dense
        v-model="searchText"
        @click:append="search"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn
        tile
        outlined
        color="blue"
        class="font-weight-bold"
        v-if="!$store.getters.isAuthenticated"
        router
        to="/signin"
      >
        <v-icon left size="26">mdi-account-circle</v-icon> Sign in
      </v-btn>

      <v-menu offset-y left v-else>
        <template v-slot:activator="{ on }">
          <v-btn small color="red" depressed fab v-on="on" class="white--text">
            <v-avatar v-if="currentUser.photoUrl !== 'no-photo.jpg'">
              <img
                :src="`${getUrl}/uploads/avatars/${currentUser.photoUrl}`"
                :alt="`${currentUser.channelName} avatar`"
              />
            </v-avatar>
            <template v-else>
              <span class="headline">
                {{ currentUser.channelName.split('')[0].toUpperCase() }}
              </span>
            </template>
          </v-btn>
        </template>
      </v-menu>
    </v-app-bar>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    drawer: true,
    searchText: ''
  }),
  computed: {
    ...mapGetters(['currentUser', 'getUrl', 'isAuthenticated'])
  },
  methods: {
    search() {
      if (!this.searchText) return
      this.$router.push({
        name: 'Search',
        query: { 'search-query': this.searchText }
      })
    }
  }
}
</script>
