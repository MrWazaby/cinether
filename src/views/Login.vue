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
      <ion-button expand="block" color="light" id="open-register-modal"><ion-icon :icon="personAddOutline" class="ion-margin-end"></ion-icon> Register</ion-button>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/vue';
import { logInOutline, personAddOutline } from 'ionicons/icons';

export default  defineComponent({
  name: 'LoginPage',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonIcon },
  setup() {
    return {
      logInOutline,
      personAddOutline
    }
  }
});

</script>
