import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";

const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
        Alert.alert("Permissão Negada", "Permissão para acessar contatos foi negada.");  
        return;
    }

    try {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails , Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            setContacts(data);
        } else {
            Alert.alert("Nenhum Contato", "Nenhum contato encontrado.");
        }
    } catch (error) {
        Alert.alert("Erro", "Ocorreu um erro ao carregar os contatos.");
        console.error(error);
    }
};

    useEffect(() => {
        loadContacts();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name} {item.lastName}</Text>
            
            {item.phoneNumbers && item.phoneNumbers.map((phone, index) => (
                <Text key={index} style={styles.contactDetail}>
                    📞 {phone.number}
                </Text>
            ))}

            {item.emails && item.emails.map((email, index) => (
                <Text key={index} style={styles.contactDetail}>
                    📧 {email.email}
                </Text>
            ))}
        </View>
    );

    return (

        <View style={styles.container}>

            <Button title="Carregar Contatos" onPress={loadContacts} />

            <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            />
        </View>
    );
}

// Define os estilos utilizados no componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 20, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo branca
  },
  list: {
    marginTop: 20, // Espaçamento acima da lista
  },
  contactItem: {
    padding: 15, // Espaçamento interno
    borderBottomWidth: 1, // Linha de separação inferior
    borderColor: '#eee', // Cor da linha de separação
  },
  contactName: {
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
  },
  contactDetail: {
    fontSize: 14, // Tamanho da fonte
    color: '#555', // Cor do texto
    marginTop: 5, // Espaçamento acima do texto
  },
});


export default ContactsComponent;