import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Contact, ContactField, requestPermissionsAsync } from 'expo-contacts';

// Utilitário de contatos: busca por nome e compartilha os dados do contato
// (nome, telefones e emails) usando o Share do sistema.
const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
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
        ContactField.PHONES,
        ContactField.EMAILS,
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

  // Compartilha os dados do contato selecionado
  const shareContact = async (contact) => {
    const phones = contact.phones || [];
    const emails = contact.emails || [];

    const message = [
      `Nome: ${contact.fullName || 'Sem nome'}`,
      phones.length
        ? `Telefones: ${phones.map((phone) => phone.number).join(', ')}`
        : 'Telefones: —',
      emails.length
        ? `Emails: ${emails.map((email) => email.address).join(', ')}`
        : 'Emails: —',
    ].join('\n');

    try {
      await Share.share({ message, title: contact.fullName || 'Contato' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o contato.');
      console.error(error);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = contacts.filter((contact) =>
    (contact.fullName || '').toLowerCase().includes(normalizedQuery)
  );

  const renderItem = ({ item }) => {
    const phoneCount = (item.phones || []).length;
    const emailCount = (item.emails || []).length;

    return (
      <TouchableOpacity style={styles.contactItem} onPress={() => shareContact(item)}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.fullName || 'Sem nome'}</Text>
          <Text style={styles.contactDetail}>
            {phoneCount} telefone(s) · {emailCount} email(s)
          </Text>
        </View>
        <Text style={styles.shareText}>Compartilhar</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar e Compartilhar Contatos</Text>

      <TextInput
        style={styles.search}
        placeholder="Pesquisar pelo nome..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />

      <Text style={styles.subtitle}>
        {`${filtered.length} de ${contacts.length} contato(s). Toque em um contato para compartilhar.`}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactDetail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  shareText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default ContactsComponent;
