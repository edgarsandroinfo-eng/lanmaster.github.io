import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();


getRedirectResult(auth)
.then(resultado=>{

    if(resultado){

        console.log(
            "Login por Redirect:",
            resultado.user.email
        );

    }

})
.catch(console.error);


function usarRedirect(){

    return window.matchMedia("(display-mode: standalone)").matches ||
           window.navigator.standalone === true;

}


export async function autenticar(){

    // Primeiro verifica se voltou de um Redirect
    try{

        await getRedirectResult(auth);

    }catch(e){

        console.log(e);

    }

    return new Promise((resolve,reject)=>{

        onAuthStateChanged(auth, async(usuario)=>{

            if(usuario){

                console.log("Usuário logado:",usuario.email);

                resolve(usuario);

                return;

            }

            try{

                if(usarRedirect()){

                    await signInWithRedirect(auth,provider);

                }else{

                    const resultado =
                        await signInWithPopup(auth,provider);

                    resolve(resultado.user);

                }

            }catch(erro){

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