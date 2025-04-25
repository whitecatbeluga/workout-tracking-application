import React, { createContext, useContext, useState } from "react";

interface ExerciseContextType {
  selectedEquipment: string | null;
  setSelectedEquipment: React.Dispatch<React.SetStateAction<string | null>>;
  primaryMuscleGroup: string | null;
  setPrimaryMuscleGroup: React.Dispatch<React.SetStateAction<string | null>>;
  secondaryMuscleGroups: string[];
  setSecondaryMuscleGroups: React.Dispatch<React.SetStateAction<string[]>>;
  exerciseType: string | null;
  setExerciseType: React.Dispatch<React.SetStateAction<string | null>>;
  resetExerciseData: () => void;
}

// Create the context
const ExerciseContext = createContext<ExerciseContextType | undefined>(
  undefined
);

// Create the Provider component
const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<string | null>(
    null
  );
  const [secondaryMuscleGroups, setSecondaryMuscleGroups] = useState<string[]>(
    []
  );
  const [exerciseType, setExerciseType] = useState<string | null>(null);

  const resetExerciseData = () => {
    setSelectedEquipment(null);
    setPrimaryMuscleGroup(null);
    setSecondaryMuscleGroups([]);
    setExerciseType(null);
  };

  return (
    <ExerciseContext.Provider
      value={{
        selectedEquipment,
        setSelectedEquipment,
        primaryMuscleGroup,
        setPrimaryMuscleGroup,
        secondaryMuscleGroups,
        setSecondaryMuscleGroups,
        exerciseType,
        setExerciseType,
        resetExerciseData, // Provide reset function
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseProvider;

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error(
      "useExerciseContext must be used within an ExerciseProvider"
    );
  }
  return context;
};
