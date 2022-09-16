<template>
  <ion-page>
    <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cinether</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input placeholder="Email" type="email" v-model="email"></ion-input>
      <ion-input placeholder="Password" type="password" v-model="password"></ion-input>
      <ion-button expand="block" @click="login()"><ion-icon :icon="logInOutline" class="ion-margin-end"></ion-icon>Login</ion-button>
      <ion-button expand="block" color="light" id="open-register-modal"><ion-icon :icon="personAddOutline" class="ion-margin-end"></ion-icon> Register</ion-button>
      <a href="#" id="open-reset-modal">I forgot my password</a> {{ type }}
      
      <ion-modal trigger="open-register-modal">
        <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Register</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="register()">Create account</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-input placeholder="Email" type="email" v-model="email"></ion-input>
          <ion-input placeholder="Repeat email" type="email" v-model="emailCheck"></ion-input>
          <ion-input placeholder="Password" type="password" v-model="password"></ion-input>
          <ion-input placeholder="Repeat Password" type="password" v-model="passwordCheck"></ion-input>
          <p class="ion-marggin">
          By registering to the service you agree with the <a href="https://github.com/mrwazaby/cinether">rules</a> and with the <a href="https://github.com/mrwazaby/cineteher">privacy policy</a>.
          </p>
          <ion-button expand="block" @click="register()"><ion-icon :icon="personAddOutline" class="ion-margin-end"></ion-icon>Create account</ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal trigger="open-reset-modal">
        <ion-progress-bar type="indeterminate" v-if="loading"></ion-progress-bar>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Password reset</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="reset()">Reset my password</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-input placeholder="Email" type="email" v-model="email"></ion-input>
          <ion-button expand="block" @click="reset()"><ion-icon :icon="refreshCircleOutline" class="ion-margin-end"></ion-icon>Reset my password</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon, IonModal, IonProgressBar, modalController, alertController } from '@ionic/vue';
import { logInOutline, personAddOutline, refreshCircleOutline } from 'ionicons/icons';
import { supabase } from '../supabase';
import { store } from '../store';
import validator from 'validator';

export default  defineComponent({
  name: 'LoginPage',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonInput, IonIcon, IonModal, IonProgressBar },
  setup() {
    return {
      logInOutline,
      personAddOutline,
      refreshCircleOutline
    }
  },
  data() {
    return {
      email: "",
      emailCheck: "",
      password: "",
      passwordCheck: "",
      loading: false,
    }
  },
  props: {
    accessToken: {
      type: String
    },
    type: {
      type: String
    }
  },
  methods: {
      async cancel() {
        await modalController.dismiss();
      },
      async login() {
        this.loading = true
        try {
          const { error } = await supabase.auth.signIn({
            email: this.email,
            password: this.password,
          })
          if (error) throw error
          store.user = supabase.auth.user()
          this.email = ""
          this.password = ""
          this.$router.push('/tabs/tab1')
          this.loading = false
        } catch (error: any) {
            const alert = await alertController.create({
              header: 'Error',
              subHeader: 'An error happend during the log in to your account',
              message: error.error_description || error.message,
              buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
        }
      },
      async register() {
        this.loading = true
        try {
          if(!validator.isEmail(this.email)) throw new Error("Your email is invalid.")
          if(!validator.isStrongPassword(this.password)) throw new Error("Your password is not strong enought. You must have at least 8 characters, one lower case, one upper case, one number and one sepcial character.")
          if(this.email != this.emailCheck) throw new Error("The two emails does not match.")
          if(this.password != this.passwordCheck) throw new Error("The two passwords does not match.")
          const { error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password
          })
          if(error) throw error 
          const alert = await alertController.create({
            header: 'Success',
            subHeader: 'Your account is created!',
            message: 'Please check your email for validation. If you do not recieve the email you may already have an account on Cinether with this email.',
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
          await modalController.dismiss();
          this.email = ""
          this.emailCheck = ""
          this.password = ""
          this.passwordCheck = ""
        } catch(error: any) {
          const alert = await alertController.create({
            header: 'Error',
            subHeader: 'An error happend during the creation of your account',
            message: error.error_description || error.message,
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
        }
      },
      async reset() {
        this.loading = true
        try {
          const { error } = await supabase.auth.api.resetPasswordForEmail(this.email, {
            redirectTo: `${process.env.VUE_APP_PUBLIC_SITE_URL}/reset-password`,
          })
          if (error) throw error
          this.email = ""
          const alert = await alertController.create({
            header: 'Success',
            subHeader: 'Check you mailbox!',
            message: 'If an account with this email exists you will get a link to reset your password.',
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
          await modalController.dismiss();
        } catch (error: any) {
            const alert = await alertController.create({
              header: 'Error',
              subHeader: 'An error happend during the log in to your account',
              message: error.error_description || error.message,
              buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
        }
      },
    }
});

</script>
