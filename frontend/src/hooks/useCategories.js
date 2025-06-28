import { useEffect, useState } from "react";
import { categoriesAPI } from "../utils/api";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoriesAPI
      .getAll()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};
