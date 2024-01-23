import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

// Fonction utilitaire pour créer un token JWT
const createToken = async (_id) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
    return token;
  } catch (error) {
    console.error("Error during token creation:", error);
    throw error;
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json("User with the given email already exists.");
    }

    // Vérifier si tous les champs requis sont présents
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required.");
    }

    // Vérifier si l'email est valide
    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email format.");
    }

    // Vérifier si le mot de passe est fort
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be a strong password.");
    }

    // Créer un nouvel utilisateur
    user = new userModel({ name, email, password });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Enregistrer l'utilisateur dans la base de données
    await user.save();

    // Créer un token JWT
    const token = createToken(user._id);

    // Retourner les informations de l'utilisateur et le token
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    // Gérer les erreurs
    console.error("Error during user registration:", error);
    res.status(500).json("Internal Server Error");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid email or password....");
    }

    const IsValidPassword = await bcrypt.compare(password, user.password);

    if (!IsValidPassword) {
      return res.status(400).json("Invalid email or password....");
    }

    // Créer un token JWT
    const token = createToken(user._id);

    // Retourner les informations de l'utilisateur et le token
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    // Gérer les erreurs
    console.error("Error during user login:", error);
    res.status(500).json(error);
  }
};

export const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    // Gérer les erreurs
    console.error("Error during user login:", error);
    res.status(500).json(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    // Gérer les erreurs
    console.error("Error during user login:", error);
    res.status(500).json(error);
  }
};
