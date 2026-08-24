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

    const mobile =
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const pwa =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

    return mobile || pwa;

}


export async function autenticar(){

    return new Promise(async(resolve,reject)=>{

        onAuthStateChanged(auth, async(usuario)=>{

            if(usuario){

                console.log("Usuário logado:",usuario.email);

                resolve(usuario);

                return;

            }

            try{

               if(usarRedirect()){

    await signInWithRedirect(auth,provider);

    return;

}else{

    const resultado =
        await signInWithPopup(auth,provider);

    console.log(
        "Login realizado:",
        resultado.user.email
    );

    resolve(resultado.user);

}

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