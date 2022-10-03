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
        <ion-label position="stacked">Update your descritpion</ion-label>
        <ion-textarea placeholder="Description" v-model="description"></ion-textarea>
      </ion-item>
      <ion-button expand="block" @click="changeDescription()"><ion-icon :icon="refreshCircleOutline" class="ion-margin-end"></ion-icon>Change my descritpion</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonIcon, IonProgressBar, alertController } from '@ionic/vue';
import { refreshCircleOutline } from 'ionicons/icons';
import { supabase } from '../supabase';

export default  defineComponent({
  name: 'changeDescription',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonTextarea, IonIcon, IonProgressBar },
  setup() {
    return {
      refreshCircleOutline
    }
  },
  data() {
    return {
      myID: "",
      description: "",
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
      async changeDescription() {
        this.loading = true
        try {
          const { error } = await supabase
          .from('profiles')
          .update({ description: this.description })
          .match({ id: this.myID })
          if(error) throw error
          this.description = ""
          const alert = await alertController.create({
            header: 'Success',
            subHeader: 'Your description is changed!',
            message: 'You can change it at any time.',
            buttons: ['OK'],
          })
          await alert.present();
          this.loading = false
          this.$router.push('/tabs/profiles')
        } catch(error: any) {
            const alert = await alertController.create({
              header: 'Error',
              subHeader: 'An error happend during the change of your description.',
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
