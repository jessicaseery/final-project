"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const MONGO_URI ="mongodb+srv://jessicaseery:Jetskiseery13!@cluster0.ft8wtmq.mongodb.net/?retryWrites=true&w=majority";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getDatabase = async () => {
    const client = await MongoClient.connect(MONGO_URI, options);
    return client.db("final-project");
};

const updateGame = async (id, updatedData, character) => {
    const db = await getDatabase();
    const gamesCollection = db.collection("games");

    try {
        console.log("Updating game with ID:", id);

        await gamesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData },
        );

        console.log("Game updated successfully");
    } catch (error) {
        console.error("Error updating game in the database:", error);
        throw error;
    }
};
const addCharacterToGame = async (req, res) => {
    const { id } = req.params;
    const newCharacter = req.body;

    try {
        const db = await getDatabase();
        const gamesCollection = db.collection("games");

        await gamesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { characters: newCharacter } }
        );

        res.json({ message: "Character added to the game successfully" });
    } catch (error) {
        console.error("Error adding character to the game:", error);
        res.status(500).json({ message: "Error adding character to the game" });
    }
};

const updateGameById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        await updateGame(id, updatedData);
        res.json({ message: "Game updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating game" });
    }
};

const getAllGames = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("final-project");
        const games = await db.collection("games").find({}).toArray();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching games" });
    } finally {
        client.close();
    }
};
const getGameById = async (req, res) => {
    const client = new MongoClient(MONGO_URI)
    try {
    await client.connect()
    const gameId = req.params.id;
    const db = client.db("final-project");
    const game = await db.collection("games").findOne({ _id: new ObjectId(gameId) });
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ message: "Game not found" });
    }
} catch (error) {
    console.error("Error fetching game by ID:", error);
    res.status(500).json({ message: "Error fetching game by ID", error: error.message });
} finally {
    client.close();
}
};

const addNewGame = async (req, res) => {
    const newGame = req.body;
    const db = await getDatabase();
    const gamesCollection = db.collection("games");
    try {
        const newGameId = new ObjectId();
        newGame._id = newGameId;
        await gamesCollection.insertOne(newGame);

        res.json({ message: "Game added successfully", gameId: newGameId });
    } catch (error) {
        res.status(500).json({ message: "Error adding new game" });
    }
};

let usersCollection;
const addUser = async (userData) => {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    await usersCollection.insertOne(userData);
};
const checkCredentials = async (username, password) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("final-project");
        usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username, password });
        return user ? true : false;
    } finally {
        client.close();
    }
};

const signIn = async (req, res) => {
    const { username, password } = req.body;
    const isValidCredentials = await checkCredentials(username, password);

    if (isValidCredentials) {
        if (!usersCollection) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        const user = await usersCollection.findOne({ username });
        if (user) {
            const userId = user._id;
            res.json({ message: 'User signed in successfully', userId });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
const signUp = async (req, res) => {
    const { firstName, lastName, username, password} = req.body;
    const newUserId = new ObjectId();
    const profilepic = req.files && req.files.profilepic ? req.files.profilepic : null;
    const userData = {
        _id: newUserId,
        firstName,
        lastName,
        username,
        password,
        profilepic,
    };
    try {
        await addUser(userData);
        res.json({ message: 'User signed up successfully', userId: newUserId });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up' });
    }
};
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdFromDatabase(id);
        if (user) {
            const { _id, firstName, lastName, username, profilepic } = user;
            const imagebase = profilepic
                ? profilepic.data.toString("base64")
                : null;

            res.json({
                _id,
                firstName,
                lastName,
                username,
                profilepic: { ...profilepic, data: imagebase },
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Error fetching user by ID", error: error.message });
    }
};

const getUserByIdFromDatabase = async (userId) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("final-project");
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        return user;
    } finally {
        client.close();
    }
};
const addCommentToGame = async (req, res) => {
    const { id } = req.params;
    const { userId, username, text, recommended } = req.body;

    try {
    const db = await getDatabase();
    const gamesCollection = db.collection('games');
    await gamesCollection.updateOne(
        { _id: new ObjectId(id) },
        {$push: {
            comments: {
                userId: new ObjectId(userId),
                username,
                text,
                recommended,
                    },
                },
        }
    );

    res.json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment to the game:', error);
        res.status(500).json({ message: 'Error adding comment to the game' });
    }
};

module.exports = {
    updateGameById,
    getAllGames,
    getGameById,
    addNewGame,
    signIn,
    signUp,
    getUserById,
    addCharacterToGame,
    addCommentToGame
};