import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUserProfile, clearCurrentUser } from "../store/user.slice";

import UserProfileView from "../components/UserProfileView";

const ViewUserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, currentUserLoading } = useSelector(
    (state) => state.usersManagement,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleUserProfile(id));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const rawUserData = currentUser || location.state?.userData;

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/admin/users");
    }
  };

  return (
    <UserProfileView
      user={rawUserData}
      loading={currentUserLoading}
      onBack={handleBack}
      initialTab={location.state?.initialTab}
    />
  );
};

export default ViewUserProfilePage;
