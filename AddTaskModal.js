import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Overlay, Text } from '@rneui/themed';

const AddTaskModal = React.memo(({ visible, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleAddTask = useCallback(() => {
    if (title && date) {
      onAddTask({ title, date, id: Date.now() });
      setTitle('');
      setDate('');
      onClose();
    }
  }, [title, date, onAddTask, onClose]);

  return (
    <Overlay isVisible={visible} onBackdropPress={onClose} overlayStyle={styles.overlay}>
      <View style={styles.container}>
        <Text h4 style={styles.modalTitle}>Aggiungi nuovo compito</Text>
        <Input
          placeholder="Titolo dell'attività"
          value={title}
          onChangeText={setTitle}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Data (GG/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
        />
        <Button title="Aggiungi compito" onPress={handleAddTask} buttonStyle={styles.addButton} />
        <Button title="Cancellare" onPress={onClose} type="outline" buttonStyle={styles.cancelButton} />
      </View>
    </Overlay>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  container: {
    width: '100%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2089dc',
  },
  input: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2089dc',
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    borderColor: '#2089dc',
    borderRadius: 5,
  },
});

export default AddTaskModal;