import type { LayerProps } from 'react-map-gl';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    // Define distinct red gradient colors for each range
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#ffcccc', // Light red for 0-2
      2, '#ff9999', // Slightly darker red for 3-5
      3, '#ff6666', // Moderate red for 6-8
      5, '#ff3333', // Bright red for 9-13
      8, '#ff0000', // Deep red for 14-21
      13, '#cc0000', // Dark red for 22-50
      21, '#990000', // Burgundy for 51-100
      50, '#660000', // Very dark red for 101-250
      100, '#330000', // Almost black for 251-750
    ],
    // Define circle radius based on cluster count
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      5, // Radius for 0-2
      2, 8, // Radius for 3-5
      3, 11, // Radius for 6-8
      5, 14, // Radius for 9-13
      8, 17, // Radius for 14-21
      13, 20, // Radius for 22-50
      21, 23, // Radius for 51-100
      50, 25, // Radius for 101-250 (Max size)
    ],
    // Define circle opacity based on cluster count
    'circle-opacity': [
      'step',
      ['get', 'point_count'],
      0.3, // Opacity for 0-2
      2, 0.4, // Opacity for 3-5
      3, 0.5, // Opacity for 6-8
      5, 0.6, // Opacity for 9-13
      8, 0.7, // Opacity for 14-21
      13, 0.75, // Opacity for 22-50
      21, 0.8, // Opacity for 51-100
      50, 0.85, // Opacity for 101-250 (Max opacity)
    ],
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};
