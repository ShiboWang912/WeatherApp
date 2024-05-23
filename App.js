import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 43.784793,
    longitude: -79.226872,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pins, setPins] = useState([]);
  const [dropPinMode, setDropPinMode] = useState(false);

  const handleLocateUser = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleSearch = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBsqYPiezi0_mCdQ0I6pbH09DpFquk-dck`);
    const data = await response.json();
    const location = data.results[0].geometry.location;
    setRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleAddPin = () => {
    setDropPinMode(true);
  };

  const handleMapPress = (e) => {
    if (dropPinMode) {
      setPins([...pins, e.nativeEvent.coordinate]);
      setDropPinMode(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {pins.map((pin, index) => (
          <Marker key={index} coordinate={pin} />
        ))}
        {pins.length > 2 && (
          <Polygon coordinates={pins} fillColor="rgba(100, 200, 200, 0.3)" />
        )}
      </MapView>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <Button title="Locate me" onPress={handleLocateUser} />
      <Button title="Add Pin" onPress={handleAddPin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    margin: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
});
