<template>
  <div id="channel-home">
    <v-parallax
      height="230"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-parallax>
    <div class="nav-bgcolor">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
              <v-skeleton-loader
                type="list-item-avatar-two-line"
                :loading="loading"
                class="mr-1"
              >
                <v-card class="transparent" flat>
                  <v-list-item three-line>
                    <v-list-item-avatar size="80">
                      <v-img
                        v-if="channel.authorAvatar !== ''"
                        :src="channel.authorAvatar"
                      ></v-img>

                      <v-avatar v-else color="red" size="60">
                        <span class="white--text headline">
                          {{
                            (channel.author || channel.channelName || '')
                              .split('')[0]
                              .toUpperCase()
                          }}</span
                        >
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content class="align-self-auto">
                      <v-list-item-title class="headline mb-1">{{
                        channel.author || channel.channelName
                      }}</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ channel.author || channel.channelName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-card flat class="transparent">
        <v-card class="transparent" flat>
          <v-card-title>Uploads</v-card-title>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              v-for="(video, i) in loading ? 10 : videos"
              :key="i"
              class="mx-xs-auto"
            >
              <v-skeleton-loader type="card-avatar" :loading="loading">
                <video-card
                  :card="{ maxWidth: 350 }"
                  :video="video"
                ></video-card>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </div>
  </div>
</template>

<script>
import { invidiousApi } from '@/services/invidious'
import VideoCard from '@/components/VideoCard'

export default {
  data: () => ({
    loading: false,
    errored: false,
    videos: [],
    channel: {}
  }),
  components: {
    VideoCard
  },
  methods: {
    async getChannel(id) {
      this.loading = true
      this.errored = false
      try {
        const channel = await invidiousApi.getChannel(id)
        this.channel = channel || {}
        const videos = await invidiousApi.getChannelVideos(id)
        this.videos = Array.isArray(videos) ? videos : videos.videos || []
      } catch (err) {
        this.errored = true
        console.log(err)
        this.$router.push('/')
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.getChannel(this.$route.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    this.getChannel(to.params.id)
    next()
  }
}
</script>
