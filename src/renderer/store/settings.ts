import { ActionTree } from 'vuex'
import { RootState } from '@/store'
import { Settings } from '@/store/types/Settings'

export const namespaced = true

export const state = ():Settings => ({})

export type SettingsState = ReturnType<typeof state>

export const actions: ActionTree<SettingsState, RootState> = {
  destroyMtSettings () {
    localStorage.mastootConfigUsers = ''
  }
}
