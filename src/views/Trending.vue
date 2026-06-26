<template>
  <div id="trending" class="pt-7 px-sm-10">
    <v-container fluid>
      <v-row>
        <v-col
          cols="8"
          sm="7"
          md="10"
          lg="10"
          v-for="(video, i) in loading ? 12 : videos"
          :key="i"
          class="mx-lg-0 mx-md-0 mx-sm-auto mx-auto"
        >
          <v-skeleton-loader
            class="mx-auto"
            type="list-item-avatar-three-line"
            :loading="loading"
            tile
            large
          >
            <v-card class="card" tile flat :to="`/watch/${video.videoId}`">
              <v-row no-gutters>
                <v-col class="mx-auto" cols="12" sm="8" md="5" lg="4">
                  <v-img
                    max-height="200"
                    class="align-center"
                    :src="getThumbnail(video)"
                  ></v-img>
                </v-col>
                <v-col class="hidden-sm-and-down">
                  <div class="ml-4">
                    <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold">
                      {{ video.title }}
                    </v-card-title>

                    <v-card-subtitle class="pl-2 pb-0">
                      {{ video.author }}
                      <v-icon>mdi-circle-small</v-icon>
                      {{ video.viewCount || video.views || 0 }} views
                      <v-icon>mdi-circle-small</v-icon>
                      {{ dateFormatter(video.published) }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-2 pt-0">
                      {{ truncateText(video.description || '', 200) }}
                    </v-card-subtitle>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col class="text-center" v-if="videos.length === 0 && !loading && !errored">
          <p>No trending videos yet</p>
        </v-col>
        <v-col class="text-center" v-if="errored">
          <v-alert prominent type="error">
            <v-row align="center">
              <v-col class="grow">
                <div class="title">Error!</div>
                <div>Something went wrong, but don't fret — let's give it another shot.</div>
              </v-col>
              <v-col class="shrink">
                <v-btn @click="getVideos">Take action</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="12">
          <infinite-loading @infinite="getVideos">
            <div slot="spinner">
              <v-progress-circular
                indeterminate
                color="red"
              ></v-progress-circular>
            </div>
            <div slot="no-results"></div>
            <span slot="no-more"></span>
            <div slot="error" slot-scope="{ trigger }">
              <v-alert prominent type="error">
                <v-row align="center">
                  <v-col class="grow">
                    <div class="title">Error!</div>
                    <div>
                      Something went wrong, but don't fret — let's give it
                      another shot.
                    </div>
                  </v-col>
                  <v-col class="shrink">
                    <v-btn @click="trigger">Take action</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </infinite-loading>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'

import { invidiousApi } from '@/services/invidious'

export default {
  name: 'Trending',
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    videos: []
  }),
  methods: {
    async getVideos($state) {
      if (this.loaded) {
        if ($state) $state.complete()
        return
      }
      this.loading = true

      const videos = await invidiousApi
        .getTrending('US', 'default')
        .catch((err) => {
          console.log(err)
          this.errored = true
          if ($state) $state.error()
        })
        .finally(() => {
          this.loading = false
        })

      if (!videos) return

      const mapped = Array.isArray(videos) ? videos : videos.videos || []
      if (mapped.length) {
        this.videos.push(...mapped)
        this.loaded = true
        if ($state) $state.complete()
      } else if ($state) {
        $state.complete()
      }
    },
    getThumbnail(video) {
      if (video.videoThumbnails && video.videoThumbnails.length) {
        const hq = video.videoThumbnails.find(
          (t) => t.quality === 'medium' || t.quality === 'high'
        )
        return hq ? hq.url : video.videoThumbnails[0].url
      }
      return video.videoId
        ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
        : ''
    },
    truncateText(string, num) {
      if (string.length <= num) {
        return string
      }
      return string.slice(0, num)
    },
    dateFormatter(date) {
      return date ? moment.unix(date).fromNow() : ''
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<style lang="scss">
.v-skeleton-loader__list-item-avatar-three-line {
  height: 250px;
  .v-skeleton-loader__paragraph.v-skeleton-loader__bone {
    margin-top: -125px;
    @media (max-width: 700px) {
      display: none;
      margin-top: inherit;
    }
  }
  .v-skeleton-loader__avatar {
    height: 200px !important;
    width: 300px !important;
  }
  .v-skeleton-loader__text {
    height: 20px;
  }
}
</style>
