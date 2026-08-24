import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const provider = new GoogleAuthProvider();


export async function autenticar(){

    return new Promise(async(resolve,reject)=>{

        onAuthStateChanged(auth, async(usuario)=>{

            if(usuario){

                console.log("Usuário logado:",usuario.email);

                resolve(usuario);

                return;

            }

            try{

                const resultado =
                    await signInWithPopup(auth,provider);

                console.log(
                    "Login realizado:",
                    resultado.user.email
                );

                resolve(resultado.user);

            }catch(erro){

                console.error(erro);

                reject(erro);

            }

        });

    });

}


export function usuarioAtual(){

    return auth.currentUser;

}


export async function sair(){

    await signOut(auth);

}