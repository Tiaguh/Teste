import React, { useState } from 'react'

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"

function Search() {
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(null)

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName))

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
    } catch (err) {
      setErr(true)
    }
  }

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user..."
          onChange={e => setUserName(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && <div className="userChat">
        <img src={user.photoUrl} />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}

    </div>
  )
}

export default Search