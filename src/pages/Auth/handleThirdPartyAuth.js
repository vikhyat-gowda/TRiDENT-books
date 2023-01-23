import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { db, auth } from "../../backend/config";

const provider = new GoogleAuthProvider();

const authWithGoogle = async (isLogin = false) => {
  signInWithPopup(auth, provider).then(async (result) => {
    const user = result.user;
    console.log("User", user);

    if (!isLogin) {
      const usersRef = doc(db, `Users/${user.uid}`);
      await setDoc(usersRef, {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        photoUrl: user.photoURL,
        email: user.email,
      }).then(() => {
        console.log("Created a copy in DB");
      });
    }
  });
};

export { authWithGoogle };
