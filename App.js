import React from "react"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import ImagePickerComponent from "./components/ImagePickerComponent"

const App = () => {
  return (
    <SafeAreaView style={styles.container}> 
      <ImagePickerComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

export default App;