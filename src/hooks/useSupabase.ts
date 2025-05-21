import { useState, useEffect } from 'react';
import * as supabaseApi from '@/lib/supabase';

// Generic hook for fetching data with loading and error states
function useFetch<T>(fetchFunction: () => Promise<T>, initialState: T) {
  const [data, setData] = useState<T>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFunction]);

  return { data, loading, error };
}

// Specific hooks for each data type
export function useServices() {
  return useFetch(supabaseApi.getServices, []);
}

export function useTechnologyCategories() {
  return useFetch(supabaseApi.getTechnologyCategories, []);
}

export function useTechnologies() {
  return useFetch(supabaseApi.getTechnologies, []);
}

export function useProjects() {
  return useFetch(supabaseApi.getProjects, []);
}

export function useAboutSkills() {
  return useFetch(supabaseApi.getAboutSkills, []);
}

export function useExperiences() {
  return useFetch(supabaseApi.getExperiences, []);
}

export function useEducation() {
  return useFetch(supabaseApi.getEducation, []);
}

export function useContactInfo() {
  return useFetch(supabaseApi.getContactInfo, []);
}

export function useSocialMedia() {
  return useFetch(supabaseApi.getSocialMedia, []);
}

export function useFAQs() {
  return useFetch(supabaseApi.getFAQs, []);
}

export function usePersonalInfo() {
  return useFetch(supabaseApi.getPersonalInfo, null);
}

// Hook for submitting contact form
export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      setLoading(true);
      const result = await supabaseApi.submitContactForm(formData);
      setSuccess(result.success);
      setError(result.success ? null : result.message);
      return result;
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, success, error };
}
