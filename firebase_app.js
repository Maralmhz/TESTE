// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase (Sua conta)
const firebaseConfig = {
  apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
  authDomain: "checklist-oficina-72c9e.firebaseapp.com",
  projectId: "checklist-oficina-72c9e",
  storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
  messagingSenderId: "305423384809",
  appId: "1:305423384809:web:b152970a419848a0147078"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função auxiliar para salvar checklist
// Salva dentro da coleção da oficina específica definida no config.js
async function salvarNoFirebase(checklistData) {
    if (!window.OFICINA_CONFIG || !window.OFICINA_CONFIG.id) {
        console.error("ID da oficina não configurado em config.js");
        return { success: false, error: "ID da oficina não encontrado" };
    }

    const oficinaId = window.OFICINA_CONFIG.id;
    const checklistId = String(checklistData.id); // Garante que o ID seja string

    try {
        // Caminho: oficinas / {oficina-modelo} / checklists / {17000000}
        const docRef = doc(db, "oficinas", oficinaId, "checklists", checklistId);
        
        // Remove fotos pesadas antes de enviar (Base64 não deve ir pro Firestore gratuito em excesso)
        // Criamos uma cópia segura
        const dadosParaSalvar = { ...checklistData };
        if (dadosParaSalvar.fotos && dadosParaSalvar.fotos.length > 0) {
           // Opcional: Salvar apenas métricas de fotos, ou avisar que fotos são locais
           dadosParaSalvar.fotos = []; 
           dadosParaSalvar.temFotosLocal = true;
        }

        await setDoc(docRef, dadosParaSalvar);
        console.log(`Checklist ${checklistId} salvo com sucesso no Firebase!`);
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        return { success: false, error: error.message };
    }
}

// Função para buscar checklists da nuvem
async function buscarChecklistsNuvem() {
    if (!window.OFICINA_CONFIG || !window.OFICINA_CONFIG.id) return [];

    const oficinaId = window.OFICINA_CONFIG.id;
    const lista = [];

    try {
        const q = query(collection(db, "oficinas", oficinaId, "checklists"), orderBy("id", "desc"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            lista.push(doc.data());
        });
        
        return lista;
    } catch (error) {
        console.error("Erro ao buscar checklists:", error);
        return [];
    }
}

// Exporta para usar no arquivo principal
export { db, salvarNoFirebase, buscarChecklistsNuvem };
