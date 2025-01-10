import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";

const SortingVisualizer = ({ array }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
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
    if (algorithm === "Bubble Sort") {
      return generateBubbleSortSteps(arr);
    } else if (algorithm === "Merge Sort") {
      return generateMergeSortSteps(arr);
    } else if (algorithm === "Quick Sort") {
      return generateQuickSortSteps(arr);
    } else if (algorithm === "Insertion Sort") {
      return generateInsertionSortSteps(arr);
    } else if (algorithm === "Selection Sort") {
      return generateSelectionSortSteps(arr);
    } else if (algorithm === "Heap Sort") {
      return generateHeapSortSteps(arr);
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

  const generateInsertionSortSteps = (arr) => {
    const steps = [];
    const tempArr = [...arr];

    for (let i = 1; i < tempArr.length; i++) {
      let key = tempArr[i];
      let j = i - 1;

      while (j >= 0 && tempArr[j] > key) {
        tempArr[j + 1] = tempArr[j];
        steps.push([...tempArr]);
        j--;
      }

      tempArr[j + 1] = key;
      steps.push([...tempArr]);
    }

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

  const generateSelectionSortSteps = (arr) => {
    const steps = [];
    const tempArr = [...arr];

    for (let i = 0; i < tempArr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < tempArr.length; j++) {
        if (tempArr[j] < tempArr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [tempArr[i], tempArr[minIdx]] = [tempArr[minIdx], tempArr[i]];
        steps.push([...tempArr]);
      }
    }

    return steps;
  };

  const generateHeapSortSteps = (arr) => {
    const steps = [];
    const tempArr = [...arr];

    const heapify = (n, i) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < n && tempArr[left] > tempArr[largest]) {
        largest = left;
      }

      if (right < n && tempArr[right] > tempArr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        [tempArr[i], tempArr[largest]] = [tempArr[largest], tempArr[i]];
        steps.push([...tempArr]);
        heapify(n, largest);
      }
    };

    const heapSort = () => {
      const n = tempArr.length;

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }

      for (let i = n - 1; i > 0; i--) {
        [tempArr[0], tempArr[i]] = [tempArr[i], tempArr[0]];
        steps.push([...tempArr]);
        heapify(i, 0);
      }
    };

    heapSort();
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
      case "Bubble Sort":
        return { best: "O(n)", worst: "O(n^2)" };
      case "Quick Sort":
        return { best: "O(n log n)", worst: "O(n^2)" };
      case "Merge Sort":
        return { best: "O(n log n)", worst: "O(n log n)" };
      case "Insertion Sort":
        return { best: "O(n)", worst: "O(n^2)" };
      case "Selection Sort":
        return { best: "O(n^2)", worst: "O(n^2)" };
      case "Heap Sort":
        return { best: "O(n log n)", worst: "O(n log n)" };
      default:
        return { best: "N/A", worst: "N/A" };
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
          <option value="Insertion Sort">Insertion Sort</option>
        </select>
      </div>
      <div className="bars-container">
        {currentArray.map((value, index) => (
          <div className="bar-wrapper" key={index}>
            <div
              className="bar"
              style={{ height: `${value * 3}px` }}
              title={`Value: ${value}`}
            >
              <span className="tooltip">{value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="sorting-buttons">
        <button
          onClick={startSorting}
          disabled={
            isSorting || currentStep >= steps.length || isDisabledAfterStop
          }
        >
          Start Sorting
        </button>
        <button onClick={stopSorting} disabled={!isSorting}>
          Stop Sorting
        </button>
      </div>
      <div className="complexity-info">
        <h3>Time Complexity Information</h3>
        <p>
          <strong>Algorithm:</strong> {algorithm}
        </p>
        <p>
          <strong>Best Case:</strong> {best}
        </p>
        <p>
          <strong>Worst Case:</strong> {worst}
        </p>
      </div>
    </div>
  );
};

export default SortingVisualizer;
