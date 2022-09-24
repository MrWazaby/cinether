<template>
  <ion-page>
    <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button size="small" color="medium" @click="$router.push('/tabs/profiles')">Back</ion-button>
      <ion-item class="ion-margin">
        <ion-label position="stacked">Update your username</ion-label>
        <ion-input placeholder="Username" type="text" v-model="username"></ion-input>
      </ion-item>
      <ion-button expand="block" @click="changeUsername()"><ion-icon :icon="refreshCircleOutline" class="ion-margin-end"></ion-icon>Change my username</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon, IonProgressBar, alertController } from '@ionic/vue';
import { refreshCircleOutline } from 'ionicons/icons';
import { supabase } from '../supabase';
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
      myID: "",
      username: "",
      accessToken: "",
      loading: false,
    }
  },
  mounted() {
    const user = supabase.auth.user()
    if(user !== null) {
      this.myID = user.id
    }
  },
  methods: {
      async changeUsername() {
        this.loading = true
        try {
          if(!validator.isAlphanumeric(this.username)) throw new Error("Your username must be alphanumeric.")
          if(3 > this.username.length && this.username.length < 30 ) throw new Error("Your username must have at least 3 chars and at most 30 chars.")
          const { error } = await supabase
          .from('profiles')
          .update({ username: this.username })
          .match({ id: this.myID })
          if(error) throw error
          this.username = ""
          const alert = await alertController.create({
            header: 'Success',
            subHeader: 'Your user name is changed!',
            message: 'You can change it at any time.',
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
          this.$router.push('/tabs/profiles')
        } catch(error: any) {
            const alert = await alertController.create({
              header: 'Error',
              subHeader: 'An error happend during the change of your username.',
              message: error.error_description || error.message,
              buttons: ['OK'],
            })
          await alert.present();
          this.loading = false
        }         
      }
   }
});

</script>
