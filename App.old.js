import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    const data = [
      "Open up App.js to start working on your app!",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Changes you make will automatically reload.",
      "Shake your phone to open the developer menu."
    ];

    const mapped = data.map((x,i) => ({ text: x, key: i }));

    return (
      <View style={styles.container}>
        <FlatList
          data={mapped}
          renderItem={({item}) => <Text>{item.text}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    backgroundColor: 'red'
  }
});
