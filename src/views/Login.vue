<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cinether</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input placeholder="Email"></ion-input>
      <ion-input placeholder="Password" type="password"></ion-input>
      <ion-button expand="block"><ion-icon :icon="logInOutline" class="ion-margin-end"></ion-icon>Login</ion-button>
      <ion-button expand="block" color="light" ref="modal" id="open-register-modal"><ion-icon :icon="personAddOutline" class="ion-margin-end"></ion-icon> Register</ion-button>
      
      <ion-modal ref="modal" trigger="open-register-modal">
        <ion-header>
          <ion-toolbar>
            <ion-buttons>
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Register</ion-title>
            <ion-buttons >
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonModal, modalController } from '@ionic/vue';
import { logInOutline, personAddOutline } from 'ionicons/icons';

export default  defineComponent({
  name: 'LoginPage',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonIcon, IonModal },
  setup() {
    return {
      logInOutline,
      personAddOutline
    }
  },
  methods: {
      async cancel() {
        await modalController.dismiss();
      },
      confirm() {
        //this.$refs.modal.$el.dismiss(null, 'confirm');
      }
    }
});

</script>
