import React from "react";
import { Text, View, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/style";

const ScoreboardScreen = ({ navigation, route }) => {
    const { playerName, totalScore } = route.params; // Retrieve player name and total score from params

    // Function to save player name and total score in AsyncStorage
    const saveDataToStorage = async () => {
        try {
            await AsyncStorage.setItem('playerName', playerName);
            await AsyncStorage.setItem('totalScore', totalScore.toString());
        } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
        }
    };

    // Function to reset game state and navigate to Home screen
    const startNewGame = async () => {
        try {
            // Clear stored player name and total score from AsyncStorage
            await AsyncStorage.removeItem('playerName');
            await AsyncStorage.removeItem('totalScore');
            // Navigate back to Home screen
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error clearing data from AsyncStorage:', error);
        }
    };

    // Call the function to save data when component mounts
    React.useEffect(() => {
        saveDataToStorage();
    }, []);

    return (
        <>
            <Text>Player: {playerName} Score: {totalScore}</Text>
            <Pressable onPress={startNewGame}>
                <Text style={styles.button}>Start New Game</Text>
            </Pressable>
        </>
    );
};

export default ScoreboardScreen;
