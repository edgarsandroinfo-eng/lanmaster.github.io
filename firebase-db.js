import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const REF = doc(db,"LanMaster","Banco");

export async function carregarFirebase(){

    const snap = await getDoc(REF);

    if(snap.exists()){

        return snap.data().banco;

    }

    return null;

}

export async function salvarFirebase(banco){

    await setDoc(REF,{
        banco:banco
    });

}

export function observarFirebase(callback){

    onSnapshot(REF,(snap)=>{

        if(snap.exists()){

            callback(snap.data().banco);

        }

    });

}