// src/storage/contactPhotos.js
// Armazena as fotos adicionadas pelo usuário em AsyncStorage e copia os arquivos
// para o diretório de documentos do app, para que persistam após reiniciar.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';

const STORAGE_KEY = 'contact_photos';

const photosDirectory = new Directory(Paths.document, 'contact-photos');

// Lê o mapa de fotos salvo (contactId -> uri)
export const getSavedPhotos = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

// Retorna a foto salva de um contato específico
export const getContactPhoto = async (contactId) => {
  const photos = await getSavedPhotos();
  return photos[contactId] || null;
};

// Copia a foto escolhida para o diretório de documentos e salva a URI em AsyncStorage
export const saveContactPhoto = async (contactId, sourceUri) => {
  try {
    photosDirectory.create({ idempotent: true, intermediates: true });

    const extension = Paths.extname(sourceUri) || '.jpg';
    const destination = new File(photosDirectory, `${contactId}-${Date.now()}${extension}`);

    const source = new File(sourceUri);
    await source.copy(destination);

    const photos = await getSavedPhotos();
    photos[contactId] = destination.uri;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

    return destination.uri;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Remove a foto salva de um contato e apaga o arquivo do disco
export const removeContactPhoto = async (contactId) => {
  const photos = await getSavedPhotos();
  const uri = photos[contactId];

  if (uri) {
    try {
      const file = new File(uri);
      if (file.exists) {
        file.delete();
      }
    } catch (error) {
      console.error(error);
    }

    delete photos[contactId];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }
};
