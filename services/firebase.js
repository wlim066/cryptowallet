import {auth, db} from '../config/firebase';
import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
} from 'firebase/firestore';

export const getUserCoinData = async docData => {
  try {
    // Get the current logged in user's favourited coin ids.
    const firebaseDoc = await getDoc(docData);
    coinIds = firebaseDoc.get('favourites');
    console.log('Retrieved coins: ', coinIds);
    return coinIds;
  } catch (e) {
    console.error('Error getting document: ', e);
  }
};

export const addUserCoinData = async (docData, coinIds) => {
  try {
    const docRef = await setDoc(docData, {
      //addDoc is for generated doc ids, which we don't want.
      favourites: coinIds,
    });

    console.log('Document added');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateUserCoinData = async (docData, coinIds) => {
  try {
    const docRef = await updateDoc(docData, {
      favourites: coinIds,
    });

    console.log('Document updated');
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteUserCoinData = async (docData, coinIds) => {
  try {
    const docRef = await deleteDoc(docData);

    console.log('Document deleted.');
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};
