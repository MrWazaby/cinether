<template>
  <ion-page>
    <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profiles</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-searchbar placeholder="Search for a user" @ionInput="search = $event.target.value"></ion-searchbar>
      
      <ion-card v-if="showSearch">
        <ion-card-header>
          <ion-card-subtitle>Search results</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item v-for="user in searchResults" :key="user.id" @click="getProfile(user.id)">
              <ion-label>
                {{ user.username }}
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-item>
          <ion-avatar slot="start">
            <img v-bind:src="avatarUrl">
          </ion-avatar>
          <ion-label>{{ username }}</ion-label>
          <ion-button v-if="id === myID" fill="outline" slot="end" color="medium" @click="presentSettingsActionSheet">Settings</ion-button>
          <ion-button v-else fill="outline" slot="end" color="primary" @click="presentSettingsActionSheet">Follow</ion-button>
        </ion-item>
       
        <ion-list>
          <ion-item>
            <ion-label>Followers</ion-label>
            <ion-badge color="primary">{{ followersCount }}</ion-badge>
          </ion-item> 

          <ion-item>
            <ion-label>Following</ion-label>
            <ion-badge color="secondary">{{ followingCount }}</ion-badge>
          </ion-item>

          <ion-item>
            <ion-label>Proposed movies</ion-label>
            <ion-badge color="tertiary">30</ion-badge>
          </ion-item>

          <ion-item>
            <ion-label>Viewed movies</ion-label>
            <ion-badge color="success">30</ion-badge>
          </ion-item>

          <ion-item>
            <ion-label>Messages count</ion-label>
            <ion-badge color="dark">300</ion-badge>
          </ion-item>

          <ion-item>
            <ion-label>Member since</ion-label>
            <ion-badge color="light">{{ createdAt }}</ion-badge>
          </ion-item>

        </ion-list>

        <ion-card-content>
          {{ description }}
        </ion-card-content>
      </ion-card>

      <ion-button v-if="id !== myID" fill="outline" color="medium" @click="getProfile(myID)" class="ion-margin">Back to my profile</ion-button>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonCard, IonAvatar, IonList, actionSheetController, IonProgressBar } from '@ionic/vue';
import { idCard, close, camera, lockOpen, logOut, book } from 'ionicons/icons';
import { supabase } from '../supabase';

export default defineComponent({
  name: 'profiles-page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, IonButton, IonCard, IonAvatar, IonList, IonProgressBar },
  mounted() {
    this.getMyID()
  },
  watch: {
    "$route" () {
      this.getMyID()
    },
    search(newSearch: string) {
      if(newSearch.length >= 3) {
        this.showSearch = true
        this.searchUser(newSearch)
      } else {
        this.showSearch = false
      }
    }
  },
  data() {
    let searchResults: any[] = []
    return {
      myID: "",
      id: "",
      username: "Loading...",
      createdAt: "...",
      description: "Loading...",
      avatarUrl: "",
      followersCount: 0,
      followingCount: 0,
      loading: false,
      search: "",
      showSearch: false,
      searchResults: searchResults
    }
  },
  methods: {
    getMyID() {
      const user = supabase.auth.user()
      if(user !== null) {
        this.myID = user.id
        this.getProfile(user.id)
      }
    },
    async getAvatar(id: string) {
      this.avatarUrl = ""
      try {
        const { data, error } = await supabase.storage
            .from('avatars')
            .download(`${id}/avatar.jpg`)
        if (error) throw error
        if(data === null) {
          throw new Error("Error while processing the avatar")
        } else {
          this.avatarUrl = URL.createObjectURL(data)
        }
      } catch (error: any) {
          console.log('Error downloading image: ', error.message)
      }
    },
    async getProfile(id: string) {
      this.loading = true
      this.search = ""
      try {
        let { data, error, status } = await supabase
              .from('profiles')
              .select()
              .eq('id', id)
              .single()

        if (error && status !== 406) throw error
        if(data) {
          this.id = data.id
          this.username = data.username
          const date = new Date(data.created_at)
          this.createdAt = date.toLocaleDateString() 
          this.description = data.description
          await this.getAvatar(id)
          if(this.avatarUrl === "") this.avatarUrl = "https://icotar.com/initials/" + encodeURI(this.username) + ".png"  
        }

        let count
        ({ error, count } = await supabase
              .from('followers')
              .select(`following_id`, { count: 'exact' })
              .eq('follower_id', id)
        )

        if (error && status !== 406) throw error
        if(count !== null) {
          this.followingCount = count
        }

        ({ error, count } = await supabase
              .from('followers')
              .select(`follower_id`, { count: 'exact' })
              .eq('following_id', id)
        )

        if (error && status !== 406) throw error
        if(count !== null) {
          this.followersCount = count
        }
      } catch (error: any) {
          alert(error.message)
      } finally {
        this.loading = false
      }
    },
    async searchUser(search: string) {
      this.loading = true
      const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', "%" + search + "%")
      if(data) {
        this.searchResults = data
      }
      this.loading = false
    },
    async presentSettingsActionSheet() {
      const actionSheet = await actionSheetController
        .create({
          header: 'Settings',
          buttons: [
          {
              text: 'Change my password',
              icon: lockOpen,
              handler: () => {
                this.$router.push('/settings/password')
              },
            },
            {
              text: 'Change my username',
              icon: idCard,
              handler: () => {
                this.$router.push('/settings/username')
              },
            },
            {
              text: 'Change my description',
              icon: book,
              handler: () => {
                this.$router.push('/settings/description')
              },
            },
            {
              text: 'Change my avatar',
              icon: camera,
              handler: () => {
                this.$router.push('/settings/avatar')
              },
            },
            {
              text: 'Log out',
              icon: logOut,
              handler: async () => {
                
                await supabase.auth.signOut()
                this.$router.push('/')
              },
            },

            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        });
      await actionSheet.present();
    },
  },
});
</script>
