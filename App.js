import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
// import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
// import * as SecureStore from "expo-secure-store";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useEffect, useState } from "react";
import IconButton from "./components/Ui/IconButton";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

// const tokenCache = {
//   async getToken(key) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key, value) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// const SignOut = () => {
//   const { isLoaded, signOut } = useAuth();
//   if (!isLoaded) {
//     return null;
//   }
//   return (
//     <View>
//       <Button
//         title="Sign Out"
//         onPress={() => {
//           signOut();
//         }}
//       />
//     </View>
//   );
// };

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  // const { isLoaded, signOut } = useAuth();
  // if (!isLoaded) {
  //   return null;
  // }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <>
              <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
              {/* <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={() => {
                  signOut();
                }}
              /> */}
            </>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <NavigationContainer>
        {authCtx.isAuthenticated && <AuthenticatedStack />}
        {!authCtx.isAuthenticated && <AuthStack />}
      </NavigationContainer>

      {/* <ClerkProvider
        tokenCache={tokenCache}
        publishableKey="pk_test_YWRqdXN0ZWQtY2FyaWJvdS0wLmNsZXJrLmFjY291bnRzLmRldiQ"
      >
        <NavigationContainer>
          {authCtx.isAuthenticated && <AuthenticatedStack />}
          <SignedIn>
            <AuthenticatedStack />
          </SignedIn>
          <SignedOut>
            {/* <AuthStack /> */}
      {/* {!authCtx.isAuthenticated && <AuthStack />}
          </SignedOut>
        </NavigationContainer>
      </ClerkProvider> */}
    </>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }
    fetchToken();
    console.log("Hello");
  }, []);

  useEffect(() => {
    if (!isTryingLogin) {
      SplashScreen.hideAsync();
    }
  }, [isTryingLogin, setIsTryingLogin]);

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
