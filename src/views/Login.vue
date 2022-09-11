<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cinether</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input placeholder="Email" type="email"></ion-input>
      <ion-input placeholder="Password" type="password"></ion-input>
      <ion-button expand="block"><ion-icon :icon="logInOutline" class="ion-margin-end"></ion-icon>Login</ion-button>
      <ion-button expand="block" color="light" ref="modal" id="open-register-modal"><ion-icon :icon="personAddOutline" class="ion-margin-end"></ion-icon> Register</ion-button>
      
      <ion-modal ref="modal" trigger="open-register-modal">
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
          <ion-input placeholder="Username" v-model="username"></ion-input> 
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
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon, IonModal, modalController, alertController } from '@ionic/vue';
import { logInOutline, personAddOutline } from 'ionicons/icons';
import { supabase } from '../supabase';
import validator from 'validator';

export default  defineComponent({
  name: 'LoginPage',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonInput, IonIcon, IonModal },
  setup() {
    return {
      logInOutline,
      personAddOutline
    }
  },
  data() {
    return {
      username: "",
      email: "",
      emailCheck: "",
      password: "",
      passwordCheck: ""
    }
  },
  methods: {
      async cancel() {
        await modalController.dismiss();
      },
      async register() {
        try {
          if(!validator.isAlphanumeric(this.username) || this.username.length < 4) throw new Error("Username must be alphanumeric and > 4 charcters.")
          if(!validator.isEmail(this.email)) throw new Error("Your email is invalid.")
          if(!validator.isStrongPassword(this.password)) throw new Error("Your password is not strong enought. You must have at least 8 characters, one lower case, one upper case, one number and one sepcial character.")
          if(this.email != this.emailCheck) throw new Error("The two emails does not match.")
          if(this.password != this.passwordCheck) throw new Error("The two passwords does not match.")
          const { error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password
          },{
            data: {
              username: this.username,
            }
          })
          if(error) throw error 
          const alert = await alertController.create({
            header: 'Sucess',
            subHeader: 'Your account is created!',
            message: 'Please check your email for validation. If you do not recieve the email you may already have an account on Cinether with this email.',
            buttons: ['OK'],
          })
          await alert.present();
          await modalController.dismiss();

        } catch(error: any) {
          const alert = await alertController.create({
            header: 'Error',
            subHeader: 'An error happend during the creation of your account',
            message: error.error_description || error.message,
            buttons: ['OK'],
          })
          await alert.present();
        }
      },
    }
});

</script>
