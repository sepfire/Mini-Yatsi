// Home.js

import React, { useState } from "react";
import { Text, TextInput, View, Pressable, Keyboard } from "react-native";
import styles from "../styles/style";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons.js';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View>
                {!hasPlayerName ?
                    <>
                        <TextInput style={styles.input} onChangeText={setPlayerName} autoFocus={true} placeholder="enter player name here"/>
                        <Pressable onPress={() => handlePlayerName(playerName)}>
                            <Text style={styles.play}>LETS PLAY!</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <Text>Rules of the game:</Text>
                        <Text multiline={true}>
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS}
                            throws. After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.
                        </Text>
                        <Text multiline={true}>
                            POINTS: After each round game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from
                            {MIN_SPOT} to {MAX_SPOT} again.
                        </Text>
                        <Text multiline={true}>
                            GOAL: To get points as much as possible.
                            {BONUS_POINTS_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS}
                            points more.
                        </Text>
                        <Text>Good luck, {playerName}</Text>
                        <Pressable onPress={() => navigation.navigate("Gameboard", { player: playerName })}>
                            <Text style={styles.play}>PLAY</Text>
                        </Pressable>
                    </>
                }
            </View>
            <Footer />
        </>
    )
}

export default HomeScreen;
