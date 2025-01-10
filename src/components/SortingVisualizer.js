import React, { useState, useEffect } from 'react';
import './SortingVisualizer.css';

const SortingVisualizer = ({ array }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState('Bubble Sort');
  const [sortingInterval, setSortingInterval] = useState(null); 
  const [isDisabledAfterStop, setIsDisabledAfterStop] = useState(false); 

  useEffect(() => {
    setCurrentArray([...array]);
    const sortingSteps = generateSteps([...array], algorithm);
    setSteps(sortingSteps);
    setCurrentStep(0);
    setIsDisabledAfterStop(false); 
  }, [array, algorithm]);

  useEffect(() => {
    if (isSorting) {
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setCurrentArray(steps[currentStep]);
          setCurrentStep((prev) => prev + 1);
        } else {
          clearInterval(interval);
          setIsSorting(false);
        }
      }, 500);
      setSortingInterval(interval);
    }
    return () => clearInterval(sortingInterval);
  }, [isSorting, currentStep, steps]);

  const generateSteps = (arr, algorithm) => {
    if (algorithm === 'Bubble Sort') {
      return generateBubbleSortSteps(arr);
    } else if (algorithm === 'Merge Sort') {
      return generateMergeSortSteps(arr);
    } else if (algorithm === 'Quick Sort') {
      return generateQuickSortSteps(arr);
    }
    return [];
  };

  const generateBubbleSortSteps = (arr) => {
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push([...arr]);
        }
      }
    }
    return steps;
  };
  const generateMergeSortSteps = (arr) => {
    const steps = [];
    const tempArr = [...arr]; 
  
    const merge = (left, right, startIdx) => {
      let result = [];
      let i = 0;
      let j = 0;
  
      while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
      }
  
      result = [...result, ...left.slice(i), ...right.slice(j)];
      
      for (let k = 0; k < result.length; k++) {
        tempArr[startIdx + k] = result[k];
      }
  
      steps.push([...tempArr]); 
      return result;
    };
  
    const mergeSort = (startIdx, endIdx) => {
      if (startIdx >= endIdx) return [tempArr[startIdx]];
      const midIdx = Math.floor((startIdx + endIdx) / 2);
      const left = mergeSort(startIdx, midIdx);
      const right = mergeSort(midIdx + 1, endIdx);
      return merge(left, right, startIdx);
    };
  
    mergeSort(0, tempArr.length - 1);
    return steps;
  };
  
  const generateQuickSortSteps = (arr) => {
    const steps = [];
    const tempArr = [...arr]; 
    const partition = (start, end) => {
      const pivot = tempArr[end];
      let i = start;
  
      for (let j = start; j < end; j++) {
        if (tempArr[j] < pivot) {
          [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
          i++;
        }
      }
      [tempArr[i], tempArr[end]] = [tempArr[end], tempArr[i]];
      steps.push([...tempArr]); 
      return i;
    };
  
    const quickSort = (start, end) => {
      if (start >= end) return;
      const pivotIndex = partition(start, end);
      quickSort(start, pivotIndex - 1);
      quickSort(pivotIndex + 1, end);
    };
  
    quickSort(0, tempArr.length - 1);
    return steps;
  };

  const startSorting = () => {
    setIsSorting(true);
    setIsDisabledAfterStop(false);
  };

  const stopSorting = () => {
    setIsSorting(false);
    clearInterval(sortingInterval);
    setIsDisabledAfterStop(true); 
  };

  const getComplexity = (algorithm) => {
    switch (algorithm) {
      case 'Bubble Sort':
        return { best: 'O(n)', worst: 'O(n^2)' };
      case 'Quick Sort':
        return { best: 'O(n log n)', worst: 'O(n^2)' };
      case 'Merge Sort':
        return { best: 'O(n log n)', worst: 'O(n log n)' };
      default:
        return { best: 'N/A', worst: 'N/A' };
    }
  };

  const { best, worst } = getComplexity(algorithm);

  return (
    <div>
      <div className="controls">
        <label htmlFor="algorithm-select">Choose an algorithm:</label>
        <select
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isSorting}
        >
          <option value="Bubble Sort">Bubble Sort</option>
          <option value="Quick Sort">Quick Sort</option>
          <option value="Merge Sort">Merge Sort</option>
        </select>
      </div>
      <div className="bars-container">
        {currentArray.map((value, index) => (
          <div key={index} className="bar" style={{ height: `${value * 3}px` }}></div>
        ))}
      </div>
      <div className="sorting-buttons">
        <button
          onClick={startSorting}
          disabled={isSorting || currentStep >= steps.length || isDisabledAfterStop}
        >
          Start Sorting
        </button>
        <button onClick={stopSorting} disabled={!isSorting}>
          Stop Sorting
        </button>
      </div>
      <div className="complexity-info">
        <h3>Time Complexity Information</h3>
        <p><strong>Algorithm:</strong> {algorithm}</p>
        <p><strong>Best Case:</strong> {best}</p>
        <p><strong>Worst Case:</strong> {worst}</p>
      </div>
    </div>
  );
};

export default SortingVisualizer;
