import { createContext, useState, useEffect, useContext } from "react";

const Base_url = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
   const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${Base_url}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("opss");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${Base_url}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("opss");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${Base_url}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("data", data);
      setCities((cities) => [...cities, data]);
    } catch {
      alert("opss");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${Base_url}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id != id));
    } catch {
      alert("opss");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(" citiesContext was use outside of citiesProvider");
  return context;
}

export { CitiesProvider, useCities };
