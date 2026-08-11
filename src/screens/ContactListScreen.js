// src/screens/ContactListScreen.js
// Tela 1 - Lista de contatos do celular.

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Contact, ContactField, requestPermissionsAsync } from 'expo-contacts';
import ContactAvatar from '../components/ContactAvatar';
import { getSavedPhotos } from '../storage/contactPhotos';

const ContactListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [savedPhotos, setSavedPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  // Carrega todos os contatos do aparelho
  const loadContacts = useCallback(async () => {
    const { status } = await requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar contatos foi negada.');
      setLoading(false);
      return;
    }

    try {
      const data = await Contact.getAllDetails([
        ContactField.FULL_NAME,
        ContactField.GIVEN_NAME,
        ContactField.FAMILY_NAME,
        ContactField.PHONES,
        ContactField.EMAILS,
        ContactField.IMAGE,
      ]);

      const sorted = [...data].sort((a, b) =>
        (a.fullName || '').localeCompare(b.fullName || '')
      );
      setContacts(sorted);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Adiciona o botão que leva à tela de recursos do dispositivo
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('DeviceResources')}>
          <Text style={styles.headerButton}>Recursos</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Atualiza as fotos salvas sempre que a tela ganha foco
  // (ex: ao voltar da tela de detalhes após adicionar/remover foto)
  useFocusEffect(
    useCallback(() => {
      let active = true;

      getSavedPhotos().then((photos) => {
        if (active) {
          setSavedPhotos(photos);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  const openDetails = (contact) => {
    navigation.navigate('ContactDetail', { contact });
  };

  const getPrimaryPhone = (contact) => {
    const phones = contact.phones || [];
    return phones.length > 0 ? phones[0].number : 'Sem telefone';
  };

  const renderItem = ({ item }) => {
    const photoUri = savedPhotos[item.id] || item.image || null;

    return (
      <TouchableOpacity style={styles.contactItem} onPress={() => openDetails(item)}>
        <ContactAvatar size={56} name={item.fullName} photoUri={photoUri} />

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.fullName || 'Sem nome'}</Text>
          <Text style={styles.contactPhone}>{getPrimaryPhone(item)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  list: {
    paddingVertical: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
});

export default ContactListScreen;
