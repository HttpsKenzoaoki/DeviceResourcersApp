// Define os imports necessários
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';

// Define a chave de armazenamento e o diretório das imagens salvas
const STORAGE_KEY = 'gallery_images';
const galleryDirectory = new Directory(Paths.document, 'gallery-images');

// Galeria pessoal: adiciona imagens da galeria do aparelho e as salva de forma
// persistente (AsyncStorage + expo-file-system), exibindo em grade com opção de remover.
const ImagePickerComponent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega as imagens salvas anteriormente
  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active) {
          setImages(raw ? JSON.parse(raw) : []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  // Solicita permissão, abre a galeria e salva as imagens escolhidas
  const addImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão Negada', 'Permissão para acessar a galeria foi negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      galleryDirectory.create({ idempotent: true, intermediates: true });

      const newImages = [];
      for (const asset of result.assets) {
        const extension = Paths.extname(asset.uri) || '.jpg';
        const destination = new File(
          galleryDirectory,
          `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`
        );

        const source = new File(asset.uri);
        await source.copy(destination);

        newImages.push(destination.uri);
      }

      const updated = [...images, ...newImages];
      setImages(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as imagens.');
      console.error(error);
    }
  };

  // Remove uma imagem salva (arquivo e referência)
  const removeImage = (uri) => {
    Alert.alert('Remover imagem', 'Deseja remover esta imagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            const file = new File(uri);
            if (file.exists) {
              file.delete();
            }
          } catch (error) {
            console.error(error);
          }

          const updated = images.filter((image) => image !== uri);
          setImages(updated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.thumb} onPress={() => removeImage(item)} activeOpacity={0.8}>
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.removeBadge}>
        <Text style={styles.removeText}>x</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Galeria Pessoal</Text>
        <TouchableOpacity style={styles.addButton} onPress={addImages}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {images.length === 0
          ? 'Nenhuma imagem salva ainda. Toque em "Adicionar" para começar.'
          : `${images.length} imagem(ns) salva(s). Toque em uma imagem para removê-la.`}
      </Text>

      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.list}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 24,
  },
  thumb: {
    flex: 1,
    maxWidth: '31%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ImagePickerComponent;
