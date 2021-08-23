import { ActionTree } from 'vuex'
import { RootState } from '@/store'
import { Settings } from '@/store/types/Settings'

const ipcRenderer = window.ipc

export const namespaced = true

export const state = ():Settings => ({})

export type SettingsState = ReturnType<typeof state>

export const actions: ActionTree<SettingsState, RootState> = {
  destroyMtSettings () {
    localStorage.clear()
    ipcRenderer.invoke('restart')
  }
}
