import React, { useState, useRef, useEffect } from "react";
import { useDimensions } from "webrix/hooks";
import "./style.scss";
import Icon from "../Icons";

const Line = ({ path, color }) => {

  // If path is not an array, convert it to an array
  if (!Array.isArray(path)) {
    path = [path]; // Convert to single element array
  }

  // If path has only 1 element, add fake data
  if (path.length === 1) {
    const fakePath = new Array(8).fill(path[0]); // Add 8 elements to make the graph meaningful
    path = fakePath; // Update path with fake data
  }

  const dx = 100 / (path.length - 1);
  const d = `M0,${path[0]} ${path.slice(1).map((p, i) => (
    `C${dx * i + dx / 2},${path[i]} ` +
    `${dx * (i + 1) - dx / 2},${path[i + 1]} ` +
    `${dx * (i + 1)},${path[i + 1]} `
  )).join(' ')}`;

  return (
    <>
      <path stroke={color} d={d} fill='none' className='stroke'/>
      <path d={d + ` V0 H0 Z`} fill={`url(#gradient-${color})`} className='gradient'/>
      <defs>
        <linearGradient id={`gradient-${color}`} x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity={0}/>
          <stop offset='100%' stopColor={color} stopOpacity={0.15}/>
        </linearGradient>
      </defs>
    </>
  );
};

// Store point positions globally to ensure consistency
const calculatePointPositions = (data, width, height, range) => {
  const positions = [];
  
  // Ensure data is in the expected format (array of arrays)
  const processedData = Array.isArray(data[0]) ? data : [data];
  
  processedData.forEach((row, r) => {
    positions[r] = [];
    if (Array.isArray(row)) {
      row.forEach((y, i) => {
        const normalizedY = (y - range[0]) / (range[1] - range[0]) * height;
        // Use percentage calculation for better consistency
        const xPercent = i / (row.length - 1);
        const xPosition = xPercent * width;
        
        positions[r][i] = {
          x: xPosition,
          y: height - normalizedY,
          value: y
        };
      });
    }
  });
  
  return positions;
};

const Points = ({ data, width, height, setActive, range, pointPositions }) => {
  const timeout = useRef();
  
  const activate = (path, point) => {
    clearTimeout(timeout.current);
    setActive({ path, point });
  }
  
  const deactivate = (path, point) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setActive(cur => {
        if (cur.path === path && cur.point === point) {
          return null;
        }
        return cur;
      });
    }, 200);
  }
  
  return (
    <div className="points">
      {pointPositions.map((row, r) => 
        row.map((point, i) => (
          <div 
            key={`point-${r}-${i}`} 
            style={{
              '--x': `${point.x}px`, 
              '--y': `${point.y}px`
            }} 
            onMouseEnter={() => activate(r, i)} 
            onMouseLeave={() => deactivate(r, i)}
          >
          </div>
        ))
      )}
    </div>
  );
};

const Legend = ({ labels, WeatherCondition, day}) => (
  <div className='legend'>
    <div className="flex flex-col items-end justify-right">
      <div className="text-4xl font-bold">{labels}</div>
      <div className="text-lg font-semibold">{WeatherCondition}</div>
      <div className="text-lg font-semibold">{day}</div>
    </div>
  </div>
);

const Marker = ({ colors, active, pointPositions }) => {
  if (!active) return null;
  
  const { path, point } = active;
  
  // Safety check to prevent errors
  if (!pointPositions[path] || !pointPositions[path][point]) return null;
  
  // Use pre-calculated position
  const position = pointPositions[path][point];
  const value = position.value;
  
  return (
    <div className='marker' style={{
      '--color': colors[path] || colors[0], 
      '--x': `${position.x}px`,
      '--y': `${position.y}px`
    }}>
      <div className='tooltip font-bold'>
        <span>{value !== undefined ? String(value) : ''}°C</span>
      </div>
      <div className='circle'/>
    </div>
  );
};

const Graph = ({ data, colors, range, labels, title, icon, subtitle, legend, WeatherCondition, day }) => {
  const [active, setActive] = useState(null);
  const [pointPositions, setPointPositions] = useState([]);
  const graph = useRef();
  const { width, height } = useDimensions(graph);

  // Ensure data is in the correct format: array of arrays
  let processedData;
  if (!Array.isArray(data)) {
    processedData = [[data]];
  } else if (!Array.isArray(data[0])) {
    processedData = [data];
  } else {
    processedData = data;
  }

  // SVG path data normalization
  const normalizedData = processedData.map(path => 
    path.map(value => {
      return ((value - range[0]) / (range[1] - range[0])) * 100;
    })
  );
  
  useEffect(() => {
    if (width && height) {
      const newPositions = calculatePointPositions(processedData, width, height, range);
  
      setPointPositions(prevPositions =>
        JSON.stringify(prevPositions) !== JSON.stringify(newPositions) ? newPositions : prevPositions
      );
    }
  }, [processedData, width, height, range]);
  

  return (
    <div className='graph' ref={graph}>
      <div className='heading'>
        <div className="flex flex-row gap-2">
          <div><Icon icon={icon} size={150}/></div>          
          <div>
            <div className='title font-bold'>{title}</div>
            <div className='subtitle font-semibold'>{subtitle}</div>
          </div>
        </div>
      </div>
      
      {active && pointPositions.length > 0 && (
        <Marker 
          colors={colors} 
          active={active} 
          pointPositions={pointPositions}
        />
      )}
      
      <Legend colors={colors} labels={legend} day={day} WeatherCondition={WeatherCondition}/>
      
      <svg className="svg" viewBox={`0 0 100 100`} preserveAspectRatio='none'>
        {normalizedData.map((path, i) => (
          <Line key={i} path={path} color={colors[i] || colors[0]} />
        ))}
      </svg>
      
      <div className='labels'>
        {labels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      
      {pointPositions.length > 0 && (
        <Points 
          data={processedData} 
          width={width} 
          height={height} 
          setActive={setActive} 
          range={range}
          pointPositions={pointPositions}
        />
      )}
    </div>
  );
};

export default Graph;