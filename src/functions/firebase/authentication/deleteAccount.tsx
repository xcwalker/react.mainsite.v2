import { deleteUser, User } from "firebase/auth";
import toast from "react-hot-toast";
import { toastStyle, toastStyleError } from "../../../toast";
import getDataByDateFromUser from "../storage/getDataByDateFromUser";
import { deleteDoc, doc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import firebaseSetUserData from "../user/setUserData";
import { deletedUser } from "../../../types";

export default async function firebaseDeleteAccount(
  user: User,
  postsToo: boolean = false
) {
  if (user) {
    // check when the user last signed in
    if (
      Date.now() -
        (user.metadata.lastSignInTime
          ? new Date(user.metadata.lastSignInTime).getTime()
          : 0) >
      5 * 60 * 1000
    ) {
      const errorMessage =
        "412: Please re-authenticate before updating your email.";

      toast.error(errorMessage, {
        style: toastStyleError,
      });

      return Promise.reject(new Error(errorMessage));
    }

    if (postsToo) {
      await deletePosts("blog", user.uid);
      await deletePosts("recipes", user.uid);
      await deletePosts("projects", user.uid);
      await deletePosts("albums", user.uid);
      await deletePosts("overlays", user.uid);
      await deletePosts("videos", user.uid);
    }

    await firebaseSetUserData(user.uid, deletedUser);

    toast
      .promise(
        deleteUser(user),
        {
          loading: "Deleting account...",
          success: "Account deleted successfully.",
          error: (err) => `Error deleting account: ${err.message} ${err.code}`,
        },
        toastStyle
      )
      .finally(() => {
        return Promise.resolve();
      });
  } else {
    const errorMessage = "No user is currently signed in.";
    toast.error(errorMessage, {
      style: toastStyleError,
    });
    return Promise.reject(new Error(errorMessage));
  }
}

async function deletePosts(collection: string, userID: string) {
  toast.promise(
    getDataByDateFromUser(collection, userID).then(async (posts) => {
      if (posts && posts.length > 0) {
        const deletePromises = posts.map((post) =>
          deleteDoc(doc(firebaseDB, collection, post.id))
        );
        return Promise.all(deletePromises).then(() => {});
      } else {
        return Promise.resolve();
      }
    }),
    {
      loading: `Deleting user ${collection} posts...`,
      success: `User ${collection} posts deleted successfully.`,
      error: (err) =>
        `Error deleting ${collection} posts: ${err.message} ${err.code}`,
    },
    toastStyle
  );
}
