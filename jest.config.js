// module.exports = {
//     "roots": [
//       "<rootDir>/src"
//     ],
//     "testMatch": [
//       "**/__tests__/**/*.+(ts|tsx|js)",
//       "**/?(*.)+(spec|test).+(ts|tsx|js)"
//     ],
//     "transform": {
//       "^.+\\.(ts|tsx)$": "ts-jest"
//     },
//   }
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

