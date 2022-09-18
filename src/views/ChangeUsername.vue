<template>
  <ion-page>
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

      <ion-searchbar placeholder="Search for a user"></ion-searchbar>
      
      <ion-card>
        <ion-item>
          <ion-avatar slot="start">
            <img src="https://avatars.githubusercontent.com/u/7716380?v=4">
          </ion-avatar>
          <ion-label>Alexandre Martin</ion-label>
          <ion-button fill="outline" slot="end" color="medium" @click="presentSettingsActionSheet">Settings</ion-button>
        </ion-item>
       
        <ion-list>
          <ion-item>
            <ion-label>Followers</ion-label>
            <ion-badge color="primary">22k</ion-badge>
          </ion-item> 

          <ion-item>
            <ion-label>Following</ion-label>
            <ion-badge color="secondary">158</ion-badge>
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
            <ion-badge color="light">17/09/2022</ion-badge>
          </ion-item>

        </ion-list>

        <ion-card-content>
          User description
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonCard, IonAvatar, IonList, actionSheetController } from '@ionic/vue';
import { idCard, close, camera, lockOpen } from 'ionicons/icons';

export default defineComponent({
  name: 'profiles-page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, IonButton, IonCard, IonAvatar, IonList },
  methods: {
    async presentSettingsActionSheet() {
      const actionSheet = await actionSheetController
        .create({
          header: 'Settings',
          buttons: [
          {
              text: 'Change my password',
              icon: lockOpen,
              handler: () => {
                console.log('Change password clicked')
              },
            },
            {
              text: 'Change my pseudo',
              icon: idCard,
              handler: () => {
                console.log('pseudo clicked')
              },
            },
            {
              text: 'Change my avatar',
              icon: camera,
              handler: () => {
                console.log('avatar clicked')
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
