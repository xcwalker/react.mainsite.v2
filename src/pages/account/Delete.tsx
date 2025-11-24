import { Link, Navigate, useNavigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { useState } from "react";
import Protect from "../../components/Security/Protect";
import Button from "../../components/Button";
import { separator, title } from "../../App";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import InputToggle from "../../components/InputToggle";
import firebaseDeleteAccount from "../../functions/firebase/authentication/deleteAccount";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function DeleteAccountPage() {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePosts, setDeletePosts] = useState(false);

  async function submit() {
    if (!confirmDelete || !currentUser || loading) {
      return;
    }

    setLoading(true);
    
    firebaseDeleteAccount(
      currentUser,
      deletePosts
    ).catch((err) => {
      if (err.message.startsWith("412")) {
        // Redirect to re-authenticate
        navigate("/account/reauthenticate?redirect=/account/delete");
      } else {
        console.error("Error deleting account:", err);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Protect redirect={<Navigate to={"/account/login"} replace />}>
      <PageSeoWrapper
        title={`Login ${separator} Accounts ${separator} ${title}`}
        description={`Login to your account on ${title}`}
      >
        <AccountPage id="accountLogin" onSubmit={() => submit()}>
          <h2 className={css.title}>Delete Account</h2>
          <p className={css.description}>
            <span>Are you sure you want to delete your account?</span>{" "}
            <span className={css.special}>This action cannot be undone.</span>
          </p>
          <InputToggle
            id="deletePosts"
            label="Delete all my posts and content."
            disabled={loading}
            checked={deletePosts}
            onChange={(checked) => setDeletePosts(checked)}
          />
          <InputToggle
            id="confirmDelete"
            label="I understand that deleting my account is irreversible."
            disabled={loading}
            checked={confirmDelete}
            onChange={(checked) => setConfirmDelete(checked)}
          />
          <Button
            title="Delete Account"
            onClick={() => {
              submit();
            }}
            style="danger"
            centered
            width="fit-content"
            disabled={loading}
          >
            Delete Account
          </Button>
          <Link to="/me" className={css.link}>
            Cancel
          </Link>
        </AccountPage>
      </PageSeoWrapper>
    </Protect>
  );
}
