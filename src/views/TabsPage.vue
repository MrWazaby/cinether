<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="triangle" />
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tabs/profiles">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Profiles</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, triangle, peopleOutline } from 'ionicons/icons';
import { supabase } from '../supabase'

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      ellipse,  
      triangle,
      peopleOutline
    }
  },
  mounted() {
    console.log(supabase.auth.session())
    if(supabase.auth.session() === null) {
      this.$router.push("/")
    }
  }
});
</script>
