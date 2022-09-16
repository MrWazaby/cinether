<template>
  <ion-page>
    <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cinether</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Reset your password</ion-label>
        <ion-input placeholder="Password" type="password" v-model="password"></ion-input>
        <ion-input placeholder="Repeat Password" type="password" v-model="passwordCheck"></ion-input>
      </ion-item>
      <ion-button expand="block" @click="reset()"><ion-icon :icon="refreshCircleOutline" class="ion-margin-end"></ion-icon>Reset my password</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon, IonProgressBar, modalController, alertController } from '@ionic/vue';
import { refreshCircleOutline } from 'ionicons/icons';
import { supabase } from '../supabase';
import { store } from '../store';
import validator from 'validator';

export default  defineComponent({
  name: 'ResetPassword',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonInput, IonIcon, IonProgressBar },
  setup() {
    return {
      refreshCircleOutline
    }
  },
  data() {
    return {
      password: "",
      passwordCheck: "",
      loading: false,
    }
  },
  methods: {
      async reset() {
        this.loading = true
        const parsedParams = {};
        this.$route.hash.split('&')
          .map((part: string) => part.replace(/^#/, ''))
          .forEach((param: string) => {
            const parts = param.split('=');
            parsedParams[parts[0]] = parts[1];
          }); 
        console.log(parsedParams)
      }
   }
});

</script>
