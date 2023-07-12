import React, { useState } from 'react';
import './App.css';
import CustomNavbar from './components/Navbar';
import News from './components/News';
import LoadingBar from 'react-top-loading-bar'
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [progressBar, setProgressBar] = useState(0);

  const setLoadingProgressBar = (percentage) => {
    setProgressBar(percentage);
  }

  const routerMapping = [
    { path: "/", category: "general" },
    { path: "/business", category: "business" },
    { path: "/entertainment", category: "entertainment" },
    { path: "/general", category: "general" },
    { path: "/health", category: "health" },
    { path: "/science", category: "science" },
    { path: "/sports", category: "sports" },
    { path: "/technology", category: "technology" }
  ];

  return (
    <BrowserRouter>
      <div className="App">
        <LoadingBar
          color='#f11946'
          progress={progressBar}
          onLoaderFinished={() => setProgressBar(0)}
        />
        <CustomNavbar />
        <Routes>
          {routerMapping.map((element) => (
            <Route
              exact
              path={element.path}
              key={element.path}
              element={
                <News
                  Country="us"
                  category={element.category}
                  routerMapping={routerMapping}
                  setLoadingProgressBar={setLoadingProgressBar}
                  endpoint="top-headlines"
                />
              }
            />
          ))}
          <Route exact path="/:q" element={<News endpoint="everything" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;