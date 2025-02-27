const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");

// 環境変数から Firebase 設定を取得
const config = functions.config();
const firebaseConfig = {
  apiKey: config.custom.api_key,
  authDomain: config.custom.auth_domain,
  projectId: config.custom.project_id,
  storageBucket: config.custom.storage_bucket,
  messagingSenderId: config.custom.messaging_sender_id,
  appId: config.custom.app_id
};

// Firebase の初期化
const firebaseApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(firebaseApp);

// Firebase Admin SDK の初期化
admin.initializeApp();
const serverAuth = admin.auth();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ユーザー登録
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    res.json({ success: true, uid: userCredential.user.uid, email: userCredential.user.email });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ログイン
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;

    // Firebase Admin SDK を使ってカスタムトークンを発行
    const customToken = await serverAuth.createCustomToken(user.uid);

    res.json({ success: true, token: customToken });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 認証チェック
app.post("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const decodedToken = await serverAuth.verifyIdToken(token);
    res.json({ success: true, user: decodedToken });
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid Token" });
  }
});

// レシピ一覧を取得
app.get("/recipes", async (req, res) => {
  try {
    const snapshot = await db.collection("recipes").get();
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Firebase Functions にデプロイ
exports.api = functions.https.onRequest(app);