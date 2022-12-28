import { useState, useEffect } from "react";
import axios from "../../../axios";
import User from "../../ui/User";
import "./Home.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

const Home = () => {
  const [query, setQuery] = useState("");
  // users fetched from the API
  const [users, setUsers] = useState([]);
  // Page
  const [page, setPage] = useState(1);
  // per Page
  const [limit, setLimit] = useState(10);

  const handleChangeQuery = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handlePrevPage = () => {
    setPage((page) => {
      if (page === 1) return page;
      else return page - 1;
    });
  };
  const handleNextPage = () => {
    setPage((page) => page + 1);
  };
  const handlePageLimit = (e) => {
    const value = e.target.value;
    setLimit(parseInt(value));
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/search/users?q=" + query, {
        params: {
          page,
          per_page: limit,
        },
      });
      return data?.items;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (query) {
      const items = await fetchUsers();
      setUsers(items);
    } else {
      console.log("your query is empty...");
    }
  };

  useEffect(() => {
    const displayUsersOnChange = async () => {
      if (query) {
        const items = await fetchUsers();
        setUsers(items);
      }
    };
    displayUsersOnChange();
  }, [page, limit]);

  return (
    <div className="container">
      <div className="search-form">
        <h2>Github search user</h2>
        <form onSubmit={handleSearchUsers}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleChangeQuery}
          />
          <button onClick={handleSearchUsers}>Search</button>
        </form>
      </div>
      <div className="search-results">
        <div className="more-options">
          <label>
            <small>Per Page</small>
            <select onChange={handlePageLimit}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <div className="pagination">
            <MdOutlineArrowBackIos
              onClick={handlePrevPage}
              style={page === 1 ? { display: "none" } : {}}
            />
            <button onClick={handlePrevPage}>{page}</button>
            <button onClick={handleNextPage}>{page + 1}</button>
            <MdOutlineArrowForwardIos onClick={handleNextPage} />
          </div>
        </div>
        {users ? (
          users.map((user) => {
            return <User user={user} key={user.id} />;
          })
        ) : (
          <h2>there is nothing to display...</h2>
        )}
      </div>
    </div>
  );
};

export default Home;
