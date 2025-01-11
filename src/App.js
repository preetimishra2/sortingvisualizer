import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SortingVisualizer from './components/SortingVisualizer';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [array, setArray] = useState([]);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <InputForm onSubmit={setArray} />
        {array.length > 0 && <SortingVisualizer array={array} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
