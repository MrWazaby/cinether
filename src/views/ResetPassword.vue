<template>
  <ion-page>
    <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cinether</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button size="small" color="medium" @click="$router.push('/')">Back home</ion-button>
      <ion-item class="ion-margin">
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
  mounted() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        if(session != null) {
          this.accessToken = session["access_token"]
        }
      } 
    })
  },
  data() {
    return {
      password: "",
      passwordCheck: "",
      accessToken: "",
      loading: false,
    }
  },
  methods: {
      async reset() {
        this.loading = true
        try {
          if(!validator.isStrongPassword(this.password)) throw new Error("Your password is not strong enought. You must have at least 8 characters, one lower case, one upper case, one number and one sepcial character.")
          if(this.password != this.passwordCheck) throw new Error("The two passwords does not match.")
          if(this.accessToken == "") throw new Error("Your reset link is invalid or expired.")
          const { error } = await supabase.auth.api.updateUser(this.accessToken, {
            password: this.password,
          });
          if(error) throw error
          this.password = ""
          this.passwordCheck = ""
          const alert = await alertController.create({
            header: 'Success',
            subHeader: 'Your password is changed!',
            message: 'You can now log in to your accont.',
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
          this.$router.push('/')
        } catch(error: any) {
            const alert = await alertController.create({
              header: 'Error',
              subHeader: 'An error happend during the reset of your password',
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
