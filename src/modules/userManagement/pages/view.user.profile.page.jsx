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

  return (
    <UserProfileView
      user={rawUserData}
      loading={currentUserLoading}
      onBack={() => navigate("/admin/users")}
      initialTab={location.state?.initialTab}
    />
  );
};

export default ViewUserProfilePage;
