npx create-expo-app ColdWallet
cd ColdWallet
npm i
npx expo prebuild
cd ios
pod install
cd ../
npm run ios
