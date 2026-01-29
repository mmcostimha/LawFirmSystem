import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Função para limpar a busca, se necessário
  const clearSearch = () => setSearchTerm('');

  return (
    <FilterContext.Provider value={{ searchTerm, setSearchTerm, clearSearch }}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook personalizado para facilitar o uso
export const useFilter = () => useContext(FilterContext);