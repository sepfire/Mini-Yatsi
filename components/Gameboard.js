// Gameboard.js

import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Header from './Header';
import Footer from './Footer';
import styles from "../styles/style";
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT } from '../constants/Game';
import { Container, Row, Col } from "react-native-flex-grid";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons.js';

let board = [];

export default Gameboard = ({ navigation, route }) => {
    const [playerName, setPlayerName] = useState("");
    const [nbrOfThrows, setNbrOfThrows] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState("Throw dices");
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [totalPoints, setTotalPoints] = useState(0);
    const [roundNumber, setRoundNumber] = useState(1);

    useEffect(() => {
        if (playerName === "" && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    const throwDices = () => {
        if (nbrOfThrows > 0 && !gameEndStatus) {
            let spots = [...diceSpots];
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = "dice-" + randomNumber;
                    spots[i] = randomNumber;
                }
            }
            setNbrOfThrows(nbrOfThrows - 1);
            setDiceSpots(spots);
            setStatus(nbrOfThrows === 1 ? "Select your final dice" : "Select your dices and throw again.");
        } else if (nbrOfThrows === 0 && !gameEndStatus) {
            setStatus("Select your points before next throw");
        } else if (nbrOfThrows === 0 && gameEndStatus) {
            // Move to the next round
            if (roundNumber < 6) {
                setRoundNumber(roundNumber + 1);
                resetRound(); // Reset game state for the next round
                setStatus("Throw dices"); // Reset status for the next round
            } else {
                setStatus("Game Over"); // Or any other appropriate message
            }
        }
    }

    const selectDice = (index) => {
        if (nbrOfThrows < NBR_OF_THROWS && !gameEndStatus) {
            let updatedSelectedDices = [...selectedDices];
            updatedSelectedDices[index] = !updatedSelectedDices[index];
            setSelectedDices(updatedSelectedDices);
        } else {
            setStatus("You have to throw dices first.");
        }
    }

    const selectDicePoints = (index) => {
        if (nbrOfThrows === 0 && !gameEndStatus) {
            let updatedSelectedDicePoints = [...selectedDicePoints];
            updatedSelectedDicePoints[index] = !updatedSelectedDicePoints[index];
            setSelectedDicePoints(updatedSelectedDicePoints);
        }
    }

    function getSpotTotal(spot) {
        // Calculate the total points for each spot
        let total = 0;
        for (let j = 0; j < NBR_OF_DICES; j++) {
            if (diceSpots[j] === spot && selectedDices[j]) {
                total += spot;
            }
        }
        return total;
    }

    const pointsRow = [];
    for (let spot = 1; spot <= MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRowText" + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        );
    }


    const resetRound = () => {
        // Calculate points earned in the current round
        let roundPoints = 0;
        for (let spot = 1; spot <= MAX_SPOT; spot++) {
            roundPoints += getSpotTotal(spot);
        }

        // Add round points to total points
        setTotalPoints(totalPoints => totalPoints + roundPoints);

        // Increment round number by 1
        setRoundNumber(prevRoundNumber => prevRoundNumber + 1);

        // Reset game state for the next round
        setNbrOfThrows(NBR_OF_THROWS);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        board = []; // Reset the board array
    };

    useEffect(() => {
        if (nbrOfThrows === 0 && !gameEndStatus) {
            setStatus("Select your points before next throw");
        } else if (nbrOfThrows === 0 && gameEndStatus) {
            resetRound();
        }
    }, [nbrOfThrows, gameEndStatus]);

    // Render dice components
    const renderDice = () => {
        return board.map((dice, index) => (
            <Col key={`dice${index}`}>
                <Pressable onPress={() => selectDice(index)}>
                    <MaterialCommunityIcons
                        name={dice}
                        size={50}
                        color={selectedDices[index] ? "black" : "steelblue"}
                    />
                </Pressable>
            </Col>
        ));
    };

    // Render spot counter for selecting points
    const renderSpotCounter = () => {
        return (
            <Container fluid>
                <Row>
                    {Array.from({ length: MAX_SPOT }, (_, i) => (
                        <Col key={`spotCounter${i}`}>
                            <Pressable onPress={() => selectDicePoints(i)}>
                                <MaterialCommunityIcons
                                    name={`numeric-${i + 1}-circle`}
                                    size={35}
                                    color={selectedDicePoints[i] && !gameEndStatus ? "black" : "steelblue"}
                                />
                            </Pressable>
                        </Col>
                    ))}
                </Row>
            </Container>
        );
    };

    const currentPoints = dicePointsTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0) +
        pointsRow.reduce((accumulator, currentValue) => accumulator + getSpotTotal(currentValue), 0);

        return (
            <>
                <Header />
                <View style={styles.gamescreen}>
                    <Text style={styles.gameTitle}>Round: {roundNumber}/6</Text>
                    <Text style={styles.gameTitle}>Total points: {totalPoints}</Text>
                    <Container fluid>
                        <Row>{renderDice()}</Row>
                    </Container>
                    {renderSpotCounter()}
                    <Container fluid>
                        <Row>{pointsRow}</Row>
                    </Container>
                    <Pressable
                        style={styles.throw}
                        onPress={() => {
                            if (nbrOfThrows > 0) {
                                throwDices();
                            } else if (roundNumber < 6) {
                                resetRound();
                            } else {
                                navigation.navigate('Scoreboard', { playerName: playerName,totalScore: totalPoints }); // Pass total score as param
                            }
                        }}>
                        <Text style={styles.throw}>
                            {nbrOfThrows > 0 ? "THROW DICES" : roundNumber < 6 ? "NEXT ROUND" : "To score screen"}
                        </Text>
                    </Pressable>
                    <Text>Throws left: {nbrOfThrows}</Text>
                    <Text>{status}</Text>
                    <Text style={styles.player}>Player: {playerName}</Text>
                </View>
                <Footer />
            </>
        );
}