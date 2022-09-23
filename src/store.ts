import { reactive } from 'vue'

export const store: { user_id: string | null } = reactive({
  user_id: null,
})
