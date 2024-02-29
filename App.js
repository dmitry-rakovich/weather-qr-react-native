import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, Button, ScrollView} from "react-native";
import {Camera} from "expo-camera";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState([]);
  const [isCamera, setIsCamera] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = async (e) => {
    setIsCamera(false);
    const url = e.data;
    const response = await fetch(url).then((res) => res.json());
    if (response) {
      if (
        scannedData.find(
          (item) => item.resolvedAddress === response.resolvedAddress
        )
      ) {
        alert("City is exist");
        return;
      }
      setScannedData([
        ...scannedData,
        {
          resolvedAddress: response.resolvedAddress,
          description: response.description,
          temp: response.currentConditions.temp,
          conditions: response.currentConditions.conditions,
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Доступ к камере запрещен</Text>;
  }

  return (
    <>
      {isCamera ? (
        <Camera onBarCodeScanned={handleScan} style={styles.scanner} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Weather</Text>
          {scannedData.length < 1 ? (
            <Text style={styles.subtitle}>Нет данных</Text>
          ) : (
            <ScrollView style={styles.cards}>
              {scannedData.map((item) => (
                <View key={item.city} style={styles.card}>
                  <Text style={styles.resolvedAddress}>
                    {item.resolvedAddress}
                  </Text>
                  <View>
                    <Text style={styles.subtitle}>
                      Temperature: <Text style={styles.text}> {item.temp}</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                      Description:
                      <Text style={styles.text}> {item.description}</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                      Conditions:
                      <Text style={styles.text}> {item.conditions}</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.button}>
            <Button
              title="Сканировать QR-код"
              onPress={() => setIsCamera(true)}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "wheat",
  },
  title: {
    fontSize: 50,
    marginBottom: 50,
  },
  scanner: {
    width: 600,
    height: 900,
  },
  card: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: 300,
    marginBottom: 20,
    backgroundColor: "white",
  },
  cards: {
    marginBottom: 50,
    height: 500,
    paddingHorizontal: 50,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
  },

  resolvedAddress: {
    fontSize: 30,
    fontWeight: "600",
  },
  button: {
    position: "absolute",
    bottom: 20,
  },
});

export default App;
