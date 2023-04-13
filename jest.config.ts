import type {Config} from "@jest/types";
const config: Config.InitialOptions = {
    verbose: true,
    moduleDirectories: ["node_modules", "src"],
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
        '^.+\\.svg$': '<rootDir>/tests/__mocks__/svg.js',
    },
    setupFiles: [
        "mock-local-storage",
        "fake-indexeddb/auto"
    ],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^Modules/(.*)": "<rootDir>/src/modules/$1",
        "^Components/(.*)": "<rootDir>/src/components/$1",
        "^Styles/(.*)": "<rootDir>/src/styles/$1",
        "^Settings/(.*)": "<rootDir>/src/settings/$1",
        "^Public/(.*)": "<rootDir>/public/$1",
        "Hooks": "<rootDir>/src/hooks",
        "\\.(css|scss|less)$": "identity-obj-proxy",
        "^dexie$": require.resolve('dexie'),
    }
};

export default config;