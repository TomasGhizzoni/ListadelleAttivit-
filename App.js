import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { ThemeProvider, Button, ListItem, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTaskModal from './AddTaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = useCallback((newTask) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    setIsAddModalVisible(false);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, []);

  const renderTask = useCallback(({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
      </ListItem.Content>
      <Button
        title="Eliminare"
        onPress={() => deleteTask(item.id)}
        buttonStyle={styles.deleteButton}
      />
    </ListItem>
  ), [deleteTask]);

  const theme = useMemo(() => ({
    Button: {
      raised: true,
      buttonStyle: {
        backgroundColor: '#2089dc',
        borderRadius: 10,
      },
      titleStyle: {
        color: 'white',
        fontWeight: 'bold',
      },
    },
    ListItem: {
      containerStyle: {
        borderRadius: 10,
        marginVertical: 5,
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text h4 style={styles.header}>Lista delle Attività</Text>
          {tasks.length === 0 ? (
            <Text style={styles.emptyMessage}>Non ci sono compiti. Aggiungine uno!</Text>
          ) : (
            <FlatList
              data={tasks}
              renderItem={renderTask}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        <Button
          title="Aggiungi compito"
          onPress={() => setIsAddModalVisible(true)}
          
          containerStyle={{
            width: 200,  // Ancho del botón
            height: 50,  // Alto del botón
          }}
          buttonStyle={{
            padding: 10,  // Padding interno
          }}
          titleStyle={{ color: 'blue' }}
          icon={{ name: 'add', color: 'blue' }}
        />
        <AddTaskModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddTask={addTask}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2089dc',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 150,
    borderRadius: 25,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
  listContent: {
    paddingBottom: 80, 
  },
});