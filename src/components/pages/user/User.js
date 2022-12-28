import React, { useState, useEffect } from "react";
import "./User.css";
import { MdArrowBackIos } from "react-icons/md";
import { BsGithub } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "../../../axios";
import Repo from "../../ui/Repo";

const User = () => {
  const { login } = useParams();

  // UserInformation
  const [userInfo, setUserInfo] = useState({});
  // User repos
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await Promise.all([
          axios.get(`/users/${login}`),
          axios.get(`/users/${login}/repos`),
        ]);
        setUserInfo(response[0].data);
        setRepos(response[1].data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInformation();
  }, []);

  return (
    <div className="container">
      <div className="user-information">
        <div className="image">
          <Link to="/" className="back">
            <MdArrowBackIos />
          </Link>
          <img src={userInfo?.avatar_url} alt="" />
        </div>
        <div className="user-content">
          <h3>{userInfo?.name}</h3>
          <p>{userInfo?.bio}</p>
          <div className="more-data">
            <p>
              <FaUserFriends />
              &nbsp; {userInfo?.followers}Followers. Following{" "}
              {userInfo?.following}
            </p>
            {userInfo?.location && (
              <p>
                <MdLocationPin />
                &nbsp; {userInfo?.location}
              </p>
            )}
            {userInfo?.blog && (
              <p>
                <IoGlobeOutline />
                &nbsp; {userInfo?.blog}
              </p>
            )}
            <p>
              <BsGithub />
              &nbsp; <a href={userInfo?.html_url}>view github profile</a>
            </p>
          </div>
        </div>
      </div>
      <div className="user-repository">
        <h1>Repository</h1>
        {repos ? (

          repos.map((repo) => {
            return <Repo repo={repo} key={repo.id} />;
          })
        ) : (
          <h2>No repos for this user... </h2>
        )}
      </div>
    </div>
  );
};

export default User;
