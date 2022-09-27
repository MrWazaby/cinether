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
        <ion-label position="stacked">Update your avatar</ion-label>
        <ion-input
          type="file"
          id="single"
          accept="image/*"
          @change="uploadAvatar"
          :disabled="loading"
        />
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonProgressBar, alertController } from '@ionic/vue';
import { supabase } from '../supabase';
import validator from 'validator';

export default  defineComponent({
  name: 'ResetPassword',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonInput, IonProgressBar },
  mounted() {
    const user = supabase.auth.user()
      if(user !== null) {
        this.myID = user.id
      }
  },
  data() {
    return {
      myID: "",
      loading: false,
    }
  },
  methods: {
    async uploadAvatar(evt: any) {
      const values = evt.target.files
      try {
        this.loading = true
        if (!values || values.length === 0) throw new Error('You must select an image to upload.')

        const file = values[0]
        const fileExt = file.name.split('.').pop()
        const fileName = "avatar.jpg"
        const filePath = `${this.myID}/${fileName}`

        if(fileExt !== "jpg") throw new Error("You can only upload jpg")

        let { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            upsert: true
          })
        if (uploadError) throw uploadError
        
        const alert = await alertController.create({
          header: 'Success',
          subHeader: 'Your avatar is changed!',
          message: 'You can change it at any time.',
          buttons: ['OK'],
        })
        await alert.present();
        this.loading = false
        this.$router.push('/tabs/profiles')
      }  catch(error: any) {
          const alert = await alertController.create({
            header: 'Error',
            subHeader: 'An error happend during the change of your avatar.',
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
