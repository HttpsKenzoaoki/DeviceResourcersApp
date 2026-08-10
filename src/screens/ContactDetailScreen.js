// src/screens/ContactDetailScreen.js
// Tela 2 - Detalhes do contato com opções para adicionar/remover foto.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ContactAvatar from '../components/ContactAvatar';
import {
  getContactPhoto,
  saveContactPhoto,
  removeContactPhoto,
} from '../storage/contactPhotos';

const ContactDetailScreen = ({ route }) => {
  const { contact } = route.params;

  const [savedPhoto, setSavedPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  // Carrega a foto salva em AsyncStorage para este contato
  useEffect(() => {
    let active = true;

    getContactPhoto(contact.id).then((uri) => {
      if (active) {
        setSavedPhoto(uri);
      }
    });

    return () => {
      active = false;
    };
  }, [contact.id]);

  // Foto a ser exibida: foto salva > foto nativa do contato
  const photoUri = savedPhoto || contact.image || null;

  // Abre a galeria para escolher uma foto e salva em AsyncStorage
  const addPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão Negada', 'Permissão para acessar a galeria foi negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    try {
      setSaving(true);
      const uri = await saveContactPhoto(contact.id, result.assets[0].uri);
      setSavedPhoto(uri);
      Alert.alert('Sucesso', 'Foto adicionada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Remove a foto salva em AsyncStorage
  const removePhoto = async () => {
    await removeContactPhoto(contact.id);
    setSavedPhoto(null);
    Alert.alert('Sucesso', 'Foto removida!');
  };

  const phones = contact.phones || [];
  const emails = contact.emails || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ContactAvatar size={120} name={contact.fullName} photoUri={photoUri} />

        {saving && <ActivityIndicator size="small" color="#4A90E2" style={styles.saving} />}

        <Text style={styles.name}>{contact.fullName || 'Sem nome'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Telefones</Text>
        {phones.length === 0 ? (
          <Text style={styles.emptyText}>Sem telefones cadastrados</Text>
        ) : (
          phones.map((phone, index) => (
            <Text key={index} style={styles.value}>
              {phone.number}
            </Text>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emails</Text>
        {emails.length === 0 ? (
          <Text style={styles.emptyText}>Sem emails cadastrados</Text>
        ) : (
          emails.map((email, index) => (
            <Text key={index} style={styles.value}>
              {email.address}
            </Text>
          ))
        )}
      </View>

      <View style={styles.buttons}>
        <View style={styles.buttonSpacing}>
          <Button title="Adicionar foto da galeria" onPress={addPhoto} disabled={saving} />
        </View>

        <Button title="Remover foto" onPress={removePhoto} disabled={!savedPhoto || saving} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  saving: {
    marginTop: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  buttons: {
    marginTop: 12,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default ContactDetailScreen;
