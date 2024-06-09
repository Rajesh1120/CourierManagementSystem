import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function handleLogout() {
      await logout();
      toast.success("Succesfully Logout ",{"icon": "😢"})
      navigate("/");
    }

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
