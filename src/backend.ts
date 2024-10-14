import PocketBase from 'pocketbase';
import type { UsersResponse, TypedPocketBase } from './pocketbase-types.ts'
import { ref } from 'vue'


//export de la connexion à PocketBase afin de le réutiliser dans les composants
export const pb = new PocketBase(import.meta.env.VITE_URL_POCKETBASE) as TypedPocketBase

//Déconnecte l'utilisateur
export function logout () {
  pb.authStore.clear()
}

//Connexion avec Github
export async function loginWithGitHub(){
  const authData = await pb
    .collection("users")
    .authWithOAuth2({provider: "github"})
  console.log ("loginWithGitHub authData", authData);
}

export async function loginWithGoogle(){
  const authData = await pb
    .collection("users")
    .authWithOAuth2({provider: "google"})
  console.log ("google authData", authData);
}

/** Utilisteur connecté */
export const user = ref<UsersResponse | null>(null)
pb.authStore.onChange((token, model) => {
  user.value = model as UsersResponse
}, true /* lancé de suite */)
